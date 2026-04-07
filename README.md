# CraftMind Studio

You don't just record Minecraft clips. You direct a working movie set.

AI actors follow schedules, hit their marks, and remember scene context. No mods or plugins required. It connects to vanilla servers using player bots and runs entirely on Cloudflare Workers.

Open source, MIT licensed. Zero dependencies. Fork-first workflow.

---

## Why This Exists
You spend too much time coordinating friends for shoots. This tool lets you produce the scene in your head by managing AI actors that show up, take direction, and adapt to on-set changes.

---

## Quick Start
1.  **You fork this repository.**
2.  You connect your fork to a new Cloudflare Workers project.
3.  You add two environment variables: `OPENAI_API_KEY` and your Minecraft server address.
4.  You deploy. Your studio dashboard is live in under two minutes.
5.  You edit `src/actors.js` and `src/director.js` to define your cast and shots.

---

## What It Does
*   **Vanilla-Compatible:** Connects as standard player bots. Works on any public, private, or realm server without mods.
*   **Persistent Actors:** If an actor is interrupted mid-action, it will attempt to complete its task.
*   **Parallel Productions:** You can run multiple, isolated filming sessions simultaneously on one server.

---

## Features
*   **AI Performers:** Bots deliver lines, react to in-game events, hold poses, and retain context between takes.
*   **Director Scripting:** Provide a plain text script; the director breaks it into shots and manages coverage.
*   **Set Management:** Tag in-game regions as sets or green rooms. Actors respect these boundaries.
*   **State Tracking:** Actors maintain internal mood and focus levels that change based on takes and wait times.
*   **Live Dashboard:** Monitor takes, pause production, call for reshoots, and adjust behavior from a browser.

---

## Architecture
This is a stateless application built on Cloudflare Workers. It orchestrates Mineflayer bot connections, hosts the director logic, and serves the dashboard. All runtime state is stored in Cloudflare KV.

---

## A Measured Limitation
Actor reactions are not instantaneous. Due to round-trip latency between the edge worker and your game server, combined with AI processing time, an actor's response to an on-set event can be delayed by 1-3 seconds.

---

## License
MIT. You are free to use, modify, and distribute this software.

Attribution: Superinstance and Lucineer (DiGennaro et al.).

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>