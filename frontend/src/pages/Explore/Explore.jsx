// src/pages/Explore/Explore.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import "./Explore.css";
import PropertyCard from "../../components/PropertyCard";
import PropertyModal from "../../components/PropertyModal";
import { fetchProperties } from "../../services/agent1";
import LoadingOverlay from "../../components/LoadingOverlay";
import CompareBar from "../../components/CompareBar";
import { locationData } from "../../data/locationData";
import { debounce } from "../../utils/debounce";

function Explore({
  setActiveSection,
  setSelectedProperty,
  compareList,
  setCompareList,
}) {
  const inputRef = useRef(null);

  const [selectedModal, setSelectedModal] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);

  // =========================
  // 🔁 RESTORE STATE
  // =========================
  useEffect(() => {
    const savedProps = sessionStorage.getItem("explore_properties");
    const savedFilters = sessionStorage.getItem("explore_filters");
    const savedHasSearched = sessionStorage.getItem("explore_has_searched");

    if (savedProps && savedHasSearched === "true") {
      setProperties(JSON.parse(savedProps));
      setHasSearched(true);
    }

    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      setLocation(parsed.location || "");
      setBudget(parsed.budget || "");
      setType(parsed.type || "");
    }
  }, []);

  // =========================
  // 📦 COMPARE LIST
  // =========================
  useEffect(() => {
    const saved = sessionStorage.getItem("compare_list");
    if (saved) setCompareList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("compare_list", JSON.stringify(compareList));
  }, [compareList]);

  // =========================
  // ⚡ DEBOUNCE SUGGESTIONS
  // =========================
  const generateSuggestions = (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    let results = [];

    locationData.forEach((item) => {
      if (item.city.toLowerCase().includes(lower)) {
        results.push(item.city);
      }

      item.areas.forEach((area) => {
        if (area.toLowerCase().includes(lower)) {
          results.push(area);
        }
      });
    });

    setSuggestions([...new Set(results)].slice(0, 6));
  };

  const debouncedSuggest = useMemo(
    () => debounce(generateSuggestions, 300),
    []
  );

  useEffect(() => {
    debouncedSuggest(location);
  }, [location]);

  // =========================
  // 🧠 DROPDOWN POSITION
  // =========================
  const updateDropdownPosition = () => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  // =========================
  // 🖱️ CLICK OUTSIDE
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = async () => {
    setLoading(true);
    setShowDropdown(false);
    setHasSearched(false);

    const payload = {
      location,
      budget: Number(budget) || 0,
      type,
    };

    try {
      const results = await fetchProperties(payload);

      setProperties(results);

      sessionStorage.setItem("explore_properties", JSON.stringify(results));
      sessionStorage.setItem(
        "explore_filters",
        JSON.stringify({ location, budget, type })
      );
      sessionStorage.setItem("explore_has_searched", "true");

      setTimeout(() => setHasSearched(true), 50);
    } catch (err) {
      console.error(err);
      setProperties([]);
    }

    setLoading(false);
  };

  // =========================
  // 🎯 SELECT SUGGESTION
  // =========================
  const handleSelect = (value) => {
    setLocation(value);
    setShowDropdown(false);
  };

  // =========================
  // 🔄 COMPARE
  // =========================
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

  return (
    <div className="explore-container">
      <h2 className="explore-title">Explore Properties</h2>

      {/* ================= FILTER PANEL ================= */}
      <div className="filter-panel">
        {/* LOCATION */}
        <input
          ref={inputRef}
          placeholder="Enter location (e.g. Whitefield)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => {
            updateDropdownPosition();
            setShowDropdown(true);
          }}
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
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
        </select>

        <button
          className="primary-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {/* ================= DROPDOWN PORTAL ================= */}
      {showDropdown &&
        suggestions.length > 0 &&
        dropdownPos &&
        createPortal(
          <div
            className="suggestions-dropdown-portal"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              position: "absolute",
            }}
          >
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => handleSelect(s)}
              >
                {s}
              </div>
            ))}
          </div>,
          document.body
        )}

      {/* ================= COMPARE ================= */}
      <CompareBar
        compareList={compareList}
        setCompareList={setCompareList}
        onCompare={() => setActiveSection("compare")}
      />

      {loading && <LoadingOverlay />}

      {!loading && hasSearched && properties.length === 0 && (
        <p className="empty-state">No properties found</p>
      )}

      {/* ================= GRID ================= */}
      <div className={`property-grid ${hasSearched ? "show-grid" : ""}`}>
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

      {/* ================= MODAL ================= */}
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