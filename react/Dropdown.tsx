import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

// Dropdown is a trigger button with a menu that closes on an outside click, Escape or a
// click inside the menu. The trigger is the accent profile button, a nav link with
// navStyle, or whatever className says.
export function Dropdown({
  label,
  navStyle = false,
  className,
  children,
}: {
  label: ReactNode;
  navStyle?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      className="dropdown"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={className ?? (navStyle ? "nav-dropdown-toggle" : "btn primary user-profile-button")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {label} <i className="fa-solid fa-caret-down" aria-hidden="true" />
      </button>
      {open && (
        <div className="dropdown-menu" id={menuId} role="menu" ref={menuRef} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
