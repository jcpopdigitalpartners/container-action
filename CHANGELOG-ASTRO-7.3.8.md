# Astro 7.3.8 upgrade — October 9, 2026

## Changed

- Root `package.json`: `astro` from `^5.14.0` to **exactly `7.3.8`**.
- Root `package.json`: Node.js engine requirement `>=22.12.0`.
- `.nvmrc`: use Node.js 22 LTS.
- `README.md`: update installation, verification, and upgrade instructions.

## Reviewed and preserved

- Astro configuration retains `output: 'static'`, GitHub Pages `site` / `base` values, and trailing slashes.
- GitHub Actions continues using Node.js 22, `npm install`, source validation, `astro build`, and asset checks.
- Modern Editorial theme, pinned audio player, module navigation, 26 audio chapter sections, lesson-specific Resources, 7 MP3s, and isometric Valkey video are unmodified.
- Module 3 resource-led preview and external video/documentation resources remain packaged as before.
- No dependencies were changed in the independent `labs/module-1/api` package.

## Migration analysis

This upgrade crosses Astro major versions 5 → 6 → 7. The source does not rely on the legacy content layer, removed experimental flags, Astro DB, Astro SSR adapters, custom Vite configuration, or removed transitions APIs. Astro 7 uses a stricter Rust compiler, so a successful actual build must be checked after installing the package.

Official references:
- https://docs.astro.build/en/guides/upgrade-to/v6/
- https://docs.astro.build/en/guides/upgrade-to/v7/
- https://www.npmjs.com/package/astro/v/7.3.8

## Validation limits

`npm run check:source` checks course structure without using Astro. `npm install` could not reach registry.npmjs.org (EAI_AGAIN) in this environment. Consequently no `package-lock.json` was invented, and no `astro build` success is claimed.

On your connected VS Code/WSL environment:

```bash
node -v
npm install
npm run check:source
npm run build
```

After successful install, commit `package-lock.json` and switch GitHub Actions to `npm ci` for deterministic deployments.
