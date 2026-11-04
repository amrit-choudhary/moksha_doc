---
title: "Web builds"
description: "Compile a game to WebAssembly with Emscripten and host it as a page."
order: 5
source: "README.md, moksha_samples: CLAUDE.md, tools/build_web.py"
sourceCommit: "d18f364"
---

On web, `moksha_add_game` produces a page: `<Target>.html`, `.js`, `.wasm` and `.data`. Games don't need any web-specific code.

## Setup
You need [Emscripten](https://emscripten.org) 4.0.10 or newer (Moksha is built with 6.0.13), whose install needs Python 3.10+. You also need a cook built for your host machine, because the cook runs during the build. With the `live` preset from [Getting started](/docs/getting-started/#working-on-the-engine-at-the-same-time):
```
cmake --preset live
cmake --build --preset live --target Moksha_Cook
```
Rebuild it after changing the cook.

Then add a per-machine `web` preset to `CMakeUserPresets.json`, replacing `<emsdk>` with your emsdk folder:
```json
{
    "name": "web",
    "binaryDir": "${sourceDir}/build-web",
    "toolchainFile": "<emsdk>/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake",
    "cacheVariables": {
        "FETCHCONTENT_SOURCE_DIR_MOKSHA": "${sourceDir}/../../moksha/moksha",
        "MOKSHA_COOK_EXECUTABLE": "${sourceDir}/build-live/_deps/moksha-build/tools/cook/Moksha_Cook",
        "CMAKE_BUILD_TYPE": "Release"
    }
}
```
Add a matching build preset, `{ "name": "web", "configurePreset": "web" }`.

## Build and serve
```
cmake --preset web
cmake --build --preset web --target MyGame
```
WebGPU needs a secure page, so serve the output from `localhost` or HTTPS. A plain `http://` address on your network will not work, even though the page itself loads.
```
python3 -m http.server -d build-web 8000
```
`DISPLAY_NAME` on `moksha_add_game` sets the page's title. The samples repository's [`tools/build_web.py`](https://github.com/amrit-choudhary/moksha_samples/blob/main/tools/build_web.py) is a working example of collecting several games into one folder.

## What's different in a browser
- **WebGPU only.** There is no WebGL fallback, and the page shows a message if the browser has no WebGPU.
- **No networking.** Browsers have no raw sockets, so `gameClient` never connects, and `contentClient` fails and carries on. Two socket errors in the console at startup are expected.
- **The window size is read once.** The game keeps its configured size and shrinks to fit the browser window at startup, and it never scales up or resizes afterwards. If you embed it in an `<iframe>`, give the frame its final size before the game loads.
- **`Quit()` only logs,** since a page can't close itself.
- **Saves live in the browser.** `UserData` is kept in IndexedDB, per site address, after each write. A tab killed right after a write can lose that write. Moving the game to a new address loses its saves.
- **The app can end without `End()`,** as it can on mobile.
- **Input:** keyboard and mouse, with the first finger acting as the mouse.

## Hosting
A build is single-threaded, so it needs no COOP or COEP headers. Any static host with HTTPS works. Serve `.wasm` as `application/wasm`, and turn on compression if you can: the `.data` files shrink a great deal, taking a whole game from 2-3 MB to about 300 KB with gzip.
