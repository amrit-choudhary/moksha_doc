---
title: "Known issues"
description: "What's currently rough or unfinished in the engine."
order: 8
source: "README.md, moksha/server/CLAUDE.md, code survey"
sourceCommit: "d18f364"
---

## Not built yet
- **3D meshes:** data classes and an OBJ parser exist, but meshes aren't drawn.
- **Tilemaps:** `TileMap` is an empty stub. Use instanced sprites instead.
- **Vulkan:** planned for Android and Linux clients, with no code yet.
- **Web networking:** browsers have no raw sockets.
- **Not currently included:** an editor, scripting, gamepad support and rigid-body physics. Collision reports overlaps and never moves anything.

## Platform issues
- **macOS:** keys pressed with Cmd stick. Releasing one Shift, Ctrl, Option or Cmd while the other side is held reads as still down. Held keys stick when the window loses focus. Resizing the window doesn't update the UI layout.
- **Web:** the game doesn't resize after startup, and there's no WebGL fallback.

## Rendering
The UI passes use fixed texture slots: the sprite atlas at 0 and the font at 1. On DirectX 12, a scene using only the second instanced sprite set gets no buffer for it.

## Servers
Clients are never forgotten, because there's no disconnect or timeout, so a server accepts at most 255 connects in its lifetime. There's no SIGTERM handling, and every datagram is logged.

## Client loop
Network messages are received after rendering, which adds up to a frame of latency.

## Code
`DebugSystem` is reached through a static instance, and `InputManager` keeps key state in statics.
