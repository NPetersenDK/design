import type { ReactNode } from "react";

// Pager is Previous, "page / pages" and Next under a paged table. Nothing is rendered
// for a single page.
export function Pager({
  page,
  pageSize,
  total,
  onPage,
  prev = "Previous",
  next = "Next",
  status,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  prev?: string;
  next?: string;
  status?: (page: number, pages: number, total: number) => ReactNode;
}) {
  const pages = Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));
  if (pages <= 1) return null;
  return (
    <div className="row center">
      <button type="button" className="btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        {prev}
      </button>
      <span className="muted">{status ? status(page, pages, total) : `${page} / ${pages}`}</span>
      <button type="button" className="btn sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        {next}
      </button>
    </div>
  );
}
