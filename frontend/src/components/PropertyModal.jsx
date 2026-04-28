import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./PropertyModal.css";
import { getPropertyImage } from "../utils/imageMapper";

function PropertyModal({ property, onClose, onAnalyze }) {
  const image = getPropertyImage(property);

  // 🔒 LOCK BACKGROUND SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ CLOSE */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* 🖼 IMAGE */}
        <img
          src={image}
          alt={property.name}
          className="modal-image"
        />

        {/* 📦 BODY */}
        <div className="modal-body">
          <h2>{property.name}</h2>
          <p className="modal-location">{property.location}</p>

          <h3 className="modal-price">{property.price}</h3>

          <div className="modal-features">
            {property.features?.map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>

          <div className="modal-reason">
            {property.reason}
          </div>

          <button
            className="analyze-btn"
            onClick={() => onAnalyze(property)}
          >
            Analyze Property
          </button>
        </div>
      </div>
    </div>
  );

  // 🔥 PORTAL RENDER (KEY FIX)
  return createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
}

export default PropertyModal;