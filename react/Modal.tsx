import type { ReactNode } from "react";

// Modal is a centered dialog over a dimmed overlay; only its own buttons close it.
// className="wide" for text-heavy dialogs, "lg" for details that scroll.
export function Modal({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className="modal-overlay">
      <div className={`modal${className ? " " + className : ""}`}>{children}</div>
    </div>
  );
}
