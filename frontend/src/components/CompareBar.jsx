import "./CompareBar.css";

function CompareBar({ compareList, setCompareList, onCompare }) {
  if (compareList.length < 2) return null;

  return (
    <div className={`compare-bar ${compareList.length === 3 ? "glow" : ""}`}>

      <div className="compare-info">
        <span className="compare-count">
          {compareList.length} Selected
        </span>

        <button
          className="close-btn"
          onClick={() => setCompareList([])}
        >
          ✕
        </button>
      </div>

      <button className="compare-now-btn" onClick={onCompare}>
        Compare Now →
      </button>

    </div>
  );
}

export default CompareBar;