// src/services/agent5.js

const USE_MOCK = true; // 🔁 switch like other agents

const WEBHOOK_URL =
  "https://learnersbyte1.app.n8n.cloud/webhook-test/schedule-visit";

// 🧠 CACHE
const CACHE_PREFIX = "booking_cache_";
const inFlightRequests = new Map();

// 🧪 MOCK RESPONSE
const mockResponse = {
  status: "success",
  message: "Visit scheduled successfully",
  slot: "confirmed",
};

// 🔧 NORMALIZER
function normalize(data) {
  return {
    status: data?.status || "error",
    message: data?.message || "Something went wrong",
    slot: data?.availability || "unknown",
  };
}

// 🚀 MAIN FUNCTION
export async function scheduleVisit(payload) {
  if (!payload) return normalize({});

  const MODE = USE_MOCK ? "mock" : "api";

  const cacheKey = CACHE_PREFIX + MODE + "_" + JSON.stringify(payload);
  const requestKey = JSON.stringify(payload);

  // ⚡ CACHE
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  // 🚫 IN-FLIGHT
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  // 🧪 MOCK MODE
  if (USE_MOCK) {
    const res = normalize(mockResponse);
    sessionStorage.setItem(cacheKey, JSON.stringify(res));
    return res;
  }

  // 🌐 API MODE
  const req = (async () => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      const normalized = normalize(data);

      sessionStorage.setItem(cacheKey, JSON.stringify(normalized));
      return normalized;
    } catch (err) {
      console.error("Agent5 error:", err);
      return normalize({});
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, req);
  return req;
}