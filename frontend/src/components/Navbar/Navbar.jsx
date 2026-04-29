import "./Navbar.css";

function Navbar({ setActiveSection, activeSection }) {
  const navItems = [
    { id: "explore", label: "Explore" },
    { id: "price", label: "Price Check" },
    { id: "compare", label: "Compare" },
    { id: "finance", label: "Finance" },
    { id: "booking", label: "Book Visit" },
  ];

  return (
    <div className="navbar">
      <div className="navbar-inner">

        {/* LEFT */}
        <div
          className="nav-left"
          onClick={() => setActiveSection("hero")}
        >
          <span className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5L12 3l9 7.5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </span>
          <span className="logo-text">FindMyCrib</span>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-pill ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span>{item.label}</span>
              <div className="hover-glow"></div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Navbar;