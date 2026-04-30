import { useEffect, useState } from "react";
import "./Finance.css";
import { fetchFinanceAnalysis } from "../../services/agent4";
import { getPropertyImage } from "../../utils/imageMapper";

function Finance({ property, setActiveSection }) {
  const [income, setIncome] = useState(80000);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const [progress, setProgress] = useState(0);

  const image = getPropertyImage(property);

  const getNumericPrice = () => {
    if (!property?.price) return 0;
    let value = parseFloat(property.price.replace(/[^\d.]/g, ""));
    if (property.price.toLowerCase().includes("cr")) return value * 10000000;
    return value * 100000;
  };

  useEffect(() => {
    if (!property) return;
    const price = getNumericPrice();
    setDownPayment(Math.round(price * 0.2));
  }, [property]);

  const mapAffordability = (value) => {
    if (value === "yes") return "Comfortable";
    if (value === "risky") return "Manageable";
    if (value === "no") return "Risky";
    return "Unknown";
  };

  useEffect(() => {
    if (!property || trigger === 0) return;

    const run = async () => {
      setLoading(true);

      const payload = {
        price: getNumericPrice() - downPayment,
        income,
        interest_rate: interestRate,
        tenure_years: tenure,
      };

      const res = await fetchFinanceAnalysis(payload);

      setResult(res);
      setLoading(false);
    };

    run();
  }, [trigger]);

  // 🔥 Apple-style animation
  useEffect(() => {
    if (!result) return;

    let start = 0;
    const target = Math.min(100, (result.emi / income) * 100);

    const interval = setInterval(() => {
      start += 1.5;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setProgress(start);
    }, 10);

    return () => clearInterval(interval);
  }, [result]);

  if (!property) return null;

  return (
    <div className="section finance-wrapper">

      <h2>Financial Analysis</h2>

      {/* PROPERTY */}
      <div className="finance-property highlight-card">
        <div className="image-wrap">
          <img src={image} alt="" />
        </div>

        <div>
          <h3>{property.name}</h3>
          <p>{property.location}</p>
          <p>{property.price}</p>
        </div>
      </div>

      {/* INPUTS */}
      <div className="finance-inputs">
        <div className="input-group">
          <label>Income</label>
          <input type="number" value={income}
            onChange={(e)=>setIncome(Math.max(10000, Number(e.target.value)))} />
        </div>

        <div className="input-group">
          <label>Down Payment</label>
          <input type="number" value={downPayment}
            onChange={(e)=>setDownPayment(Math.max(0, Number(e.target.value)))} />
        </div>

        <div className="input-group">
          <label>Tenure</label>
          <input type="number" value={tenure}
            onChange={(e)=>setTenure(Math.min(30, Math.max(1, Number(e.target.value))))}/>
        </div>

        <div className="input-group">
          <label>Interest</label>
          <input type="number" value={interestRate}
            onChange={(e)=>setInterestRate(Math.min(15, Math.max(5, Number(e.target.value))))}/>
        </div>

        <div className="input-group btn-group">
          <label>&nbsp;</label>
          <button className="finance-btn" onClick={()=>setTrigger(p=>p+1)}>
            Calculate
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {result && (
        <>
          <div className="cards-row fade-in">
            <div className="result-card">
              <h4>Monthly EMI</h4>
              <p>₹ {result.emi?.toLocaleString()}</p>
            </div>

            <div className="result-card">
              <h4>Investment Rating</h4>
              <p>{result.investment_rating}</p>
            </div>

            <div className={`result-card status ${result.affordability}`}>
              <h4>Affordability</h4>
              <p>{mapAffordability(result.affordability)}</p>
            </div>
          </div>

          {/* 🔥 APPLE RING */}
          <div className="affordability-card">

            <div className="affordability-left">

              <div className="ring-wrapper">

                <div className="ring-bg"></div>

                <div
                  className="ring-progress"
                  style={{
                    "--progress": `${progress}%`
                  }}
                ></div>

                <div className="ring-center">
                  <span>{Math.round(progress)}%</span>
                  <p>EMI Load</p>
                </div>

              </div>

            </div>

            <div className="affordability-right">
              <h3>
                {result.affordability === "yes"
                  ? "Safe Zone"
                  : result.affordability === "risky"
                  ? "Moderate Load"
                  : "High Leverage"}
              </h3>

              <p className="emi-value">
                ₹ {result.emi?.toLocaleString()}
              </p>

              <p className="ratio">
                EMI is {Math.round((result.emi / income) * 100)}% of income
              </p>

              <div className={`status-dot ${result.affordability}`}></div>
            </div>

          </div>

          <div className="insight fade-in delay-1">
            💡 {result.reason}
          </div>
        </>
      )}

      {loading && (
        <div className="finance-overlay">
          <div className="finance-loader">
            <div className="loader-spinner"></div>
            <p>Analyzing finances...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;