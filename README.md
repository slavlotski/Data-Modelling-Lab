# Data Modelling Lab

An educational web application for learning data modelling — from relational fundamentals to advanced warehouse architectures (Kimball, Inmon, Data Vault, Anchor Modelling).

## Features

- **Theory modules** — 16 modules with rich Markdown content
- **Visual ER diagram builder** — drag-and-drop entity/relationship designer
- **SQL sandbox** — write and execute SQL against a real PostgreSQL database
- **Challenges** — structured exercises with automatic schema validation

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Quick Start

```bash
# Clone the repo
git clone <repo-url>
cd Data-Modelling-Lab

# Run setup (starts PostgreSQL, installs deps, runs migrations)
./scripts/setup.sh        # macOS / Linux
# or
powershell scripts/setup.ps1  # Windows

# Start the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Curriculum

| Part | Modules | Topic |
|------|---------|-------|
| I | 1–4 | Relational Foundations |
| II | 5–9 | Dimensional Modelling (Kimball) |
| III | 10–11 | Inmon (Enterprise DW) |
| IV | 12–13 | Data Vault 2.0 |
| V | 14 | Anchor Modelling |
| VI | 15–16 | Methodology Comparison & Capstone |

## Project Structure

```
├── client/          # React + TypeScript frontend (Vite)
├── server/          # Node.js + Express backend
├── content/         # Markdown theory + JSON challenges
├── scripts/         # Setup and utility scripts
└── docker-compose.yml
```

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Flow, Monaco Editor, Tailwind CSS, Zustand
- **Backend:** Node.js, Express, Drizzle ORM, PostgreSQL
- **Infrastructure:** Docker

## License

MIT
