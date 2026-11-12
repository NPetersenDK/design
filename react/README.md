# react

Reference components for the React apps. Copy the files you need into `web/src/design/` and import from there. Do not edit the copies; change them here and copy again, like `design.css`.

| File | Exports | Markup it renders |
|---|---|---|
| `Dropdown.tsx` | `Dropdown` | `.dropdown` with a `.user-profile-button` trigger (or `.nav-dropdown-toggle` with `navStyle`, or any `className`), `.dropdown-menu`; closes on outside click, Escape and a click inside |
| `SortTh.tsx` | `useSort`, `sortRows`, `SortTh`, types | `th.sort` with `aria-sort` and the Font Awesome arrow. `useSort(key, dir)` keeps the state for client-side tables; for server-side sorting build the `Sorter` from your own state |
| `Stat.tsx` | `Stat` | `.stat` tile with `.stat-value` and `.stat-label`; `sm`, `sub` and `tone` (`ok`, `err`) |
| `Modal.tsx` | `Modal` | `.modal-overlay` > `.modal` (`className="wide"` for text) |
| `Confirm.tsx` | `useConfirm`, `ConfirmOpts` | `dialog.modal.wide` with Cancel and OK. `const [confirm, confirmDialog] = useConfirm(); ... if (!(await confirm("Delete X?", { danger: true }))) return;` and render `{confirmDialog}` once |
| `Pager.tsx` | `Pager` | `.row.center` with Previous, "page / pages" and Next as `.btn.sm` |
| `Empty.tsx` | `Empty` | `.empty`, or `tr > td.empty` when `cols` is given |

All files depend on React only (and `react-router` nowhere). Font Awesome must be loaded by the page.
