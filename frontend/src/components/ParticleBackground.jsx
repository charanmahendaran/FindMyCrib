import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },

        background: {
          color: "transparent",
        },

        fpsLimit: 60,

        particles: {
          number: {
            value: 55,  // balanced
          },

          opacity: {
            value: 0.3,  // 🔥 was too low before
          },

          size: {
            value: { min: 1.2, max: 3 },
          },

          links: {
            enable: true,
            opacity: 0.15,  // 🔥 visible but clean
          },

          move: {
            speed: 0.3,  // smooth
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: false, // 🔥 disable
            },
          },
        },

        detectRetina: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}

export default ParticleBackground;