import { useState, useEffect, useRef, lazy, Suspense } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";
import { scheduleVisit } from "../../services/agent5";
import ParticleAnimation from "./ParticleAnimation";

const BookingDetails = lazy(() => import("./BookingDetails"));

function Booking({ property, setActiveSection }) {
  const [apiData, setApiData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timer, setTimer] = useState(15);
  const [finalMessage, setFinalMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showParticle, setShowParticle] = useState(false);

  const dropdownRef = useRef(null);
  const dateRef = useRef(null);
  const resultRef = useRef(null);

  const [openTime, setOpenTime] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("Checking availability...");

  const [form, setForm] = useState({
    date: "",
    time: "",
  });

  const generateCalendar = () => {
    const days = [];
    const today = new Date();

    for (let i = -7; i <= 15; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const formatted = d.toISOString().split("T")[0];

      days.push({
        value: formatted,
        label: d.getDate(),
        disabled: i < 0 || i > 15,
      });
    }

    return days;
  };

  const calendarDays = openDate ? generateCalendar() : [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const timeSlots = [];
  for (let h = 9; h < 18; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

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
    if (finalMessage) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 400);
    }
  }, [finalMessage]);
  useEffect(() => {
    if (!showDetails) return;

    let t = 15;
    setTimer(t);

    const interval = setInterval(() => {
      t--;
      setTimer(t);

      if (t === 0) {
        clearInterval(interval);
        setShowDetails(false);
        setFinalMessage(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showDetails]);

  const handleAnimationComplete = () => {
    setShowParticle(false);
    setShowDetails(true);
  };

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
    setSubmitted(true);

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

    if (!form.date || !form.time) hasError = true;

    if (hasError) return;

    setLoading(true);

    try {
      const data = await scheduleVisit({
        user_name: name,
        user_email: email,
        phone,
        date: form.date,
        time: form.time,
        property_name: property?.name,
        location: property?.location,
      });

      if (data?.status === "success") {
        const parsed = data?.data || data?.[0]?.data;

        setSuccess(true);
        setApiData(parsed);

        setTimeout(() => {
          window.scrollTo({
            top: resultRef.current.offsetTop - 80,
            behavior: "smooth",
          });
        }, 300);

        setTimeout(() => {
          setShowParticle(true);
        }, 500);
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
            const v = e.target.value;
            setName(v);
            setNameError(v.length < 3 ? "Minimum 3 characters required" : "");
          }}
          className={`
            ${nameError ? "error" : ""}
            ${name && !nameError ? "valid" : ""}
            ${submitted && !name ? "error" : ""}
          `}
        />
        {nameError && <span className="error-text">{nameError}</span>}

        {/* EMAIL */}
        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            const v = e.target.value;
            setEmail(v);
            setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter valid email" : "");
          }}
          className={`
            ${emailError ? "error" : ""}
            ${email && !emailError ? "valid" : ""}
            ${submitted && !email ? "error" : ""}
          `}
        />
        {emailError && <span className="error-text">{emailError}</span>}

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
            const v = e.target.value.replace(/\D/g, "");
            setPhone(v);
            setPhoneError(v.length < 10 ? "Enter valid phone number" : "");
          }}
          className={`
            ${phoneError ? "error" : ""}
            ${phone && !phoneError ? "valid" : ""}
            ${submitted && !phone ? "error" : ""}
          `}
        />
        {phoneError && <span className="error-text">{phoneError}</span>}

        <div className="row">

          {/* DATE */}
          <div className={`date-dropdown ${openDate ? "open" : ""}`} ref={dateRef}>
            <div
              className={`
                date-selected
                ${form.date ? "valid" : ""}
                ${submitted && !form.date ? "error" : ""}
              `}
              onClick={() => setOpenDate(!openDate)}
            >
              {form.date || "Select Date"}
            </div>

            {openDate && (
              <div className="calendar">
                <div className="calendar-header">
                  {new Date().toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className="calendar-weekdays">
                  {weekdays.map((d) => <span key={d}>{d}</span>)}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((day) => (
                    <div
                      key={day.value}
                      className={`calendar-day 
                        ${day.disabled ? "disabled" : ""} 
                        ${form.date === day.value ? "active" : ""}`}
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
              className={`
                time-selected
                ${form.time ? "valid" : ""}
                ${submitted && !form.time ? "error" : ""}
              `}
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

      <button className="book-btn" onClick={handleConfirm}>
        Confirm Booking
      </button>

      <div ref={resultRef} className="result-section">

        <div className="top-stack">

          {success && (
            <div className="success-toast">
              ✅ Visit Scheduled Successfully
            </div>
          )}

          {finalMessage && (
            <div className="success-toast white-border">
              📩 Check your email for confirmation
            </div>
          )}

        </div>

        <div className="result-content">

          <div className={`transition-shell ${showDetails ? "expanded" : ""}`}>
            {showParticle && !showDetails && (
              <ParticleAnimation onComplete={handleAnimationComplete} />
            )}
          </div>

          <Suspense fallback={null}>
            {showDetails && apiData && (
              <div className="booking-details-smooth">
                <BookingDetails apiData={apiData} timer={timer} />
              </div>
            )}
          </Suspense>
        </div>
      </div>

    </div>
  );
}

export default Booking;