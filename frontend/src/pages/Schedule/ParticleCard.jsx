import { useEffect, useRef } from "react";
import "./ParticleCard.css";

function ParticleCard({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 220;
    const height = 180;

    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const target = [];

    for (let y = 20; y < height - 20; y += 6) {
      for (let x = 20; x < width - 20; x += 6) {
        target.push({ x, y });
      }
    }

    for (let i = 0; i < target.length; i++) {
      particles.push({
        x: Math.random() * width,
        y: -Math.random() * 150,
        tx: target[i].x,
        ty: target[i].y,
        vx: 0,
        vy: 0,
      });
    }

    let start = performance.now();
    let done = false;

    const animate = (t) => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;

        p.vx += dx * 0.02;
        p.vy += dy * 0.02;

        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,220,220,0.8)";
        ctx.fill();
      });

      if (!done && t - start > 2500) {
        done = true;
        onComplete && onComplete();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <div className="particle-card">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default ParticleCard;