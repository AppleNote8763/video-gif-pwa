# Video GIF PWA Handoff

## Project Summary

This is a personal-use React/Vite PWA that converts local video files to GIFs directly in the browser using FFmpeg.wasm. It is deployed on Vercel and intended to be installable on a phone through the browser's "Add to Home Screen" flow.

Production URL: https://video-gif-pwa.vercel.app/

## Current Stack

- React 18
- Vite 5
- Tailwind CSS
- vite-plugin-pwa
- @ffmpeg/ffmpeg and @ffmpeg/core
- Vercel deployment with cross-origin isolation headers

## Important Files

- `src/App.jsx`: Main app state, upload handling, batch queue state, conversion options, FFmpeg conversion flow.
- `src/hooks/useFFmpeg.js`: Loads FFmpeg.wasm and exposes ready/loading/progress/error state.
- `src/utils/ffmpegHelpers.js`: Validates accepted video formats.
- `src/components/FileUploadCard.jsx`: Upload/drop UI with multiple-file selection.
- `src/components/VideoPreview.jsx`: Source video preview.
- `src/components/GifPreview.jsx`: GIF result list, preview, file-name editing, and download.
- `vite.config.js`: Vite, PWA manifest, app version injection, and dev/preview COOP/COEP headers.
- `vercel.json`: Vercel COOP/COEP/CORP headers for FFmpeg.wasm and PWA behavior.
- `scripts/copy-ffmpeg-core.mjs`: Copies FFmpeg core files into `public/ffmpeg` before dev/build.

## Current Behavior

- Supports MP4, MOV, and WEBM uploads.
- Supports selecting multiple videos at once.
- Multiple selected videos are converted sequentially, not in parallel.
- GIF conversion is limited to a maximum selected clip duration of 30 seconds.
- Quality presets control width, FPS, color count, and palette use.
- The app uses local browser processing only; videos are not uploaded to a server.
- The PWA is configured for installable mobile use from the Vercel deployment.
- The UI warns users to keep the app open while conversion is running because screen-off/background behavior can interrupt FFmpeg.wasm.

## Recent Change

The app was updated to `1.1.4` with these behavior changes:

- File upload now accepts multiple videos in one selection/drop.
- Batch conversion runs one file at a time: convert, clean FFmpeg virtual files, then move to the next file.
- Each completed source video creates its own GIF result.
- Result cards support per-GIF file-name editing and individual downloads.
- Failed files are shown in the result area and do not stop later files from converting.
- The conversion button now says `GIF 순차 변환 시작` when multiple files are selected.
- A conversion warning was added below the button: `변환 중에는 앱을 계속 열어두세요. 화면이 꺼지면 변환이 중단될 수 있습니다.`
- Version was bumped to `1.1.4`.

Implementation details:

- `selectedFiles` stores the current file queue. `file` remains the first selected file for the existing preview/options flow.
- `results` stores per-file status and output data: queued, converting, done, or failed.
- `batchProgress` stores the current batch index and file name for the status panel.
- `handleConvert` builds a queued result list and processes `filesToConvert` with a `for...of` loop.
- `convertFile` is the inner FFmpeg helper used for each source file. It always unlinks input, palette, and output files in `finally`.
- Batch conversion intentionally does not run FFmpeg jobs in parallel because mobile memory pressure is the main reliability risk.
- For multiple files, end-time validation against `videoDuration` is skipped because only the first file's metadata is loaded in the current UI.

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
