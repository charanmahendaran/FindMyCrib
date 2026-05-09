import { useEffect, useState, useRef } from "react";
import "./PriceCheck.css";
import { getPropertyImage } from "../../utils/imageMapper";
import { fetchPriceAnalysis } from "../../services/agent2";
import PriceScene from "../../components/PriceScene/PriceScene";

function PriceCheck({ property, setActiveSection }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 staged reveal states
  const [showCards, setShowCards] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const lastKeyRef = useRef(null);

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

  // 🔥 PRICE FORMATTER
  const formatPrice = (value) => {
    if (!value) return "";

    const num = Number(value);

    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
    }

    if (num >= 100000) {
      return (num / 100000).toFixed(0) + " L";
    }

    return num.toString();
  };

  const parsePrice = (val) => {
    if (!val) return 0;

    const v = val.toString().toLowerCase().trim();

    if (v.includes("cr")) return parseFloat(v) * 10000000;
    if (v.includes("l")) return parseFloat(v) * 100000;

    return Number(v) || 0;
  };

  const formatRange = (range) => {
    if (!range) return "";

    const parts = range.split("-");
    if (parts.length !== 2) return range;

    const min = parsePrice(parts[0]);
    const max = parsePrice(parts[1]);

    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);
  // ✅ FIXED SUMMARY FORMATTER
  const formatSummary = (text) => {
    if (!text) return "";

    return text
      .replace(/(\d+)L/g, (_, num) => {
        return formatPrice(Number(num) * 100000);
      })
      .replace(/\b\d{6,}\b/g, (num) => {
        return formatPrice(Number(num));
      });
  };

  useEffect(() => {
    const key = `${property.name}_${property.price}`;

    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    const load = async () => {
      setLoading(true);
      setShowCards(false);
      setShowFlag(false);
      setShowSummary(false);

      const res = await fetchPriceAnalysis(property);
      setAnalysis(res);
      setLoading(false);

      // 🔥 staged reveal timings
      setTimeout(() => setShowCards(true), 100);
      setTimeout(() => setShowFlag(true), 400);
      setTimeout(() => setShowSummary(true), 700);
    };

    load();
  }, [property]);

  const image = getPropertyImage(property);

  const riskLevel =
    property?.risk ||
    analysis?.risk_check?.risk_level ||
    "low";
    
  const singleFlag =
    analysis?.risk_check?.flag ||
    analysis?.risk_check?.flags?.[0] ||
    "No major risks identified.";

  if (!visible) return null;

  return (
    <>
      <PriceScene risk={riskLevel} />

      <div className="section">
        <h2>Price Intelligence</h2>

        {/* PROPERTY HEADER */}
        <div className="property-main">
          <img src={image} alt="" />
          <div>
            <h3>{property.name}</h3>
            <p>{property.location}</p>
            <p>{property.price}</p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="price-loading-overlay">
            <div className="loader-card">
              <div className="spinner"></div>

              <h3>Analyzing Property</h3>

              <p className="typing-text">
                Evaluating price, risks & trends<span className="dots"></span>
              </p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {analysis && !loading && (
          <>
            {/* 🔥 CARDS */}
            {showCards && (
              <div className="cards-row fade-in">
                <div className="result-card">
                  <h4>Price Status</h4>
                  <p>{analysis.price_analysis.price_status}</p>
                </div>

                <div className="result-card">
                  <h4>Estimated Range</h4>
                  <p>
                    {formatRange(
                      analysis.price_analysis.estimated_price_range
                    )}
                  </p>
                </div>

                <div
                  className={`result-card status ${riskLevel}`}
                >
                  <h4>Risk Level</h4>
                  <p>{riskLevel}</p>
                </div>
              </div>
            )}

            {/* 🔥 FLAG */}
            {showFlag && (
              <div className="flags-section fade-in">
                <h4>Risk Insight</h4>
                <div className="flag-item single">
                  ⚠️ {singleFlag}
                </div>
              </div>
            )}

            {/* 🔥 SUMMARY */}
            {showSummary && (
              <div className="summary-section fade-in">
                <h4>AI Insight</h4>
                <div className="summary-box">
                  💡 {formatSummary(analysis.summary)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PriceCheck;