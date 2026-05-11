# GraphicsLab

An interactive, gamified web platform for learning computer graphics algorithms. Built as a fun way to visualize, understand, and code the programs from a BCA Computer Graphics syllabus.

**[Try It Live](https://graphicslab-web.vercel.app/)**

![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## What Is It?

Instead of staring at Turbo C++ output, GraphicsLab lets you **watch algorithms draw pixel by pixel** on an interactive canvas, read beginner-friendly explanations, study real C++ code with line-by-line breakdowns, take quizzes, and solve challenges — all in the browser.

## 20 Algorithms Covered

| Category | Programs |
|----------|----------|
| **Line Drawing** | Direct Line (Slope-Intercept), DDA Line, Bresenham Line |
| **Curves** | Mid-Point Circle, Bresenham Circle, Mid-Point Ellipse, Arc Drawing, Sector Drawing |
| **Transformations** | Point/Line/Triangle/Rectangle Translation, Scaling, X-Shear, Y-Shear, Rotation |

## Features

### For Each Program — 5 Interactive Tabs

| Tab | What It Does |
|-----|-------------|
| **What Is It?** | Kid-friendly analogy + theory + algorithm steps, explained by Graphy (the mascot) |
| **See It Live** | Canvas visualization with play/pause, step-through, speed control, and adjustable parameters |
| **The Code** | Actual BCA C++ code with syntax highlighting, line-by-line explanations, and key line markers |
| **Quick Quiz** | 3 multiple-choice questions with explanations and XP rewards |
| **Master Challenge** | Calculation-based challenges to test understanding |

### Platform Features

- **Gamification** — XP system, leveling (21 tiers), 10 earnable badges, streak tracking
- **Leaderboard** — Global ranking by XP with level and badge counts
- **Friends System** — Add friends, compare progress, challenge each other
- **Guest Mode** — Full access to all programs without signing up
- **Graphy Mascot** — Animated SVG robot companion with mood states (happy, thinking, celebrating)
- **Admin Dashboard** — User management and platform analytics
- **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Vite, Zustand, Framer Motion, Recharts, Monaco Editor |
| **Backend** | Express 5, TypeScript, Prisma ORM, PostgreSQL, JWT auth, bcrypt |
| **Deployment** | Vercel (frontend + serverless API) |
| **Canvas** | Custom HTML5 Canvas visualizer with coordinate system, grid, animation engine |

## Project Structure

```
graphicslab-bca/
├── client/                     # React frontend
│   ├── src/
│   │   ├── algorithms/         # All 20 algorithm implementations (TypeScript)
│   │   ├── components/
│   │   │   ├── canvas/         # CanvasVisualizer — pixel-by-pixel rendering engine
│   │   │   ├── layout/         # Layout, Sidebar, TopBar
│   │   │   ├── mascot/         # Graphy SVG mascot + SpeechBubble
│   │   │   └── tabs/           # WhatIsIt, SeeItLive, TheCode, QuickQuiz, MasterChallenge
│   │   ├── data/programs.ts    # All 20 programs: theory, C++ code, quizzes, challenges
│   │   ├── hooks/              # useConfetti, useSound
│   │   ├── pages/              # Landing, Dashboard, Program, Leaderboard, Profile, Friends, Admin
│   │   ├── services/api.ts     # Axios API client
│   │   ├── store/              # Zustand auth + app state
│   │   └── types/              # TypeScript interfaces
│   └── package.json
├── server/                     # Express API
│   ├── prisma/schema.prisma    # User, Score, ActivityLog, Friendship models
│   ├── src/
│   │   ├── routes/             # auth, scores, activity, users, admin
│   │   └── middleware/         # JWT auth, admin guard
│   └── package.json
└── render.yaml                 # Deployment config
```

## Run Locally

```bash
# Clone
git clone https://github.com/Taab-cyber/graphicslab-bca.git
cd graphicslab-bca

# Backend
cd server
npm install
cp .env.example .env        # Add your DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

## License

MIT
