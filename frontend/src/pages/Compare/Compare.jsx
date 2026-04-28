import "./Compare.css";

function Compare({ compareList }) {
  if (!compareList || compareList.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No properties selected</h2>
          <p>Select properties from Explore to compare</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">

      <h2>Property Comparison</h2>

      <div className="compare-grid">
        {compareList.map((property) => (
          <div key={property.id} className="compare-card">

            <img src={property.image} alt="" />

            <h3>{property.title}</h3>
            <p>{property.location}</p>
            <p className="price">{property.price}</p>

            <p>🛏 {property.bhk}</p>
            <p>🛁 {property.bath}</p>
            <p>📐 {property.area}</p>

          </div>
        ))}
      </div>

      <div className="best-choice">
        🏆 Best Choice: {compareList[0].title}
      </div>

    </div>
  );
}

export default Compare;