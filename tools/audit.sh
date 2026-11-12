#!/usr/bin/env bash
# audit.sh: check one app against the design language. Prints what to look at; it
# changes nothing and always exits 0.
#
#   tools/audit.sh ../netdc/tv-streamer
#
# Sources are *.tsx, *.html and *.js outside node_modules, dist, web/public and the
# vendored design files. App CSS is every *.css that is not design.css.
set -u
app="${1:?usage: tools/audit.sh <app-dir>}"
here="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

find "$app" -type f \( -name '*.tsx' -o -name '*.html' -o -name '*.js' \) \
  -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.git/*' \
  -not -path '*/web/public/*' -not -path '*/bitfocus/*' -not -name 'design.js' -not -name '*.min.js' \
  > "$tmp/src"
find "$app" -type f -name '*.css' -not -name 'design.css' \
  -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.git/*' -not -path '*/web/public/*' \
  > "$tmp/css"

section() { printf '\n== %s\n' "$1"; }
clip() { cut -c1-160; }

section "design.css"
echo "repo:     $(head -1 "$here/design.css")"
for f in $(find "$app" -name design.css -not -path '*/node_modules/*' -not -path '*/dist/*'); do
  if cmp -s "$f" "$here/design.css"; then same="same as repo"; else same="DIFFERS from repo"; fi
  echo "vendored: $(head -1 "$f")  $f  ($same)"
done
for f in $(find "$app" -name design.js -not -path '*/node_modules/*' -not -path '*/dist/*'); do
  if cmp -s "$f" "$here/design.js"; then same="same as repo"; else same="DIFFERS from repo"; fi
  echo "vendored: $(head -1 "$f")  $f  ($same)"
done

section "inline styles (only runtime values are allowed)"
xargs grep -nE 'style=\{\{|style="' < "$tmp/src" 2>/dev/null | clip

section "h4 to h6 (headings stop at h3)"
xargs grep -nE '<h[4-6][ >]' < "$tmp/src" 2>/dev/null | clip

section "hex colours in markup and app css (use tokens)"
cat "$tmp/src" "$tmp/css" | xargs grep -nE '#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b' 2>/dev/null | grep -vE '#(fff|000|FFF)\b' | grep -vE '&#[0-9]+;|href="#|to="#|\$\{' | clip

section "dashes and emoji in UI text"
xargs grep -nE '–|—|▶|■|📖|💾|⚠|✅|❌|🔴|🟢|🟡|⭐|🎉|🔥|🎵|🔊|🔇' < "$tmp/src" 2>/dev/null | clip

section "--accent used as a line (use --accent-edge) or as text (use --link)"
xargs grep -nE '(border|box-shadow|outline|color)[^;{]*var\(--accent\)' < "$tmp/css" 2>/dev/null | grep -vE 'background|accent-edge|accent-soft' | clip

section "design selectors restyled in app css (rule 5)"
grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*' "$here/design.css" | sort -u > "$tmp/design_classes"
while IFS= read -r cssfile; do
  grep -nE '^[^ /@}][^{]*\{' "$cssfile" | while IFS= read -r line; do
    sel="${line#*:}"; sel="${sel%%\{*}"
    classes=$(echo "$sel" | grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*' | sort -u)
    [ -z "$classes" ] && continue
    own=0
    for c in $classes; do grep -qx "$c" "$tmp/design_classes" || own=1; done
    [ $own -eq 0 ] && echo "$cssfile:${line%%:*}: $sel"
  done
done < "$tmp/css"

section "dead app classes (defined in app css, used nowhere)"
while IFS= read -r cssfile; do
  for c in $(grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*' "$cssfile" | sort -u | sed 's/^\.//' | grep -vE '^[0-9]'); do
    xargs grep -qE "\b$c\b" < "$tmp/src" 2>/dev/null || echo "$cssfile: .$c"
  done
done < "$tmp/css"

section "classes nothing defines (typos, removed classes; JS hooks listed apart)"
cat "$tmp/css" | xargs cat 2>/dev/null | grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*' | sed 's/^\.//' > "$tmp/app_classes"
sed 's/^\.//' "$tmp/design_classes" >> "$tmp/app_classes"
sort -u "$tmp/app_classes" -o "$tmp/app_classes"
# Classes a script reaches for (querySelector, closest, matches, getElementsByClassName)
# are hooks, not styling; they are reported on their own line.
xargs grep -ohE '(querySelector(All)?|closest|matches|getElementsByClassName)\([^)]*\)' < "$tmp/src" 2>/dev/null \
  | grep -oE '\.[a-zA-Z_][a-zA-Z0-9_-]*|getElementsByClassName\([^)]*' | sed -E 's/^\.//; s/getElementsByClassName\(["'"'"']//' | sort -u > "$tmp/hooks"
xargs grep -ohE 'class(Name)?="[^"$`{]*"' < "$tmp/src" 2>/dev/null | sed -E 's/class(Name)?="//; s/"$//' | tr ' ' '\n' \
  | grep -E '^[a-zA-Z_][a-zA-Z0-9_-]*$' | grep -vE '^(fa|fa-|fab|far|fas|js-)$|^fa-' | sort -u > "$tmp/used"
undefined=""; hooks=""
while IFS= read -r c; do
  grep -qx "$c" "$tmp/app_classes" && continue
  if grep -qx "$c" "$tmp/hooks"; then hooks="$hooks $c"; else undefined="$undefined $c"; fi
done < "$tmp/used"
echo "undefined:${undefined:- none}"
echo "js hooks: ${hooks:- none}"
