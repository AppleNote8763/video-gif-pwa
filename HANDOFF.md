# Video GIF PWA Handoff

## Project Summary

This is a personal-use React/Vite PWA that converts local video files to GIFs directly in the browser using FFmpeg.wasm. It is deployed on Vercel and intended to be installable on a phone through the browser's "Add to Home Screen" flow.

## Current Stack

- React 18
- Vite 5
- Tailwind CSS
- vite-plugin-pwa
- @ffmpeg/ffmpeg and @ffmpeg/core
- Vercel deployment with cross-origin isolation headers

## Important Files

- `src/App.jsx`: Main app state, upload handling, conversion options, FFmpeg conversion flow.
- `src/hooks/useFFmpeg.js`: Loads FFmpeg.wasm and exposes ready/loading/progress/error state.
- `src/utils/ffmpegHelpers.js`: Validates accepted video formats.
- `src/components/FileUploadCard.jsx`: Upload/drop UI.
- `src/components/VideoPreview.jsx`: Source video preview.
- `src/components/GifPreview.jsx`: GIF preview and download.
- `vite.config.js`: Vite, PWA manifest, app version injection, and dev/preview COOP/COEP headers.
- `vercel.json`: Vercel COOP/COEP/CORP headers for FFmpeg.wasm and PWA behavior.
- `scripts/copy-ffmpeg-core.mjs`: Copies FFmpeg core files into `public/ffmpeg` before dev/build.

## Current Behavior

- Supports MP4, MOV, and WEBM uploads.
- GIF conversion is limited to a maximum selected clip duration of 30 seconds.
- Quality presets control width, FPS, color count, and palette use.
- The app uses local browser processing only; videos are not uploaded to a server.
- The PWA is configured for installable mobile use from the Vercel deployment.

## Recent Change

The app was updated to `1.1.3` with these behavior changes:

- GIF download names default to the source video name with a `.gif` extension.
- The generated GIF file name can be edited before download.
- GIF conversion length was increased from 15 seconds to 30 seconds.
- Clips over 20 seconds show a mobile performance warning, but quality, FPS, and color settings are not automatically reduced.

The upload size behavior was changed from a hard 250MB block to a warning-only policy:

- Files over 250MB now still upload and preview.
- A warning is shown that conversion may be slow or fail on a phone.
- Unsupported file formats are still blocked.

Implementation details:

- `MAX_FILE_SIZE` in `src/App.jsx` remains `250 * 1024 * 1024`.
- `handleFile` calls `validateVideoFile(selectedFile)` without the size limit so size does not block upload.
- If `selectedFile.size > MAX_FILE_SIZE`, `handleFile` sets a warning message after creating the preview URL.
- `validateVideoFile` in `src/utils/ffmpegHelpers.js` only applies size validation when a `maxSize` argument is provided.

## Verified

Last checked with:

```bash
npm.cmd run build
```

The build completed successfully.

## Notes For Next Chat

- The user does not want UI changes unless explicitly requested.
- This is a personal app, so practical S10e/mobile behavior matters more than broad public-user guardrails.
- For future behavior or feature changes, bump the app version in `package.json` as part of the same patch.
- If working on mobile reliability, focus on FFmpeg memory use, large-file warnings, clip duration, width/FPS defaults, and Vercel/PWA cache behavior.
- The Korean text in terminal output may appear garbled depending on shell encoding, but the app has built successfully.
