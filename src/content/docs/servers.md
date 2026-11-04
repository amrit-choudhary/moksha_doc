---
title: "Servers and networking"
description: "Run a game server and send messages between clients and server. Native platforms only."
order: 7
source: "moksha/server/CLAUDE.md, moksha/shared/CLAUDE.md"
sourceCommit: "d18f364"
---

Networking runs on native platforms and not yet on web, because browsers have no raw sockets. Servers build on every desktop OS, including Linux on ARM64 such as a Raspberry Pi. On a server-only machine, configure with `-DMOKSHA_BUILD_CLIENT=OFF`.

## A game server
A server is a plain `main` plus your `IGameServerListener`:
```cpp
int main(int argc, char** argv) {
    MyListener listener;
    ME::ServerApp app;
    return app.Run(argc, argv, listener);
}
```
Build it with:
```cmake
moksha_add_server(MyGame_Server SOURCES main.cpp RES_LIST resources/res_list.json)
```
`ServerApp` handles paths, `settings.ini`, networking, 60 Hz time and timers, and the `GameServer`. `GameServer` runs one non-blocking UDP socket and handles up to 256 datagrams per tick. It answers the engine's own verbs itself: connect, ping, and relaying chat and data to other clients.

## The listener
- `OnStart(ServerApp&)`: get timers and the server here.
- `OnClientConnected`: a client joined.
- `OnGameMessage(clientID, verb, reader)`: one of your game's messages arrived. Reply with `Send`, `Broadcast` or `SendToOthers`.
- `OnEnd`: clear timers and close resources.

## Wire format
One datagram is `u8 version | u8 verb | u8 clientID | payload`, at most 1,200 bytes. Verbs `0x00-0x7F` belong to the engine, and `0x80-0xFF` (`FIRST_GAME_VERB` and up) belong to your game, which defines its own payloads. Messages are read and written with `ByteWriter` and `ByteReader`, which are bounds-checked and use caller-owned memory and native byte order. The [Cookbook](/docs/cookbook/#multiplayer-messages) has a client-side example.

## Limits
These matter if you're considering it for anything beyond experiments:
- There's no acknowledgement or resend layer, and no authentication. The version byte isn't checked.
- There's no disconnect or timeout, and client IDs are never reused, so restart the server after 255 connects.
- A repeated connect from the same address gets a new ID, so a client that retries leaves an unused client behind.
- There's no SIGTERM handler, so stopping the process skips `OnEnd`.
- Every datagram is logged at info level.

## Hosting
Open UDP 9310, or your configured port, in the host's firewall. `resources/config/settings.ini` sits next to the executable, with the port under `[settings] port`. Without it, the default port is used. Clients point at a server with `--serverIP=<ip>` and `--serverPort=<port>`.
