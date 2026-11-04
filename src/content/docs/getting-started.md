---
title: "Getting started"
description: "Create a game in its own repository and build it against the engine."
order: 1
source: "README.md, docs/game_cookbook.md"
sourceCommit: "d18f364"
---

A Moksha game is its own repository. It fetches the engine at a pinned commit through CMake, and `moksha_add_game` takes care of the platform details, so a game never branches on the platform.

## What you need
- CMake 3.31 or newer and a C++20 compiler.
- **Windows:** [dxc](https://github.com/microsoft/DirectXShaderCompiler) on `PATH`, for cooking shaders.
- **macOS and iOS:** Xcode with its Metal toolchain (Xcode > Settings > Components).

## Repository shape
```
my_game/
  CMakeLists.txt                fetch the engine, then moksha_add_game(...)
  CMakePresets.json             pinned preset
  game_main.cpp                 MOKSHA_GAME(MyGame::GameMain, "My Game")
  game/                         class GameMain : public ME::Game
  scene/                        your ME::Scene and ME::SceneUI subclasses
  resources/res_list.json       assets to cook, paths relative to this file
  resources/config/settings.ini
```

## Build files
**`CMakeLists.txt`**
```cmake
cmake_minimum_required(VERSION 3.31)
project(MyGame LANGUAGES CXX C)

# The engine builds without exceptions; drop MSVC's default /EHsc so it doesn't clash with /EHs-c- (D9025).
if(MSVC)
    string(REPLACE "/EHsc" "" CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
endif()

# The engine commit this game builds against.
set(MOKSHA_PIN <full commit sha>)

include(FetchContent)
FetchContent_Declare(moksha
    GIT_REPOSITORY https://github.com/amrit-choudhary/moksha.git
    GIT_TAG ${MOKSHA_PIN})
FetchContent_MakeAvailable(moksha)

moksha_add_game(MyGame
    SOURCES game_main.cpp game/game_main_class.cpp scene/scene_main.cpp
    RES_LIST resources/res_list.json
    # LIBRARIES <the game's own libraries>
    # HEADLESS   adds MyGame_Headless, a windowless console build
)
```
Link your own libraries through `LIBRARIES`, not `target_link_libraries`: on a platform without a windowed client, the main target doesn't exist. After adding or removing a `.cpp`, configure again.

**`CMakePresets.json`**
```json
{
    "version": 6,
    "configurePresets": [ { "name": "pinned", "binaryDir": "${sourceDir}/build" } ],
    "buildPresets": [ { "name": "pinned", "configurePreset": "pinned" } ]
}
```

**`resources/res_list.json`** lists only your own files. The engine's shaders, font and UI atlas are added automatically.
```json
{
    "copy": ["config/settings.ini"]
}
```

**`resources/config/settings.ini`**
```ini
[window]
title=My Game
width=1280
height=720
vsync=1

[time]
fixedStepFPS=60
```
Every key can be overridden on the command line, for example `--width=1920`.

## The game
**`game_main.cpp`** connects your class to the engine, which owns the entry point:
```cpp
#include "game/game_main_class.h"
#include "moksha/client/game/game_factory.h"

MOKSHA_GAME(MyGame::GameMain, "My Game")
```
For more control, such as reading command-line arguments or changing the default window, define `ME::Game* ME::CreateGame(const ME::AppArgs& args, ME::AppConfig& config)` and `void ME::DestroyGame(ME::Game* game)` instead.

**The game class:** in `Init(ME::Engine& engine)`, call the base `Init`, then create `scene` and `uiScene` and call `Init()` on each. Both are required. Engine systems are reached through `engine->` (`input`, `timers`, `physics`, `audio` and so on), and you delete the scenes in `End()`.

The [Cookbook](/docs/cookbook/#minimal-game-one-sprite-moved-with-the-arrow-keys) has every file of a complete minimal game, including the scene and the game class.

## Build it
```
cmake --preset pinned
cmake --build --preset pinned
```

## Working on the engine at the same time
Clone the engine and add a gitignored `CMakeUserPresets.json`, so the game builds your local copy and one debugger session covers both. Adjust the path to wherever your clone lives:
```json
{
    "version": 6,
    "configurePresets": [
        {
            "name": "live",
            "binaryDir": "${sourceDir}/build-live",
            "cacheVariables": { "FETCHCONTENT_SOURCE_DIR_MOKSHA": "${sourceDir}/../../moksha/moksha" }
        }
    ],
    "buildPresets": [ { "name": "live", "configurePreset": "live" } ]
}
```
- Configuring warns when `MOKSHA_PIN` is behind the clone.
- Commit and push the engine first, then set `MOKSHA_PIN` to that commit and push the game.
- `pinned` builds exactly the pinned commit from GitHub. Use it on build machines, servers and fresh clones.

## Next
Read [Core concepts](/docs/concepts/) before writing much code: it covers the hard rules and the traps.
