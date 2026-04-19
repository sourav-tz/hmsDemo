import { useEffect, useState, useRef } from "react";
import { useChatbot } from "./hooks/useChatbot";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────

const TAG_ICONS = {
  electricity: "⚡",
  water: "💧",
  internet: "📶",
  plumber: "🔧",
  carpenter: "🪚",
  cleaning: "🧹",
  other: "📋",
};

const STATUS_CFG = {
  pending:  { label: "Pending",  color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  resolved: { label: "Resolved", color: "#065f46", bg: "#d1fae5", dot: "#10b981" },
  rejected: { label: "Rejected", color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

const CARD_INTENTS = new Set([
  "GET_COMPLAINTS", "GET_MY_COMPLAINTS", "GET_ROOM_STUDENTS", "GET_ROOM_OCCUPANCY",
  "GET_STUDENT_REMARKS", "GET_NOTICES", "GET_STUDENT_INFO",
]);

const PRIORITY_CFG = {
  HIGH:   { color: "#dc2626", bg: "#fee2e2", label: "HIGH" },
  MEDIUM: { color: "#ea580c", bg: "#ffedd5", label: "MED" },
  LOW:    { color: "#6b7280", bg: "#f3f4f6", label: "LOW" },
};

// ─────────────────────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────────────────────

const renderText = (text) => {
  if (!text) return null;
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
};

// ─────────────────────────────────────────────────────────
// TYPEWRITER TEXT
// ─────────────────────────────────────────────────────────

const TypewriterText = ({ text, animate }) => {
  const [displayed, setDisplayed] = useState(animate ? "" : text);
  const [done, setDone] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let idx = 0;
    const speed = text.length < 60 ? 20 : text.length < 120 ? 12 : 6;
    const id = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, animate]); // eslint-disable-line

  return (
    <>
      {renderText(displayed)}
      {!done && (
        <span className="chat-cursor" style={{
          display: "inline-block",
          width: 2,
          height: "0.85em",
          background: "#6366f1",
          marginLeft: 2,
          verticalAlign: "middle",
          borderRadius: 1,
        }} />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────
// COMPLAINT CARD
// ─────────────────────────────────────────────────────────

const ComplaintCard = ({ c }) => {
  const status   = STATUS_CFG[c.status?.toLowerCase()] || STATUS_CFG.pending;
  const priority = PRIORITY_CFG[c.priority] || PRIORITY_CFG.LOW;
  const tagKey   = c.tag?.toLowerCase();
  const tagIcon  = TAG_ICONS[tagKey] || "📋";
  const date     = c.createdAt
    ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })
    : null;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8ecf0",
      borderLeft: `3px solid ${priority.color}`,
      borderRadius: 8,
      padding: "8px 10px",
      marginBottom: 5,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#374151", fontWeight: 600, fontSize: 11, textTransform: "capitalize" }}>
          <span style={{ fontSize: 11 }}>{tagIcon}</span>
          {c.tag || "General"}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
          color: priority.color, background: priority.bg,
          padding: "1px 6px", borderRadius: 999,
        }}>
          {priority.label}
        </span>
      </div>

      <p style={{ margin: "0 0 5px", color: "#1e293b", fontWeight: 500, fontSize: 12, lineHeight: 1.35 }}>
        {c.subject || "Complaint"}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 11 }}>
        <span style={{ color: "#64748b" }}>Roll <strong style={{ color: "#334155" }}>{c.rollNo ?? "—"}</strong></span>
        {c.roomNo != null && (
          <span style={{ color: "#64748b" }}>Room <strong style={{ color: "#334155" }}>{c.roomNo}</strong></span>
        )}
        {date && <span style={{ color: "#94a3b8" }}>{date}</span>}
        <span style={{
          marginLeft: "auto",
          display: "flex", alignItems: "center", gap: 3,
          color: status.color, background: status.bg,
          fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 999,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: status.dot, display: "inline-block" }} />
          {status.label}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STUDENT INFO CARD  (single student lookup)
// ─────────────────────────────────────────────────────────

const StudentInfoCard = ({ s }) => {
  const initials = `${s.firstName?.[0] || ""}${s.lastName?.[0] || ""}`.toUpperCase() || "?";
  const rows = [
    { label: "Course", value: s.course?.courseName },
    { label: "Year",   value: s.year ? `Year ${s.year}` : null },
    { label: "Room",   value: s.room?.roomNo ? `Room ${s.room.roomNo}` : null },
    { label: "Email",  value: s.email },
    { label: "Phone",  value: s.profile?.phoneNumber },
  ].filter(r => r.value);

  return (
    <div style={{ background: "#fff", border: "1px solid #e8ecf0", borderRadius: 10, overflow: "hidden", marginTop: 4 }}>
      <div style={{
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        padding: "11px 13px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 13 }}>
            {s.firstName} {s.lastName}
          </p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 1 }}>
            Roll {s.rollNo}
          </p>
        </div>
      </div>
      <div style={{ padding: "9px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "#94a3b8", fontWeight: 500 }}>{label}</span>
            <span style={{ color: "#1e293b", fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STUDENT ROW CARD  (room student list)
// ─────────────────────────────────────────────────────────

const StudentRow = ({ s }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", background: "#fff",
    border: "1px solid #e8ecf0", borderRadius: 8, marginBottom: 5,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>
      {(s.firstName?.[0] || "?").toUpperCase()}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1e293b" }}>
        {s.firstName} {s.lastName}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 2, fontSize: 11, color: "#64748b" }}>
        <span>Roll <strong style={{ color: "#334155" }}>{s.rollNo}</strong></span>
        {s.year && <span>· Year {s.year}</span>}
        {s.room?.roomNo && <span>· Room <strong style={{ color: "#334155" }}>{s.room.roomNo}</strong></span>}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// OCCUPANCY GAUGE
// ─────────────────────────────────────────────────────────

const OccupancyGauge = ({ current, max }) => {
  const pct  = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  const fill = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#10b981";
  const statusLabel = pct >= 90 ? "Full" : pct >= 60 ? "Filling up" : "Available";
  const statusColor = pct >= 90 ? "#991b1b" : pct >= 60 ? "#92400e" : "#065f46";
  const statusBg    = pct >= 90 ? "#fee2e2" : pct >= 60 ? "#fef3c7" : "#d1fae5";

  return (
    <div style={{
      background: "#fff", border: "1px solid #e8ecf0",
      borderLeft: `3px solid ${fill}`, borderRadius: 8, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>🏠 Room Occupancy</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: fill }}>{current}/{max}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: statusColor,
            background: statusBg, padding: "1px 6px", borderRadius: 999,
          }}>
            {statusLabel.toUpperCase()}
          </span>
        </div>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 999, height: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: fill, borderRadius: 999, transition: "width 0.6s ease",
        }} />
      </div>
      <p style={{ margin: "5px 0 0", fontSize: 11, color: "#94a3b8", textAlign: "right" }}>{pct}% occupied</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// NOTICE CARD
// ─────────────────────────────────────────────────────────

const NoticeCard = ({ n }) => {
  const date = n.createdAt
    ? new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })
    : null;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8ecf0",
      borderLeft: `3px solid ${n.isGlobal ? "#7c3aed" : "#0891b2"}`,
      borderRadius: 8,
      padding: "8px 10px",
      marginBottom: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {n.title || "Untitled Notice"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
            color: n.isGlobal ? "#7c3aed" : "#0891b2",
            background: n.isGlobal ? "#f3e8ff" : "#e0f2fe",
            padding: "1px 6px", borderRadius: 999,
          }}>
            {n.isGlobal ? "COLLEGE" : "HOSTEL"}
          </span>
          {date && <span style={{ fontSize: 11, color: "#94a3b8" }}>{date}</span>}
        </div>
      </div>
      {n.url && (
        <a
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: "#4338ca",
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: 999,
            padding: "4px 10px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          View
        </a>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// REMARK CARD
// ─────────────────────────────────────────────────────────

const RemarkCard = ({ r }) => {
  const date = r.createdAt
    ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })
    : null;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8ecf0",
      borderLeft: "3px solid #6366f1",
      borderRadius: 8,
      padding: "8px 10px",
      marginBottom: 5,
    }}>
      {r.remarks && (
        <p style={{ margin: "0 0 6px", fontSize: 12, color: "#1e293b", lineHeight: 1.45 }}>
          {r.remarks}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontSize: 11, color: "#64748b" }}>
          <strong style={{ color: "#334155" }}>{r.createdByName || "Unknown"}</strong>
          {r.createdByRole && <span style={{ marginLeft: 4, color: "#94a3b8" }}>({r.createdByRole})</span>}
          {date && <span style={{ marginLeft: 8 }}>{date}</span>}
        </div>
        {r.fileAttachment && (
          <a
            href={r.fileAttachment}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: "#4338ca",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: 999,
              padding: "3px 10px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            View Attachment
          </a>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STRUCTURED DATA RENDERER
// ─────────────────────────────────────────────────────────

const StructuredBlock = ({ rawData }) => {
  if (!rawData?.intent) return null;
  const { intent, complaints, students, currentOccupancy, maxOccupancy } = rawData;

  if (intent === "GET_STUDENT_INFO") {
    const s = rawData.student || rawData.students?.[0];
    if (!s) return null;
    // Multiple matches → list of rows
    if (rawData.students?.length > 1) {
      return (
        <div style={{ marginTop: 8 }}>
          {rawData.students.map((st, i) => (
            <StudentRow key={st.rollNo || i} s={st} />
          ))}
        </div>
      );
    }
    return <StudentInfoCard s={s} />;
  }

  if ((intent === "GET_COMPLAINTS" || intent === "GET_MY_COMPLAINTS") && complaints?.length > 0) {
    return (
      <div style={{ marginTop: 8 }}>
        {complaints.slice(0, 6).map((c, i) => (
          <ComplaintCard key={c.complaintId || i} c={c} />
        ))}
        {complaints.length > 6 && (
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            +{complaints.length - 6} more complaints
          </p>
        )}
      </div>
    );
  }

  if (intent === "GET_ROOM_STUDENTS" && students?.length > 0) {
    return (
      <div style={{ marginTop: 8 }}>
        {students.map((s, i) => (
          <StudentRow key={s.rollNo || i} s={s} />
        ))}
      </div>
    );
  }

  if (intent === "GET_NOTICES" && rawData.notices?.length > 0) {
    return (
      <div style={{ marginTop: 8 }}>
        {rawData.notices.slice(0, 5).map((n, i) => (
          <NoticeCard key={n.public_id || i} n={n} />
        ))}
      </div>
    );
  }

  if (intent === "GET_STUDENT_REMARKS" && rawData.remarks?.length > 0) {
    return (
      <div style={{ marginTop: 8 }}>
        {rawData.remarks.slice(0, 6).map((r, i) => (
          <RemarkCard key={r.remarkId || i} r={r} />
        ))}
        {rawData.remarks.length > 6 && (
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            +{rawData.remarks.length - 6} more remarks
          </p>
        )}
      </div>
    );
  }

  if (intent === "GET_ROOM_OCCUPANCY") {
    return (
      <div style={{ marginTop: 8 }}>
        <OccupancyGauge current={currentOccupancy ?? 0} max={maxOccupancy ?? 0} />
      </div>
    );
  }

  return null;
};

// ─────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────

const MessageBubble = ({ msg, onSuggestion, animate }) => {
  const isUser = msg.sender === "user";
  const isCard = msg.rawData && CARD_INTENTS.has(msg.rawData.intent);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      gap: 4,
    }}>
      <div style={{
        maxWidth: "86%",
        padding: "9px 13px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        fontSize: 13,
        lineHeight: 1.55,
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        ...(isUser
          ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.3)" }
          : { background: "rgba(255,255,255,0.92)", color: "#1e293b", border: "1px solid rgba(232,236,240,0.8)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", backdropFilter: "blur(8px)" }
        ),
      }}>
        {/* Bot text: typewriter for latest, normal render for rest */}
        {!isUser && !isCard && (
          <TypewriterText text={msg.text} animate={animate} />
        )}
        {/* Suppress text list for card intents */}
        {isUser && renderText(msg.text)}
        {/* Count line for card intents */}
        {!isUser && isCard && (
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", marginBottom: msg.rawData.complaints?.length || msg.rawData.students?.length ? 4 : 0 }}>
            {msg.rawData.count !== undefined ? `${msg.rawData.count} result${msg.rawData.count !== 1 ? "s" : ""}` : ""}
          </p>
        )}
        {!isUser && <StructuredBlock rawData={msg.rawData} />}
      </div>

      {!isUser && msg.suggestions?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxWidth: "90%" }}>
          {msg.suggestions.map((chip, i) => (
            <button
              key={i}
              onClick={() => onSuggestion(chip)}
              style={{
                fontSize: 11, padding: "4px 10px",
                borderRadius: 999, border: "1px solid #c7d2fe",
                background: "#eef2ff", color: "#4338ca",
                cursor: "pointer", fontWeight: 500,
                transition: "background 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#e0e7ff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "flex-start" }}>
    <div style={{
      background: "rgba(255,255,255,0.92)", border: "1px solid rgba(232,236,240,0.8)",
      borderRadius: "16px 16px 16px 4px",
      padding: "10px 14px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      display: "flex", gap: 4, alignItems: "center",
    }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7,
          borderRadius: "50%",
          background: "#a5b4fc",
          display: "inline-block",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// LOGIN PANEL
// ─────────────────────────────────────────────────────────

const LoginPanel = ({ authMode, credentials, setCredentials, onLogin }) => (
  <div style={{
    padding: "14px 16px",
    borderTop: "1px solid #e8ecf0",
    background: "rgba(248,250,255,0.95)",
    display: "flex", flexDirection: "column", gap: 8,
  }}>
    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#4338ca", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      Login as {authMode}
    </p>
    {["email", "password"].map((field) => (
      <input
        key={field}
        type={field}
        placeholder={field === "email" ? "Email address" : "Password"}
        value={credentials[field]}
        onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onLogin()}
        style={{
          border: "1px solid #c7d2fe", borderRadius: 8,
          padding: "8px 12px", fontSize: 13, outline: "none",
          background: "#fff",
        }}
      />
    ))}
    <button
      onClick={onLogin}
      style={{
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        color: "#fff", border: "none", borderRadius: 8,
        padding: "9px", fontSize: 13, fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Sign In
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────
// FLOATING TOGGLE BUTTON  (with pulse ring + unread badge)
// ─────────────────────────────────────────────────────────

const ToggleButton = ({ onClick, isOpen, unreadCount }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
    {/* Pulse rings — only when closed */}
    {!isOpen && (
      <>
        <span className="chat-pulse-ring" />
        <span className="chat-pulse-ring" style={{ animationDelay: "0.75s" }} />
      </>
    )}

    {/* Unread badge */}
    {unreadCount > 0 && !isOpen && (
      <span style={{
        position: "absolute", top: -5, right: -5,
        minWidth: 18, height: 18,
        borderRadius: 999,
        background: "#ef4444",
        color: "#fff", fontSize: 10, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 4px",
        border: "2px solid #fff",
        zIndex: 1,
        animation: "badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}>
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}

    <button
      onClick={onClick}
      className="chat-toggle-btn"
      aria-label="Toggle chatbot"
    >
      {isOpen ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 9l-7 7-7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────
// MAIN CHATBOT
// ─────────────────────────────────────────────────────────

const UniversalChatbot = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [animatingMsgIdx, setAnimatingMsgIdx] = useState(null);
  const firstRender = useRef(true);

  const {
    messages,
    input,
    setInput,
    loading,
    authMode,
    credentials,
    setCredentials,
    messagesEndRef,
    handleSend,
    handleLogin,
    handleSuggestion,
  } = useChatbot();

  // Track new bot messages for typewriter + unread badge
  useEffect(() => {
    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];
    if (!lastMsg || lastMsg.sender !== "bot") return;

    // Always set animating index for the latest bot message
    setAnimatingMsgIdx(lastIdx);

    // Unread badge: skip the welcome message (first render)
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!open) {
      setUnreadCount((c) => c + 1);
    }
  }, [messages.length]); // eslint-disable-line

  // Clear unread when panel opens
  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes badgePop {
          from { transform: scale(0) rotate(-20deg); }
          to   { transform: scale(1) rotate(0deg); }
        }
        @keyframes headerShimmer {
          0%   { left: -70%; }
          100% { left: 140%; }
        }

        /* ── Classes ── */
        .chat-msg  { animation: msgFadeIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .chat-panel { animation: chatSlideUp 0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

        .chat-cursor { animation: cursorBlink 0.7s step-end infinite; }

        .chat-pulse-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2.5px solid rgba(99,102,241,0.55);
          animation: pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite;
          pointer-events: none;
        }

        .chat-toggle-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(79,70,229,0.45);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .chat-toggle-btn:hover {
          transform: scale(1.1) translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(79,70,229,0.6) !important;
        }
        .chat-toggle-btn:active {
          transform: scale(0.95) !important;
        }

        .chat-header-shimmer {
          position: absolute; top: 0; bottom: 0; width: 55%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: headerShimmer 3.5s linear infinite;
          pointer-events: none;
        }

        .chat-avatar-ring {
          width: 38px; height: 38px; border-radius: 50%;
          flex-shrink: 0;
          background: #1e1b4b;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }

        .chat-send-btn {
          transition: transform 0.15s, box-shadow 0.15s !important;
        }
        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.08) !important;
        }
        .chat-send-btn:active:not(:disabled) {
          transform: scale(0.92) !important;
        }
      `}</style>

      <ToggleButton
        onClick={() => setOpen((v) => !v)}
        isOpen={open}
        unreadCount={unreadCount}
      />

      {open && (
        <div
          className="chat-panel"
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 420,
            maxHeight: 660,
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 16px 56px rgba(0,0,0,0.22), 0 4px 16px rgba(79,70,229,0.12)",
            zIndex: 9998,
            background: "rgba(241,245,249,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          {/* ── Header ── */}
          <div style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #6d28d9 100%)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Shimmer overlay */}
            <div className="chat-header-shimmer" />

            {/* Avatar */}
            <div className="chat-avatar-ring">🤖</div>

            <div style={{ flex: 1, position: "relative" }}>
              <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                HMS Assistant
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 1 }}>
                Hostel Management · NIT Kurukshetra
              </p>
            </div>

            {/* Online indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#4ade80", display: "inline-block",
                boxShadow: "0 0 0 3px rgba(74,222,128,0.25)",
              }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Online</span>
            </div>
          </div>

          {/* ── Message Area ── */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 0,
              maxHeight: 460,
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} className="chat-msg">
                <MessageBubble
                  msg={msg}
                  onSuggestion={handleSuggestion}
                  animate={i === animatingMsgIdx && msg.sender === "bot"}
                />
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Login Panel ── */}
          {authMode && (
            <LoginPanel
              authMode={authMode}
              credentials={credentials}
              setCredentials={setCredentials}
              onLogin={handleLogin}
            />
          )}

          {/* ── Input Bar ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderTop: "1px solid rgba(226,232,240,0.6)",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            flexShrink: 0,
          }}>
            <input
              style={{
                flex: 1,
                fontSize: 13,
                borderRadius: 24,
                padding: "9px 16px",
                background: "rgba(241,245,249,0.9)",
                border: "1px solid #e2e8f0",
                outline: "none",
                color: "#1e293b",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && input.trim()) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask about complaints, rooms, students…"
              disabled={loading}
              onFocus={e => { e.target.style.borderColor = "#a5b4fc"; e.target.style.boxShadow = "0 0 0 3px rgba(165,180,252,0.25)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
            <button
              className="chat-send-btn"
              onClick={() => !loading && input.trim() && handleSend(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: "50%",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "#e2e8f0",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: input.trim() && !loading ? "0 2px 10px rgba(79,70,229,0.4)" : "none",
              }}
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke={input.trim() && !loading ? "#fff" : "#94a3b8"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalChatbot;
