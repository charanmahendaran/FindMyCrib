// src/services/agent2.js

const USE_MOCK = true; // Set to false to fetch from API, true to use mock data

const WEBHOOK_URL ="";//Use Webhook URL for API mode

// 🧠 CACHE + INFLIGHT
const CACHE_PREFIX = "price_cache_";
const inFlightRequests = new Map();

// 🧪 MOCK DATA
const mockAnalysis = {
  price_analysis: {
    price_status: "fair",
    estimated_price_range: "80L - 95L",
  },
  risk_check: {
    risk_level: "low",
    flags: ["Good locality", "Stable pricing"],
  },
  summary:
    "This property is fairly priced and located in a stable, high-demand area with good growth potential.",
};

// 🔧 NORMALIZER
function normalizeAnalysis(data) {
  return {
    price_analysis: {
      price_status: data?.price_analysis?.price_status || "unknown",
      estimated_price_range:
        data?.price_analysis?.estimated_price_range || "N/A",
    },
    risk_check: {
      risk_level: data?.risk_check?.risk_level || "unknown",
      flag:
        data?.risk_check?.flags?.[0] ||
        "No major risks identified.",
    },
    summary: data?.summary || "",
  };
}

// 🔥 PRICE PARSER
function parsePrice(price) {
  if (!price) return 0;

  if (typeof price === "number") return price;

  const value = price.toLowerCase();

  if (value.includes("cr")) return parseFloat(value) * 10000000;
  if (value.includes("l")) return parseFloat(value) * 100000;

  return Number(price) || 0;
}

// 🔥 TYPE INFERENCE
function inferType(property) {
  const text = (property.name || property.title || "").toLowerCase();

  if (text.includes("villa")) return "villa";
  if (text.includes("plot") || text.includes("land")) return "plot";

  return "apartment";
}

// 🚀 MAIN FUNCTION
export async function fetchPriceAnalysis(property) {
  if (!property) return normalizeAnalysis({});

  const payload = {
    name: property.name || property.title || "Unknown",
    location: property.location || "",
    price:
      Number(property.numeric_price) ||
      parsePrice(property.price) ||
      0,
    type: property.type || inferType(property),
  };

  const MODE = USE_MOCK ? "mock" : "api";

  const cacheKey =
    CACHE_PREFIX +
    `${MODE}_${payload.name}_${payload.price}_${payload.type}`;

  const requestKey = `${payload.name}_${payload.price}_${payload.type}`;

  console.log("Agent 2 Payload:", payload);

  // ⚡ CACHE
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    console.log("⚡ Using cached");
    return JSON.parse(cached);
  }

  // 🚫 IN-FLIGHT DEDUP
  if (inFlightRequests.has(requestKey)) {
    console.log("⏳ Reusing request");
    return inFlightRequests.get(requestKey);
  }

  // 🧪 MOCK MODE
  if (USE_MOCK) {
    const result = normalizeAnalysis(mockAnalysis);
    sessionStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  }

  // 🌐 API MODE
  const requestPromise = (async () => {
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

      const normalized = normalizeAnalysis(data?.data);

      sessionStorage.setItem(cacheKey, JSON.stringify(normalized));

      return normalized;
    } catch (err) {
      console.error(err);
      return normalizeAnalysis({});
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);

  return requestPromise;
}