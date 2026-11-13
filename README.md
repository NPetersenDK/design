# design

One plain stylesheet (`design.css`), one tiny script (`design.js`), a handful of React snippets (`react/`) and one HTML gallery (`index.html`). No npm, no build step. Open `index.html` by double-click to see every component, switch theme and try accent colours live.

## Themes

Set on the root element. Dark only.

```html
<html lang="en" data-theme="esb">   <!-- or "blue" or "gray" -->
```

`esb` (red) for eSportBrande apps, `gray` or `blue` for the NPetersen apps.

## Install

Copy `design.css` into the app and link it before the app's own CSS. Do not edit the copy.

| App type | Install path | How |
|---|---|---|
| React (Vite) | `web/public/design.css` | `<link rel="stylesheet" href="/design.css">` in `web/index.html`, after Font Awesome and before Vite's own bundle. Vite copies `public/` into `dist/`, so the Go BFF serves the same file to the access denied page |
| Go-served `web/` app | `web/design.css` (+ `web/design.js`) | `//go:embed web/design.css`, served at `/design.css` or `{{BASE}}/design.css`; `<link href="/design.css" rel="stylesheet">` before the app stylesheet, `<script src="/design.js">` before the app script |

Install from a tag:

```
curl -o <install path> https://raw.githubusercontent.com/NPetersenDK/design/v1.6.0/design.css
curl -o <install path> https://raw.githubusercontent.com/NPetersenDK/design/v1.6.0/design.js
```

React apps copy the files they need from `react/` into `web/src/design/` the same way (see `react/README.md`).

## design.js

| Function | Does |
|---|---|
| `dsToast(message, kind)` | toast bottom right; kind is `ok`, `warn`, `err` or `info` |
| `dsError(message, title)` | error popup (native dialog), Esc or OK closes it |
| `dsConfirm(message, { title, ok, cancel, danger })` | question popup; resolves `true` for OK, `false` for Cancel or Esc. `danger: true` makes OK red and starts the focus on Cancel. Use it instead of `window.confirm` |
| `dsPrompt(message, { title, ok, cancel, value, type, placeholder })` | one-input popup; resolves the text for OK, `null` for Cancel or Esc. Use it instead of `window.prompt` |
| `dsTabs(root)` | tab switching: `.tab[data-tab="x"]` shows `[data-panel="x"]` and hides the other panels |
| `dsRowClick(tbody, handler)` | row click for `tr.clickable`, ignores clicks on links, buttons and inputs |
| `dsFieldError(el, message, where)` | inline error next to a field; empty message clears it |

## Everyday rules

1. Change the gallery or add a mockup before changing an app.
2. CSS used by one app stays in that app.
3. CSS needed by two or more apps moves to `design.css`, with a new tag.
4. Apps update by choice, by changing the tag in the curl command.
5. App CSS adds classes. It never restyles a design selector (`.stat-value`, `.note code`, `.table td` and so on). Need it different: change the design.
6. Before an app release, run `tools/audit.sh <app-dir>` and clear what it lists.

## Writing rules

- Headings are `h1` to `h3` only. A fourth level is a bold line in a paragraph.
- No em or en dashes in UI text (`–`, `—`). Use ` - `, a colon, or rewrite. An empty value is `-`. A score is `16-14`.
- No emoji as icons. Font Awesome only.
- Colours mean status (`ok`, `warn`, `err`, `info`). The theme colour is for things you click or select. The brand icon in the topbar has no colour of its own.
- Lines (borders, rings, active tab) use `--accent-edge`, never `--accent`. Text in the theme colour uses `--link`.
- No inline `style=` except a value the app computes at runtime (a progress width, a meter level, a colour the user picked).

## Layout helpers

- `.row`, `.row.wrap`, `.stack`, `.toolbar` as before. Modifiers: `.end` (right-aligned), `.center`, `.between` (space-between), `.tight` (smaller gap).
- `.grid2`, `.grid3`, `.grid4`, and `.grid-auto` for as many columns as fit. The app sets the minimum in its own class: `.station-grid { --min: 280px; }`.
- `.truncate` for one-line text with an ellipsis, `.stale` for data that is no longer current, `.empty` (or `td.empty`) when a list or table has nothing to show.
- `hr` is a plain rule; the surrounding `.stack` or `.card` spaces it.
- `code` and `kbd` are small mono chips. In a `.note` a `code` stays in the running text; in a `.log` it is plain.

## Buttons and controls

- `.btn`, `.primary`, `.danger`, `.ghost`, `.sm`, `.block`. `.on` for a toggle that is switched on. `.icon` for a square icon-only button.
- `.btn.choice` is the big choice button: optional `<i>` icon, `<b>` title, `.choice-hint` line. Put several in a `.choice-grid` (`.compact` for many small ones).
- `.segmented` is a group of exclusive buttons in one frame; `.on` marks the chosen one; `.sm` for narrow segments such as a 1 to 10 rating.
- `.item` is a selectable row (pickers, search results, station lists): inset surface, edge on hover, `.on` when chosen. A button, a link or a div.
- `input.search` is the toolbar search field (220px, full width on a phone).
- `.tab:disabled` for a tab that is not available right now.

## Badges

`<span class="badge ok">` and the variants: `ok` (live, success), `warn` (attention), `err` (failed), `info` (neutral highlight), `accent` (tags: groups, games, sources, in the theme colour), `muted` (idle or done). Plain `.badge` is a neutral outline. `.badge.live` pulses for something happening right now (recording, on air).

Old badge names (intranet, ct-logs) map as: green to ok, yellow to warn, red to err, blue to info, gray to muted, accent to accent.

A badge that links somewhere is `<a class="badge">`, one that does something is `<button class="badge">`. The edge lights up on hover.

## Small helpers

- `ul.list`: a plain list, no bullets or indent.
- `dl.kv` and `.kv`: key and value, as a two column list or as one row.
- `.stat` tiles in a `.row.wrap.statrow`; `.stat.sm`; `.stat-value.ok` or `.err` when the number is a status in itself.
- `.progress` + `.progress-fill`: a thin bar filled from the left. `.meter` + `.meter-cover`: an audio level; the app sets `--lvl` (0 to 100) on the meter.
- A label with badges on one line: `<div class="toolbar"><span class="muted small">Label</span>...badges</div>`. A heading above a row gets the full `.stack` gap.
- `--team-a` and `--team-b`: the two sides of a match.
- `.login` centres itself. On a page of its own, wrap it in `.center`.
- `.modal`, `.modal.wide` (text, left-aligned), `.modal.lg` (details, search: 760px, scrolls inside). Button rows in a dialog are `<form method="dialog" class="row end">`.

## Topbar and footer

Topbar: `.brand` (text or logo, no colour on the icon), `.nav`, `.spacer`, then status badges and buttons in a `.toolbar.end`. The version does not go in the topbar; it lives in the footer.

Footer, `<footer class="footer muted">`:

- NPetersen apps: `A project by NPetersen - <a><i class="fa-brands fa-github"></i> NPetersenDK</a> - <a>nipetersen.dk</a> - <a><i class="fa-brands fa-twitch"></i> NPetersen</a> - <span id="versionBadge">v1.2.0</span>` (the version always goes last in the footer, where the app has one).
- eSportBrande apps (intranet): `Site created with <i class="fa-regular fa-heart"></i> by eSport Brande and Nikolaj Petersen (npetersen on Discord)` and the GitHub line, then the version as ` - <span id="versionBadge">v1.2.0</span>` last.

## Access denied page

`mockups/shared/denied.html` is the page an app shows when the login worked but the user has no role. `<main class="card denied">` inside `.center`, the claims in a `.log > dl`, the links to try again or log out below. Keep each app's own template fields; only the markup and the text change.

## Audit

```
tools/audit.sh ../netdc/tv-streamer
```

Lists the vendored design version, inline styles, `h4` to `h6`, hex colours, dashes and emoji, `--accent` used as a line, design selectors restyled in app CSS, dead app classes and classes that nothing defines. Plain bash and grep.
