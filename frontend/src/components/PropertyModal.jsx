// src/components/PropertyModal.jsx

import "./PropertyModal.css";
import { getPropertyImage } from "../utils/imageMapper";

function PropertyModal({ property, onClose, onAnalyze }) {
  if (!property) return null;

  const image = getPropertyImage(property);

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* ❌ CLOSE BUTTON (TOP RIGHT - FIXED POSITION) */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* 🔥 SCROLLABLE CONTENT */}
        <div className="modal-content">

          {/* IMAGE */}
          <div className="modal-image-container">
            <img src={image} alt={property.name} />
          </div>

          {/* INFO */}
          <div className="modal-body">
            <h2>{property.name}</h2>
            <p className="modal-location">{property.location}</p>
            <p className="modal-price">{property.price}</p>

            {/* FEATURES */}
            <div className="modal-features">
              {property.features?.map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>

            {/* REASON */}
            <div className="modal-reason">
              {property.reason}
            </div>

            {/* BUTTON */}
            <button
              className="analyze-btn"
              onClick={() => onAnalyze(property)}
            >
              Analyze Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyModal;