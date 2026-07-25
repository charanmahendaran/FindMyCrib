import { MeshDistortMaterial } from "@react-three/drei";

export default function AnimatedFog({ risk }) {
  const color =
    risk === "high"
      ? "#451010"
      : risk === "medium"
      ? "#4a2f09"
      : "#062f2f";

  return (
    <mesh position={[0, 0, -8]} scale={14}>
      <planeGeometry args={[1, 1]} />

      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.18}
        distort={0.2}
        speed={0.3}
      />
    </mesh>
  );
}