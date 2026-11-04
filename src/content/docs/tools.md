---
title: "Tools"
description: "The asset cook, the content server and the module dependency check."
order: 6
source: "tools/CLAUDE.md"
sourceCommit: "d18f364"
---

## Asset cook (`Moksha_Cook`)
`moksha_add_game` runs the cook before each game build: the engine's `resources/res_list.json` first, then the game's. You rarely need to run it by hand.
```
Moksha_Cook --target <t> --out <dir> [--dxc <exe>] <res_list.json>...
```
Each list is cooked into one output folder, and two lists producing the same output path is an error. Outputs newer than their sources are skipped, and a shader is rebuilt when any file in its folder changes.

### `res_list.json`
Paths are relative to the list's folder, and unknown keys are errors.

| Key | What happens |
|---|---|
| `copy` | Files are copied as they are |
| `textures` | PNG becomes an uncompressed RGBA8 `.dds` |
| `shaders` | `{"hlsl": [...], "metal": [...], "wgsl": [...]}`. Each target cooks its graphics API's language |

- **HLSL** becomes `<name>_vs.cso` and `<name>_ps.cso` through dxc.
- **Metal** becomes `<name>.metallib` through `xcrun`. A metallib loads only on the OS it was built for.
- **WGSL** stays as source for the browser to compile, with `#include "file"` lines replaced by that file from the shader's folder.

### Targets
`win-dx12`, `mac-metal`, `ios-metal`, `web-webgpu`, and `headless`, which only copies files, for headless clients and servers. `android-vulkan` is reserved and reports "not supported yet". Cross-compiled builds pass a host-built cook with `MOKSHA_COOK_EXECUTABLE`.

## Content server (`Moksha_ContentServer`)
A TCP server, on port 9311 by default, that hands the files listed in `dlc/manifest.json` to clients, so you can deliver game data without shipping a new client. Set the port under `[settings] port` in `resources/config/settings.ini`.

- Files are loaded into memory at startup, so a request never reaches the disk. To update, edit the files, bump their versions in the manifest and restart.
- It takes up to 32 clients, in a single-threaded polling loop with a 30-second idle timeout.
- It's built when the engine is the top-level project, or with `MOKSHA_BUILD_TOOLS=ON`. `test_dlc/` is a minimal manifest to try it with.

## Layer check
`python tools/check_layers.py` checks module dependencies and include style.
