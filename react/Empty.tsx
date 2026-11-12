import type { ReactNode } from "react";

// Empty is the line shown when a list or table has nothing in it. With cols it is a
// table row spanning the table.
export function Empty({ cols, children }: { cols?: number; children: ReactNode }) {
  if (cols) {
    return (
      <tr>
        <td className="empty" colSpan={cols}>
          {children}
        </td>
      </tr>
    );
  }
  return <div className="empty">{children}</div>;
}
