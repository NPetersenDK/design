// Sortable table headers following the table standard: <th class="sort"> with aria-sort
// and a Font Awesome arrow, the whole cell clickable, not a Tab stop on purpose.
import { useState } from "react";
import type { ReactNode } from "react";

export type SortDir = "asc" | "desc";
export type SortState<K extends string> = { key: K; dir: SortDir };

// A Sorter is the active column and a way to change it. useSort gives one for
// client-side tables; a server-side table builds one from its own state:
//   const s: Sorter<F> = { sort: { key: field, dir }, toggle: (k) => setField(k) };
export type Sorter<K extends string> = {
  sort: SortState<K>;
  toggle: (key: K, firstDir?: SortDir) => void;
};

// useSort keeps the active column. Clicking another column starts in `firstDir`
// (numbers usually want "desc"); clicking the active one flips the direction.
export function useSort<K extends string>(key: K, dir: SortDir = "asc"): Sorter<K> {
  const [sort, setSort] = useState<SortState<K>>({ key, dir });
  const toggle = (k: K, firstDir: SortDir = "asc") =>
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: firstDir }));
  return { sort, toggle };
}

// sortRows returns a sorted copy; strings compare in the given locale, ties keep
// their incoming order.
export function sortRows<T, K extends string>(
  rows: T[],
  s: SortState<K>,
  get: Record<K, (row: T) => string | number>,
  locale = "da",
): T[] {
  const f = get[s.key];
  const m = s.dir === "asc" ? 1 : -1;
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const x = f(a.r);
      const y = f(b.r);
      const c = typeof x === "string" && typeof y === "string" ? x.localeCompare(y, locale) : Number(x) - Number(y);
      return c * m || a.i - b.i;
    })
    .map((e) => e.r);
}

export function SortTh<K extends string>({
  s,
  k,
  num,
  first,
  className,
  children,
}: {
  s: Sorter<K>;
  k: K;
  num?: boolean;
  first?: SortDir;
  className?: string;
  children: ReactNode;
}) {
  const on = s.sort.key === k;
  const icon = on ? (s.sort.dir === "asc" ? "fa-solid fa-arrow-up" : "fa-solid fa-arrow-down") : "fa-solid fa-sort";
  const cls = ["sort", num ? "num" : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <th
      className={cls}
      aria-sort={on ? (s.sort.dir === "asc" ? "ascending" : "descending") : "none"}
      onClick={() => s.toggle(k, first ?? (num ? "desc" : "asc"))}
    >
      {children}
      <i className={icon} aria-hidden="true" />
    </th>
  );
}
