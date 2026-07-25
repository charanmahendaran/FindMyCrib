import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./CompareScene.css";

function AmbientPlane({
  position,
  rotation,
  scale,
  color,
  opacity,
}) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * 0.15) * 0.08;

    ref.current.rotation.z =
      rotation[2] +
      Math.sin(state.clock.elapsedTime * 0.08) * 0.01;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const group = useRef();

  const particles = React.useMemo(() => {
    const temp = [];

    for (let i = 0; i < 18; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        scale: Math.random() * 0.04 + 0.01,
      });
    }

    return temp;
  }, []);

  useFrame(() => {
    group.current.rotation.y += 0.0003;
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale, 8, 8]} />

          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      {/* LIGHTING */}
      <ambientLight intensity={0.35} />

      <directionalLight
        position={[4, 5, 3]}
        intensity={0.6}
        color="#67e8f9"
      />

      {/* LEFT SOFT PANEL */}
      <AmbientPlane
        position={[-5, 0, -6]}
        rotation={[0, 0.25, -0.08]}
        scale={[6, 10, 1]}
        color="#164e63"
        opacity={0.05}
      />

      {/* RIGHT DEPTH PANEL */}
      <AmbientPlane
        position={[7, 0, -8]}
        rotation={[0, -0.3, 0.05]}
        scale={[8, 14, 1]}
        color="#0f766e"
        opacity={0.04}
      />

      {/* CENTER LIGHT HAZE */}
      <AmbientPlane
        position={[2, -1, -10]}
        rotation={[0, 0, 0]}
        scale={[12, 8, 1]}
        color="#082f49"
        opacity={0.03}
      />

      {/* PARTICLES */}
      <FloatingParticles />
    </>
  );
}

export default function CompareScene() {
  return (
    <div className="compare-scene-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <fog attach="fog" args={["#000000", 8, 22]} />

        <SceneContent />
      </Canvas>
    </div>
  );
}