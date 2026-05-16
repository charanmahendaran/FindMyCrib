import React, { useEffect, useState } from "react";

const currencyData = [
  { symbol: "$", left: "8%", top: "18%", size: "85px" },
  { symbol: "₹", left: "22%", top: "58%", size: "70px" },
  { symbol: "€", left: "38%", top: "22%", size: "78px" },
  { symbol: "¥", left: "63%", top: "34%", size: "82px" },
  { symbol: "$", left: "82%", top: "65%", size: "76px" },

  { symbol: "₹", left: "50%", top: "75%", size: "68px" },
  { symbol: "€", left: "74%", top: "50%", size: "72px" },
  { symbol: "¥", left: "91%", top: "22%", size: "74px" },

  { symbol: "$", left: "42%", top: "42%", size: "66px" },
  { symbol: "₹", left: "15%", top: "80%", size: "60px" },
  { symbol: "€", left: "86%", top: "84%", size: "72px" },
];

function FinanceBackground({ affordability }) {
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (!affordability) return;

    setTransitioning(true);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [affordability]);
  const getRiskClass = () => {
    if (!affordability) return "neutral";

    if (affordability === "yes") return "safe";
    if (affordability === "risky") return "risky";

    return "danger";
  };

  return (
    <div
      className={`
    finance-bg
    ${getRiskClass()}
    ${transitioning ? "transitioning" : ""}
  `}
    >
      <div className="finance-fog"></div>

      <div className="currency-field">
        {currencyData.map((item, index) => (
          <div
            key={index}
            className="currency-symbol"
            style={{
              left: item.left,
              top: item.top,
              fontSize: item.size,
              animationDelay: `${index * 0.2}s`,
              animationDuration: `${8 + index * 0.6}s`,
            }}
          >
            <div
              className="currency-line"
              style={{
                height: `${120 + index * 8}px`,
              }}
            ></div>

            <span>{item.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinanceBackground;