import { useState } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";
import { scheduleVisit } from "../../services/agent5";

function Booking({ property, setActiveSection }) {
  const [done, setDone] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Checking availability...");
  const [openTime, setOpenTime] = useState(false);

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

  const image = getPropertyImage(property);
  const title = property.title || property.name || "Property";
  const location = property.location || property.place || "Bangalore";
  const price = property.price || "";

  const today = new Date().toISOString().split("T")[0];

  const timeSlots = [];
  for (let h = 9; h < 18; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

  const validate = (field, value) => {
    let error = "";
    if (field === "name" && (!value || value.length < 3)) {
      error = "Enter at least 3 characters";
    }
    if (field === "phone" && !/^\d{10}$/.test(value)) {
      error = "Enter valid 10-digit number";
    }
    if (field === "date" && (!value || value < today)) {
      error = "Select a valid date";
    }
    if (field === "time" && !value) {
      error = "Select time";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValid =
    form.name &&
    form.phone &&
    form.date &&
    form.time &&
    Object.values(errors).every((e) => !e);

  const handleBooking = async () => {
    if (!isValid) return;

    setLoadingConfirm(true);

    setOverlayMessage("Checking availability...");
    setTimeout(() => setOverlayMessage("Confirming visit..."), 800);
    setTimeout(() => setOverlayMessage("Finalizing..."), 1400);

    try {
      const res = await scheduleVisit({
        user_name: form.name,
        user_email: "test@email.com",
        property_name: title,
        location,
        date: form.date,
        time: form.time,
      });

      if (res.status === "success") {
        setTimeout(() => {
          setLoadingConfirm(false);
          setSuccessMsg(true);

          setTimeout(() => setSuccessMsg(false), 10000);
        }, 2000);
      } else {
        setLoadingConfirm(false);
        alert(res.message);
      }
    } catch {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className="section-container">

      <div className="booking-property">
        <div className="img-wrapper">
          <img src={image} alt={title} />
        </div>
        <div className="property-info">
          <h3>{title}</h3>
          <p>{location}</p>
          <p className="price">{price}</p>
        </div>
      </div>

      <div className="booking-form">

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          maxLength={10}
          className={errors.phone ? "error" : ""}
        />

        <div className="row">

          {/* DATE */}
          <div className="date-field">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={today}
            />
          </div>

          {/* TIME */}
          <div className="time-dropdown">
            <div
              className="time-selected"
              onClick={() => setOpenTime(!openTime)}
            >
              {form.time || "Select Time"}
            </div>

            {openTime && (
              <div className="time-menu">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    onClick={() => {
                      setForm({ ...form, time: slot });
                      setOpenTime(false);
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {loadingConfirm && (
          <div className="form-overlay">
            <div className="overlay-content">
              <div className="loader"></div>
              <p className="overlay-text">{overlayMessage}</p>
            </div>
          </div>
        )}

      </div>

      <button
        className="book-btn"
        disabled={!isValid || loadingConfirm}
        onClick={handleBooking}
      >
        Confirm Booking
      </button>

      {successMsg && (
        <div className="success-toast">
          ✅ Visit Scheduled Successfully
        </div>
      )}

    </div>
  );
}

export default Booking;