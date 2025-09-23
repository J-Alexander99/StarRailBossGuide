BossGuide (Expo) - Quick start

This repository contains a minimal Expo + TypeScript skeleton for BossGuide, a cross-platform (mobile + web) app.

Getting started (Windows PowerShell):

1) Install dependencies

npm install

2) Start the dev server (Expo)

npx expo start

3) Run on web (PC)

npx expo start --web

4) Run on Android (using Emulator or physical device with Expo Go)

npx expo start --android

Notes:
- This scaffold includes React Navigation (stack + bottom tabs).
- To build native installers or run iOS on macOS, see Expo docs: https://docs.expo.dev

Next steps you may want me to do for you:
- Run `npm install` now and start the dev server from this environment.
- Add sample boss images into `assets/` and show them in `BossDetail`.
- Wire persistent storage or remote sync for boss data.
