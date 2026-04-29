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
            value: 60,
            density: { enable: true, area: 800 },
          },

          color: {
            value: "#ffffff",
          },

          opacity: {
            value: 0.15,
          },

          size: {
            value: { min: 1, max: 3 },
          },

          links: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.08,
            width: 1,
          },

          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            outModes: "out",
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },

          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.2,
              },
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