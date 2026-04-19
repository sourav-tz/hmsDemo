// =====================================================
// 🪝 useChatbot — Core chatbot logic hook
// =====================================================

import { useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  generateReply,
  handleSmallTalk,
  handleFAQ,
  getSuggestions,
} from "../utils/responseGenerator";
import {
  isSmallTalk,
  isContextRefinement,
  mergeContext,
  getContext,
  extractRefinementParams,
} from "../utils/queryClassifier";

const BASE = import.meta.env.VITE_BASE_URL;

const TYPING_DELAY = 700; // ms

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there! 👋 I'm your HMS Assistant.\nAsk me about complaints, rooms, or students — or just say hi!",
      suggestions: ["What can you do?", "Show complaints", "My complaints"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  // =====================================================
  // 🔹 APPEND MESSAGE
  // =====================================================

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // =====================================================
  // 🔹 BOT REPLY WITH TYPING SIM
  // =====================================================

  const addBotReply = useCallback(
    (text, suggestions = [], rawData = null) => {
      setTimeout(() => {
        appendMessage({ sender: "bot", text, suggestions, rawData });
        setLoading(false);
      }, TYPING_DELAY);
    },
    [appendMessage]
  );

  // =====================================================
  // 🔹 MAIN SEND
  // =====================================================

  const handleSend = useCallback(
    async (customInput = null, afterLogin = false) => {
      const query = (customInput || input).trim();
      if (!query) return;

      if (!afterLogin) {
        appendMessage({ sender: "user", text: query });
      }

      setInput("");
      setLoading(true);

      // ─── Small talk (no API call needed) ───
      const smallTalkReply = handleSmallTalk(query);
      if (smallTalkReply) {
        addBotReply(smallTalkReply, getSuggestions("default"));
        return;
      }

      // ─── Context refinement? Merge params ───
      const isRefinement = isContextRefinement(query);
      const ctx = getContext();

      if (isRefinement && ctx.intent) {
        const refinedParams = extractRefinementParams(query);
        const merged = mergeContext(ctx.intent, refinedParams);

        // Re-hit the API with merged params injected into a reconstructed query
        // We'll send original query but also pass context via header/body
        try {
          const url =
            afterLogin || isLoggedIn
              ? `${BASE}/HA/nlp/query`
              : `${BASE}/guest/chat`;

          const res = await axios.post(
            url,
            {
              query,
              // Pass merged context so backend can use it
              contextIntent: merged.intent,
              contextParams: merged.params,
            },
            { withCredentials: true, validateStatus: () => true }
          );

          await handleApiResponse(res.data, query, afterLogin);
        } catch {
          addBotReply("Oops, something broke on my side 😅 Try again in a moment.");
        }
        return;
      }

      // ─── Normal API flow ───
      try {
        const url =
          afterLogin || isLoggedIn
            ? `${BASE}/HA/nlp/query`
            : `${BASE}/guest/chat`;

        const res = await axios.post(
          url,
          { query },
          { withCredentials: true, validateStatus: () => true }
        );

        await handleApiResponse(res.data, query, afterLogin);
      } catch {
        addBotReply("Oops, something broke on my side 😅 Try again in a moment.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, isLoggedIn, addBotReply, appendMessage]
  );

  // =====================================================
  // 🔹 API RESPONSE HANDLER
  // =====================================================

  const handleApiResponse = useCallback(
    async (data, query, afterLogin) => {
      if (!data) {
        addBotReply("⚠️ No response from server. Try again.");
        return;
      }



      

      // Auth required
      if (data.requiresAuth) {
        if (!authMode) {
          setAuthMode(data.requiredRole);
          localStorage.setItem("pendingQuery", query);
          addBotReply(
            `🔐 This requires you to log in as **${data.requiredRole}**.\nPlease enter your credentials below.`
          );
        }
        return;
      }
            // 🔥 HANDLE BACKEND ERRORS
      if (data.success === false) {
        addBotReply(data.message || "⚠️ Something went wrong.");
        return;
      }

      // 🔥 HANDLE NON-STANDARD ERROR RESPONSES
      if (!data.intent && data.message) {
        addBotReply(data.message);
        return;
      }

      // Update context — carry forward key params for follow-up queries
      if (data.intent && data.intent !== "UNKNOWN") {
        const ctxParams = {};
        if (data.student?.rollNo)  ctxParams.rollNo = data.student.rollNo;
        if (data.students?.length) ctxParams.roomNo  = data.students[0]?.roomId ?? undefined;
        // For complaints filtered by rollNo, keep it for follow-ups
        if (data.complaints?.length && data.complaints[0]?.rollNo && data.count === data.complaints.length) {
          const uniqueRolls = [...new Set(data.complaints.map((c) => c.rollNo))];
          if (uniqueRolls.length === 1) ctxParams.rollNo = uniqueRolls[0];
        }
        mergeContext(data.intent, ctxParams);
      }

      // FAQ fallback for UNKNOWN
      if (data.intent === "UNKNOWN") {
        const faqReply = handleFAQ(query);
        if (faqReply) {
          addBotReply(faqReply, getSuggestions("default"));
          return;
        }
      }

      let reply;

      try {
        reply = generateReply(data, query);
      } catch (err) {
        console.error("Reply error:", err);
        reply = null;
      }

      if (!reply) {
        reply = "⚠️ I couldn't format the response properly.";
      }
      const chips = getSuggestions(data.intent);
      addBotReply(reply, chips, data);
    },
    [addBotReply, authMode]
  );

  // =====================================================
  // 🔹 LOGIN
  // =====================================================

  const handleLogin = useCallback(async () => {
    try {
      const url =
        authMode === "ADMIN" ? "/HA/adminLogin" : "/student/login";

      const res = await axios.post(
        `${BASE}${url}`,
        {
          email: credentials.email,
          password: credentials.password,
          role: authMode === "ADMIN" ? "Hostel-Authority" : "Student",
        },
        { withCredentials: true, validateStatus: () => true }
      );

      if (res.status !== 200) {
        appendMessage({ sender: "bot", text: "❌ Invalid credentials. Please try again." });
        return;
      }

      setIsLoggedIn(true);
      setAuthMode(null);
      setCredentials({ email: "", password: "" });

      appendMessage({ sender: "bot", text: "✅ Logged in successfully!" });
      appendMessage({ sender: "bot", text: "⏳ Fetching your data..." });

      const pendingQuery = localStorage.getItem("pendingQuery");
      if (pendingQuery) {
        localStorage.removeItem("pendingQuery");
        handleSend(pendingQuery, true);
      }
    } catch {
      appendMessage({ sender: "bot", text: "⚠️ Network error during login. Try again." });
    }
  }, [authMode, credentials, appendMessage, handleSend]);

  // =====================================================
  // 🔹 SUGGESTION CHIP CLICK
  // =====================================================

  const handleSuggestion = useCallback(
    (chip) => {
      handleSend(chip);
    },
    [handleSend]
  );

  return {
    messages,
    input,
    setInput,
    loading,
    authMode,
    credentials,
    setCredentials,
    isLoggedIn,
    messagesEndRef,
    handleSend,
    handleLogin,
    handleSuggestion,
  };
};