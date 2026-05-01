// src/services/agent5.js

const USE_MOCK = false;// Set to false to fetch from API, true to use mock data

const WEBHOOK_URL =
  "https://learnersbyte1.app.n8n.cloud/webhook-test/schedule-visit";

// 🧠 CACHE
const CACHE_PREFIX = "booking_cache_";
const inFlightRequests = new Map();

// 🧪 MOCK RESPONSE (MATCHES YOUR N8N FORMAT)
const mockResponse = {
  status: "success",
  source: "mock",
  data: {
    booking_id: "VISIT-MOCK1234",
    visit_details: {
      property_name: "Prestige Lakeside Habitat",
      location: "Whitefield",
      date: "2026-05-11",
      time: "4:00 PM",
    },
    created_at: new Date().toISOString(),
    confirmation_message:
      "Hi Krishna, your visit to Prestige Lakeside Habitat in Whitefield is confirmed on 2026-05-11 at 4:00 PM.",
  },
};

// 🔧 NORMALIZER (🔥 KEEP FULL RESPONSE)
function normalize(data) {
  return data || {
    status: "error",
    message: "Something went wrong",
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

  // 🚫 IN-FLIGHT REQUEST PREVENTION
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
      return normalize({
        status: "error",
        message: "Failed to schedule visit",
      });
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, req);
  return req;
}