/**
 * Intent Resolver — Enhanced with context merging support + LLM fallback
 */

const OpenAI = require("openai");

let _openai = null;
const getOpenAI = () => {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
};

const SUPPORTED_INTENTS = [
  "GET_ROOM_STUDENTS",
  "GET_ROOM_OCCUPANCY",
  "GET_COMPLAINTS",
  "COUNT_COMPLAINTS",
  "GET_MY_COMPLAINTS",
  "COUNT_MY_COMPLAINTS",
  "GET_STUDENT_INFO",
  "GET_STUDENT_REMARKS",
  "GET_NOTICES",
];

const LLM_PROMPT = (query) => `You are an intent classification engine for a Hostel Management System.

Your job is to:
1. Identify the user's intent
2. Extract parameters

Return ONLY valid JSON. No explanation, no markdown, no extra text.

Supported intents:
GET_ROOM_STUDENTS - who lives in a room
GET_ROOM_OCCUPANCY - room capacity or occupancy
GET_COMPLAINTS - fetch complaints
COUNT_COMPLAINTS - count complaints
GET_MY_COMPLAINTS - fetch user's own complaints
COUNT_MY_COMPLAINTS - count user's own complaints
GET_STUDENT_INFO - student details
GET_STUDENT_REMARKS - remarks about student

Extract (only if present):
- roomNo (number)
- rollNo (number)
- status (pending/resolved/rejected)
- priority (HIGH/MEDIUM/LOW)
- tag (electricity, water, internet, plumber, carpenter, cleaning, other)

Query: "${query}"

Output:
{
  "intent": "...",
  "params": {}
}`;

const resolveIntentWithLLM = async (query) => {
  const start = Date.now();

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 200,
      messages: [
        { role: "user", content: LLM_PROMPT(query) }
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();
    const elapsed = Date.now() - start;

    console.log(`[LLM] tokens=${completion.usage?.total_tokens} latency=${elapsed}ms raw=${raw}`);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("[LLM] JSON parse failed:", raw);
      return { intent: "UNKNOWN", params: {} };
    }

    const intent = SUPPORTED_INTENTS.includes(parsed.intent) ? parsed.intent : "UNKNOWN";
    const params = parsed.params && typeof parsed.params === "object" ? parsed.params : {};

    const confidence = intent !== "UNKNOWN" ? 0.85 : 0.0;
    console.log(`[LLM] intent=${intent} confidence=${confidence} params=${JSON.stringify(params)}`);

    return { intent, params, confidence };
  } catch (err) {
    console.error("[LLM] Error:", err.message);
    return { intent: "UNKNOWN", params: {} };
  }
};

const TAG_MAP = {
  electricity: ['electricity', 'light', 'power'],
  water: ['water', 'leak', 'tap'],
  internet: ['internet', 'wifi', 'network'],
  plumber: ['plumber', 'pipe'],
  carpenter: ['carpenter', 'furniture'],
  cleaning: ['cleaning', 'dirty'],
  other: ['other']
};

// ─── HELPERS ──────────────────────────────────────────
const extractRoomNo = (q) => {
  // "room 123" or "room number 123"
  const direct = q.match(/room\s*(number)?\s*(\d+)/);
  if (direct) return Number(direct[2]);
  // "room occupancy of 123" / "who stays in 123"
  if (q.includes('room') || q.includes('occupancy') || q.includes('stays in') || q.includes('lives in')) {
    const fallback = q.match(/\b(\d{1,4})\b/);
    if (fallback) return Number(fallback[1]);
  }
  return null;
};

const extractRollNo = (q) => {
  const match = q.match(/(?:roll\s*(?:number)?\s*(?:is)?\s*)?(\d{5,12})/);
  if (!match) return null;
  const roll = Number(match[1]);
  return roll > 10000 ? roll : null;
};

// Extract student name from queries like:
//   "info of Rahul", "details of Rahul Sharma", "student named Rahul"
const FIELD_KEYWORDS = new Set(['email', 'phone', 'mobile', 'contact', 'room', 'block', 'name', 'details', 'info']);

const extractStudentName = (q) => {
  const patterns = [
    /(?:of|for|about|named?|called)\s+([a-z][a-z\s]{1,30})(?:\s*$|\s*\?)/,
    /student\s+([a-z][a-z\s]{1,30})(?:\s*$|\s*\?)/,
  ];
  for (const re of patterns) {
    const m = q.match(re);
    if (m) {
      const candidate = m[1].trim();
      // Reject single-word matches that are field keywords, not real names
      if (FIELD_KEYWORDS.has(candidate.toLowerCase())) continue;
      return candidate;
    }
  }
  return null;
};

const resolveIntent = (query, contextIntent = null, contextParams = {}) => {

  if (!query || typeof query !== 'string') {
    return { intent: 'UNKNOWN', params: {} };
  }

  const q = query.toLowerCase();

  const isCountQuery =
    q.includes('how many') ||
    q.includes('count') ||
    q.includes('number of');

  // ──────────────────────────────────────────────────────
  // 🔹 STUDENT CONTEXT CARRY-FORWARD (pronouns / field follow-ups)
  // ──────────────────────────────────────────────────────
  if (contextIntent === 'GET_STUDENT_INFO' && contextParams?.rollNo) {
    const hasPronoun = /\b(his|her|their|this student|the student)\b/.test(q);
    const hasField   = /\b(email|phone|mobile|room|block|live|lives|stay|name)\b/.test(q);

    if (hasPronoun || hasField) {
      const params = { rollNo: contextParams.rollNo };
      if (/\bemail\b/.test(q))                                  params.field = 'email';
      else if (/\b(phone|mobile|contact)\b/.test(q))            params.field = 'phone';
      else if (/\b(room|block|live|lives|stay|where)\b/.test(q)) params.field = 'room';
      else if (/\bname\b/.test(q))                              params.field = 'name';
      return { intent: 'GET_STUDENT_INFO', params };
    }
  }

  // ──────────────────────────────────────────────────────
  // 🔹 CREATE COMPLAINT
  // ──────────────────────────────────────────────────────
  // ──────────────────────────────────────────────────────
  // 🔹 MY COMPLAINTS
  // ──────────────────────────────────────────────────────
  if (/\bmy complaint(s)?\b/.test(q)) {
    const params = { self: true };
    if (/\b(pending|open)\b/.test(q)) params.status = 'pending';
    if (/\b(resolved|done|fixed)\b/.test(q)) params.status = 'resolved';
    if (/\b(rejected|declined)\b/.test(q)) params.status = 'rejected';

    return {
      intent: isCountQuery ? 'COUNT_MY_COMPLAINTS' : 'GET_MY_COMPLAINTS',
      params
    };
  }

  // ──────────────────────────────────────────────────────
  // 🔹 ROOM
  // ──────────────────────────────────────────────────────
  if (q.includes('room')) {
    const params = {};
    const roomNo = extractRoomNo(q);
    if (roomNo) params.roomNo = roomNo;

    if (q.includes('who lives') || q.includes('students')) {
      return { intent: 'GET_ROOM_STUDENTS', params };
    }
    if (q.includes('occupancy') || q.includes('capacity')) {
      return { intent: 'GET_ROOM_OCCUPANCY', params };
    }
  }

  // ──────────────────────────────────────────────────────
  // 🔥 GENERAL COMPLAINTS — build params from query
  // ──────────────────────────────────────────────────────
  const freshParams = {};
  let isComplaintQuery = false;

  if (/\b(high|urgent|critical)\b/.test(q)) { freshParams.priority = 'HIGH'; isComplaintQuery = true; }
  if (/\b(medium|moderate)\b/.test(q)) { freshParams.priority = 'MEDIUM'; isComplaintQuery = true; }
  if (/\b(low|minor)\b/.test(q)) { freshParams.priority = 'LOW'; isComplaintQuery = true; }

  if (/\b(pending|open)\b/.test(q)) { freshParams.status = 'pending'; isComplaintQuery = true; }
  if (/\b(resolved|done|fixed)\b/.test(q)) { freshParams.status = 'resolved'; isComplaintQuery = true; }
  if (/\b(rejected|declined)\b/.test(q)) { freshParams.status = 'rejected'; isComplaintQuery = true; }

  for (const tag in TAG_MAP) {
    if (TAG_MAP[tag].some(word => new RegExp(`\\b${word}\\b`).test(q))) {
      freshParams.tag = tag;
      isComplaintQuery = true;
      break;
    }
  }

  const rollNo = extractRollNo(q);
  if (rollNo) freshParams.rollNo = rollNo;

  if (/\b(complaint|complaints|issue|issues)\b/.test(q)) {
    isComplaintQuery = true;
  }

  if (isComplaintQuery) {
    // ─── CONTEXT MERGE: If we have contextParams, merge with fresh ───
    let mergedParams = freshParams;

    if (contextIntent && (
      contextIntent === 'GET_COMPLAINTS' ||
      contextIntent === 'COUNT_COMPLAINTS' ||
      contextIntent === 'GET_MY_COMPLAINTS' ||
      contextIntent === 'COUNT_MY_COMPLAINTS'
    )) {
      // New params override old ones for same key, old ones fill in gaps
      mergedParams = { ...contextParams, ...freshParams };
    }

    return {
      intent: isCountQuery ? 'COUNT_COMPLAINTS' : 'GET_COMPLAINTS',
      params: mergedParams
    };
  }

  // ──────────────────────────────────────────────────────
  // 🔹 STUDENT INFO  (must be before context refinement)
  // ──────────────────────────────────────────────────────
  const isStudentQuery =
    q.includes('student') ||
    q.includes('student details') ||
    q.includes('student info') ||
    /\b(where|which).*(roll|student)\b/.test(q) ||
    /\b(roll|student).*(live|lives|stay|stays|room|block)\b/.test(q) ||
    (q.includes('roll') && (q.includes('name') || q.includes('phone') || q.includes('email') || q.includes('details')));

  if (isStudentQuery) {
    const params = {};
    const rollNo = extractRollNo(q);
    if (rollNo) {
      params.rollNo = rollNo;
    } else {
      const name = extractStudentName(q);
      if (name) params.name = name;
    }

    if (q.includes('phone')) params.field = 'phone';
    else if (q.includes('email')) params.field = 'email';
    else if (q.includes('room') || /\b(live|lives|stay|stays|where)\b/.test(q)) params.field = 'room';
    else if (/\bname\b/.test(q) && !params.name) params.field = 'name';

    return { intent: 'GET_STUDENT_INFO', params };
  }

  // ──────────────────────────────────────────────────────
  // 🔹 CONTEXT REFINEMENT — no clear intent in query but context exists
  // ──────────────────────────────────────────────────────
  if (contextIntent && Object.keys(freshParams).length > 0) {
    const merged = { ...contextParams, ...freshParams };
    return { intent: contextIntent, params: merged };
  }
  
// =====================================================
// 🔹 STUDENT REMARKS
// =====================================================

if (
  q.includes("remark") ||
  q.includes("remarks") ||
  q.includes("feedback")
) {
  const params = {};

  const rollNo = extractRollNo(q);
  if (rollNo) {
    params.rollNo = rollNo;
  } else {
    const name = extractStudentName(q);
    if (name) params.name = name;
  }

  return {
    intent: "GET_STUDENT_REMARKS",
    params
  };
}


  // ──────────────────────────────────────────────────────
  // 🔹 NOTICES
  // ──────────────────────────────────────────────────────
  if (
    q.includes('notice') ||
    q.includes('notices') ||
    q.includes('announcement') ||
    q.includes('announcements') ||
    q.includes('circular')
  ) {
    const params = {};
    const hostelMatch = q.match(/hostel\s*(?:no\.?|number)?\s*(\d{1,2})\b/);
    if (hostelMatch) params.hostelNo = Number(hostelMatch[1]);
    return { intent: 'GET_NOTICES', params };
  }

  // ──────────────────────────────────────────────────────
  // 🔹 ANALYTICS
  // ──────────────────────────────────────────────────────
  return { intent: 'UNKNOWN', params: {} };
};

module.exports = { resolveIntent, resolveIntentWithLLM };