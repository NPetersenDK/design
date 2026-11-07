# design

One plain stylesheet (`design.css`), one tiny script (`design.js`) and one HTML gallery (`index.html`). No npm, no build step. Open `index.html` by double-click to see every component, switch theme and try accent colours live.

## Themes

Set on the root element. Dark only.

```html
<html lang="en" data-theme="esb">   <!-- or "blue" or "gray" -->
```

## Install

Copy `design.css` into the app and link it before the app's own CSS. Do not edit the copy.

| App type | Install path | How |
|---|---|---|
| React (Vite) | `src/design.css` | `import "./design.css";` before `./styles.css` in `src/main.tsx` |
| Go-served static | `static/design.css` | `<link rel="stylesheet" href="/static/design.css">` before the app stylesheet link |
| Plain `web/` app | `web/design.css` | `<link rel="stylesheet" href="design.css">`, and serve the file from the app |

Install from a tag (after the repo is published):

```
curl -o <install path> https://raw.githubusercontent.com/NPetersenDK/design/v1.5.0/design.css
```

Toasts need `design.js` (`dsToast(message, kind)`, kind is `ok`, `warn`, `err` or `info`). Copy it the same way.

## Everyday rules

1. Change the gallery or add a mockup before changing an app.
2. CSS used by one app stays in that app.
3. CSS needed by two or more apps moves to `design.css`, with a new tag.
4. Apps update by choice, by changing the tag in the curl command.

## Badges

`<span class="badge ok">` and the variants: `ok` (live, success), `warn` (attention), `err` (failed), `info` (neutral highlight), `accent` (tags: groups, games, sources, in the theme colour), `muted` (idle or done). Plain `.badge` is a neutral outline.

Old badge names (intranet, ct-logs) map as: green to ok, yellow to warn, red to err, blue to info, gray to muted, accent to accent.

A badge that links somewhere is `<a class="badge">`. Its edge lights up on hover.

## Small helpers

- `ul.list`: a plain list, no bullets or indent.
- `dl.kv` and `.kv`: key and value, as a two column list or as one row.
- A label with badges on one line: `<div class="toolbar"><span class="muted small">Label</span>...badges</div>`. A heading above a row gets the full `.stack` gap.
- `--team-a` and `--team-b`: the two sides of a match.
- `.login` centres itself. On a page of its own, wrap it in `.center`.
