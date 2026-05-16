// src/services/agent4.js

const USE_MOCK = true; // Set to false to fetch from API, true to use mock data

const WEBHOOK_URL =
  "http://localhost:5678/webhook/price-financial";

// 🧠 EMI FORMULA (LOCAL)
function calculateEMI(principal, rate, tenureYears) {
  const monthlyRate = rate / 12 / 100;
  const months = tenureYears * 12;

  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(emi);
}

// 🧠 LOCAL ANALYSIS (MOCK MODE)
function localFinanceAnalysis({ price, income, interest_rate, tenure_years }) {
  const emi = calculateEMI(price, interest_rate, tenure_years);

  const affordabilityRatio = emi / income;

  let affordability = "yes";
  let reason = "This investment is financially comfortable.";

  if (affordabilityRatio > 0.5) {
    affordability = "no";
    reason = "This may heavily strain your finances.";
  } else if (affordabilityRatio > 0.3) {
    affordability = "risky";
    reason = "Manageable but requires financial discipline.";
  }

  return {
    emi,
    affordability,
    investment_rating:
      affordability === "yes"
        ? "Good"
        : affordability === "risky"
        ? "Moderate"
        : "Poor",
    reason,
  };
}

// 🚀 MAIN FUNCTION
export async function fetchFinanceAnalysis(payload) {
  console.log("Agent 4 Mode:", USE_MOCK ? "LOCAL" : "API");

  if (USE_MOCK) {
    return localFinanceAnalysis(payload);
  }

  // 🌐 API MODE
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

    return data?.data;
  } catch (err) {
    console.error("Agent 4 error:", err);
    return {};
  }
}