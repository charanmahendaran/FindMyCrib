import { useEffect, useRef, useState } from "react";
import "./Finance.css";
import { fetchFinanceAnalysis } from "../../services/agent4";
import { getPropertyImage } from "../../utils/imageMapper";
import FinanceBackground from "../../components/FinanceBackground";

function Finance({ property, setActiveSection }) {
  const [income, setIncome] = useState(80000);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const [hasCalculated, setHasCalculated] = useState(false);
  const [lastPayloadKey, setLastPayloadKey] = useState(null);

  const donutRef = useRef(null);
  const [showDonut, setShowDonut] = useState(false);

  const [progress, setProgress] = useState(0);

  const image = property ? getPropertyImage(property) : "";

  // ✅ FORMATTER
  const formatCurrency = (val) => {
    if (!val && val !== 0) return "";
    return "₹ " + Number(val).toLocaleString("en-IN");
  };

  // PRICE PARSER
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

  // 🔥 MAIN LOGIC
  useEffect(() => {
    if (!property || trigger === 0) return;

    const run = async () => {
      const safeIncome = Number(income) || 0;
      const safeDownPayment = Number(downPayment) || 0;

      const payload = {
        price: getNumericPrice() - safeDownPayment,
        income: safeIncome,
        interest_rate: interestRate,
        tenure_years: tenure,
      };

      const newKey = JSON.stringify(payload);

      if (newKey === lastPayloadKey && result) {
        setResult({ ...result });
        setHasCalculated(true);
        return;
      }

      setLoading(true);

      const res = await fetchFinanceAnalysis(payload);

      setResult(res);
      setLastPayloadKey(newKey);
      setHasCalculated(true);
      setLoading(false);
    };

    run();
  }, [trigger]);

  // SCROLL OBSERVER
  useEffect(() => {
    if (!donutRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowDonut(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(donutRef.current);

    return () => observer.disconnect();
  }, [donutRef, result]);

  // DONUT PROGRESS
  useEffect(() => {
    if (!result || !showDonut) return;

    let start = 0;
    const safeIncome = Number(income) || 1;
    const target = Math.min(100, (result.emi / safeIncome) * 100);

    const interval = setInterval(() => {
      start += 1.5;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setProgress(start);
    }, 10);

    return () => clearInterval(interval);
  }, [showDonut, result]);

  // ✅ EMPTY STATE (fix for blank screen)
  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property from Explore</p>

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
  <div className="section finance-wrapper">

    <FinanceBackground
      affordability={result?.affordability}
    />
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
          <input
            type="number"
            value={income}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setIncome("");
              else setIncome(Number(val));
            }}
            onBlur={() => {
              if (!income || income < 10000) {
                setIncome(10000);
              }
            }}
          />
        </div>

        <div className="input-group">
          <label>Down Payment</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setDownPayment("");
              else setDownPayment(Number(val));
            }}
            onBlur={() => {
              if (!downPayment || downPayment < 300000) {
                setDownPayment(300000);
              }
            }}
          />
        </div>

        <div className="input-group">
          <label>Tenure</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) =>
              setTenure(Math.min(30, Math.max(1, Number(e.target.value))))
            }
          />
        </div>

        <div className="input-group">
          <label>Interest</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) =>
              setInterestRate(Math.min(15, Math.max(5, Number(e.target.value))))
            }
          />
        </div>

        <div className="input-group btn-group">
          <label>&nbsp;</label>
          <button
            className="finance-btn"
            onClick={() => setTrigger((p) => p + 1)}
          >
            Calculate
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {hasCalculated && result && (
        <>
          <div key={lastPayloadKey} className="cards-row fade-in">
            <div className="result-card">
              <h4>Monthly EMI</h4>
              <p>{formatCurrency(result.emi)}</p>
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

          {/* DONUT */}
          <div
            ref={donutRef}
            className={`affordability-card ${showDonut ? "show" : ""}`}
          >
            <div className="affordability-left">
              <div className="ring-wrapper">
                <div className="ring-bg"></div>

                <div
                  className="ring-progress"
                  style={{ "--progress": `${progress}%` }}
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
                {formatCurrency(result.emi)}
              </p>

              <p className="ratio">
                EMI is{" "}
                {Math.round(
                  (result.emi / (Number(income) || 1)) * 100
                )}%
                of income
              </p>

              <div className={`status-dot ${result.affordability}`}></div>
            </div>
          </div>

          <div className={`insight ${showDonut ? "fade-in delay-1" : ""}`}>
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