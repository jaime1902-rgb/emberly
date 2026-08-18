import { cn } from "@/lib/utils";

const STREAK_LENGTHS = [30, 24, 19, 15, 11, 8, 5];

function Streaks({
  cx,
  tipX,
  spread,
}: {
  cx: number;
  tipX: number;
  spread: number;
}) {
  return (
    <>
      {STREAK_LENGTHS.map((len, i) => {
        const y = cx - spread / 2 + (spread / (STREAK_LENGTHS.length - 1)) * i;
        const x0 = tipX - len * 7;
        const tipPointX = tipX - (STREAK_LENGTHS.length - 1 - i) * 2;
        const points = `${x0},${y - 1.6} ${tipPointX},${y} ${x0},${y + 1.6}`;
        return (
          <polygon
            key={i}
            points={points}
            fill="var(--accent-strong)"
            opacity={(0.35 + i * 0.09).toFixed(2)}
          />
        );
      })}
    </>
  );
}

/** Emberly logomark: a galloping horse head built from motion-streak lines. */
export function EmberlyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(className)}
    >
      <Streaks cx={24} tipX={46} spread={40} />
      <polygon
        points="36,8 40,2 42,9 58,20 50,26 38,25 30,18 30,10"
        fill="var(--foreground)"
      />
      <circle cx="52" cy="17" r="1.3" fill="var(--background)" />
    </svg>
  );
}
