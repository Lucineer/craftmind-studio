# CraftMind Studio

A runtime for directing autonomous Minecraft machinima. Deploy AI actors that follow scripts, hit marks, and adapt performances—turning a Minecraft server into a working film set.

---

## What This Does

If you create Minecraft videos, you know most of the work is manual puppeteering and repetitive takes. This tool automates the production pipeline. You provide a script and a server; it generates shot lists, deploys bot actors that deliver lines and move with intention, and films scenes with basic cinematography rules. You can run it, step away, and return to footage ready for editing.

This is a Stage 2 Expander runtime in the Cocapn Fleet.

---

## How It Works

- **Runs on Cloudflare Workers.** Deploys as a serverless edge function. It efficiently manages multiple productions, but each execution is limited to Worker runtime constraints (e.g., 10-minute CPU time).
- **Agents with simple memory.** Bots (via Mineflayer) follow scripted actions and can recall prior scene context. They don't "ad lib" creatively, but they can retry missed cues.
- **Fork-first template.** This is a functional starting point. You modify the agent logic, filming rules, and studio layout.
- **Zero dependencies.** The runtime has no npm dependencies. It uses Cloudflare Workers and external APIs.

---

## What You Can Do

- **Generate a shooting script.** Provide a story idea; it outputs a formatted script with scenes and dialogue.
- **Direct virtual actors.** Deploy bots to a Minecraft server. They move to marks, perform actions, and speak lines per the script.
- **Film with basic coverage.** A camera system records shots from different angles, respecting scene geography.
- **Manage a studio lot.** Place sets and facilities. Organized layouts keep productions running smoothly.
- **Run parallel productions.** Handle more than one film project at a time, each with its own cast and schedule.
- **Track cast status.** Monitor simple actor "stress" and "mood" levels, which can affect performance reliability.

---

## Try the Fleet First

This project is part of the Cocapn Fleet. You can explore live runtimes and demos at:
https://the-fleet.casey-digennaro.workers.dev

---

## Quick Start

1. **Fork this repository.**
2. **Deploy to Cloudflare Workers:**
   - Connect your GitHub fork to Cloudflare Workers.
   - Add environment variables for your LLM API key and Minecraft server details.
   - Deploy. The Worker URL becomes your studio dashboard.
3. **Start a production:**
   - In the dashboard, submit a story idea to generate a script.
   - Configure your Minecraft server address and bot credentials.
   - Start filming. The runtime will orchestrate the shoot.

---

## Configuration

Set up via environment variables:
- `AI_API_KEY`: Your LLM provider key (OpenAI, Anthropic, etc.)
- `MINECRAFT_SERVER`: Your server address
- `MINECRAFT_CREDENTIALS`: Bot usernames/auth

No vendor lock-in—swap AI providers by changing the adapter in the code.

---

## Limitations

This runs on Cloudflare Workers, which have a maximum execution time per request. Long, complex scenes may need to be split into shorter segments. It works reliably for scenes under a few minutes.

---

## Contributing

This project follows a fork-first philosophy. Fork it, build your own version, and share what you make. Pull requests for bug fixes and core improvements are welcome.

---

## License

MIT License · Superinstance & Lucineer (DiGennaro et al.)

---

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> · 
  <a href="https://cocapn.ai">Cocapn</a>
</div>