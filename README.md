# SnoozeEscape

SnoozeEscape is a playful browser game about an alarm clock that refuses to be stopped. Every attempt triggers a different evasive antic; after the eighth try, the clock gives up on you first and goes back to sleep.

The project is a self-contained static website built without frameworks, external images, remote fonts, analytics, a backend, or a production build step.

## Table of Contents

- [Project status](#project-status)
- [Features](#features)
- [Technology](#technology)
- [Getting started](#getting-started)
- [How to play](#how-to-play)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Accessibility and motion](#accessibility-and-motion)
- [Browser support](#browser-support)
- [Privacy and security](#privacy-and-security)
- [GitHub Pages deployment](#github-pages-deployment)
- [Release checklist](#release-checklist)
- [Customization](#customization)
- [License](#license)
- [About](#about)

## Project status

| Item | Status |
| --- | --- |
| Current version | `1.0.0` |
| Release readiness | Production-ready |
| Repository visibility | Private until publication is explicitly approved |
| Deployment target | GitHub Pages from the repository root |
| License | MIT |

## Features

- Live 12-hour digital clock
- Continuous alarm animation with clock shake and bouncing bells
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
- Reset control for immediate rematches
- Responsive desktop and mobile layouts
- Mouse, keyboard, and touch support through native controls
- Live status announcements for assistive technology
- Visible focus states, semantic markup, and a skip link
- `prefers-reduced-motion` support
- Original bedroom artwork drawn entirely with CSS and inline SVG

## Technology

- **Structure:** semantic HTML5
- **Styling and animation:** CSS3, custom properties, responsive media queries, and keyframe animation
- **Artwork:** inline SVG and CSS shapes
- **Interaction:** vanilla JavaScript with a small alarm state machine
- **Audio:** Web Audio API oscillators and gain envelopes
- **Validation:** dependency-free Node.js verification script
- **Local serving:** Python's built-in static HTTP server
- **Hosting:** zero-build GitHub Pages deployment

## Getting started

### Prerequisites

- A current version of Chrome, Edge, Firefox, or Safari
- Python 3 for the documented local server command
- Node.js 18 or newer for production validation
- GitHub authentication if cloning while the repository is private

### Clone the repository

```bash
git clone https://github.com/SUDARSHANCHAUDHARI/SnoozeEscape.git
cd SnoozeEscape
```

There are no packages to install.

### Run locally

```bash
npm run dev
```

Open [http://localhost:4173](http://localhost:4173). You can also open `index.html` directly, although a local server more closely matches GitHub Pages behavior.

### Validate the project

```bash
npm run check
```

The check verifies JavaScript syntax, required repository files, local asset references, unique HTML IDs, accessible controls, reduced-motion support, Web Audio usage, all nine alarm antics, author metadata, and the eight-attempt ending.

## How to play

1. Press **Start the alarm**. This user gesture gives the browser permission to start Web Audio.
2. Press **Stop** and watch the clock evade you.
3. Use **Sound on/off** or the **Volume** slider at any time.
4. Continue until the eighth attempt, when the clock falls asleep by itself.
5. Press **Reset room** for a rematch.

Modern browsers block autoplaying audio, so sound cannot begin before the initial button press. If Web Audio is unavailable, the visual game remains playable and reports the problem in the status area.

## Project structure

```text
SnoozeEscape/
├── .editorconfig        # Shared text-formatting rules
├── .gitignore           # Local, secret, cache, and build exclusions
├── .nojekyll            # Direct GitHub Pages static serving
├── AGENTS.md            # Repository-specific agent guidance
├── CHANGELOG.md         # Version history
├── LICENSE              # MIT license
├── README.md            # Project documentation
├── SECURITY.md          # Vulnerability reporting policy
├── favicon.svg          # Local SVG site icon
├── index.html           # Semantic scene and inline SVG artwork
├── package.json         # Metadata and local commands
├── script.js            # Game state, movement, time, and audio
├── styles.css           # Scene design, responsiveness, and animation
└── scripts/
    └── verify.mjs       # Dependency-free production checks
```

## Architecture

The clock deliberately uses two animation layers. The outer `.clock-positioner` controls where it sits on the desk, while the inner `.alarm-clock` controls actions such as shaking, rolling, and falling. This separation lets position changes and body motion run together without competing for the same CSS transform.

The JavaScript state machine tracks whether the game has started, whether an antic is active, the attempt count, the last randomized antic, and the final sleeping state. Consecutive duplicate antics are excluded. Short Web Audio oscillator bursts are scheduled only while the alarm is active and stop when the tab is hidden or the clock falls asleep.

## Accessibility and motion

- Interactive actions use native buttons and a labeled range input.
- Status changes are announced through an `aria-live` region.
- Keyboard focus is moved to the Stop control after starting.
- Focus indicators remain visible against the illustrated scene.
- Touch targets use native click behavior and `touch-action: manipulation`.
- Reduced-motion preferences disable nonessential movement while preserving game status updates.

## Browser support

SnoozeEscape targets current versions of Chrome, Edge, Firefox, and Safari with JavaScript enabled. Web Audio is optional; when unavailable, the visual game remains playable and reports the limitation in the status area.

## Privacy and security

SnoozeEscape runs entirely in the browser. It stores no data, requests no permissions beyond user-initiated audio, and sends no network requests at runtime. It has no third-party runtime dependencies, analytics, accounts, authentication, or backend services.

Report security concerns using the private process documented in [SECURITY.md](SECURITY.md). Do not open a public issue for a vulnerability.

## GitHub Pages deployment

The repository is ready to publish directly from its root directory. No build artifact or GitHub Actions workflow is required.

1. Run `npm run check`.
2. Confirm the intended commit is on `main`.
3. Make the repository public only after explicit publication approval.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.

After publication, the expected site address is:

```text
https://sudarshanchaudhari.github.io/SnoozeEscape/
```

All application asset paths are relative, so repository-subpath hosting works without URL rewriting. The included `.nojekyll` file tells GitHub Pages to serve the files directly.

## Release checklist

Before publishing a release:

1. Run `npm run check`.
2. Serve the repository root and confirm `index.html`, `styles.css`, `script.js`, and `favicon.svg` return HTTP 200 with the expected content types.
3. Manually exercise eight Stop attempts with sound on and off.
4. Check keyboard navigation, touch sizing, and reduced-motion behavior.
5. Review the Git diff and confirm no environment files, keys, local configuration, or generated caches are tracked.
6. Review [CHANGELOG.md](CHANGELOG.md) and update the version when behavior changes.

## Customization

The main colors and font stacks are CSS custom properties at the top of `styles.css`. Adjust `MAX_ATTEMPTS` in `script.js` only if you also update the counter copy and the eight attempt pips in `index.html`.

## License

Copyright © 2026 Sudarshan Chaudhari.

Released under the [MIT License](LICENSE).

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
