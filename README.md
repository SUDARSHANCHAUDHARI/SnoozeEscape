# SnoozeEscape

SnoozeEscape is a playful, standalone browser game about an alarm clock that refuses to be stopped. Every attempt triggers a different evasive antic. After the eighth try, the clock gives up on you first.

The project uses only HTML, CSS, inline SVG, and vanilla JavaScript. It has no framework, build step, remote assets, analytics, or backend.

**Release status:** `v1.0.0` is production-ready. The GitHub repository remains private until publication is explicitly approved.

## Features

- Live 12-hour digital clock
- Continuous animated ringing, clock shake, and bouncing bells
- Web Audio API alarm with mute and volume controls
- Nine randomized alarm behaviors:
  - jumps somewhere else
  - rolls across the desk
  - hides behind the books
  - moves its Stop button
  - grows tiny legs and runs
  - relabels Stop as Snooze
  - pretends to stop, then rings again
  - falls from the desk and climbs back
  - covers itself with a blanket
- Eight-attempt counter and final sleeping state
- Reset button for instant rematches
- Responsive desktop and mobile layouts
- Native button interactions for mouse, keyboard, and touch
- Live status announcements for assistive technology
- Visible focus states, semantic controls, and a skip link
- `prefers-reduced-motion` support
- Self-contained artwork drawn with CSS and inline SVG

## Run locally

No installation or build is required. You can open `index.html` directly, although a local server more closely matches GitHub Pages behavior:

```bash
npm run dev
```

Then visit [http://localhost:4173](http://localhost:4173).

The `dev` command uses Python's built-in static server. You can use any other static file server if Python 3 is unavailable.

## Validate the project

Run the dependency-free validation checks with Node.js 18 or newer:

```bash
npm run check
```

The check verifies JavaScript syntax, required files, local asset references, unique HTML IDs, accessible controls, reduced-motion support, Web Audio usage, and the complete set of alarm antics.

## Controls

1. Press **Start the alarm**. This user gesture gives the browser permission to start Web Audio.
2. Press **Stop** and watch the clock evade you.
3. Use **Sound on/off** or the **Volume** slider at any time.
4. After the clock falls asleep—or whenever you want a rematch—press **Reset room**.

The first sound must follow a user action because modern browsers block autoplaying audio. If sound is unavailable, the visual game continues and reports the problem in the status area.

## GitHub Pages deployment

This repository is ready to publish from its root directory; no build action is needed.

1. Push the project to a GitHub repository.
2. Open **Settings → Pages** in that repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the branch you pushed and the `/ (root)` folder, then save.

All asset paths are relative, so the game works both at a user site and beneath a repository path such as `https://username.github.io/SnoozeEscape/`. The included `.nojekyll` file tells GitHub Pages to serve the static files directly.

> GitHub Actions are intentionally not required. Pages can publish this project directly from a branch.

## Project structure

```text
SnoozeEscape/
├── .editorconfig
├── .gitignore
├── .nojekyll
├── AGENTS.md
├── CHANGELOG.md
├── LICENSE
├── README.md
├── SECURITY.md
├── favicon.svg
├── index.html
├── package.json
├── script.js
├── styles.css
└── scripts/
    └── verify.mjs
```

## How it works

The clock uses two animation layers. The outer `.clock-positioner` controls where it sits on the desk, while the inner `.alarm-clock` controls actions such as shaking, rolling, and falling. Keeping those transforms separate allows location changes and body motion to run together.

The alarm logic is a small state machine tracking whether the game has started, whether an antic is active, the attempt count, the last randomized antic, and the final sleeping state. Consecutive duplicates are excluded so the interaction stays varied. Web Audio oscillator bursts are created only while the alarm is active and are stopped when the tab is hidden or the clock falls asleep.

## Browser support

SnoozeEscape targets current versions of Chrome, Edge, Firefox, and Safari. It needs JavaScript enabled. Web Audio support is optional; when unavailable, the visual experience remains playable.

## Release checklist

Before publishing a release:

1. Run `npm run check`.
2. Serve the repository root and confirm `index.html`, `styles.css`, and `script.js` return HTTP 200.
3. Manually exercise eight Stop attempts with sound on and off.
4. Check keyboard navigation, touch sizing, and reduced-motion behavior.
5. Review the Git diff and confirm no environment files, keys, or local configuration are tracked.
6. Make the GitHub repository public only after explicit publication approval, then enable Pages from the intended branch and `/ (root)` directory.

No GitHub Actions workflow is required for this zero-build project. Direct branch deployment keeps the release path small and auditable.

## Customization

The main colors and font stacks are CSS custom properties at the top of `styles.css`. Adjust `MAX_ATTEMPTS` in `script.js` only if you also update the counter copy and the eight attempt pips in `index.html`.

## Privacy

SnoozeEscape runs entirely in the browser. It stores no data and sends no network requests.

## License

Released under the [MIT License](LICENSE).
