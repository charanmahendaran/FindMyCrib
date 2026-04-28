import "./PropertyCard.css";
import { getPropertyImage } from "../utils/imageMapper";

function PropertyCard({ property, index, onDetails, onCompare, isSelected }) {
  const image = getPropertyImage(property, index);

  return (
    <div className={`property-card ${isSelected ? "selected" : ""}`}>
      
      {/* Image */}
      <div className="image-container">
        <img src={image} alt={property.name} className="property-image" />
        <span className="image-tag">Representative Image</span>
      </div>

      {/* Content */}
      <div className="property-content">
        
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">{property.location}</p>
        <h2 className="property-price">{property.price}</h2>

        {/* Icons */}
        <div className="property-icons">
          <span>🛏 {property.bhk} BHK</span>
          <span>🛁 {property.bath}</span>
          <span>📐 {property.area}</span>
        </div>

        {/* Actions */}
        <div className="property-actions">
          <button className="details-btn" onClick={() => onDetails(property)}>
            Details
          </button>

          <button
            className={`compare-btn ${isSelected ? "active" : ""}`}
            onClick={() => onCompare(property)}
          >
            {isSelected ? "Selected" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;