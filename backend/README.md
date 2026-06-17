---
title: Nemesis Backend
emoji: 🎯
colorFrom: red
colorTo: purple
sdk: docker
pinned: false
---

# Nemesis — AI Red Teaming Platform (Backend)

FastAPI backend for the Nemesis AI Red Teaming platform.

## Environment Variables

Set the following in the Space's **Settings → Variables**:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `DATABASE_URL` | `sqlite:///./data/redteam.db` |
