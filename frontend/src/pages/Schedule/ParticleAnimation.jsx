import { useEffect, useRef } from "react";
import "./ParticleAnimation.css";

function ParticleAnimation({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 220;
    const height = 280;

    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const target = [];

    // document shape
    for (let y = 20; y < height - 20; y += 7) {
      for (let x = 20; x < width - 20; x += 7) {
        target.push({ x, y });
      }
    }

    for (let i = 0; i < target.length; i++) {
      particles.push({
        x: Math.random() * width,
        y: -Math.random() * 200,
        tx: target[i].x + (Math.random() - 0.5) * 4,
        ty: target[i].y + (Math.random() - 0.5) * 4,
        vx: 0,
        vy: 0,
      });
    }

    let start = performance.now();
    let completed = false;

    const animate = (time) => {
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
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,220,220,0.8)";
        ctx.fill();
      });

      if (!completed && time - start > 3500) {
        completed = true;
        onComplete && onComplete();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <div className="particle-wrapper">
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      <div className="paper-overlay"></div>
    </div>
  );
}

export default ParticleAnimation;