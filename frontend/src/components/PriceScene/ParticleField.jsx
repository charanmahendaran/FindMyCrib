import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ParticleField({ risk }) {
  const points = useRef();

  const particles = useMemo(() => {
    const positions = [];

    for (let i = 0; i < 55; i++) {
      positions.push((Math.random() - 0.5) * 18);
      positions.push((Math.random() - 0.5) * 10);
      positions.push((Math.random() - 0.5) * 10);
    }

    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y =
        state.clock.elapsedTime * 0.01;
    }
  });

  const color =
    risk === "high"
      ? "#ef4444"
      : risk === "medium"
      ? "#f59e0b"
      : "#14b8a6";

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}