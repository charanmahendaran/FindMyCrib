// src/services/agent3.js

const USE_MOCK = true; // Set to false to fetch from API, true to use mock data
const WEBHOOK_URL ="";

// 🧠 CACHE + INFLIGHT
const CACHE_PREFIX = "compare_cache_";
const inFlightRequests = new Map();


// 🧪 MOCK ENGINE
function mockCompare(properties) {
  if (!properties || properties.length < 2) return null;

  const parsePrice = (price) => {
    if (typeof price === "number") return price;

    const val = price.toLowerCase();
    if (val.includes("cr")) return parseFloat(val) * 10000000;
    if (val.includes("l")) return parseFloat(val) * 100000;

    return Number(price) || 0;
  };

  const scored = properties.map((p) => {
    const price = parsePrice(p.price);
    const area = Number(p.area?.replace(/\D/g, "")) || 0;

    const score =
      (area / 1000) * 2 +
      (10 - price / 1000000);

    return {
      id: p.id,
      score: Number(score.toFixed(1)),
    };
  });

  const ranking = scored
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      id: item.id,
      rank: index + 1,
      score: item.score,
    }));

  const best = ranking[0];

  return {
    ranking,
    best_property: {
      id: best.id,
      reason: "Best balance of price and space",
    },
    comparison_summary: {
      price_comparison: "Lower priced properties offer better affordability.",
      value_comparison: "Better area-to-price ratio gives higher value.",
      risk_comparison: "All properties carry moderate market risk.",
    },
  };
}


// 🔧 NORMALIZER (VERY IMPORTANT)
function normalizeComparison(data) {
  return {
    ranking: data?.ranking || [],
    best_property: {
      id: data?.best_property?.id ?? null,
      reason:
        data?.best_property?.reason ||
        "Best overall option based on comparison.",
    },
    comparison_summary: {
      price_comparison:
        data?.comparison_summary?.price_comparison || "",
      value_comparison:
        data?.comparison_summary?.value_comparison || "",
      risk_comparison:
        data?.comparison_summary?.risk_comparison || "",
    },
  };
}


// 🚀 MAIN FUNCTION
export async function fetchComparison(properties) {
  if (!properties || properties.length < 2) {
    return normalizeComparison({});
  }

  // 🔥 PAYLOAD
  const payload = {
    properties: properties.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      price: p.price,
      bhk: p.bhk,
      area: p.area,
      type: p.type,
    })),
  };

  console.log("Agent 3 Payload:", payload);

  const MODE = USE_MOCK ? "mock" : "api";

  const cacheKey =
    CACHE_PREFIX +
    MODE +
    "_" +
    JSON.stringify(payload);

  const requestKey = JSON.stringify(payload);

  // ⚡ CACHE
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    console.log("⚡ Using cached comparison");
    return JSON.parse(cached);
  }

  // 🚫 IN-FLIGHT
  if (inFlightRequests.has(requestKey)) {
    console.log("⏳ Reusing in-flight request");
    return inFlightRequests.get(requestKey);
  }

  // 🧪 MOCK MODE
  if (USE_MOCK) {
    const result = normalizeComparison(mockCompare(properties));

    sessionStorage.setItem(cacheKey, JSON.stringify(result));

    return result;
  }

  // 🌐 API MODE
  const requestPromise = (async () => {
    try {
      console.log("Calling Agent 3 API...");

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Agent 3 API failed");

      const data = await res.json();

      console.log("Agent 3 Response:", data);

      const normalized = normalizeComparison(data?.data);

      sessionStorage.setItem(cacheKey, JSON.stringify(normalized));

      return normalized;
    } catch (err) {
      console.error("Agent 3 error:", err);
      return normalizeComparison({});
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);

  return requestPromise;
}