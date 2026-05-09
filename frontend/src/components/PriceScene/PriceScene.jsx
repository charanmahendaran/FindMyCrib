import { Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

import FloatingObjects from "./FloatingObjects";
import ParticleField from "./ParticleField";
import AnimatedFog from "./AnimatedFog";

import "./PriceScene.css";

export default function PriceScene({ risk = "low" }) {
    // 🔥 Progressive cinematic loading
    const [showAtmosphere, setShowAtmosphere] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const [showObjects, setShowObjects] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => {
            setShowAtmosphere(true);
        }, 350);

        const t2 = setTimeout(() => {
            setShowParticles(true);
        }, 900);

        const t3 = setTimeout(() => {
            setShowObjects(true);
        }, 1500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    // 🔥 Risk colors
    const colors = {
        low: "#14b8a6",
        medium: "#f59e0b",
        high: "#ef4444",
    };

    // 🔥 Background tones
    const bgColor =
        risk === "high"
            ? "#090404"
            : risk === "medium"
                ? "#0f0a03"
                : "#031010";

    return (
        <div className="price-scene-wrapper">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
            >
                {/* BACKGROUND */}
                <color attach="background" args={[bgColor]} />

                <fog attach="fog" args={[bgColor, 10, 24]} />

                {/* LIGHTING */}
                <ambientLight intensity={0.35} />

                <directionalLight
                    position={[4, 4, 4]}
                    intensity={1}
                    color={colors[risk]}
                />

                <pointLight
                    position={[-4, -2, 2]}
                    intensity={1.2}
                    color={colors[risk]}
                />

                <Float
                    speed={0.4}
                    rotationIntensity={0.08}
                    floatIntensity={0.12}
                >
                    {showAtmosphere && (
                        <AnimatedFog risk={risk} />
                    )}

                    {showParticles && (
                        <ParticleField risk={risk} />
                    )}

                    {showObjects && (
                        <FloatingObjects risk={risk} />
                    )}
                </Float>
            </Canvas>
        </div>
    );
}