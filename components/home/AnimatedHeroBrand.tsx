import Image from "next/image";
import styles from "./AnimatedHeroBrand.module.css";

type AnimatedHeroBrandProps = {
  className?: string;
};

export function AnimatedHeroBrand({ className }: AnimatedHeroBrandProps) {
  return (
    <div className={[styles.brand, className].filter(Boolean).join(" ")}>
      <Image
        alt="短剧 Agent"
        className={styles.compositeImage}
        height={120}
        priority
        src="/home/hero-title-composite.svg"
        width={343}
      />
    </div>
  );
}
