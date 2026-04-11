"use client";

import { useCallback, useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import styles from "./UploadLottieIndicator.module.css";

type UploadStage = "idle" | "preview" | "uploading" | "complete";

type UploadLottieIndicatorProps = {
  stage: UploadStage;
  className?: string;
  onComplete?: () => void;
};

const PREVIEW_END_FRAME = 18;
const LAST_FRAME_OFFSET = 1;
const PREVIEW_SEGMENT_MS = 300;
const ANIMATION_FPS = 60;
const HOVER_EXIT_EASING = [0.01, 0.63, 0.25, 0.99] as const;

function cubicBezierAtTime(t: number, p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (time: number) => ((ax * time + bx) * time + cx) * time;
  const sampleCurveY = (time: number) => ((ay * time + by) * time + cy) * time;
  const sampleCurveDerivativeX = (time: number) => (3 * ax * time + 2 * bx) * time + cx;

  let x = t;

  for (let i = 0; i < 6; i += 1) {
    const derivative = sampleCurveDerivativeX(x);

    if (Math.abs(derivative) < 1e-6) {
      break;
    }

    const delta = sampleCurveX(x) - t;
    x -= delta / derivative;
  }

  x = Math.min(1, Math.max(0, x));

  return sampleCurveY(x);
}

export function UploadLottieIndicator({
  stage,
  className,
  onComplete,
}: UploadLottieIndicatorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const completionRef = useRef(onComplete);
  const stageRef = useRef<UploadStage>("idle");
  const currentFrameRef = useRef(0);
  const tweenRef = useRef<number | null>(null);

  const cancelTween = useCallback(() => {
    if (tweenRef.current !== null) {
      cancelAnimationFrame(tweenRef.current);
      tweenRef.current = null;
    }
  }, []);

  const setFrame = useCallback((frame: number) => {
    const animation = animationRef.current;

    if (!animation) {
      currentFrameRef.current = frame;
      return;
    }

    currentFrameRef.current = frame;
    animation.goToAndStop(frame, true);
  }, []);

  const animateToFrame = useCallback(
    ({
      from,
      to,
      duration,
      easing,
      onDone,
    }: {
      from: number;
      to: number;
      duration: number;
      easing?: (value: number) => number;
      onDone?: () => void;
    }) => {
      cancelTween();

      if (Math.abs(to - from) <= 0.5 || duration <= 0) {
        setFrame(to);
        onDone?.();
        return;
      }

      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const easedProgress = easing ? easing(progress) : progress;
        const frame = from + (to - from) * easedProgress;

        setFrame(frame);

        if (progress >= 1) {
          tweenRef.current = null;
          onDone?.();
          return;
        }

        tweenRef.current = requestAnimationFrame(tick);
      };

      tweenRef.current = requestAnimationFrame(tick);
    },
    [cancelTween, setFrame],
  );

  const applyStage = useCallback(
    (nextStage: UploadStage) => {
      const animation = animationRef.current;

      if (!animation) {
        stageRef.current = nextStage;
        return;
      }

      stageRef.current = nextStage;

      const finalFrame = Math.max(0, animation.totalFrames - LAST_FRAME_OFFSET);
      const currentFrame = currentFrameRef.current;

      if (nextStage === "complete") {
        cancelTween();
        setFrame(finalFrame);
        return;
      }

      if (nextStage === "idle") {
        const distance = Math.abs(currentFrame);
        const duration = (distance / PREVIEW_END_FRAME) * PREVIEW_SEGMENT_MS;

        animateToFrame({
          duration,
          easing: (value) =>
            cubicBezierAtTime(
              value,
              HOVER_EXIT_EASING[0],
              HOVER_EXIT_EASING[1],
              HOVER_EXIT_EASING[2],
              HOVER_EXIT_EASING[3],
            ),
          from: currentFrame,
          to: 0,
        });
        return;
      }

      if (nextStage === "preview") {
        const distance = Math.abs(PREVIEW_END_FRAME - currentFrame);
        const duration = (distance / PREVIEW_END_FRAME) * PREVIEW_SEGMENT_MS;

        animateToFrame({
          duration,
          from: currentFrame,
          to: PREVIEW_END_FRAME,
        });
        return;
      }

      const uploadStartFrame = Math.max(currentFrame, PREVIEW_END_FRAME);
      const uploadDuration = ((finalFrame - uploadStartFrame) / ANIMATION_FPS) * 1000;

      if (currentFrame < uploadStartFrame - 0.5) {
        setFrame(uploadStartFrame);
      }

      animateToFrame({
        duration: uploadDuration,
        from: uploadStartFrame,
        onDone: () => {
          if (stageRef.current === "uploading") {
            stageRef.current = "complete";
            completionRef.current?.();
          }
        },
        to: finalFrame,
      });
    },
    [animateToFrame, cancelTween, setFrame],
  );

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let mounted = true;

    const load = async () => {
      const response = await fetch("/home/upload-animation.json");
      const data = await response.json();

      if (!mounted || !containerRef.current) {
        return;
      }

      const animation = lottie.loadAnimation({
        animationData: data,
        autoplay: false,
        container: containerRef.current,
        loop: false,
        renderer: "svg",
      });

      animationRef.current = animation;
      currentFrameRef.current = 0;
      animation.goToAndStop(0, true);
      applyStage(stageRef.current);
    };

    load().catch(() => {
      // Keep the zone stable even if the animation cannot load.
    });

    return () => {
      mounted = false;
      cancelTween();
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [applyStage, cancelTween]);

  useEffect(() => {
    applyStage(stage);
  }, [applyStage, stage]);

  return (
    <div className={[styles.indicator, className].filter(Boolean).join(" ")}>
      <div className={styles.indicatorInner} ref={containerRef} />
    </div>
  );
}
