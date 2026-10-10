# Modern Editorial — Applied to the production Astro course

The approved Modern Editorial palette is now the default look of the Astro source.

- Warm paper and ivory lesson surfaces; charcoal/sage narration column
- Sage instructional Resources and restrained terracotta navigation accents
- Subtle background drift with a user-controlled Pause motion switch
- Honors `prefers-reduced-motion`
- Pinned narration controls remain in place above independently scrolling chapters
- All 26 chapters and chapter-specific Resources preserved
- Module 2.3 shared-state video stays embedded and available in Resources
- Separate shared-state explainer page matches the theme
- Offline preview `preview-course.html` is regenerated using the exact production styles

## Development and verification

Run `npm install && npm run dev` from this folder; then open http://localhost:4321.

The offline `preview-course.html` can be opened directly after extracting the ZIP without npm (and has a direct link to the Module 0 preview). Its media files are included in `public/`.

Verified: source-data check, TypeScript syntax checks, 27 chapter and Resources presence, responsive in-memory Chromium interaction checks, pinned player, Resource/video appearance, motion controls, and archive integrity.

Not verified: Astro production build. The build dependency install was blocked by the sandbox's npm registry DNS lookup (EAI_AGAIN). Build with npm in your own environment or CI.
