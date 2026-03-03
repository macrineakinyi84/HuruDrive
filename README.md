# AI Content Idea Generator (Frontend Only)

This project is a frontend-only web application that helps social media creators generate high-performing content ideas using:

- **Rule-based idea generation**
- **Platform-specific strategy matching**
- **Audience and goal relevance scoring**
- **Preference learning from user feedback (localStorage)**

No backend APIs are required for core functionality.

## Why this project

Consistently producing creative, relevant content is difficult when brainstorming manually. This app solves that by providing an adaptive idea engine that:

1. Accepts creator input (platform, niche, audience, goal, effort).
2. Generates ranked ideas tailored to those parameters.
3. Learns what the user likes/dislikes over time.
4. Improves future ranking based on local feedback.

## Features

- **User-friendly interface** for structured content input.
- **Platform-specific outputs** for Instagram, TikTok, YouTube, LinkedIn, X, and Facebook.
- **Rule-based AI logic** with predefined templates, angles, and strategies.
- **Scoring model** based on:
  - goal fit
  - audience suitability
  - effort suitability
  - platform format fit
  - preference boost
- **Feedback learning** with "Helpful" / "Not for me" actions.
- **Persistent learning** via browser localStorage.
- **Regenerate variations** for fresh idea sets.

## Tech stack

- React + Vite
- Tailwind CSS
- Browser localStorage

## Run locally

```bash
npm install
npm run dev
```

Then open the Vite URL shown in your terminal.

## Build

```bash
npm run build
```

## Notes

- Learning data is stored only in the current browser profile.
- Use **Reset learning** in the UI to clear stored preference signals.
