import "./Navbar.css";

function Navbar({ setActiveSection, activeSection }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">

        {/* LEFT */}
        <div
          className="nav-left"
          onClick={() => setActiveSection("hero")}
        >
          <span className="logo-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>
          </span>

          <span className="logo-text">FindMyCrib</span>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <button
            className={activeSection === "explore" ? "active" : ""}
            onClick={() => setActiveSection("explore")}
          >
            Explore
          </button>

          <button
            className={activeSection === "price" ? "active" : ""}
            onClick={() => setActiveSection("price")}
          >
            Price Check
          </button>

          <button
            className={activeSection === "compare" ? "active" : ""}
            onClick={() => setActiveSection("compare")}
          >
            Compare
          </button>

          <button
            className={activeSection === "finance" ? "active" : ""}
            onClick={() => setActiveSection("finance")}
          >
            Finance
          </button>

          <button
            className={activeSection === "booking" ? "active" : ""}
            onClick={() => setActiveSection("booking")}
          >
            Book Visit
          </button>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button className="login-btn">Sign In</button>
          <button className="signup-btn">Create Account</button>
        </div>

      </div>
    </div>
  );
}

export default Navbar;