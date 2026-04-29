import { useEffect, useState, useRef } from "react";
import "./PriceCheck.css";
import { getPropertyImage } from "../../utils/imageMapper";
import { fetchPriceAnalysis } from "../../services/agent2";

function PriceCheck({ property, setActiveSection }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const formatSummary = (text) => {
    if (!text) return "";

    return text.replace(/(\d+)L/g, (_, num) => {
      const value = Number(num) * 100000;
      return formatPrice(value);
    });
  };

  useEffect(() => {
    const key = `${property.name}_${property.price}`;

    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    const load = async () => {
      setLoading(true);
      const res = await fetchPriceAnalysis(property);
      setAnalysis(res);
      setLoading(false);
    };

    load();
  }, [property]);

  const image = getPropertyImage(property);

  const singleFlag =
    analysis?.risk_check?.flag ||
    analysis?.risk_check?.flags?.[0] ||
    "No major risks identified.";

  return (
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

      {/* 🔥 NEW LOADING (REPLACED SKELETON) */}
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

      {/* ✅ RESULT */}
      {analysis && !loading && (
        <>
          <div className="cards-row">
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
              className={`result-card status ${analysis.risk_check.risk_level}`}
            >
              <h4>Risk Level</h4>
              <p>{analysis.risk_check.risk_level}</p>
            </div>
          </div>

          <div className="flags-section">
            <h4>Risk Insight</h4>
            <div className="flag-item single">
              ⚠️ {singleFlag}
            </div>
          </div>

          <div className="summary-section">
            <h4>AI Insight</h4>
            <div className="summary-box">
              💡 {formatSummary(analysis.summary)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PriceCheck;