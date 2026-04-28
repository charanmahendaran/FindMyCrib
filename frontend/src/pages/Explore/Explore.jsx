import "./Explore.css";
import properties from "../../data/propertiesData";

function Explore({
  setActiveSection,
  setSelectedProperty,
  compareList,
  setCompareList,
}) {

  const handleCompare = (property) => {
    const exists = compareList.find((p) => p.id === property.id);

    if (exists) {
      setCompareList(compareList.filter((p) => p.id !== property.id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, property]);
      }
    }
  };

  return (
    <div className="explore-container">

      <h2 className="explore-title">Explore Properties</h2>

      {/* FILTER */}
      <div className="filter-panel">
        <input placeholder="Location" />
        <input placeholder="Budget" />

        <select>
          <option>Property Type</option>
          <option>Apartment</option>
          <option>Villa</option>
        </select>

        <button className="primary-btn">Search</button>
      </div>

      {/* 🔥 COMPARE BAR */}
      <div className="compare-bar">
        <div className="compare-left">
          {compareList.length > 0 && (
            <div className="selected-pill">
              {compareList.length} Selected
              <span onClick={() => setCompareList([])}>✕</span>
            </div>
          )}
        </div>

        <div className="compare-right">
          {compareList.length > 1 && (
            <button
              className="compare-now"
              onClick={() => setActiveSection("compare")}
            >
              Compare Now
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="property-grid">
        {properties.map((property) => {
          const isSelected = compareList.some(
            (p) => p.id === property.id
          );

          return (
            <div
              key={property.id}
              className={`property-card ${isSelected ? "selected" : ""}`}
            >

              <img src={property.image} alt="" />

              <div className="property-info">
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p className="price">{property.price}</p>

                <div className="property-icons">
                  <span>🛏 {property.bhk}</span>
                  <span>🛁 {property.bath}</span>
                  <span>📐 {property.area}</span>
                </div>

                <div className="card-actions">

                  <button
                    className="analyze-btn"
                    onClick={() => {
                      setSelectedProperty(property);
                      setActiveSection("price");
                    }}
                  >
                    Analyze
                  </button>

                  <button
                    className={`compare-btn ${isSelected ? "active" : ""}`}
                    onClick={() => handleCompare(property)}
                  >
                    {isSelected ? "Remove" : "Compare"}
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Explore;