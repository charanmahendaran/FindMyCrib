function BookingDetails({ apiData, timer }) {
  return (
    <div className="booking-details-page">

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

        {/* 🔥 TIMER INSIDE CARD */}
        <div className="auto-close-box">
          ⏳ This will auto close in <strong>{timer}s</strong>
        </div>

      </div>
    </div>
  );
}

export default BookingDetails;