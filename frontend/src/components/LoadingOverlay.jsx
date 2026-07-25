import "./LoadingOverlay.css";
import { useEffect, useState } from "react";

const messages = [
  "Scanning best properties for you...",
  "Analyzing market trends...",
  "Filtering ideal matches...",
  "Checking price insights...",
  "Almost there, preparing results..."
];

function LoadingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-box">
        
        <div className="loader"></div>

        <p className="loading-text">{messages[index]}</p>

      </div>
    </div>
  );
}

export default LoadingOverlay;