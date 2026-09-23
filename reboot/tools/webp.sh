#!/usr/bin/env bash
#
# Absolute Cinema — poster converter
#
# Turns a jpg/png/jpeg into a correctly named .webp, drops it in the right
# language folder, and prints the JSON block to paste into data/movies.js.
# No upload tools, no websites.
#
#   ./tools/webp.sh -t "Spider-Man: Brand New Day" -y 2026 -l English ~/Downloads/poster.jpg
#
# Then upload the file it wrote to the GitHub release tagged with that
# language, and paste the printed block into data/movies.js.

set -euo pipefail

QUALITY=82
MAXWIDTH=600
TITLE="" YEAR="" LANG="" OUTNAME=""
OUTROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/posters"

usage() {
  cat <<'USAGE'
Usage: webp.sh -t TITLE -y YEAR -l LANGUAGE [options] IMAGE

Required:
  -t TITLE      Film title, e.g. "Kantara: Chapter 1"
  -y YEAR       Release year, e.g. 2025
  -l LANGUAGE   Telugu | English | Hindi | Tamil | Kannada

Options:
  -q QUALITY    webp quality 0-100 (default 82)
  -w WIDTH      max width in px, taller posters scale down (default 600)
  -o NAME       override the generated filename
  -h            this help

Converts to posters/<language>/<Title>_<year>.webp and prints the
data/movies.js entry.
USAGE
}

while getopts ":t:y:l:q:w:o:h" opt; do
  case $opt in
    t) TITLE=$OPTARG ;;
    y) YEAR=$OPTARG ;;
    l) LANG=$OPTARG ;;
    q) QUALITY=$OPTARG ;;
    w) MAXWIDTH=$OPTARG ;;
    o) OUTNAME=$OPTARG ;;
    h) usage; exit 0 ;;
    \?) echo "unknown option -$OPTARG" >&2; usage; exit 1 ;;
    :)  echo "-$OPTARG needs a value" >&2; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

SRC=${1:-}
[ -n "$SRC" ]   || { echo "error: no image given"   >&2; usage; exit 1; }
[ -f "$SRC" ]   || { echo "error: no such file: $SRC" >&2; exit 1; }
[ -n "$TITLE" ] || { echo "error: -t TITLE is required"    >&2; exit 1; }
[ -n "$YEAR"  ] || { echo "error: -y YEAR is required"     >&2; exit 1; }
[ -n "$LANG"  ] || { echo "error: -l LANGUAGE is required" >&2; exit 1; }

command -v cwebp >/dev/null 2>&1 || {
  echo "error: cwebp not found. Install it with:  brew install webp" >&2
  exit 1
}

# Filename, matching the convention already in the archive:
#   "&" becomes "and", ":" and other punctuation are dropped,
#   spaces and hyphens become underscores.
slug() {
  printf '%s' "$1" \
    | sed -e 's/&/ and /g' \
          -e "s/[:,.'\"!?()]//g" \
          -e 's/[-–—/]/ /g' \
    | tr -s ' ' '_' \
    | sed -e 's/^_//' -e 's/_$//'
}

LANG_TAG=$(printf '%s' "$LANG" | tr '[:upper:]' '[:lower:]')
FILE=${OUTNAME:-"$(slug "$TITLE")_${YEAR}.webp"}
DEST_DIR="$OUTROOT/$LANG_TAG"
DEST="$DEST_DIR/$FILE"

mkdir -p "$DEST_DIR"

# cwebp reads png/jpeg directly; anything else goes through sips to png first.
ext=$(printf '%s' "${SRC##*.}" | tr '[:upper:]' '[:lower:]')
INPUT=$SRC
TMP=""
case $ext in
  jpg|jpeg|png) ;;
  *)
    TMP=$(mktemp -t acposter).png
    sips -s format png "$SRC" --out "$TMP" >/dev/null
    INPUT=$TMP
    ;;
esac
trap '[ -n "$TMP" ] && rm -f "$TMP"' EXIT

before=$(wc -c < "$SRC" | tr -d ' ')

# -resize 0 H would fix height; we cap width and let height follow.
cwebp -quiet -q "$QUALITY" -resize "$MAXWIDTH" 0 -metadata none "$INPUT" -o "$DEST"

after=$(wc -c < "$DEST" | tr -d ' ')
dims=$(sips -g pixelWidth -g pixelHeight "$DEST" 2>/dev/null \
        | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{if(w)print w"x"h}')

printf '\n  wrote  %s\n' "$DEST"
printf '  size   %s KB -> %s KB  (%s, q%s)\n\n' \
  "$((before / 1024))" "$((after / 1024))" "${dims:-?}" "$QUALITY"

echo "  1. Upload that file to the GitHub release tagged: $LANG_TAG"
echo "  2. Paste this into data/movies.js, newest entry first:"
echo
cat <<JSON
  {
    "title": "$TITLE",
    "year": $YEAR,
    "watchedDate": "$(date +%Y-%m-%d)",
    "language": "$LANG",
    "format": "2D",
    "theatre": "",
    "city": "",
    "poster": "$FILE",
    "price": null,
    "screen": "",
    "seat": "",
    "note": ""
  },
JSON
echo
