# Absolute Cinema — reboot

A clean rebuild of the site. Same data, same poster pipeline, far less noise.

Preview it with any static server from the repo root, e.g.
`python3 -m http.server` then open `/reboot/`.

## What changed

**Animation removed.** The old build had thirteen moving parts: a looping
film-grain overlay, a pulsing nav dot, a 26-second drifting hero backdrop, a
bobbing scroll arrow, a 3D-tilted hero poster, hover glow bloom behind every
card, poster zoom on hover, a sliding "View ⤢" overlay, staggered
scroll-reveal on every card, a modal entrance transition, a close button that
spun 90°, growing bar charts, and a spinner. None of it survives. The only
motion left is a 150ms colour fade on things you can actually click.

**Features removed.** The full-viewport hero (backdrop, feature poster,
"Enter the archive" cue) and the "By the numbers" section with its language
and year bar charts. The three headline numbers now sit inline in the header.

**Kept.** Search, year filter, language filter, sort toggle, clear, films
grouped by year, and the detail panel.

## Design

One typeface (Inter) instead of three (Fraunces + Inter + Space Mono). A
neutral near-black palette with no accent colour — the posters supply all the
colour, and hierarchy comes from weight and opacity instead of gold. Hover
state is a single border lightening.

## Note

`index.html` loads `../data/movies.js` so there is one copy of the data. If
this folder is ever promoted to the repo root, change that path to
`data/movies.js`.
