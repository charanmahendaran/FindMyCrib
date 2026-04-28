// src/pages/Explore/Explore.jsx

import { useState, useEffect } from "react";
import "./Explore.css";
import PropertyCard from "../../components/PropertyCard";
import PropertyModal from "../../components/PropertyModal";
import { fetchProperties } from "../../services/agent1";
import LoadingOverlay from "../../components/LoadingOverlay";
import CompareBar from "../../components/CompareBar";

function Explore({
  setActiveSection,
  setSelectedProperty,
  compareList,
  setCompareList,
}) {
  // 🔹 STATES
  const [selectedModal, setSelectedModal] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 🔹 FILTERS
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");

  // ✅ 🔥 PERSIST COMPARE LIST (KEY FIX)
  useEffect(() => {
    const saved = sessionStorage.getItem("compare_list");
    if (saved) {
      setCompareList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("compare_list", JSON.stringify(compareList));
  }, [compareList]);

  // 🔹 COMPARE HANDLER
  const handleCompare = (property) => {
    const exists = compareList.find((p) => p.id === property.id);

    if (exists) {
      setCompareList(compareList.filter((p) => p.id !== property.id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, property]);
      }
    }
  };

  // 🔹 SEARCH HANDLER
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    const payload = {
      location: location || "",
      budget: Number(budget) || 0,
      type,
    };

    try {
      const results = await fetchProperties(payload);
      setProperties(results);

      // 🔥 Smooth scroll to results
      setTimeout(() => {
        document.querySelector(".property-grid")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

    } catch (err) {
      console.error("Search error:", err);
      setProperties([]);
    }

    setLoading(false);
  };

  return (
    <div className="explore-container">
      <h2 className="explore-title">Explore Properties</h2>

      {/* 🔍 FILTER PANEL */}
      <div className="filter-panel">
        <input
          placeholder="Enter location (e.g. Whitefield)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Budget (e.g. 90, 90L, 1.2Cr)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="1bhk">1 BHK Apartment</option>
          <option value="2bhk">2 BHK Apartment</option>
          <option value="3bhk">3 BHK Apartment</option>
          <option value="4bhk">4 BHK Apartment</option>
          <option value="villa">Villa (3–5 BHK)</option>
          <option value="plot">Plot / Land</option>
        </select>

        <button
          className="primary-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {/* 🔥 STICKY COMPARE BAR */}
      <CompareBar
        compareList={compareList}
        setCompareList={setCompareList}
        onCompare={() => setActiveSection("compare")}
      />

      {/* 🔥 LOADING OVERLAY */}
      {loading && <LoadingOverlay />}

      {/* ❌ EMPTY STATE */}
      {!loading && hasSearched && properties.length === 0 && (
        <p className="empty-state">
          No properties found. Try adjusting filters.
        </p>
      )}

      {/* 🏘 PROPERTY GRID */}
      <div className="property-grid">
        {properties.map((property, index) => {
          const isSelected = compareList.some(
            (p) => p.id === property.id
          );

          return (
            <PropertyCard
              key={property.id}
              property={property}
              index={index}
              isSelected={isSelected}
              onDetails={(p) => setSelectedModal(p)}
              onCompare={handleCompare}
            />
          );
        })}
      </div>

      {/* 📌 MODAL */}
      {selectedModal && (
        <PropertyModal
          property={selectedModal}
          onClose={() => setSelectedModal(null)}
          onAnalyze={(p) => {
            setSelectedProperty(p);
            setActiveSection("price");
          }}
        />
      )}
    </div>
  );
}

export default Explore;