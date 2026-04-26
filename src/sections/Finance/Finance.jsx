import { useState, useEffect } from "react";
import "./Finance.css";

function Finance({ property, setActiveSection }) {
  const [price, setPrice] = useState(0);
  const [income, setIncome] = useState(80000);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const [emi, setEmi] = useState(0);
  const [status, setStatus] = useState("");

  // Extract numeric price
  useEffect(() => {
    if (property?.price) {
      let numeric = parseFloat(property.price.replace(/[^\d.]/g, ""));

      if (property.price.includes("Cr")) {
        numeric = numeric * 10000000;
      } else {
        numeric = numeric * 100000;
      }

      setPrice(numeric);
      setDownPayment(numeric * 0.2);
    }
  }, [property]);

  // EMI Calculation
  useEffect(() => {
    if (!price) return;

    const loan = price - downPayment;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;

    const emiCalc =
      (loan * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const finalEmi = Math.round(emiCalc);
    setEmi(finalEmi);

    const ratio = finalEmi / income;

    if (ratio < 0.3) setStatus("Comfortable");
    else if (ratio < 0.5) setStatus("Manageable");
    else setStatus("Risky");

  }, [price, downPayment, tenure, interestRate, income]);

  // Empty state
  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property to analyze financial details</p>

          <p
            className="empty-cta"
            onClick={() => setActiveSection("explore")}
          >
            Go to Explore →
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">

      <h2>Financial Analysis</h2>

      {/* PROPERTY */}
      <div className="finance-property">
        <img src={property.image} alt="" />
        <div>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p>{property.price}</p>
        </div>
      </div>

      {/* INPUTS */}
      <div className="finance-inputs">

        <div className="input-group">
          <label>Monthly Income (₹)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            placeholder="e.g. 80000"
          />
        </div>

        <div className="input-group">
          <label>Down Payment (₹)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            placeholder="e.g. 10,00,000"
          />
        </div>

        <div className="input-group">
          <label>Loan Tenure (Years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            placeholder="e.g. 20"
          />
        </div>

        <div className="input-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            placeholder="e.g. 8.5"
          />
        </div>

      </div>

      {/* TIP */}
      <p className="finance-tip">
        Tip: Keep EMI below 30% of your monthly income
      </p>

      {/* RESULTS */}
      <div className="cards-row">

        <div className="result-card">
          <h4>Monthly EMI</h4>
          <p>₹ {emi.toLocaleString()}</p>
        </div>

        <div className="result-card">
          <h4>Loan Amount</h4>
          <p>₹ {(price - downPayment).toLocaleString()}</p>
        </div>

        <div className={`result-card status ${status.toLowerCase()}`}>
          <h4>Affordability</h4>
          <p>{status}</p>
        </div>

      </div>

      {/* AI INSIGHT */}
      <div className="glass-card insight">

        {status === "Comfortable" &&
          "💡 This property is well within your financial comfort zone."}

        {status === "Manageable" &&
          "⚖️ This property is affordable but may require budgeting."}

        {status === "Risky" &&
          "⚠️ This property may strain your finances. Consider alternatives."}

      </div>

    </div>
  );
}

export default Finance;