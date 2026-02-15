# 🐾 cli-pet — A GitHub-Powered Virtual Pet for Your Terminal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with GitHub Copilot CLI](https://img.shields.io/badge/Built%20with-GitHub%20Copilot%20CLI-blue)](https://github.com/features/copilot/cli)

> **A Tamagotchi-style virtual pet that lives in your terminal and reacts to your real GitHub activity.** Feed it commits, keep it healthy with green builds, make it happy with merged PRs, and energize it with coding streaks!

## ✨ Features

- 🐱🐶🐉🐙 **4 adorable pet species** — Cat, Dog, Dragon, and Octocat
- 📊 **GitHub-powered stats** — Your real coding activity drives your pet's health
- 🎮 **Interactive mini-games** — Play with your pet in the terminal
- 🧠 **Smart coding tips** — Your pet gives personalized advice based on your habits
- 🎨 **Beautiful ASCII art** — Expressive pet states with color-coded mood indicators
- 💾 **Persistent state** — Your pet remembers you between sessions

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **GitHub CLI** (`gh`) authenticated, or a `GITHUB_TOKEN` environment variable

### Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cli-pet.git
cd cli-pet

# Install dependencies & build
npm install && npm run build

# Link globally (optional)
npm link
```

### Usage

```bash
# Adopt your first pet! 🏠
cli-pet adopt

# Check on your pet 👀
cli-pet status

# Feed your pet with GitHub activity 🍕
cli-pet feed

# Play a mini-game 🎮
cli-pet play

# View detailed GitHub stats 📊
cli-pet stats

# Get coding tips from your pet 🧠
cli-pet tips
```

## 📖 How It Works

Your pet has **4 core stats**, each driven by your real GitHub activity:

| Stat | Emoji | Driven By | Effect |
|------|-------|-----------|--------|
| **Hunger** | 🍕 | Your commits | More commits = well-fed pet |
| **Health** | ❤️ | CI/CD status | Green builds = healthy pet |
| **Happiness** | 😊 | Merged PRs & reviews | Collaboration = happy pet |
| **Energy** | ⚡ | Coding streaks | Consistent activity = energized pet |

Stats **decay over time** — if you don't code, your pet gets hungry and sad! Run `cli-pet feed` regularly to keep your pet happy.

### Pet Moods

Your pet's mood changes based on its overall stats:

- 🌟 **Ecstatic** — All stats above 85%
- 😊 **Happy** — Balanced, healthy stats
- 😢 **Sad** — Low happiness or declining stats
- 🍕 **Hungry** — Haven't committed in a while
- 🤒 **Sick** — CI builds are failing
- 😴 **Sleeping** — Low energy, needs activity
- 💀 **Fainted** — Critical stats! Feed immediately!

### Leveling Up

Your pet earns **XP** from your GitHub activity:
- Each commit = **5 XP**
- Each merged PR = **20 XP**
- Each code review = **10 XP**
- Each streak day = **3 XP**

Every **100 XP** = 1 level up! 🎉

## 🏗️ Architecture

```
src/
├── index.ts              # CLI entry point (Commander.js)
├── commands/
│   ├── adopt.ts           # Interactive pet adoption
│   ├── status.ts          # Pet status display
│   ├── feed.ts            # GitHub activity → pet feeding
│   ├── play.ts            # Mini-game
│   ├── stats.ts           # Detailed GitHub stats
│   └── tips.ts            # AI-powered coding tips
├── pet/
│   ├── engine.ts          # State machine & stat calculations
│   ├── types.ts           # TypeScript interfaces
│   └── persistence.ts     # Save/load pet state
├── github/
│   ├── activity.ts        # GitHub API integration
│   └── analyzer.ts        # Activity → stat mapping
├── art/
│   ├── ascii.ts           # ASCII art for all species & moods
│   ├── animations.ts      # Terminal animations
│   └── colors.ts          # Color theming
└── utils/
    ├── config.ts          # Config management
    └── display.ts         # Terminal rendering
```

## 🛠️ Tech Stack

- **TypeScript** — Type-safe codebase
- **Commander.js** — CLI argument parsing
- **Octokit** — GitHub API client
- **Chalk** — Terminal colors
- **Boxen** — Terminal boxes
- **Figlet** — ASCII text art
- **Ora** — Loading spinners
- **Conf** — Persistent configuration

## 🤝 Built with GitHub Copilot CLI

This entire project was built using **GitHub Copilot CLI** as my AI-powered coding companion. Copilot CLI helped with:

- 🏗️ **Architecture design** — Planning the project structure and module boundaries
- 💻 **Code generation** — Writing TypeScript code across all modules
- 🐛 **Debugging** — Identifying and fixing issues in real-time
- 🔍 **Code exploration** — Understanding GitHub API responses and library interfaces
- 📝 **Documentation** — Generating this README and inline documentation

## 📄 License

MIT © 2026

---

**Made with 💜 and GitHub Copilot CLI**
