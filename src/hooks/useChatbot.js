// =====================================================
// 🪝 useChatbot — Core chatbot logic hook
// =====================================================

import { useState, useRef, useCallback, useEffect } from "react";
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
const TYPING_DELAY = 700;

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there! 👋 I'm your HMS Assistant.\nAsk me about complaints, rooms, or students — or just say hi!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);

  // Use refs to always have latest values inside callbacks
  const isLoggedInRef = useRef(isLoggedIn);
  const authModeRef = useRef(authMode);
  const loadingRef = useRef(loading);

  useEffect(() => { isLoggedInRef.current = isLoggedIn; }, [isLoggedIn]);
  useEffect(() => { authModeRef.current = authMode; }, [authMode]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

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

  const addBotReply = useCallback((text) => {
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, TYPING_DELAY);
  }, []);

  // =====================================================
  // 🔹 API RESPONSE HANDLER
  // =====================================================

  const handleApiResponse = useCallback((data, query) => {
    if (!data) {
      addBotReply("⚠️ No response from server. Try again.");
      return;
    }

    // Auth required
    if (data.requiresAuth) {
      if (!authModeRef.current) {
        setAuthMode(data.requiredRole);
        localStorage.setItem("pendingQuery", query);
        addBotReply(
          `🔐 This requires you to log in as **${data.requiredRole}**.\nPlease enter your credentials below.`
        );
      }
      return;
    }

    // Update frontend context
    if (data.intent && data.intent !== "UNKNOWN") {
      mergeContext(data.intent, {});
    }

    // FAQ fallback for UNKNOWN
    if (data.intent === "UNKNOWN" || !data.success) {
      const faqReply = handleFAQ(query);
      if (faqReply) {
        addBotReply(faqReply);
        return;
      }
    }

    const reply = generateReply(data, query);
    addBotReply(reply);
  }, [addBotReply]);

  // =====================================================
  // 🔹 MAIN SEND
  // =====================================================

  const handleSend = useCallback(async (customInput = null, afterLogin = false) => {
    const query = typeof customInput === "string"
      ? customInput.trim()
      : "";

    if (!query) return;
    if (loadingRef.current && !afterLogin) return;

    if (!afterLogin) {
      appendMessage({ sender: "user", text: query });
    }

    setInput("");

    // ─── Small talk — no API needed ───
    const smallTalkReply = handleSmallTalk(query);
    if (smallTalkReply) {
      addBotReply(smallTalkReply);
      return;
    }

    setLoading(true);

    // ─── Context refinement ───
    const isRefinement = isContextRefinement(query);
    const ctx = getContext();

    const url = (afterLogin || isLoggedInRef.current)
      ? `${BASE}/HA/nlp/query`
      : `${BASE}/guest/chat`;

    if (isRefinement && ctx.intent) {
      const refinedParams = extractRefinementParams(query);
      const merged = mergeContext(ctx.intent, refinedParams);

      try {
        const res = await axios.post(
          url,
          {
            query,
            contextIntent: merged.intent,
            contextParams: merged.params,
          },
          { withCredentials: true, validateStatus: () => true }
        );
        handleApiResponse(res.data, query);
      } catch {
        addBotReply("Oops, something broke on my side 😅 Try again in a moment.");
      }
      return;
    }

    // ─── Normal API flow ───
    try {
      const res = await axios.post(
        url,
        { query },
        { withCredentials: true, validateStatus: () => true }
      );
      handleApiResponse(res.data, query);
    } catch {
      addBotReply("Oops, something broke on my side 😅 Try again in a moment.");
    }
  }, [appendMessage, addBotReply, handleApiResponse]);

  // =====================================================
  // 🔹 LOGIN
  // =====================================================

  const handleLogin = useCallback(async () => {
    try {
      const url = authModeRef.current === "ADMIN"
        ? "/HA/adminLogin"
        : "/student/login";

      const res = await axios.post(
        `${BASE}${url}`,
        {
          email: credentials.email,
          password: credentials.password,
          role: authModeRef.current === "ADMIN" ? "Hostel-Authority" : "Student",
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

      const pendingQuery = localStorage.getItem("pendingQuery");
      if (pendingQuery) {
        localStorage.removeItem("pendingQuery");
        setTimeout(() => handleSend(pendingQuery, true), 300);
      }
    } catch {
      appendMessage({ sender: "bot", text: "⚠️ Network error during login. Try again." });
    }
  }, [credentials, appendMessage, handleSend]);

  // =====================================================
  // 🔹 SUGGESTION CHIP CLICK
  // =====================================================

  const handleSuggestion = useCallback((chip) => {
    handleSend(chip);
  }, [handleSend]);

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