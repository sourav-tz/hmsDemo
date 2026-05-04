
// =====================================================
// 🧠 QUERY CLASSIFIER — Frontend-side intent helpers
// =====================================================

import {
  GREETING_PATTERNS,
  HOWAREYOU_PATTERNS,
  WHOAREYOU_PATTERNS,
  WHATCANYOUDO_PATTERNS,
} from "./responseGenerator";

const IGNORE_WORDS =
  /^(okay|ok|thanks|thank you|sure|got it|alright|fine|cool|nice|great|good|noted|understood|perfect|awesome|yep|yup|nope|no|yes|hmm)$/i;

// =====================================================
// 🔹 SMALL TALK
// =====================================================

export const isSmallTalk = (query) => {
  if (!query || typeof query !== "string") return false;
  const q = query.toLowerCase().trim();

  if (IGNORE_WORDS.test(q)) return true;

  return (
    GREETING_PATTERNS.test(q) ||
    HOWAREYOU_PATTERNS.test(q) ||
    WHOAREYOU_PATTERNS.test(q) ||
    WHATCANYOUDO_PATTERNS.test(q)
  );
};

// =====================================================
// 🔹 CONTEXT REFINEMENT DETECTION
// =====================================================

export const isContextRefinement = (query) => {
  if (!query || typeof query !== "string") return false;
  const q = query.toLowerCase().trim();

  // ❌ ignore simple acknowledgements
  if (IGNORE_WORDS.test(q)) return false;

  const refinementPatterns = [
    /^only\b/,
    /^just\b/,
    /^filter\b/,
    /^with\b/,
    /^but\b/,
    /^(pending|resolved|rejected)$/,
    /^(high|medium|low)$/,
    /^(electricity|water|wifi|internet|plumber|carpenter|cleaning)$/,
    /^for roll\s*\d+/,

    // student pronoun follow-ups
    /\b(his|her|their|this student|the student)\b/,
    /^(show|get|display|what|fetch)\b.*(email|phone|room|name)/,
    /^(email|phone|room|name)(\s|$)/,
    /^what'?s? (the )?(email|phone|room|name)/,
  ];

  return refinementPatterns.some((p) => p.test(q));
};

// =====================================================
// 🔹 CONTEXT STORE
// =====================================================

let _context = {
  intent: null,
  params: {},
};

// =====================================================
// 🔹 MERGE CONTEXT SAFELY
// =====================================================

export const mergeContext = (newIntent, newParams = {}) => {
  const isSameIntent =
    newIntent === _context.intent ||
    newIntent === "UNKNOWN";

  if (!isSameIntent) {
    _context = {
      intent: newIntent,
      params: { ...newParams },
    };
  } else {
    _context = {
      intent: _context.intent || newIntent,
      params: {
        ..._context.params,
        ...Object.fromEntries(
          Object.entries(newParams).filter(([_, v]) => v !== undefined)
        ),
      },
    };
  }

  return { ..._context };
};

export const getContext = () => ({ ..._context });

export const resetContext = () => {
  _context = { intent: null, params: {} };
};

// =====================================================
// 🔹 EXTRACT REFINEMENT PARAMS
// =====================================================

export const extractRefinementParams = (query) => {
  const q = query.toLowerCase();
  const params = {};

  // 🔸 STATUS
  if (/\b(pending|open)\b/.test(q)) params.status = "pending";
  if (/\b(resolved|done|fixed)\b/.test(q)) params.status = "resolved";
  if (/\b(rejected|declined)\b/.test(q)) params.status = "rejected";

  // 🔸 PRIORITY
  if (/\b(high|urgent|critical)\b/.test(q)) params.priority = "HIGH";
  if (/\b(medium|moderate)\b/.test(q)) params.priority = "MEDIUM";
  if (/\b(low|minor)\b/.test(q)) params.priority = "LOW";

  // 🔸 TAG
  const tagMap = {
    electricity: ["electricity", "light", "power"],
    water: ["water", "leak", "tap"],
    internet: ["internet", "wifi", "network"],
    plumber: ["plumber", "pipe"],
    carpenter: ["carpenter", "furniture"],
    cleaning: ["cleaning", "dirty"],
  };

  for (const [tag, words] of Object.entries(tagMap)) {
    if (words.some((w) => new RegExp(`\\b${w}\\b`).test(q))) {
      params.tag = tag;
      break;
    }
  }

  // roll number (longest match)
  const matches = q.match(/\b\d{5,12}\b/g);
  if (matches) {
    const roll = matches.reduce((a, b) => (a.length > b.length ? a : b));
    params.rollNo = Number(roll);
  }

  // student field extraction
  if (/\bemail\b/.test(q)) params.field = "email";
  else if (/\b(phone|mobile|contact|number)\b/.test(q)) params.field = "phone";
  else if (/\b(room|block|where|live|lives|stay|stays)\b/.test(q)) params.field = "room";
  else if (/\bname\b/.test(q)) params.field = "name";

  return params;
};

