// =====================================================
// 🔹 IMPORTS
// =====================================================

const { resolveIntent, resolveIntentWithLLM } = require('../../services/nlp/intentResolver');
const { fetchStudentByRollNo, fetchStudentsByName } = require('../../services/students/studentFetcher.service');
const { setUserContext, getUserContext } = require('../../services/nlp/conversationMemory');
const { fetchComplaintsForAdmin } = require('../../services/complaints/complaintFetcher.service');
const { enrichComplaintsWithPriority } = require('../../services/complaintPriority.service');
const intentAccessMap = require('../../services/nlp/intentAccessMap');
const { fetchStudentsByRoom, fetchRoomDetails } = require('../../services/rooms/roomFetcher.service');
const { fetchRemarksByRollNo } = require('../../services/remarks/remarkFetcher.service');
const { fetchNotices } = require('../../services/notices/noticeFetcher.service');

// =====================================================
// 🔹 HELPER
// =====================================================

const requireParam = (param, name, res, intent) => {
  if (param === undefined || param === null || param === "") {
    res.status(400).json({ success: false, intent, message: `${name} not found in query` });
    return false;
  }
  return true;
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

// =====================================================
// 🔹 CONTROLLER
// =====================================================

const adminNlpQuery = async (req, res) => {
  console.log("\n===== NLP CONTROLLER =====");

  try {
    const { query, contextIntent, contextParams } = req.body;

    const user = req.user || null;
    const userRole = user?.role || null;
    const hostelNo = user?.hostelNo;
    const rollNo = user?.rollNo;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query must be a valid string' });
    }

    const userId = user?.email || "guest";

    // =====================================================
    // 🔹 INTENT RESOLUTION — now accepts context
    // =====================================================

    let { intent, params } = resolveIntent(
      query,
      contextIntent || null,
      contextParams || {}
    );
    params = params || {};

    if (intent === "UNKNOWN") {
      const llmResult = await resolveIntentWithLLM(query);
      intent = llmResult.intent;
      params = llmResult.params || {};
    }

    console.log("INTENT:", intent);
    console.log("PARAMS:", params);

    // =====================================================
    // 🔐 ACCESS CONTROL
    // =====================================================

    let requiredRole = intentAccessMap?.[intent] || "ADMIN";

    const roleMap = { "Hostel-Authority": "ADMIN", "Student": "STUDENT" };
    const normalizedUserRole = roleMap[userRole] || userRole;

    if (requiredRole !== "PUBLIC") {
      if (!userRole) {
        return res.status(401).json({
          success: false, intent, requiresAuth: true, requiredRole,
          message: `Login required as ${requiredRole}`
        });
      }
      if (normalizedUserRole !== requiredRole) {
        return res.status(403).json({ success: false, intent, message: `Requires ${requiredRole} access` });
      }
    }

    // =====================================================
    // 🔹 CONVERSATION MEMORY (server-side)
    // =====================================================

    let previousContext = null;

    try {
      if (user?.email) {
        previousContext = getUserContext(user.email);
      }
    } catch (err) {
      console.log("Memory skipped:", err.message);
    }

    // Merge with server-side memory too
    if (intent === "UNKNOWN" && previousContext) {
      intent = previousContext.intent;
      params = { ...previousContext.params, ...params };
    } else if (previousContext && intent === previousContext.intent) {
      // Same intent — merge new params over old
      params = { ...previousContext.params, ...params };
    }

    // Re-extract field from query so stale field from memory never wins
    if (intent === 'GET_STUDENT_INFO') {
      const qLower = query.toLowerCase();
      if      (/\bemail\b/.test(qLower))                                  params.field = 'email';
      else if (/\b(phone|mobile|contact)\b/.test(qLower))                 params.field = 'phone';
      else if (/\b(room|block|live|lives|stay|stays|where)\b/.test(qLower)) params.field = 'room';
      else if (/\bname\b/.test(qLower))                                   params.field = 'name';
    }

    console.log("FINAL INTENT:", intent);

    // =====================================================
    // 🔴 CRITICAL SAFETY
    // =====================================================

    if (!hostelNo && requiredRole !== "PUBLIC") {
      return res.status(403).json({ success: false, message: "Hostel context missing" });
    }

    if (params.status) params.status = params.status.toLowerCase();

    // =====================================================
    // 🔹 STUDENT INFO
    // =====================================================

    if (intent === 'GET_STUDENT_INFO') {
      if (!params.rollNo && !params.name) {
        return res.status(400).json({ success: false, intent, message: "Please provide a roll number or student name" });
      }

      if (params.name) {
        const students = await fetchStudentsByName({ hostelNo, name: params.name });
        setUserContext(userId, { intent, params: students.length === 1 ? { ...params, rollNo: students[0].rollNo } : params });
        return res.json({ success: true, intent, students, count: students.length, field: params.field });
      }

      const student = await fetchStudentByRollNo({ hostelNo, rollNo: params.rollNo });
      setUserContext(userId, { intent, params });
      return res.json({ success: true, intent, student, field: params.field });
    }
    
// =====================================================
// 🔹 STUDENT REMARKS
// =====================================================



// =====================================================
// 🔹 STUDENT REMARKS
// =================================================





    // =====================================================
    // 🔹 ROOM QUERIES
    // =====================================================

    if (intent === 'GET_ROOM_STUDENTS') {
      console.log("🔥 NEW NLP CONTROLLER LOADED");
      if (!requireParam(params.roomNo, "Room number", res, intent)) return;

      const students = await fetchStudentsByRoom({ hostelNo, roomNo: params.roomNo });
      setUserContext(userId, { intent, params });

      return res.json({ success: true, intent, count: students.length, students });
    }

    if (intent === 'GET_ROOM_OCCUPANCY') {
      if (!requireParam(params.roomNo, "Room number", res, intent)) return;

      const [room, students] = await Promise.all([
        fetchRoomDetails({ hostelNo, roomNo: params.roomNo }),
        fetchStudentsByRoom({ hostelNo, roomNo: params.roomNo }),
      ]);

      if (!room) {
        return res.status(404).json({ success: false, intent, message: `Room ${params.roomNo} not found` });
      }

      setUserContext(userId, { intent, params });

      return res.json({
        success: true,
        intent,
        currentOccupancy: students.length,
        maxOccupancy: parseInt(room.maxOccupancy, 10) || 0,
      });
    }

if (intent === "GET_STUDENT_REMARKS") {
  let resolvedRollNo = params.rollNo;

  if (!resolvedRollNo && params.name) {
    const matched = await fetchStudentsByName({ hostelNo, name: params.name });

    if (matched.length === 0) {
      return res.status(404).json({ success: false, intent, message: `No student found with name "${params.name}"` });
    }
    if (matched.length > 1) {
      return res.json({
        success: false,
        intent,
        message: `Multiple students match "${params.name}". Please be more specific or use a roll number.`,
        students: matched,
      });
    }

    resolvedRollNo = matched[0].rollNo;
  }

  if (!requireParam(resolvedRollNo, "Roll number or student name", res, intent)) return;

  const remarks = await fetchRemarksByRollNo({ rollNo: resolvedRollNo });

  return res.json({
    success: true,
    intent,
    count: remarks.length,
    remarks,
  });
}






    // =====================================================
    // 🔹 MY COMPLAINTS
    // =====================================================

    if (intent === 'GET_MY_COMPLAINTS' || intent === 'COUNT_MY_COMPLAINTS') {
      let complaints = await fetchComplaintsForAdmin({ hostelNo });
      complaints = enrichComplaintsWithPriority(complaints);
      complaints = complaints.filter(c => c.rollNo === rollNo);

      if (params.status) complaints = complaints.filter(c => c.status === params.status);
      if (params.priority) complaints = complaints.filter(c => c.priority === params.priority);
      if (params.tag) complaints = complaints.filter(c => c.tag === params.tag);

      setUserContext(userId, { intent, params });

      if (intent === 'COUNT_MY_COMPLAINTS') {
        return res.json({ success: true, intent, count: complaints.length });
      }

      return res.json({ success: true, intent, count: complaints.length, complaints });
    }

    // =====================================================
    // 🔹 ALL COMPLAINTS (ADMIN) — with smart tag matching
    // =====================================================

    if (intent === 'GET_COMPLAINTS' || intent === 'COUNT_COMPLAINTS') {
      let complaints = await fetchComplaintsForAdmin({ hostelNo });
      complaints = enrichComplaintsWithPriority(complaints);

      if (params.rollNo) complaints = complaints.filter(c => c.rollNo === params.rollNo);
      if (params.status) complaints = complaints.filter(c => c.status === params.status);
      if (params.priority) complaints = complaints.filter(c => c.priority === params.priority);

      if (params.tag) {
        const validTags = TAG_MAP[params.tag] || [params.tag];
        complaints = complaints.filter(c => validTags.includes(c.tag?.toLowerCase()));
      }

      // ✅ Save to server-side memory for follow-up queries
      setUserContext(userId, { intent, params });

      if (intent === 'COUNT_COMPLAINTS') {
        return res.json({ success: true, intent, count: complaints.length });
      }

      return res.json({ success: true, intent, count: complaints.length, complaints });
    }

    // =====================================================
    // 🔹 NOTICES
    // =====================================================

    if (intent === 'GET_NOTICES') {
      // Logged-in: use their hostelNo → hostel + college notices
      // Guest with hostel number in query → hostel + college notices
      // Guest with no hostel number → college notices only
      const resolvedHostelNo = hostelNo || params.hostelNo || null;

      const notices = await fetchNotices({ hostelNo: resolvedHostelNo });
      return res.json({ success: true, intent, count: notices.length, notices });
    }

    // =====================================================
    // 🔹 DEFAULT
    // =====================================================

    return res.json({ success: false, intent, message: "Intent not supported" });

  } catch (error) {
    console.error("NLP Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "NLP processing failed",
      error: error.message
    });
  }
};

module.exports = { adminNlpQuery };