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
          <img
            src="/assets/logo/logo.jpeg"
            alt="FindMyCrib Logo"
            className="logo-img"
          />

          <span className="logo-text">FindMyCrib</span>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              className={`nav-pill nav-animate ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
              style={{
                animationDelay: `${0.2 + i * 0.08}s`, // 🔥 stagger
              }}
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