import { useState, useEffect, useRef } from "react";
import "./Schedule.css";
import { getPropertyImage } from "../../utils/imageMapper";

function Booking({ property }) {
  const [openTime, setOpenTime] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const dropdownRef = useRef(null);
  const dateRef = useRef(null);

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

  const image = getPropertyImage(property);

  return (
    <div className="section-container">

      {/* PROPERTY */}
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

      {/* FORM */}
      <div className="booking-form">

        <input placeholder="Full Name" />
        <input placeholder="Phone Number" />

        <div className="row">

          {/* DATE */}
          <div
            className={`date-dropdown ${openDate ? "open" : ""}`}
            ref={dateRef}
          >
            <div
              className={`date-selected ${form.date ? "valid" : ""}`}
              onClick={() => setOpenDate(!openDate)}
            >
              {form.date || "Select Date"}
            </div>

            {openDate && (
              <div className="calendar">

                <div className="calendar-header">
                  {today.toLocaleString("default", { month: "long" })}{" "}
                  {today.getFullYear()}
                </div>

                {/* WEEKDAYS */}
                <div className="calendar-weekdays">
                  {weekdays.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((day) => (
                    <div
                      key={day.value}
                      className={`calendar-day 
    ${form.date === day.value ? "active" : ""} 
    ${day.disabled ? "disabled" : ""}
  `}
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
          <div
            className={`time-dropdown ${openTime ? "open" : ""}`}
            ref={dropdownRef}
          >
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

      <button className="book-btn">Confirm Booking</button>

    </div>
  );
}

export default Booking;