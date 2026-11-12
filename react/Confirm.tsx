import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

export type ConfirmOpts = {
  title?: string;
  ok?: string;
  cancel?: string;
  // A destructive question: OK is red and the focus starts on Cancel.
  danger?: boolean;
};

// useConfirm replaces window.confirm with a dialog.modal.wide.
//   const [confirm, confirmDialog] = useConfirm({ ok: "Ja", cancel: "Nej" });
//   ...
//   if (!(await confirm("Slet serveren?", { danger: true }))) return;
//   ...
//   return <>{page}{confirmDialog}</>;
// Render the dialog element once per page (or once in the app shell).
export function useConfirm(
  defaults?: ConfirmOpts,
): [(message: string, opts?: ConfirmOpts) => Promise<boolean>, ReactNode] {
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((yes: boolean) => void) | null>(null);
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;
  const [state, setState] = useState<ConfirmOpts & { message: string }>({ message: "" });

  const confirm = useCallback((message: string, opts?: ConfirmOpts) => {
    setState({ ...defaultsRef.current, ...opts, message });
    return new Promise<boolean>((resolve) => {
      resolver.current?.(false);
      resolver.current = resolve;
      const d = ref.current;
      if (d && !d.open) d.showModal();
    });
  }, []);

  function onClose() {
    const d = ref.current;
    const yes = d?.returnValue === "ok";
    if (d) d.returnValue = "";
    resolver.current?.(yes);
    resolver.current = null;
  }

  const dialog = (
    <dialog ref={ref} className="modal wide" onClose={onClose}>
      <h2>{state.title ?? "Are you sure?"}</h2>
      <p className="ds-confirm-msg">{state.message}</p>
      <form method="dialog" className="row end">
        <button type="submit" className="btn ghost" value="cancel" autoFocus={state.danger}>
          {state.cancel ?? "Cancel"}
        </button>
        <button type="submit" className={state.danger ? "btn danger" : "btn primary"} value="ok" autoFocus={!state.danger}>
          {state.ok ?? "OK"}
        </button>
      </form>
    </dialog>
  );
  return [confirm, dialog];
}
