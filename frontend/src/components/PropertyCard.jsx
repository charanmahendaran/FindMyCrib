import "./PropertyCard.css";
import { getPropertyImage } from "../utils/imageMapper";

function PropertyCard({ property, index, onDetails, onCompare, isSelected }) {
  const image = getPropertyImage(property, index);

  return (
    <div
      className={`property-card ${isSelected ? "selected" : ""}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        e.currentTarget.style.transform = `
          perspective(1000px)
          rotateX(${(y - rect.height / 2) / 30}deg)
          rotateY(${-(x - rect.width / 2) / 30}deg)
          scale(1.02)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      <div className="image-container">
        <img src={image} alt={property.name} className="property-image" />
        <span className="image-tag">Representative Image</span>
      </div>

      <div className="property-content">
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">{property.location}</p>
        <h2 className="property-price">{property.price}</h2>

        <div className="property-icons">
          <span>🛏 {property.bhk} BHK</span>
          <span>🛁 {property.bath}</span>
          <span>📐 {property.area}</span>
        </div>

        <div className="property-actions">
          <button
            className="details-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDetails(property);
            }}
          >
            Details
          </button>

          <button
            className={`compare-btn ${isSelected ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onCompare(property);
            }}
          >
            {isSelected ? "Selected" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;