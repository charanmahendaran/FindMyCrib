import { Float, MeshDistortMaterial } from "@react-three/drei";

function RiskObject({
  position,
  scale,
  color,
  distort,
}) {
  return (
    <Float
      speed={0.5}
      rotationIntensity={0.22}
      floatIntensity={0.9}
    >
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />

        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.16}
          roughness={0.18}
          metalness={0.7}
          distort={distort}
          speed={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingObjects({ risk }) {
  const config = {
    low: {
      color: "#14b8a6",
      distort: 0.18,
    },

    medium: {
      color: "#f59e0b",
      distort: 0.24,
    },

    high: {
      color: "#ef4444",
      distort: 0.32,
    },
  };

  const current = config[risk];

  return (
    <>
      <RiskObject
        position={[-4, 1.5, -3]}
        scale={1.2}
        color={current.color}
        distort={current.distort}
      />

      <RiskObject
        position={[3, -1, -4]}
        scale={1}
        color={current.color}
        distort={current.distort}
      />

      <RiskObject
        position={[2, 2, -5]}
        scale={1.6}
        color={current.color}
        distort={current.distort}
      />
    </>
  );
}