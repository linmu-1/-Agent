"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import styles from "./AnimatedHeroBrand.module.css";

type AnimatedHeroBrandProps = {
  className?: string;
};

const LAST_FRAME_OFFSET = 1;

export function AnimatedHeroBrand({ className }: AnimatedHeroBrandProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let mounted = true;

    const load = async () => {
      const response = await fetch("/home/hero-title-animation.json");
      const data = await response.json();

      if (!mounted || !containerRef.current) {
        return;
      }

      const animation = lottie.loadAnimation({
        animationData: data,
        autoplay: true,
        container: containerRef.current,
        loop: false,
        renderer: "svg",
      });

      const handleComplete = () => {
        const finalFrame = Math.max(0, animation.totalFrames - LAST_FRAME_OFFSET);
        animation.goToAndStop(finalFrame, true);
      };

      animation.addEventListener("complete", handleComplete);
      animationRef.current = animation;
    };

    load().catch(() => {
      // Keep the layout stable if the title animation cannot load.
    });

    return () => {
      mounted = false;
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div className={[styles.brand, className].filter(Boolean).join(" ")}>
      <div className={styles.animationLayer} ref={containerRef} />
    </div>
  );
}
