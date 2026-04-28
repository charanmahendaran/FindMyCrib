import "./PriceCheck.css";

function PriceCheck({ property, setActiveSection }) {
  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property from Explore to view price insights</p>

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

  const getRiskClass = () => {
    if (property.price.includes("1.2Cr")) return "high";
    if (property.price.includes("90")) return "medium";
    return "low";
  };

  const getRiskLabel = () => {
    if (property.price.includes("1.2Cr")) return "High";
    if (property.price.includes("90")) return "Medium";
    return "Low";
  };

  return (
    <div className="section">

      <h2>Price Intelligence</h2>

      <div className="property-main">
        <img src={property.image} alt="" />
        <div>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p>{property.price}</p>
        </div>
      </div>

      <div className="cards-row">

        <div className="result-card">
          <h4>Price Status</h4>
          <p>Fair</p>
        </div>

        <div className="result-card">
          <h4>Estimated Range</h4>
          <p>₹70L – ₹90L</p>
        </div>

        <div className={`result-card status ${getRiskClass()}`}>
          <h4>Risk Level</h4>
          <p>{getRiskLabel()}</p>
        </div>

      </div>

      <div className="insight">
        💡 This property is priced fairly compared to nearby listings.
      </div>

    </div>
  );
}

export default PriceCheck;