// src/services/agent1.js

import mockData from "../data/propertiesData";

const USE_MOCK = true;//Use false to fetch from API, true to use mock data

const WEBHOOK_URL =
  "https://learnersbyte1.app.n8n.cloud/webhook-test/property-recommend";

// 🧠 CACHE PREFIX
const CACHE_PREFIX = "property_cache_";


// 🔥 Convert dropdown → backend format
function parseType(type) {
  if (!type) return { property_type: "", bhk: null };

  const lower = type.toLowerCase();

  if (lower.includes("plot") || lower.includes("land")) {
    return { property_type: "plot", bhk: null };
  }

  if (lower.includes("villa")) {
    const match = lower.match(/\d+/);
    return {
      property_type: "villa",
      bhk: match ? Number(match[0]) : null,
    };
  }

  const match = lower.match(/\d+/);

  return {
    property_type: "apartment",
    bhk: match ? Number(match[0]) : null,
  };
}


// 🔧 Normalize data
function normalizeProperties(properties = []) {
  return properties.map((p) => ({
    ...p,
    bhk: p.bhk != null ? Number(p.bhk) : null,
    bath: p.bath != null ? Number(p.bath) : null,
    numeric_price: Number(p.numeric_price) || 0,
    location: p.location || "",
    type: (p.type || "").toLowerCase(),
  }));
}

function parseBudget(value) {
  if (!value) return 0;

  const clean = value.toString().toLowerCase().replace(/,/g, "").trim();

  const num = parseFloat(clean);

  if (isNaN(num)) return 0;

  if (clean.includes("cr")) return num * 10000000;
  if (clean.includes("l")) return num * 100000;

  return num;
}
// 🚀 MAIN FUNCTION
export async function fetchProperties(filters) {
  const { property_type, bhk } = parseType(filters.type);

  const payload = {
    location: filters.location?.toLowerCase() || "",
    budget: parseBudget(filters.budget),
    property_type,
    bhk,
  };

  console.log("MODE:", USE_MOCK ? "MOCK" : "API");
  console.log("Payload:", payload);

  // 🔥 UNIQUE CACHE KEY PER FILTER
  const cacheKey =
    CACHE_PREFIX +
    (USE_MOCK ? "mock_" : "api_") +
    JSON.stringify(payload);

  // 🔁 CHECK CACHE FIRST
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    console.log("⚡ Using cached results");
    return JSON.parse(cached);
  }

  if (USE_MOCK) {
    console.log("Using MOCK data:", mockData);

    await new Promise((r) => setTimeout(r, 300));

    return normalizeProperties(mockData);
  }

  // 🌐 REAL API MODE
  try {
    console.log("Calling n8n:", WEBHOOK_URL);

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = await res.json();

    const properties = data?.data?.properties || [];

    const normalized = normalizeProperties(properties);

    // 🔁 SAVE TO CACHE
    sessionStorage.setItem(cacheKey, JSON.stringify(normalized));

    return normalized;
  } catch (err) {
    console.error("Agent 1 error:", err);
    return [];
  }
}