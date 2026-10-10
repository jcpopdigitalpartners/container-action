# Containers in Practice · Modules 0–3

**Deployment-ready source:** start with [GITHUB-PAGES-SETUP.md](GITHUB-PAGES-SETUP.md). This repo includes the `.github/workflows/deploy-pages.yml` build/deploy workflow and `npm run check:dist` media validation. A successful GitHub Actions build is required before the site can be considered deployed.

An audio-guided, developer-facing **Astro** site designed for GitHub Pages.
This repository includes ten numbered-course narration MP3s plus an unnumbered Course Prerequisites recording, synced chapter navigation,
OSS setup resources, illustrated lesson beats, copyable lab commands, and an
optional runnable Module 1 API/PostgreSQL lab.

## Approved visual direction — Modern Editorial

The production Astro site now uses the Modern Editorial theme: warm parchment reading surfaces, a dark charcoal/sage pinned narration player, sage instructional guidance, terracotta accents, and deliberately subtle background motion. Reduced-motion preferences are respected, and a Pause motion control is provided. The separate Valkey resource page uses the same colors.

The theme is in `src/styles/modern-editorial.css` and is imported after `site.css` in `src/pages/index.astro`. Do not remove the base stylesheet: it owns the grid, pinned audio player, responsive layout, and independent module scrolling.

## Run in VS Code / WSL

The site targets **Astro 7.3.8** (exact version, not a caret range) and requires **Node.js 22.12.0 or later**. If you use `nvm`, run `nvm use` first.

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. The site uses Astro static output and browser-native
audio; no application server is needed after export.

```bash
npm run check:source
npm run build
npm run preview
```

The published files are in `dist/`. Your course MP3s and downloadable lab pack
are copied into the build's `audio/` and `downloads/` directories.

## GitHub Pages (GitHub Actions)

1. Create a GitHub repository and extract these files at its root on `main`.
2. Commit all files, **including `.github/workflows/deploy-pages.yml`** and
   `public/audio/`.
3. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push to `main`, then watch the `Publish Astro course` workflow under Actions.
5. When it succeeds, open the URL provided by the Pages deployment.

The workflow uses Node 22 and performs a source-data check, an Astro static
build, verification of all ten exported MP3 assets plus the shared-state video, and Pages deployment.

The `astro.config.mjs` file automatically selects a project path when the
repository is not a `username.github.io` repository. For custom domains, set
`ASTRO_SITE` and `ASTRO_BASE` environment variables in the workflow.

## Module 3: Durability and Resilience

Module 3 is integrated into the primary narrated course navigation (chapters 3.0–3.8). Its three recordings are `public/audio/module-3-part-1.mp3`, `module-3-part-2.mp3`, and `module-3-part-3.mp3`. Every chapter has a topical YouTube video, official documentation, an Explore activity and troubleshooting guidance. The separate `/module-3/` page remains as an optional field guide. **Module 3 chapter seek timestamps are preliminary estimates**, to be calibrated against the provided recordings.

## Audio and section synchronization

- Module 0: `public/audio/module-0.mp3` (2:48)
- Module 1: `public/audio/module-1-part-1.mp3` (3:35)
- Module 1: `public/audio/module-1-part-2.mp3` (4:19)
- Module 1: `public/audio/module-1-part-3.mp3` (6:30)
- Module 2: `public/audio/module-2-part-1.mp3` (4:27)
- Module 2: `public/audio/module-2-part-2.mp3` (5:23)
- Module 2: `public/audio/module-2-part-3.mp3` (6:31)
- Module 3: `public/audio/module-3-part-1.mp3` (8:15)
- Module 3: `public/audio/module-3-part-2.mp3` (6:17)
- Module 3: `public/audio/module-3-part-3.mp3` (4:36)

The navigation plays the ten numbered-module tracks in sequence, carries the chapter selection
between tracks, seeks on waveform clicks, and highlights short key phrases
while the relevant passage is playing. Clicking a chapter seeks and plays from
that chapter. The **Follow narration** switch controls page scrolling; it does
not disable chapter navigation or audio. Each active chapter positions the
corresponding center card at the top edge of the sticky narration panel,
without compounded CSS scroll offsets. The left chapter list also follows
the selected chapter when it moves outside the visible panel.

**Timing precision:** Module 0 cue markers come from the earlier edited course.
Module 1–2 chapter and phrase boundaries are **editorial approximations based on
script structure**; they have not been professionally word-aligned to the new
recordings. They are centralized in `src/data/course.ts` as track-local seconds
and can be adjusted after listening to the full cuts.

All lesson sections remain rendered and readable at all times. There are **no**
fade-in or slide-in effects that depend on an intersection observer. Only
illustrations, the active chapter marker, and specific narrated phrases animate.

The right **Resources** panel is contextual: it changes as a chapter becomes
active, links to original OSS project docs, and offers the module's lab download
only while in Module 1. OS-specific install steps are in the Module 0 toolchain
section, with panels for Ubuntu/WSL, RHEL/Fedora, macOS/Lima, and Windows/WSL.

## Included practical lab

Read `labs/module-1/README.md`. Learners can also get a single ZIP from the
Resources panel while listening to Module 1.

The lab includes:

- Minimal Node.js HTTP API with PostgreSQL-backed `/items`, `/ready`, `/health`
- `Containerfile` for OCI image construction and non-root execution
- Local OpenTofu exercise + Podman shell scripts for creating and destroying
  disposable runtime resources without removing the database volume
- Development / staging configuration challenge

**Scope note:** The local OpenTofu lab uses `terraform_data` + shell provisioners
to bootstrap Podman. It provides a clear repeatable setup, but it does **not**
reconcile individual container resources or detect drift in those resources.
It is not presented as a complete native resource provider.

`coursepass` is an explicit throwaway lab credential, not an example of
production secret management. Never copy it into production or commit actual
secret values or state files.

## Source structure

```
src/pages/index.astro       Course shell and section views
src/components/             Lightweight conceptual diagrams
src/data/course.ts          Chapters, cue timings, references
src/data/install.ts         OS-specific OSS installation guides
src/data/waveform.json      Offline waveform amplitudes
src/scripts/experience.ts   Ten-track audio and panel interactions
src/styles/site.css         Layout, typography, small decorative animations
public/audio/               Ten original MP3 files
public/video/               Module 2 shared-state animation and poster
src/pages/resources/        Standalone course video player
public/downloads/           Module 1 lab starter archive
labs/module-1/              Editable source for lab exercises
.github/workflows/          Static-site Pages deployment
```

## Tool licensing and cognitive-load decisions

Core tools are open-source: Astro, Podman, Buildah, Skopeo, OpenTofu,
Node.js, PostgreSQL, Git, and curl. The course references OCI open standards.
The interface relies on browser APIs, not a paid hosting/runtime service.

- One governing idea per narrated beat
- One diagram and one **How you know it worked** test per beat
- Terminal detail behind an explicit **Try it** disclosure
- Resources filtered to the active lesson
- Persistent content; no disappearing section transitions
- Motion confined to small diagrams, waveform progress, and timed text emphasis
- Reduced-motion preference respected

The audio is supplied by the course author and is not licensed by the code
repository's choice of open-source development tools.


## Module 2 and contextual multimedia Resource (October 2026)

The course now includes Module 2.0–2.8 as navigable chapters, the three supplied narration recordings, and waveforms generated from those MP3s. Chapter cue timestamps remain **editorial estimates** and should be calibrated by listening to the recordings. Module 2 is a narrated course outline, not yet a complete set of guided labs. The standalone `containers-course-lab-2-0` remains a separate terminal-based exercise; it is not a dependency of this Astro site.

In **Module 2.3 — The problem with local state**, the right Resources panel reveals:

- **How replicas share state · animation** (uploaded `iso-mod2-animation.mp4`, 14 seconds)
- Appears around **02:57** within the **Module 2.2–2.4** recording (track 6 in the player, zero-indexed track 5).
- This cue is controlled by `src/data/course.ts` (`resourceCue: { key: 'shared-state-animation', at: 177 }`).
- The card opens the local player at `src/pages/resources/shared-state.astro`, whose video is under `public/video/`; it works under GitHub Pages base paths.
- The animation is available immediately in Modules 2.2 and 2.3, and the narration cue adds an emphasis highlight. Playing it pauses course narration to avoid overlapping audio.

The architectural explanation distinguishes client requests routed through the API Service from optional state access originating at the API Pods. **Not every client request accesses Valkey.**

Supported installation tabs: **Ubuntu / WSL**, **RHEL / Fedora**, **macOS**, **Windows**.

Validate without installing Astro dependencies: `npm run check:source`. Build after `npm install`: `npm run build`. If npm registry access is unavailable, build validation must be performed in a network-enabled environment.

## Pinned audio player and independently scrolling modules

The narration sidebar uses two separate regions:

- `.player-dock` holds the current chapter title, audio play/pause, waveform, seeking, speed and follow controls. It stays visible inside the sticky narration sidebar as lessons and modules are navigated.
- `.chapter-scroll` holds the module picker and chapter list and can be scrolled independently with mouse wheel, touchpad, touch, or keyboard. Follow narration scrolls only this chapter list to reveal the active chapter; it does not move the audio player.

The layout also works in the mobile Narration flyout. On narrow displays, open **Narration** to access the same pinned player with its own scrollable module list.

This is a CSS/layout and chapter-follow update only. It does not change the audio, lab materials, or the shared-state Resources cue.

## Module 0 guided flow (00.0 → 00.1 → 00.2)

Chapter 00.0 introduces the environment and presents an **Choose your OS** action. That button moves to Chapter 00.1, which includes the four OS-specific, copyable installation tabs (Ubuntu/WSL, RHEL/Fedora, macOS, Windows). **Run the preflight** then navigates to Chapter 00.2 for version checks and a real Podman OCI run. Setup buttons do not start the narration unexpectedly, but they synchronize it when it is already playing. The pinned player and Resources panel remain unchanged.

### Open the standalone Module 0 preview without npm

Open `preview-module0.html` directly in your browser after extracting the ZIP. It includes working chapter navigation, OS tabs, copyable installer commands, Module 0 audio, and a pinned player. The full Astro site is started with `npm install` then `npm run dev`.

## Resources and player corrections (October 2026)

- The audio control now uses proper SVG play and pause icons, not the Unicode Roman numeral II.
- Each of the 35 chapters has its own field question, two-minute exploration, expected observation, and context-specific recovery guidance in `src/data/learningAssets.ts`. The Resources panel also links to a selected reference, with a second optional deep dive where useful.
- The Resources panel includes an explicit **Pause & explore / Resume narration** control. The narration position is preserved while browsing.
- The learner-uploaded `public/video/iso-mod2-animation.mp4` is embedded directly in chapter **02.3**, with a second video player in Resources for chapters **02.2** and **02.3**. Seeking back before the editorial audio cue does not hide it. Playing course video pauses the narration.
- `preview-course.html` is a standalone browser inspection preview of all 35 lessons and the contextual Resources implementation. Open it from the extracted project root. For the complete Module 0 OS installation interaction, open `preview-module0.html`; for the video explainer open `preview-shared-state.html`.
- Audio timing for the Module 2 resource cue remains editorially estimated and can be refined later.

Run `npm run check:source` to validate the source and resources. The Astro production build requires installing dependencies with `npm install`; package creation here could not verify that build because the npm registry was unreachable.

### Module 0 structure (2026-10-09)

Chapter **00.5 — Checkpoint 0 & next steps** combines the earlier 00.5 checkpoint and 00.6 handoff into one continuous lesson. The Module 0 audio is unchanged: its closing transition remains within 00.5; Module 1 begins with **01.0** in the following audio recording.

## Astro 7.3.8 upgrade

This archive upgrades the root Astro dependency from `^5.14.0` to exactly `7.3.8`.
It does not change the separate Node.js API lab's dependencies.

The project uses static output and no Astro integrations, Vite plugins, legacy content collections, or experimental flags requiring a source migration. The existing GitHub Actions workflow uses Node 22.

**Build verification:** The packaged source can be validated without installed dependencies using `npm run check:source`. This environment was unable to reach npm's package registry, so Astro 7.3.8 could not be installed or run here. No lockfile was fabricated; run `npm install` in a connected environment to resolve it and generate `package-lock.json`, and commit the resulting lockfile for reproducible deployment. After generating the lockfile, prefer `npm ci` in CI and local reproducible installations.

The independently browsable `preview-*.html` pages were preserved; they do not load Astro and cannot substitute for a true Astro 7 build.

See `CHANGELOG-ASTRO-7.3.8.md` for the migration details.


## Module 00.0 machine readiness

Start with `preview-course.html#baseline` to check the new machine prerequisites. They distinguish Module 0–1 resource planning (4 logical CPUs, 8 GB RAM, 20 GB free) from full-course recommendations (8 logical CPUs, 16–32 GB RAM, 40–80 GB free). Copyable **read-only** system checks are supplied for Ubuntu/WSL, RHEL/Fedora, macOS, and Windows. For Windows/WSL and macOS/Lima, also verify the capacity **inside** the Linux VM. These figures are curricular planning targets and not claims about official software minimums. The existing toolchain installs remain in 00.1 and operational preflight in 00.2.

## Prerequisites audio and learner action

The unnumbered Course Prerequisites module uses `public/audio/course-prerequisites.mp3` (3m 31s). Learners choose one of four OS checks, run the read-only commands locally, record CPU/RAM/storage, and acknowledge the planning limits before the Module 00.0 continuation control activates. This browser-local self-attestation does not automatically inspect or certify the computer. The original ten audio tracks remain unchanged.

## GitHub Pages downloads

Both downloadable lab archives are included in `public/downloads/`: `module-1-labs.zip` and the independent, terminal-only `module-2-terminal-lab.zip`. The terminal lab does not depend on Astro and provides no completed Kubernetes manifests.
