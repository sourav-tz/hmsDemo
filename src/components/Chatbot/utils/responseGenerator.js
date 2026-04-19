// =====================================================
// 🤖 RESPONSE GENERATOR — Natural language reply builder
// =====================================================

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// =====================================================
// 🔹 GREETINGS & SMALL TALK
// =====================================================

export const GREETING_PATTERNS = /^(hi|hello|hey|howdy|sup|yo|hii|helo)\b/i;
export const HOWAREYOU_PATTERNS = /how are you|how's it going|how do you do/i;
export const WHOAREYOU_PATTERNS = /who are you|what are you|introduce yourself/i;
export const WHATCANYOUDO_PATTERNS = /what (else )?can you do|what (else )?do you (do|know)|help me|your capabilities|capabilities/i;

export const handleSmallTalk = (query) => {
  const q = query.toLowerCase().trim();

  // In handleSmallTalk() inside responseGenerator.js, ADD at the top:
const ACKNOWLEDGEMENTS = /^(okay|ok|thanks|thank you|sure|got it|alright|fine|cool|nice|great|good)$/i;
if (ACKNOWLEDGEMENTS.test(q.trim())) {
  return pick([
    "😊 Let me know if you need anything else!",
    "👍 Sure! Ask me anything about the hostel.",
    "Got it! Anything else I can help with?",
  ]);
}

  if (GREETING_PATTERNS.test(q)) {
    return pick([
      "Hey there! 👋 I'm your HMS Assistant. Ask me about complaints, rooms, or student info!",
      "Hello! 😊 Ready to help with hostel queries — try asking about complaints or room details.",
      "Hi! 🏠 I'm the Hostel Management Assistant. What can I help you with today?",
    ]);
  }

  if (HOWAREYOU_PATTERNS.test(q)) {
    return pick([
      "Doing great, thanks for asking! 😄 What hostel query can I help with?",
      "I'm always ready to assist! 💪 Ask me about complaints, students, or rooms.",
      "Running at 100%! 🚀 What do you need today?",
    ]);
  }

  if (WHOAREYOU_PATTERNS.test(q)) {
    return (
      "I'm **HMS Assistant** 🤖 — your smart hostel management chatbot.\n\n" +
      "I can help you with:\n" +
      "• 📋 Complaints (view, filter, create, count)\n" +
      "• 🏠 Room details and occupancy\n" +
      "• 👤 Student information lookup\n" +
      "• 📢 Notices and announcements\n\n" +
      "Just ask naturally — I'll figure it out!"
    );
  }

  if (WHATCANYOUDO_PATTERNS.test(q)) {
    return (
      "Here's what I can do for you 👇\n\n" +
      "📋 **Complaints**\n" +
      '  • "Show pending complaints"\n' +
      '  • "High priority complaints"\n' +
      '  • "Count electricity complaints"\n' +
      '  • "Complaints of roll 524110039"\n\n' +
      "🏠 **Rooms**\n" +
      '  • "Who lives in room 101?"\n' +
      '  • "Room 205 occupancy"\n\n' +
      "👤 **Students**\n" +
      '  • "Details of roll 524110039"\n' +
      '  • "Email of roll 524110039"\n' +
      '  • "Room number of roll 524110039"\n' +
      '  • "Remarks of roll 524110039"\n\n' +
      "📢 **Notices**\n" +
      '  • "Show notices"\n' +
      '  • "Latest announcements"\n\n' +
      "Just ask naturally — I understand plain English! 🧠"
    );
  }

  return null; // not small talk
};

// =====================================================
// 🔹 FAQ / GENERAL KNOWLEDGE
// =====================================================

const FAQ_MAP = {
  "hostel timing": "🕐 Hostel gate timings: Open 6:00 AM – 11:00 PM. Late entry requires a pass from the warden.",
  "wifi timing": "📶 WiFi is available 24/7 in all hostel wings. Contact admin for speed-related issues.",
  "mess timing": "🍽️ Mess timings:\n• Breakfast: 7:30–9:00 AM\n• Lunch: 12:30–2:00 PM\n• Dinner: 7:30–9:00 PM",
  "hostel rules": "📜 Key hostel rules:\n• Guests allowed only in visitor area\n• Quiet hours after 10 PM\n• No cooking in rooms\n• ID mandatory at all times",
  "visitor": "👥 Visitors are allowed between 10 AM – 6 PM in designated areas only. They must register at the gate.",
  "laundry": "👕 Laundry service runs Mon–Sat. Drop clothes by 9 AM, collect next day.",
  "gym": "💪 Hostel gym is open 6–8 AM and 5–8 PM on all days.",
  "library": "📚 The hostel reading room is open 24/7. Silence must be maintained.",
  "warden": "🏢 Warden office hours: 9 AM – 5 PM, Monday to Saturday.",
  "emergency": "🚨 Emergency contact: Security desk — ext. 100 | Warden — ext. 101",
  "complaint": "📋 To view your complaints, ask: 'Show my complaints'",
};

export const handleFAQ = (query) => {
  const q = query.toLowerCase();
  for (const key of Object.keys(FAQ_MAP)) {
    if (q.includes(key)) return FAQ_MAP[key];
  }
  return null;
};

// =====================================================
// 🔹 MAIN RESPONSE GENERATOR
// =====================================================

export const generateReply = (data, query = "") => {
  if (!data) return "⚠️ No response received. Try again in a moment.";

  const { intent, complaints, students, student, count, currentOccupancy, maxOccupancy } = data;

  switch (intent) {

    // =====================================================
    // 🔹 COMPLAINTS
    // =====================================================
    case "GET_COMPLAINTS":
    case "GET_MY_COMPLAINTS": {
      if (!complaints?.length) {
        return pick([
          "✅ No complaints found matching your filters.",
          "🎉 All clear! No complaints match that query.",
          "📭 Nothing found. Try different filters.",
        ]);
      }

      const header = pick([
        `📋 Found **${complaints.length}** complaint${complaints.length > 1 ? "s" : ""}:`,
        `📄 Here ${complaints.length === 1 ? "is" : "are"} **${complaints.length}** complaint${complaints.length > 1 ? "s" : ""}:`,
        `🔍 I found **${complaints.length}** complaint${complaints.length > 1 ? "s" : ""} for you:`,
      ]);

      const lines = complaints.slice(0, 5).map((c) => {
        const statusIcon = { pending: "🟡", resolved: "🟢", rejected: "🔴" }[c.status] || "⚪";
        const priorityBadge = c.priority ? ` [${c.priority}]` : "";
        return `${statusIcon} ${c.subject || "Complaint"} — **${c.tag || "general"}**${priorityBadge} (${c.status})`;
      });

      const suffix = complaints.length > 5 ? `\n_...and ${complaints.length - 5} more._` : "";
      return header + "\n\n" + lines.join("\n") + suffix;
    }

    case "COUNT_COMPLAINTS":
    case "COUNT_MY_COMPLAINTS": {
      return pick([
        `📊 Total: **${count}** complaint${count !== 1 ? "s" : ""} found.`,
        `🔢 There ${count === 1 ? "is" : "are"} **${count}** complaint${count !== 1 ? "s" : ""} matching your query.`,
        `📈 Count: **${count}** complaint${count !== 1 ? "s" : ""}.`,
      ]);
    }

case "GET_NOTICES": {
  if (!data.notices?.length) {
    return "No notices found for your hostel.";
  }
  return `📢 ${data.count} notice${data.count !== 1 ? "s" : ""} found.`;
}

case "GET_STUDENT_REMARKS": {
  if (!data.remarks?.length) {
    return "No remarks found for this student.";
  }
  return `📝 ${data.count} remark${data.count !== 1 ? "s" : ""} found.`;
}

    // =====================================================
    // 🔹 ROOMS
    // =====================================================
    case "GET_ROOM_STUDENTS": {
      if (!students?.length) {
        return "🏠 No students are currently assigned to this room.";
      }
      const lines = students.map((s) => `• ${s.firstName} ${s.lastName} (${s.rollNo})`).join("\n");
      return `👥 **${students.length}** student${students.length > 1 ? "s" : ""} in this room:\n\n${lines}`;
    }

    case "GET_ROOM_OCCUPANCY": {
      const pct = Math.round((currentOccupancy / maxOccupancy) * 100);
      const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
      return `🏠 Room Occupancy: **${currentOccupancy}/${maxOccupancy}**\n${bar} ${pct}%`;
    }

    // =====================================================
    // 🔹 STUDENT
    // =====================================================
    case "GET_STUDENT_INFO": {
      if (data.students) {
        if (!data.students.length) return "No students found with that name.";
        if (data.students.length > 1) {
          return `Found **${data.students.length}** students matching your query.`;
        }
        data.student = data.students[0];
      }

      if (!data.student) {
        return pick([
          "🔍 Student not found. Please verify the roll number or name.",
          "❌ No student found matching that query.",
        ]);
      }

      // Card handles the full display — return empty string so no duplicate text
      return "";
    }

    // =====================================================
    // 🔹 DEFAULT
    // =====================================================
    default: {
      if (data.message && data.message !== "Intent not supported") {
        return data.message;
      }
      return pick([
        "🤔 Hmm, I didn't quite get that. Try asking about complaints, rooms, or students.",
        "💭 Not sure I understood that. Maybe try: 'show complaints' or 'room 101 students'?",
        "🧩 I couldn't parse that one. Ask me about hostel complaints, rooms, or student info!",
      ]);
    }
  }
};

// =====================================================
// 🔹 SUGGESTION CHIPS
// =====================================================

export const getSuggestions = (intent) => {
  const map = {
    GET_COMPLAINTS: ["Show pending", "Count complaints", "High priority complaints"],
    COUNT_COMPLAINTS: ["Show all complaints", "Pending complaints", "Resolved complaints"],
    GET_MY_COMPLAINTS: ["My pending complaints", "My resolved complaints"],
    GET_STUDENT_INFO: ["Email", "Room", "Phone"],
    GET_ROOM_STUDENTS: ["Room occupancy", "Show complaints"],
    GET_ROOM_OCCUPANCY: ["Who lives here?", "Show complaints"],
    GET_NOTICES: ["Show complaints", "My complaints", "What can you do?"],
default: ["Show complaints", "My complaints", "Room details", "What can you do?"],
  };
  return map[intent] || map.default;
};