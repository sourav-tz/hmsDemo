// =====================================================
// 🧠 QUERY CLASSIFIER — Frontend-side intent helpers
// =====================================================

import {
    GREETING_PATTERNS,
    HOWAREYOU_PATTERNS,
    WHOAREYOU_PATTERNS,
    WHATCANYOUDO_PATTERNS,
  } from "./responseGenerator";
  
  /**
   * Detect if a query is small talk (no need to hit backend)
   */
  export const isSmallTalk = (query) => {
    const q = query.toLowerCase().trim();
    return (
      GREETING_PATTERNS.test(q) ||
      HOWAREYOU_PATTERNS.test(q) ||
      WHOAREYOU_PATTERNS.test(q) ||
      WHATCANYOUDO_PATTERNS.test(q)
    );
  };
  
  /**
   * Detect if query is a context refinement (no new intent, just filters)
   * e.g. "only pending", "only electricity", "for roll 524110039"
   */
  export const isContextRefinement = (query) => {
    const q = query.toLowerCase().trim();
    const refinementPatterns = [
      /^only\b/,
      /^just\b/,
      /^filter\b/,
      /^with\b/,
      /^where\b/,
      /^but\b/,
      /^(pending|resolved|rejected)$/,
      /^(high|medium|low)$/,
      /^(electricity|water|wifi|internet|plumber|carpenter|cleaning)$/,
      /^for roll\s*\d+/,
      /^\d{5,12}$/, // bare roll number
    ];
    return refinementPatterns.some((p) => p.test(q));
  };
  
  // =====================================================
  // 🔹 CONTEXT STORE — Progressive filter merging
  // =====================================================
  
  let _context = {
    intent: null,
    params: {},
  };
  
  /**
   * Merge new params into existing context
   */
  export const mergeContext = (newIntent, newParams = {}) => {
    // If a genuinely new (different) intent arrives, reset context
    const isSameIntent =
      newIntent === _context.intent ||
      newIntent === "UNKNOWN";
  
    if (!isSameIntent) {
      _context = { intent: newIntent, params: { ...newParams } };
    } else {
      _context = {
        intent: _context.intent || newIntent,
        params: { ..._context.params, ...newParams },
      };
    }
  
    return { ..._context };
  };
  
  export const getContext = () => ({ ..._context });
  
  export const resetContext = () => {
    _context = { intent: null, params: {} };
  };
  
  /**
   * Extract lightweight params from query on the frontend side
   * (mirrors backend resolver for refinements)
   */
  export const extractRefinementParams = (query) => {
    const q = query.toLowerCase();
    const params = {};
  
    if (/\b(pending|open)\b/.test(q)) params.status = "pending";
    if (/\b(resolved|done|fixed)\b/.test(q)) params.status = "resolved";
    if (/\b(rejected|declined)\b/.test(q)) params.status = "rejected";
  
    if (/\b(high|urgent|critical)\b/.test(q)) params.priority = "HIGH";
    if (/\b(medium|moderate)\b/.test(q)) params.priority = "MEDIUM";
    if (/\b(low|minor)\b/.test(q)) params.priority = "LOW";
  
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
  
    const rollMatch = q.match(/\b(\d{5,12})\b/);
    if (rollMatch) params.rollNo = Number(rollMatch[1]);
  
    return params;
  };