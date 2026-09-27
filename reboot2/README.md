# Absolute Cinema — reboot2

Built from `reference.html`, wired to the real archive in `data/movies.js`.

    python3 -m http.server        # from the repo root
    # then open http://localhost:8000/reboot2/

- `reference.html` — the original reference, untouched, for comparison.
- `index.html` — the site. Markup and styles, following the reference.
- `script.js` — data wiring, the three views, the ticket, the numbers.

## What carried over from the reference

Space Grotesk / DM Sans / DM Mono, the near-black palette with the red accent
(`#d94a3a`), the static film grain, the oversized hero, mono uppercase section
heads, the three archive views, and the light ticket-stub detail panel.

The only motion is the reference's own poster hover (a 1.045 scale and a
saturation lift) plus 150ms colour fades on controls. The grain does not
animate. Nothing reveals on scroll.

## What changed, and why

**The reference had a `rating` field. The archive has no ratings.** It appeared
as a compact-table column, a modal slot and star strings in the sample data.
Rather than invent a rating for 61 films, the column and the modal slot now
show **Language**, which every film has.

**Sample fields became real ones.** The reference's flat `date` / `theatre` /
`format` strings are computed from `watchedDate`, `theatre` + `city`, `format`
and `language`. Dates are derived from `watchedDate`, so re-dating a film
re-sorts and re-groups it with no other edit.

**Entries are numbered by when you watched them**, oldest first — #1 is the
2011 film, #61 the newest. The number is the archive's identity: it sits on
each poster, in the timeline, in the table, and on the ticket stub as
`ARCHIVE ENTRY #61`.

**Added search, year and language filters, and a sort toggle**, in the
reference's mono-button style. The reference styled a `.filters` block but
never used it; 61 films need the filtering. All three views and the numbers
respond to the current filter.

**The numbers section is computed, not hardcoded.** The reference had four
fixed stats. This has eight — Films, Theatres, Cities, Languages, On record,
In 2026, Total spent, Average ticket — plus breakdowns by language, format and
year. Bars are drawn at their final width.

`price`, `screen`, `seat` and `note` are sparse (2, 2, 2 and 1 of 61), so the
ticket only prints the rows a film actually has, and "Total spent" says
"across 2 of 61 tickets" until more are filled in.

## Fixes on top of the reference

- **Posters that fail to load** show the film's title instead of a broken-image
  icon, in all three views and on the ticket.
- **The modal traps nothing and leaked scroll.** It now locks background
  scroll, moves focus to the close button, and restores focus on close.
- **Clickable cards are `<button>`s**, not `<div>`s, so the archive is
  keyboard-navigable. Table rows stay rows and are handled by delegation.
- **Escape and backdrop clicks** close the ticket (backdrop only when the
  click is actually on the backdrop, not inside the ticket).
- **The close button escaped the ticket.** `.ticket` had no `position:
  relative`, so the absolutely positioned close button resolved against the
  fixed `.modal` and landed in the corner of the viewport instead of on the
  ticket. Present in the reference too.
- **Compact table columns** are given widths, so the film and theatre columns
  do not drift apart on a wide screen.

## Note

`index.html` loads `../data/movies.js`, so there is one copy of the data. If
this folder is promoted to the repo root, change that path to `data/movies.js`.
