import type { ReactNode } from "react";

// Stat is one number tile in a .row.wrap.statrow. tone colours the number when it is a
// status in itself (a win rate in ok, a negative balance in err).
export function Stat({
  label,
  value,
  sub,
  tone,
  sm,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "ok" | "err";
  sm?: boolean;
}) {
  return (
    <div className={sm ? "stat sm" : "stat"}>
      <div className={tone ? `stat-value ${tone}` : "stat-value"}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub != null && <div className="muted small">{sub}</div>}
    </div>
  );
}
