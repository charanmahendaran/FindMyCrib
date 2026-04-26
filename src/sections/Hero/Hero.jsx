import "./Hero.css";

function Hero({ setActiveSection }) {
  return (
    <div className="hero-container">
      <div className="hero-content">

        <h1>AI-Powered Real Estate Intelligence</h1>
        <p>Discover. Analyze. Compare. Decide.</p>

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
          Let’s Explore
        </button>

      </div>
    </div>
  );
}

export default Hero;