import { useState, useEffect, useRef } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";
import { scheduleVisit } from "../../services/agent5";

function Booking({ property, setActiveSection }) {
  const [apiData, setApiData] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timer, setTimer] = useState(10);
  const [finalMessage, setFinalMessage] = useState(false);
  const detailsRef = useRef(null);
  const [openTime, setOpenTime] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const dropdownRef = useRef(null);
  const dateRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Checking availability...");

  const [form, setForm] = useState({
    date: "",
    time: "",
  });

  const today = new Date();

  /* ---------- CALENDAR ---------- */
  const generateCalendar = () => {
    const days = [];
    const today = new Date();

    for (let i = -7; i <= 15; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const formatted = d.toISOString().split("T")[0];

      const isPast = i < 0;
      const isFutureLimit = i > 15;

      days.push({
        value: formatted,
        label: d.getDate(),
        disabled: isPast || isFutureLimit,
      });
    }

    return days;
  };

  const calendarDays = openDate ? generateCalendar() : [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* ---------- TIME ---------- */
  const timeSlots = [];
  for (let h = 9; h < 18; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenTime(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setOpenDate(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!showAnimation) return;

    const t = setTimeout(() => {
      setShowAnimation(false);
      setShowDetails(true);
    }, 5000);

    return () => clearTimeout(t);
  }, [showAnimation]);

  useEffect(() => {
    if (!showDetails) return;

    let t = 10;
    setTimer(t);

    const interval = setInterval(() => {
      t--;
      setTimer(t);

      if (t === 0) {
        clearInterval(interval);
        setShowDetails(false);
        setFinalMessage(true);

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showDetails]);

  if (!property) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h2>No property selected</h2>
          <p>Select a property from Explore</p>
          <p className="empty-cta" onClick={() => setActiveSection("explore")}>
            Go to Explore →
          </p>
        </div>
      </div>
    );
  }

  const image = getPropertyImage(property);

  const handleConfirm = async () => {
    let hasError = false;

    if (name.trim().length < 3) {
      setNameError("Minimum 3 characters required");
      hasError = true;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter valid email");
      hasError = true;
    }

    if (phone.length < 10) {
      setPhoneError("Enter valid phone number");
      hasError = true;
    }

    if (!form.date) hasError = true;
    if (!form.time) hasError = true;

    if (hasError) return;

    setLoading(true);

    try {
      setOverlayMessage("Checking availability...");

      const data = await scheduleVisit({
        user_name: name,
        user_email: email,
        phone,
        date: form.date,
        time: form.time,
        property_name: property?.name,
        location: property?.location,
      });

      setOverlayMessage("Confirming visit...");
      await new Promise((res) => setTimeout(res, 500));

      setOverlayMessage("Finalizing...");
      await new Promise((res) => setTimeout(res, 500));

      if (data?.status === "success") {
        setSuccess(true);

        const parsed = data?.data || data?.[0]?.data;
        setApiData(parsed);

        setShowAnimation(true);

        setTimeout(() => {
          detailsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        console.error("Booking failed", data);
      }

    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">

      <div className="booking-property">
        <div className="img-wrapper">
          <img src={image} alt="property" />
        </div>
        <div className="property-info">
          <h3>{property?.name}</h3>
          <p>{property?.location}</p>
          <p className="price">{property?.price}</p>
        </div>
      </div>

      <div className="booking-form">

        {/* NAME */}
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            setName(value);

            if (value.trim().length === 0) {
              setNameError("Enter your name");
            } else if (value.trim().length < 3) {
              setNameError("Minimum 3 characters required");
            } else {
              setNameError("");
            }
          }}
          className={nameError ? "error" : name ? "valid" : ""}
        />
        {nameError && <span className="error-text">{nameError}</span>}

        {/* EMAIL */}
        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) {
              setEmailError("Enter email");
            } else if (!regex.test(value)) {
              setEmailError("Enter valid email");
            } else {
              setEmailError("");
            }
          }}
          className={emailError ? "error" : email ? "valid" : ""}
        />
        {emailError && <span className="error-text">{emailError}</span>}

        {/* LOADER */}
        {loading && (
          <div className="form-overlay">
            <div className="overlay-content">
              <div className="loader"></div>
              <p className="overlay-text">{overlayMessage}</p>
            </div>
          </div>
        )}

        {/* PHONE */}
        <input
          placeholder="Phone Number"
          value={phone}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);

            if (value.length === 0) {
              setPhoneError("Enter phone number");
            } else if (value.length < 10) {
              setPhoneError("Enter valid phone number");
            } else {
              setPhoneError("");
            }
          }}
          className={phoneError ? "error" : phone ? "valid" : ""}
        />
        {phoneError && <span className="error-text">{phoneError}</span>}

        <div className="row">

          {/* DATE */}
          <div className={`date-dropdown ${openDate ? "open" : ""}`} ref={dateRef}>
            <div
              className={`date-selected ${form.date ? "valid" : ""}`}
              onClick={() => setOpenDate(!openDate)}
            >
              {form.date || "Select Date"}
            </div>

            {openDate && (
              <div className="calendar">
                <div className="calendar-header">
                  {today.toLocaleString("default", { month: "long" })} {today.getFullYear()}
                </div>

                <div className="calendar-weekdays">
                  {weekdays.map((d) => <span key={d}>{d}</span>)}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((day) => (
                    <div
                      key={day.value}
                      className={`calendar-day ${form.date === day.value ? "active" : ""} ${day.disabled ? "disabled" : ""}`}
                      onClick={() => {
                        if (day.disabled) return;
                        setForm({ ...form, date: day.value });
                        setOpenDate(false);
                      }}
                    >
                      {day.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TIME */}
          <div className={`time-dropdown ${openTime ? "open" : ""}`} ref={dropdownRef}>
            <div
              className={`time-selected ${form.time ? "valid" : ""}`}
              onClick={() => setOpenTime(!openTime)}
            >
              {form.time || "Select Time"}
            </div>

            {openTime && (
              <div className="time-menu">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="time-item"
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
      </div>

      <button
        className={`book-btn ${name.trim().length < 3 ||
          !email ||
          phone.length !== 10 ||
          !form.date ||
          !form.time
          ? "disabled-btn"
          : ""}`}
        onClick={handleConfirm}
      >
        Confirm Booking
      </button>

      {success && (
        <div className="success-toast center">
          ✅ Visit Scheduled Successfully
        </div>
      )}
      {/* 🔥 FLOW START */}
      <div ref={detailsRef}></div>

      {showAnimation && (
        <div className="paper-animation">
          <div className="paper">
            <div className="particles"></div>
          </div>
        </div>
      )}

      {showDetails && apiData && (
        <div className="booking-details-page">

          <div className="timer">{timer}s</div>

          <div className="details-card">

            <h2>Booking Confirmed</h2>

            <p className="confirmation-msg">
              {apiData.confirmation_message}
            </p>

            <div className="detail-row">
              <span>Booking ID</span>
              <strong>{apiData.booking_id}</strong>
            </div>

            <div className="detail-row">
              <span>Property</span>
              <strong>{apiData.visit_details.property_name}</strong>
            </div>

            <div className="detail-row">
              <span>Location</span>
              <strong>{apiData.visit_details.location}</strong>
            </div>

            <div className="detail-row">
              <span>Date</span>
              <strong>{apiData.visit_details.date}</strong>
            </div>

            <div className="detail-row">
              <span>Time</span>
              <strong>{apiData.visit_details.time}</strong>
            </div>

          </div>
        </div>
      )}

      {finalMessage && (
        <div className="final-message">
          📩 Check your email for confirmation
        </div>
      )}
      {/* 🔥 FLOW END */}
    </div>
  );
}

export default Booking;