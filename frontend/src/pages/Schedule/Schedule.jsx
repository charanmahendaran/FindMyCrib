import { useState } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";

function Booking({ property, setActiveSection }) {
  const [done, setDone] = useState(false);

  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property before booking a visit</p>

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

  /* 🔥 NORMALIZE PROPERTY (handles all tabs data differences) */
  const image = getPropertyImage(property);
  const title = property.title || property.name || "Property";
  const location =
    property.location || property.place || property.city || "Bangalore";
  const price = property.price || property.cost || "";

  return (
    <div className="section-container">

      {/* 🔥 PROPERTY CARD */}
      <div className="booking-property">
        <div className="img-wrapper">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.target.src = "/fallback.jpg";
            }}
          />
        </div>

        <div className="property-info">
          <h3>{title}</h3>
          <p>{location}</p>
          <p className="price">{price}</p>
        </div>
      </div>

      {!done ? (
        <>
          {/* FORM */}
          <div className="booking-form">
            <input placeholder="Full Name" required />
            <input placeholder="Phone Number" required />

            <div className="row">
              <input type="date" required />
              <input type="time" required />
            </div>
          </div>

          <button className="book-btn" onClick={() => setDone(true)}>
            Confirm Booking
          </button>
        </>
      ) : (
        <div className="booking-form success">
          ✅ Visit Scheduled Successfully
        </div>
      )}

    </div>
  );
}

export default Booking;