import { useState } from "react";

// Components
import Navbar from "../components/Navbar/Navbar";

// Sections
import Hero from "../sections/Hero/Hero";
import Explore from "../sections/Explore/Explore";
import PriceCheck from "../sections/PriceCheck/PriceCheck";
import Compare from "../sections/Compare/Compare";
import Finance from "../sections/Finance/Finance";
import Booking from "../sections/Booking/Booking";

function MainLayout() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);

  // 🔥 GLOBAL STATES
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [compareList, setCompareList] = useState([]);

  const handleSectionChange = (section) => {
    setIsVisible(false);

    setTimeout(() => {
      setActiveSection(section);
      setIsVisible(true);
    }, 150);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "explore":
        return (
          <Explore
            setActiveSection={handleSectionChange}
            setSelectedProperty={setSelectedProperty}
            compareList={compareList}
            setCompareList={setCompareList}
          />
        );

      case "price":
        return (
          <PriceCheck
            property={selectedProperty}
            setActiveSection={handleSectionChange}
          />
        );

      case "compare":
        return (
          <Compare
            compareList={compareList}
            setActiveSection={handleSectionChange}
          />
        );

      case "finance":
        return (
          <Finance
            property={selectedProperty}
            setActiveSection={handleSectionChange}
          />
        );

      case "booking":
        return (
          <Booking
            property={selectedProperty}
            setActiveSection={handleSectionChange}
          />
        );

      default:
        return <Hero setActiveSection={handleSectionChange} />;
    }
  };

  return (
    <div>
      {/* ✅ UPDATED NAVBAR (THIS IS THE FIX) */}
      <Navbar
        setActiveSection={handleSectionChange}
        activeSection={activeSection}
      />

      <div
        style={{
          paddingTop: "70px",
          transition: "all 0.35s ease",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0px)"
            : "translateY(15px)",
        }}
      >
        {renderSection()}
      </div>
    </div>
  );
}

export default MainLayout;