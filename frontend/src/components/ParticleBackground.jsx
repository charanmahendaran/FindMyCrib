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
            density: {
              enable: true,
              area: 700, // 🔥 center bias
            },
          },

          color: {
            value: "#ffffff"// 🔥 white + green mix
          },

          opacity: {
            value: { min: 0.25, max: 0.55 },
            animation: {
              enable: true,
              speed: 0.6,     // 🔥 matches breathing rhythm
              minimumValue: 0.25,
              sync: true,     // 🔥 ALL particles pulse together
            },
          },

          size: {
            value: { min: 1, max: 2.5 },
          },

          move: {
            enable: true,
            speed: 0.45,
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },

          links: {
            enable: true,
            distance: 140,

            color: "#22c55e",

            opacity: 0.08,  // 🔥 VERY subtle base
            width: 1,

            shadow: {
              enable: true,
              color: "#22c55e",
              blur: 6,
            },

            triangles: {
              enable: true,
              opacity: 0.015,
            },

            twinkle: {
              lines: {
                enable: true,
                frequency: 0.02,
                opacity: 0.6,
                color: "#22c55e",
              },
              particles: {
                enable: true,
                frequency: 0.015,
                opacity: 1,
                color: "#22c55e",
              },
            },
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["grab", "repulse"],
            },
            resize: true,
          },

          modes: {
            grab: {
              distance: 160,

              links: {
                opacity: 0.35, // 🔥 visible but NOT full
              },
            },

            repulse: {
              distance: 90,
              duration: 0.35,
            },
          },
        },

        detectRetina: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
    />
  );
}

export default ParticleBackground;