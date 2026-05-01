import { useState } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";

function Booking({ property, setActiveSection }) {
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});

  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property before booking a visit</p>
          <p className="empty-cta" onClick={() => setActiveSection("explore")}>
            Go to Explore →
          </p>
        </div>
      </div>
    );
  }

  /* 🔥 NORMALIZE PROPERTY */
  const image = getPropertyImage(property);
  const title = property.title || property.name || "Property";
  const location =
    property.location || property.place || property.city || "Bangalore";
  const price = property.price || property.cost || "";

  /* 📅 TODAY */
  const today = new Date().toISOString().split("T")[0];

  /* ⏰ TIME SLOTS */
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h < 18; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  /* 🔥 VALIDATION */
  const validate = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!value || value.trim().length < 3)
        error = "Enter at least 3 characters";
    }

    if (field === "phone") {
      if (!/^\d{10}$/.test(value))
        error = "Enter valid 10-digit number";
    }

    if (field === "date") {
      if (!value || value < today)
        error = "Select a valid future date";
    }

    if (field === "time") {
      if (!value) error = "Select a time slot";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isValid =
    form.name &&
    form.phone &&
    form.date &&
    form.time &&
    Object.values(errors).every((e) => !e);

  return (
    <div className="section-container">

      {/* PROPERTY CARD */}
      <div className="booking-property">
        <div className="img-wrapper">
          <img
            src={image}
            alt={title}
            onError={(e) => (e.target.src = "/fallback.jpg")}
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

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : form.name ? "valid" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={errors.phone ? "error" : form.phone ? "valid" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}

            <div className="row">
              <div>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  className={errors.date ? "error" : form.date ? "valid" : ""}
                />
                {errors.date && (
                  <span className="error-text">{errors.date}</span>
                )}
              </div>

              <div>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={errors.time ? "error" : form.time ? "valid" : ""}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <span className="error-text">{errors.time}</span>
                )}
              </div>
            </div>

          </div>

          <button
            className="book-btn"
            disabled={!isValid}
            onClick={() => {
              setDone(true);
              setToast("Visit Scheduled Successfully 🎉");
              setTimeout(() => setToast(""), 3000);
            }}
          >
            Confirm Booking
          </button>
        </>
      ) : (
        <div className="booking-form success">
          ✅ Visit Scheduled Successfully
        </div>
      )}

      {/* 🔔 TOAST */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}

export default Booking;