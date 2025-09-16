## DISC Personality Test (Single-Page Web App)

A lightweight, client‑side DISC personality ranking test. Users rank four words per row (4 = most like you, 1 = least like you). The app validates inputs, shows progress and live trait bars, then presents a result page with your dominant DISC type and known personalities.

### Quick Start

- Open `index.html` in your browser. That’s it.
- Optional: serve locally (recommended for consistent asset loading):
  - VS Code Live Server, or
  - Python: `python -m http.server` then open `http://localhost:8000` and navigate to this folder

### How It Works

- **Ranking:** For each row, enter 1, 2, 3, and 4 exactly once.
- **Validation:** The app enforces presence, range (1–4), and uniqueness per row before enabling submit.
- **Scoring:** Sums values per trait across rows. Tie‑breaker order is D > I > S > C.
- **Result:** Clicking “See My Result” navigates to `result.html?type=…&D=…&I=…&S=…&C=…` and renders your profile, percentages, and sample personalities.

### Features

- Input validation with immediate feedback and a completion progress bar
- Live mini score bars while you fill the table
- Clean responsive UI with light/dark aware styling
- Results page with trait percentages, highlight card, nickname, and image illustration
- Local image lookup with graceful fallback to remote images

### Project Structure

```
disc/
  img/                     # Optional local images shown on the results page
  index.html               # Test UI (ranking table, validation, progress)
  result.html              # Results UI (scores, highlight, known personalities)
  script.js                # Test logic: validation, scoring, navigation
  result.js                # Result logic: parsing, rendering, image resolution
  styles.css               # Shared styles for both pages (responsive + dark aware)
```

### Customization

- **Words/Rows:** Edit the table rows in `index.html` (`<tbody id="disc-body">`). Ensure each row contains exactly four inputs to keep validation correct. If you change the number of rows, the maximum score scales automatically (code uses `4 * numberOfRows`).
- **Type Info:** Adjust names/descriptions and sample people in `result.js` (`TYPE_INFO`).
- **Colors:** Update CSS variables in `styles.css` (`--d`, `--i`, `--s`, `--c`, and brand colors).
- **Illustrations:** Place images under `img/` and the app will try these names in order (per type):
  - `img/dominance.png`, `img/Influence.png`, `img/Steadiness.png`, `img/conscientiousness.png`
  - or generic fallbacks like `img/profile_illustration_D.png` (and `I/S/C`, any of `.webp/.png/.jpg/.jpeg`)
  If none exist, an SVG illustration is generated on the fly.
- **Known Personalities:** The app first looks for local files by slugified name (e.g., `img/steve-jobs.png`). If not found, it falls back to remote images defined in `TYPE_INFO`.

### Accessibility

- Inputs include labels/ARIA where applicable; numeric inputs restrict to 1–4 and highlight invalid states.
- Results region uses `aria-live="polite"` on the test page for dynamic feedback.

### Deployment

- Static hosting works anywhere (GitHub Pages, Netlify, Vercel, Apache/Nginx, etc.).
- For GitHub Pages:
  1. Commit this folder to a repo.
  2. Enable Pages on the repo (deploy from `main`/`docs` as preferred).
  3. Visit `https://<user>.github.io/<repo>/index.html`.

### Notes

- This tool is for personal insight only; it is not a diagnostic instrument.
- Credit link appears in the footer (`index.html` and `result.html`).

### License

Specify a license here if you intend to share or open‑source. If unsure, consider MIT:

```text
MIT License — Copyright (c) 2025
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```


