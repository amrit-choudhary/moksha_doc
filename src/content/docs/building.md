---
title: "Building and platforms"
description: "Supported targets, how to build the engine, and its CMake options."
order: 4
source: "README.md"
sourceCommit: "d18f364"
---

## Platforms
| Target | Graphics API | Status |
|---|---|---|
| Windows | DirectX 12 | Supported |
| macOS | Metal 4 | Supported on Apple silicon, macOS 26+. Plain executable, no `.app` bundle yet |
| iOS | Metal 4 | Supported on iPhone devices, iOS 26+. The Simulator has no Metal 4 |
| Web (Emscripten) | WebGPU | Supported in browsers with WebGPU. No sockets, so no networking yet |
| Linux | None yet | Servers and headless clients, including Raspberry Pi (ARM64). A windowed client on Vulkan is planned |
| Android | Vulkan | Planned |

## Building the engine
This builds the libraries, tools and tests. Games build the engine as a dependency, and then only the libraries and the cook are built.
```
cmake --preset dev
cmake --build --preset dev
build/tests/Debug/Moksha_Tests        # unit tests (build/tests/Moksha_Tests with Makefiles or Ninja)
python tools/check_layers.py          # module dependency check
```
The toolchain needs C++20 and CMake 3.31 or newer. See [Getting started](/docs/getting-started/#what-you-need) for the per-platform requirements of the cook.

## iOS
iOS is cross-compiled with the Xcode generator (`-G Xcode -DCMAKE_SYSTEM_NAME=iOS`). It needs a cook built for the Mac (`MOKSHA_COOK_EXECUTABLE`), a signing team (`CMAKE_XCODE_ATTRIBUTE_DEVELOPMENT_TEAM`) and a bundle id (`MOKSHA_BUNDLE_ID_PREFIX`, or `BUNDLE_ID` on `moksha_add_game`). The optional `DISPLAY_NAME`, `BUNDLE_ID` and `ORIENTATION PORTRAIT|LANDSCAPE|ANY` arguments fill the app's `Info.plist`.

## Web
See [Web builds](/docs/web-builds/).

## CMake options
| Option | Default | Meaning |
|---|---|---|
| `MOKSHA_RENDERER` | `DX12` on Windows, `METAL` on Apple, `WEBGPU` on Emscripten, `NONE` elsewhere | Graphics API of the windowed client. `NONE` builds the headless client only |
| `MOKSHA_BUILD_CLIENT` | `ON` | Client libraries. Servers don't need them |
| `MOKSHA_BUILD_TESTS`, `MOKSHA_BUILD_TOOLS` | `ON` when top-level | Engine tests and content server |
| `MOKSHA_COOK_EXECUTABLE` | Empty | A host-built cook, for cross-compiled builds |
| `MOKSHA_METAL_DEVELOPER_DIR` | Empty (detected) | Developer folder whose `xcrun` has the Metal compiler |
| `MOKSHA_BUNDLE_ID_PREFIX` | Empty | Reverse-DNS prefix of iOS bundle ids, such as `com.yourname.games` |

## Third-party code
Moksha is built from scratch with minimal external dependencies. These libraries are vendored, each under its own licence:
- [cJSON](https://github.com/DaveGamble/cJSON): JSON parsing.
- [miniaudio](https://miniaud.io/): audio playback.
- [metal-cpp](https://developer.apple.com/metal/cpp/): Metal C++ headers.
- `d3dx12.h`: DirectX 12 helper header.
- [stb_perlin](https://github.com/nothings/stb): Perlin noise.
- [stb_image](https://github.com/nothings/stb): PNG decoding in the cook tool.
