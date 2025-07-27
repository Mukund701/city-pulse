// apps/web/src/components/ui/particles-background.tsx
'use client';

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";

const ParticlesBackground = ({ children }: { children: React.ReactNode }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      const { loadFull } = await import("tsparticles");
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles loaded", container);
  };

  // =================================================================
  // ========= UPDATED: Options from your portfolio script ===========
  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 150,
            links: {
              opacity: 1,
            },
          },
        },
      },
      particles: {
        color: {
          value: "#00f7ff", // Cyan color
        },
        links: {
          color: "#00f7ff", // Cyan color
          distance: 150,
          enable: true,
          opacity: 0.1, // Very subtle links
          width: 1,
        },
        move: {
          enable: true,
          speed: 1, // Gentle drifting speed
        },
        number: {
          value: 80,
          density: {
            enable: true,
            area: 800,
          },
        },
        opacity: {
          value: 0.2, // Subtle particles
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      detectRetina: true,
    }),
    [],
  );
  // =================================================================

  if (init) {
    return (
      <div className="relative">
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="fixed top-0 left-0 w-full h-full z-[-1]"
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
};

export default ParticlesBackground;