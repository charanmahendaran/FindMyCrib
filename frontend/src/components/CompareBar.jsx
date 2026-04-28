// src/components/CompareBar.jsx

import "./CompareBar.css";

function CompareBar({ compareList, setCompareList, onCompare }) {
  if (compareList.length < 2) return null;

  return (
    <div className="compare-inline">
      <div className="compare-left">
        <span>{compareList.length} Selected</span>
        <button onClick={() => setCompareList([])}>✕</button>
      </div>

      <button className="compare-inline-btn" onClick={onCompare}>
        Compare Now →
      </button>
    </div>
  );
}

export default CompareBar;