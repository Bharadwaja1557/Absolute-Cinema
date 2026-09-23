# Absolute Cinema — reboot

A clean rebuild of the site. Same data, same poster pipeline, far less noise.

Preview from the repo root:

    python3 -m http.server
    # then open http://localhost:8000/reboot/

## Layout

1. **Opening** — the hero, restored. Wordmark, tagline, three counts, and the
   last film you saw. The backdrop is the newest poster blurred into a wash of
   its own colour; it fades in once and then holds still.
2. **Toolbar** — sticky. Search, year, language, sort, clear.
3. **Gallery** — posters grouped by the year you watched them. Each card shows
   the title and the date, nothing else.
4. **Statistics** — at the bottom. Headline numbers, then a breakdown by
   language and by year. The bars are drawn at their final width.

## Animation

There is none. The old build had thirteen moving parts: a looping film-grain
overlay, a pulsing nav dot, a 26-second drifting hero backdrop, a bobbing
scroll arrow, a 3D-tilted hero poster, hover glow bloom behind every card,
poster zoom on hover, a sliding "View ⤢" overlay, staggered scroll-reveal,
a modal entrance transition, a close button that spun 90°, growing bar charts,
and a spinner. `@keyframes` count is now zero. What remains is a 150ms colour
fade on things you can click, and the hero backdrop's single fade-in.

## Typeface

Geist for text, Geist Mono for dates, seat numbers and counts — the mono gives
the archive a ticket-stub feel without any decoration. Money is set in Geist
rather than Geist Mono, because the mono comma takes a full character width
and makes "3,599" read as "3 , 599".

Replaces Fraunces + Inter + Space Mono. The palette is neutral near-black with
no accent colour; the posters supply all the colour.

## New fields

All four are optional — leave them out and nothing changes. Add them to any
entry in `data/movies.js`:

```json
{
  "title": "Spider-Man: Brand New Day",
  "year": 2026,
  "watchedDate": "2026-07-30",
  "language": "English",
  "format": "4DX",
  "theatre": "PVR SUPERPLEX",
  "city": "Lucknow",
  "poster": "Spiderman_Brand_New_Day_2026.webp",

  "price": 320,
  "screen": "3",
  "seat": "H12",
  "note": "First 4DX of the year. Worth the extra, probably not twice."
}
```

| Field    | Shows up as                                                      |
|----------|------------------------------------------------------------------|
| `price`  | "Ticket ₹320" in the detail panel, and feeds **Total spent** and **Average ticket** in the statistics |
| `screen` | Bare numbers get "Screen" prefixed, so `"3"` reads *Screen 3*. Anything else is printed as written, so `"Audi 2"` stays *Audi 2* |
| `seat`   | Joined onto the screen line: *Screen 3 · Seat H12*               |
| `note`   | A quoted block under the facts. Also searchable                  |

Total spent only counts films where you filled in a price, and says so
("across 14 of 59 tickets") until every film has one. The old site ignores
these fields, so adding them breaks nothing while both versions exist.

## Adding a poster

`tools/webp.sh` replaces the online converters. It needs `cwebp`, which you
already have (`brew install webp` otherwise).

    ./tools/webp.sh -t "Kantara: Chapter 1" -y 2025 -l Kannada ~/Downloads/poster.jpg

It converts, resizes to 600px wide, strips metadata, writes to
`posters/<language>/<Title>_<year>.webp`, and prints the `data/movies.js`
entry with the filename already filled in. A ~1 MB JPG lands around 75 KB.

Then upload that file to the GitHub release tagged with the language, and
paste the printed block into `data/movies.js`.

Options: `-q` quality (default 82), `-w` max width (default 600), `-o` to
override the filename. The generated name follows the archive's convention —
`&` becomes "and", punctuation is dropped, spaces become underscores — except
that hyphens become underscores too, so "Spider-Man" gives `Spider_Man`
rather than the existing `Spiderman`. Use `-o` when you want to match an
older name exactly.

## Note

`index.html` loads `../data/movies.js`, so there is one copy of the data. If
this folder is promoted to the repo root, change that path to
`data/movies.js`.
