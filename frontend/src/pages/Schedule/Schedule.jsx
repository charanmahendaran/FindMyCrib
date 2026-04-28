import { useState } from "react";
import "./Schedule.css";

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

  return (
    <div className="section-container">

      {/* PROPERTY CARD */}
      <div className="booking-property glass-card">
        <img src={property.image} alt="" />

        <div>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p className="price">{property.price}</p>
        </div>
      </div>

      {!done ? (
        <>
          {/* FORM */}
          <div className="booking-form glass-card">

            <input placeholder="Full Name" />
            <input placeholder="Phone Number" />

            <div className="row">
              <input type="date" />
              <input type="time" />
            </div>

          </div>

          <button className="book-btn" onClick={() => setDone(true)}>
            Confirm Booking
          </button>
        </>
      ) : (
        <div className="glass-card success">
          ✅ Visit Scheduled Successfully
        </div>
      )}

    </div>
  );
}

export default Booking;