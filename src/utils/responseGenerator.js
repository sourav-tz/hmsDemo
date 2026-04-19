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
export const WHATCANYOUDO_PATTERNS = /what can you do|what do you know|help me|your capabilities|capabilities/i;

export const handleSmallTalk = (query) => {
  const q = query.toLowerCase().trim();

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
      "• 📊 Analytics and reports\n\n" +
      "Just ask naturally — I'll figure it out!"
    );
  }

  if (WHATCANYOUDO_PATTERNS.test(q)) {
    return (
      "Here's what I can do for you 👇\n\n" +
      "📋 **Complaints**\n" +
      '  • "Show pending complaints"\n' +
      '  • "Count electricity complaints"\n' +
      '  • "Complaints of roll 524110039"\n\n' +
      "🏠 **Rooms**\n" +
      '  • "Who lives in room 101?"\n' +
      '  • "Room 205 occupancy"\n\n' +
      "👤 **Students**\n" +
      '  • "Details of roll 524110039"\n' +
      '  • "Email of roll 524110039"\n\n' +
      "📊 **Analytics**\n" +
      '  • "Which hostel has most complaints?"\n' +
      '  • "Top complaint categories"\n\n' +
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
  "complaint": "📋 To file a complaint, tell me: 'Register a complaint about [issue]'",
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

  const { intent, complaints, students, student, count, result, categories, currentOccupancy, maxOccupancy, field } = data;

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

    case "CREATE_COMPLAINT": {
      return pick([
        "✅ Your complaint has been registered successfully!",
        "📝 Done! Complaint filed. The admin will look into it shortly.",
        "✅ Complaint submitted! You'll be notified on updates.",
      ]);
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
      const s = data.student;
      const resolvedField = data.field || field;

      if (!s) {
        return pick([
          "🔍 Student not found. Please verify the roll number.",
          "❌ No student found with that roll number.",
        ]);
      }

      if (resolvedField) {
        const fieldMap = {
          email: `📧 Email: **${s.email || "N/A"}**`,
          phone: `📱 Phone: **${s.profile?.phoneNumber || "N/A"}**`,
          room: `🏠 Room: **${s.room?.roomNo || "N/A"}**`,
          name: `👤 Name: **${s.firstName} ${s.lastName}**`,
        };
        return fieldMap[resolvedField] || "ℹ️ Requested field not available.";
      }

      return (
        `👤 **${s.firstName} ${s.lastName}**\n` +
        `📘 Roll No: ${s.rollNo}\n` +
        `🎓 Course: ${s.course?.courseName || "N/A"}\n` +
        `📅 Year: ${s.year || "N/A"}\n` +
        `🏠 Room: ${s.room?.roomNo || "N/A"}\n` +
        `📧 Email: ${s.email || "N/A"}\n` +
        `📱 Phone: ${s.profile?.phoneNumber || "N/A"}`
      );
    }


    case "GET_STUDENT_REMARKS": {
      const remarks = data.remarks;

      if (!remarks?.length) {
        botReply = "No remarks found for this student.";
      } else {
        botReply = `📝 Found ${remarks.length} remark(s):\n\n`;

        remarks.slice(0, 5).forEach(r => {
          botReply += `• ${r.remarks || "Attachment"}\n`;
        });
      }
      break;
    }



    // =====================================================
    // 🔹 ANALYTICS
    // =====================================================
    case "HOSTEL_WITH_MOST_COMPLAINTS": {
      return `🏆 **${result}** has the highest number of complaints right now.`;
    }

    case "TOP_COMPLAINT_CATEGORIES": {
      if (!result?.length) return "📊 No category data available yet.";
      const lines = result.map((c, i) => `${["🥇", "🥈", "🥉"][i] || "•"} ${c.tag}: **${c.count}** complaints`).join("\n");
      return `📊 Top complaint categories:\n\n${lines}`;
    }

    case "OLD_COMPLAINTS": {
      return pick([
        `⏳ Found **${data.count}** complaint${data.count !== 1 ? "s" : ""} older than the specified period.`,
        `📅 **${data.count}** old unresolved complaint${data.count !== 1 ? "s" : ""} detected.`,
      ]);
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
    GET_STUDENT_INFO: ["Student email", "Student room", "Student phone"],
    GET_ROOM_STUDENTS: ["Room occupancy", "Show complaints"],
    GET_ROOM_OCCUPANCY: ["Who lives here?", "Show complaints"],
    CREATE_COMPLAINT: ["My complaints", "Show all complaints"],
    HOSTEL_WITH_MOST_COMPLAINTS: ["Top categories", "Show old complaints"],
    TOP_COMPLAINT_CATEGORIES: ["Hostel with most complaints", "Show complaints"],
    default: ["Show complaints", "My complaints", "Room details", "What can you do?"],
  };
  return map[intent] || map.default;
};