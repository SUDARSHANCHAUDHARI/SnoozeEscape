# SnoozeEscape Agent Guide

## Scope

SnoozeEscape is a zero-build static site. Keep it framework-free, backend-free, and compatible with direct GitHub Pages hosting.

## Architecture

- `index.html` owns semantic structure and inline SVG artwork.
- `styles.css` owns the bedroom scene, responsive layout, and motion states.
- `script.js` owns the alarm state machine and Web Audio scheduling.
- `scripts/verify.mjs` is the dependency-free production check.

## Constraints

- Use only local HTML, CSS, SVG, and vanilla JavaScript assets.
- Preserve relative asset paths so repository-subpath hosting continues to work.
- Do not bypass the user gesture required to start Web Audio.
- Preserve keyboard, touch, live-region, focus, and reduced-motion behavior.
- Do not add analytics, tracking, remote fonts, or third-party scripts without explicit approval.
- Do not create or modify GitHub Actions workflows without explicit approval.
- Never commit `.env*`, local properties, keys, signing material, or generated caches.

## Verification

Run before committing or publishing:

```bash
npm run check
```

For release readiness, also serve the repository root and confirm the page, stylesheet, and script return HTTP 200.
