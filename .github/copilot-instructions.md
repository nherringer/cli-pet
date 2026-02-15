# cli-pet Copilot Instructions

This is **cli-pet**, a GitHub-powered virtual pet that lives in your terminal.

## Project Context
- TypeScript/Node.js CLI application
- Uses Commander.js for CLI argument parsing
- Uses Octokit for GitHub API integration
- Uses Chalk, Boxen, Figlet for terminal UI
- Pet state is persisted via the `conf` package

## Architecture
- `src/commands/` — CLI command handlers (adopt, status, feed, play, stats, tips)
- `src/pet/` — Pet state machine, types, and persistence
- `src/github/` — GitHub activity fetching and analysis
- `src/art/` — ASCII art, animations, and color theming
- `src/utils/` — Display helpers and config management

## Key Concepts
- Pet stats (hunger, health, happiness, energy) are driven by real GitHub activity
- Commits feed the pet, CI status affects health, PRs boost happiness, streaks boost energy
- Stats decay over time since last feeding
- Pet has mood states derived from stat levels
