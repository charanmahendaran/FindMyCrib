import { useState } from "react";

// Components
import Navbar from "../components/Navbar/Navbar";

// Sections
import Hero from "../pages/Hero/Hero";
import { lazy, Suspense } from "react";

const Explore = lazy(() => import("../pages/Explore/Explore"));
import PriceCheck from "../pages/PriceCheck/PriceCheck";
import Compare from "../pages/Compare/Compare";
import Finance from "../pages/Finance/Finance";
import Booking from "../pages/Schedule/Schedule";

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
          <Suspense fallback={null}>
            <Explore
              setActiveSection={handleSectionChange}
              setSelectedProperty={setSelectedProperty}
              compareList={compareList}
              setCompareList={setCompareList}
            />
          </Suspense>
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