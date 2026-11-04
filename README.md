# Moksha website

The site for the [Moksha game engine](https://github.com/amrit-choudhary/moksha): engine overview, docs and playable
web demos of the [samples](https://github.com/amrit-choudhary/moksha_samples). Static output, built with Astro.

## Run it
Needs Node 22.23 or newer.

```
npm install
npm run dev                    # development server
npm run build && npm run serve # the real output, at http://localhost:4321
```

The games need WebGPU, which only runs on `localhost` or HTTPS. A plain `http://` address on your network loads the
pages, but the games won't start.

## Updating
- **Demos:** run `tools/build_web.py` in the samples repo, then `npm run sync:demos`. Pass another path with
  `npm run sync:demos -- <moksha_samples/dist>`. The builds in `public/demos/` are committed, because a hosting
  provider can't build them.
- **Game text and order:** `src/data/games.ts`. Adding a game also means adding its folder to `scripts/sync_demos.mjs`
  and its images to `public/images/games/`, and its `.data` file to `public/_headers`.
- **Docs:** `src/content/docs/`. These are adapted from the engine repo, not generated. Each page's frontmatter records
  its source files and commit, so `git diff <sourceCommit> -- <source>` in the engine shows what to bring across.

## Hosting
`npm run build` writes everything to `dist/`, and any static host with HTTPS can serve it. Serve `.wasm` as
`application/wasm`, and compress `.wasm` and `.data` if the host allows it. No COOP or COEP headers are needed.
