// src/pages/Explore/Explore.jsx

import { useState } from "react";
import "./Explore.css";
import PropertyCard from "../../components/PropertyCard";
import PropertyModal from "../../components/PropertyModal";
import { fetchProperties } from "../../services/agent1";
import LoadingOverlay from "../../components/LoadingOverlay";

function Explore({
  setActiveSection,
  setSelectedProperty,
  compareList,
  setCompareList,
}) {
  // 🔹 States
  const [selectedModal, setSelectedModal] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 🔹 Filters
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");

  // 🔹 Compare Logic
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

  // 🔹 Search Handler
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    const payload = {
      location: location || "",   // allow empty
      budget: Number(budget) || 0,
      type,
    };

    try {
      const results = await fetchProperties(payload);
      console.log("RESULTS:", results);
      setProperties(results);
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

      {/* ❌ EMPTY STATE */}
      {!loading && hasSearched && properties.length === 0 && (
        <p className="empty-state">
          No properties found. Try adjusting filters.
        </p>
      )}

      {/* 🔥 COMPARE BAR */}
      <div className="compare-bar">
        <div className="compare-left">
          {compareList.length > 0 && (
            <div className="selected-pill">
              {compareList.length} Selected
              <span onClick={() => setCompareList([])}>✕</span>
            </div>
          )}
        </div>

        <div className="compare-right">
          {compareList.length > 1 && (
            <button
              className="compare-now"
              onClick={() => setActiveSection("compare")}
            >
              Compare Now
            </button>
          )}
        </div>
      </div>

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

      {/* 🔥 FROSTED LOADER */}
      {loading && <LoadingOverlay />}
    </div>
  );
}

export default Explore;