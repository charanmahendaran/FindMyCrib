import { useEffect, useState } from "react";
import "./Compare.css";
import CompareScene from "../../components/CompareScene/CompareScene";
import { getPropertyImage } from "../../utils/imageMapper";
import { fetchComparison } from "../../services/agent3";

function Compare({ compareList, setActiveSection }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!compareList || compareList.length === 0) {
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

  useEffect(() => {
    if (compareList.length < 2) return;

    const load = async () => {
      setLoading(true);
      const res = await fetchComparison(compareList);
      setResult(res);
      setLoading(false);
    };

    load();
  }, [compareList]);

  const bestId = result?.best_property?.id;

  const getRank = (id) => {
    return result?.ranking?.find((r) => r.id === id);
  };

  return (
    <>
      <CompareScene />

      <div className="section compare-wrapper">
        <h2>Property Comparison</h2>

        <div className="compare-grid">
          {compareList.map((property, index) => {
            const isBest = property.id === bestId;
            const rankData = getRank(property.id);

            return (
              <div
                key={property.id}
                className={`compare-card ${isBest ? "best" : ""}`}
              >
                {/* Rank Badge */}
                {rankData && (
                  <div className={`rank-badge rank-${rankData.rank}`}>
                    #{rankData.rank}
                  </div>
                )}

                {/* IMAGE WITH PARALLAX */}
                <div className="image-wrapper">
                  <img
                    src={getPropertyImage(property, index)}
                    alt=""
                  />
                </div>

                <div className="card-content">
                  <h3>{property.name || property.title}</h3>
                  <p className="location">{property.location}</p>
                  <p className="price">{property.price}</p>

                  {/* META */}
                  <div className="property-meta">
                    <div>🛏 {property.bhk}</div>
                    <div>🛁 {property.bath}</div>
                    <div>📐 {property.area}</div>
                  </div>

                  {/* BEST TAG */}
                  {isBest && <div className="badge">🏆 Best Choice</div>}

                  {/* SCORE */}
                  {rankData && (
                    <div className="score">
                      Score: {rankData.score}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="compare-overlay">
            <div className="compare-loader">
              <div className="loader-spinner"></div>
              <p>Analyzing properties...</p>
            </div>
          </div>
        )}

        {/* DECISION CARD */}
        {result && (
          <div className="decision-card">
            <div className="decision-header">🏆 Best Choice</div>

            <h3 className="decision-title">
              {compareList.find((p) => p.id === bestId)?.name}
            </h3>

            <p className="decision-reason">
              {result.best_property.reason}
            </p>
          </div>
        )}

        {/* INSIGHTS */}
        {result && (
          <div className="insights-panel">
            <div className="insight-box price">
              <h4>💰 Price</h4>
              <p>{result.comparison_summary.price_comparison}</p>
            </div>

            <div className="insight-box value">
              <h4>📊 Value</h4>
              <p>{result.comparison_summary.value_comparison}</p>
            </div>

            <div className="insight-box risk">
              <h4>⚠️ Risk</h4>
              <p>{result.comparison_summary.risk_comparison}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Compare;