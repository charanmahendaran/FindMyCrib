import "./Hero.css";

function Hero({ setActiveSection }) {
  return (
    <div className="hero-container">
      <div className="hero-bg-glow"></div>

      <div className="hero-content">

        <h1 className="hero-title">
          <span>AI-Powered</span>
          <br />
          Real Estate Intelligence
        </h1>

        <p className="hero-sub">
          Discover. Analyze. Compare. Decide.
        </p>

        <button
          className="hero-btn"
          onClick={() => {
            setActiveSection("explore");

            setTimeout(() => {
              const section = document.getElementById("explore-section");
              section?.scrollIntoView({ behavior: "smooth" });
            }, 150);
          }}
        >
          <span>Let’s Explore</span>
          <div className="btn-glow"></div>
        </button>

      </div>
    </div>
  );
}

export default Hero;