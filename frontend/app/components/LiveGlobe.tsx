import styles from "./LiveGlobe.module.css";

const LIGHTS: { left: number; top: number; delay: number }[] = [
  { left: 22, top: 18, delay: 0 },
  { left: 48, top: 12, delay: 0.3 },
  { left: 72, top: 22, delay: 0.6 },
  { left: 85, top: 38, delay: 0.9 },
  { left: 78, top: 58, delay: 0.2 },
  { left: 58, top: 72, delay: 0.5 },
  { left: 35, top: 78, delay: 0.8 },
  { left: 15, top: 62, delay: 0.1 },
  { left: 8, top: 42, delay: 0.4 },
  { left: 32, top: 32, delay: 0.7 },
  { left: 52, top: 28, delay: 0.15 },
  { left: 68, top: 42, delay: 0.45 },
  { left: 62, top: 58, delay: 0.75 },
  { left: 42, top: 52, delay: 0.25 },
  { left: 25, top: 48, delay: 0.55 },
  { left: 18, top: 28, delay: 0.85 },
  { left: 38, top: 8, delay: 0.35 },
  { left: 62, top: 8, delay: 0.65 },
  { left: 82, top: 28, delay: 0.95 },
  { left: 88, top: 52, delay: 0.2 },
  { left: 72, top: 68, delay: 0.5 },
  { left: 48, top: 82, delay: 0.8 },
  { left: 28, top: 68, delay: 0.1 },
  { left: 12, top: 52, delay: 0.4 },
  { left: 42, top: 42, delay: 0.7 },
  { left: 55, top: 48, delay: 0.05 },
  { left: 75, top: 35, delay: 0.38 },
  { left: 52, top: 62, delay: 0.72 },
  { left: 32, top: 58, delay: 0.12 },
  { left: 45, top: 18, delay: 0.42 },
  { left: 65, top: 55, delay: 0.58 },
  { left: 25, top: 38, delay: 0.88 },
  { left: 78, top: 48, delay: 0.22 },
  { left: 38, top: 72, delay: 0.52 },
  { left: 58, top: 38, delay: 0.82 },
  { left: 48, top: 52, delay: 0.18 },
  { left: 68, top: 62, delay: 0.48 },
  { left: 28, top: 22, delay: 0.78 },
  { left: 82, top: 62, delay: 0.28 },
  { left: 15, top: 72, delay: 0.62 },
  { left: 72, top: 18, delay: 0.92 },
  { left: 35, top: 12, delay: 0.08 },
  { left: 55, top: 72, delay: 0.35 },
  { left: 8, top: 32, delay: 0.68 },
  { left: 92, top: 48, delay: 0.98 },
  { left: 5, top: 58, delay: 0.15 },
  { left: 42, top: 28, delay: 0.55 },
  { left: 88, top: 18, delay: 0.85 },
];

export default function LiveGlobe() {
  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.scene}>
        <div className={styles.stars} />
        <div className={styles.planet}>
          <div className={styles.planetSurface} />
          <div className={styles.lights}>
            {LIGHTS.map(({ left, top, delay }, i) => (
              <span
                key={i}
                className={styles.light}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.dayNight} aria-hidden />
      </div>
    </div>
  );
}
