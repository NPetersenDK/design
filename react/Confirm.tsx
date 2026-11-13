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

export type PromptOpts = {
  title?: string;
  ok?: string;
  cancel?: string;
  value?: string;
  type?: "text" | "password" | "number";
  placeholder?: string;
};

// usePrompt replaces window.prompt with a dialog.modal.wide holding one input.
//   const [prompt, promptDialog] = usePrompt();
//   const name = await prompt("Folder name", { title: "New folder" });
//   if (name === null) return; // Cancel or Esc
// Render the dialog element once per page.
export function usePrompt(
  defaults?: PromptOpts,
): [(message: string, opts?: PromptOpts) => Promise<string | null>, ReactNode] {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolver = useRef<((value: string | null) => void) | null>(null);
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;
  const [state, setState] = useState<PromptOpts & { message: string }>({ message: "" });
  const [value, setValue] = useState("");

  const prompt = useCallback((message: string, opts?: PromptOpts) => {
    const o = { ...defaultsRef.current, ...opts, message };
    setState(o);
    setValue(o.value ?? "");
    return new Promise<string | null>((resolve) => {
      resolver.current?.(null);
      resolver.current = resolve;
      const d = ref.current;
      if (d && !d.open) d.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    });
  }, []);

  function onClose() {
    const d = ref.current;
    const yes = d?.returnValue === "ok";
    if (d) d.returnValue = "";
    resolver.current?.(yes ? (inputRef.current?.value ?? "") : null);
    resolver.current = null;
  }

  const dialog = (
    <dialog ref={ref} className="modal wide" onClose={onClose}>
      <h2>{state.title ?? "Enter a value"}</h2>
      <form method="dialog" className="stack tight">
        <label>
          {state.message}
          <input
            ref={inputRef}
            type={state.type ?? "text"}
            placeholder={state.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <div className="row end">
          <button type="submit" className="btn ghost" value="cancel" formNoValidate>
            {state.cancel ?? "Cancel"}
          </button>
          <button type="submit" className="btn primary" value="ok">
            {state.ok ?? "OK"}
          </button>
        </div>
      </form>
    </dialog>
  );
  return [prompt, dialog];
}
