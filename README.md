<div align="center">
  
# Nemesis: AI Red Teaming Platform

An automated AI Red Teaming Platform for discovering, executing, and evaluating LLM vulnerabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](#)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-nemesis--peach.vercel.app-brightgreen)](https://nemesis-peach.vercel.app)

### 🌐 [Live Demo → nemesis-peach.vercel.app](https://nemesis-peach.vercel.app)

</div>

## 📌 Overview

**Nemesis** is a modern, modular AI Red Teaming platform built to systematically evaluate Large Language Models (LLMs) against adversarial attacks. It automatically discovers vulnerabilities, executes dynamic attack campaigns (e.g., Jailbreaks, Prompt Injections, Roleplay extraction), and quantitatively evaluates the target models using a Hybrid Evaluation approach (Regex/Rule-based + LLM-as-a-Judge).

Unlike manual red-teaming scripts, Nemesis provides a complete orchestrator, a robust metric scoring system, and an interactive glassmorphism UI for continuous tracking and experimentation.

---

## 🚀 Features

* 🎯 **Dynamic Attack Generation**: Uses LiteLLM to abstract and dynamically generate unique adversarial prompts for predefined categories (Jailbreaks, Prompt Injections, Roleplay, etc.).
* 🧬 **Lineage Tracking & Mutations**: Evolve successful attacks across generations to increase efficacy over time.
* ⚖️ **Hybrid Evaluation**:
  * *Rule-based Evaluator*: Fast, regex-based heuristic checks.
  * *LLM-as-a-Judge Evaluator*: A sophisticated LLM judge accurately classifies if the model successfully mitigated the attack or fell victim.
* 📊 **Campaign Orchestrator**: Run asynchronous multi-attack campaigns against any target model.
* 🖥️ **Stunning Dashboard**: A fully responsive, React-based UI that presents vulnerability scores, success rates, and live reports.
* 🐳 **Fully Dockerized**: Run the entire stack locally with a single command.

---

## 🛠️ Architecture

Nemesis is built with a modern tech stack designed for scalability and research experimentation.

* **Backend**: FastAPI (Python)
* **Database**: SQLite (via SQLAlchemy ORM)
* **LLM Orchestration**: LiteLLM (Supports Gemini, OpenAI, Anthropic, Meta, Mistral, Groq, Cohere, etc.)
* **Frontend**: React + Vite (Vanilla CSS)

---

## 🌍 Live Deployment

| Component | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [nemesis-peach.vercel.app](https://nemesis-peach.vercel.app) |
| **Backend API** | Hugging Face Spaces | [rte404-nemesis-backend.hf.space](https://rte404-nemesis-backend.hf.space) |
| **Source Code** | GitHub | [github.com/RTE404/Nemesis](https://github.com/RTE404/Nemesis) |

> ⚠️ The backend runs on Hugging Face Spaces free tier and may have a **cold start delay of ~30 seconds** if it hasn't been used recently. Refresh if the dashboard doesn't load immediately.

---

## 🐳 Run Locally with Docker (Recommended)

The fastest way to run the full stack locally.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repository
```bash
git clone https://github.com/RTE404/Nemesis.git
cd Nemesis
```

### 2. Set up environment variables
Create a `.env` file inside the `backend/` directory:
```env
GEMINI_API_KEY=your_google_gemini_key_here
# OPENAI_API_KEY=your_openai_key_here
# ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 3. Start the full stack
```bash
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8000 |

### 4. Stop the stack
```bash
docker compose down
```

---

## ⚙️ Manual Installation (Without Docker)

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/RTE404/Nemesis.git
cd Nemesis
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
GEMINI_API_KEY=your_google_gemini_key_here
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## ⚡ Quickstart (Manual)

1. **Start the FastAPI Backend**
   ```bash
   cd backend
   python api/main.py
   ```
   *Runs on `http://localhost:8000`*

2. **Start the React Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs on `http://localhost:5173`*

### Running your first Campaign
1. Open the UI at `http://localhost:5173`
2. Navigate to **Models** → click `Register Model`
3. Choose your target model (e.g., `Gemini 3.5 Flash`)
4. Navigate to **Campaigns** → click `Launch Campaign`
5. Select the model, choose attack categories, and configure attack count
6. Once the background orchestrator finishes, click `View Report` to see live vulnerability scoring

---

## 🧠 Supported Attack Categories
- **Prompt Injection**: Overriding primary instructions.
- **Jailbreak**: Bypassing safety and alignment guardrails.
- **Roleplay**: Forcing the model into an unrestricted persona.
- **System Extraction**: Attempting to leak the hidden system prompt.
- **Context Manipulation**: Modifying the context window to confuse alignment heuristics.

---

## 🚢 Deployment Guide

This project is deployed using a completely free, no credit-card required stack.

### Stack
```
GitHub (source) → Hugging Face Spaces (backend) + Vercel (frontend)
```

### Backend — Hugging Face Spaces (Docker)
The `backend/` folder is deployed as a Docker Space on Hugging Face.

1. Create a new Space at [huggingface.co/new-space](https://huggingface.co/new-space) — choose **Docker** SDK
2. Push the contents of `backend/` to the Space's git repo
3. In **Settings → Variables and Secrets**, add:
   - `GEMINI_API_KEY` — your Gemini API key
   - `DATABASE_URL` — `sqlite:///./data/redteam.db`
4. The Space builds automatically from `backend/Dockerfile` and listens on port `7860`

### Frontend — Vercel (Static)
The `frontend/` folder is deployed as a Static Site on Vercel.

1. Import the GitHub repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set **Install Command** to `npm ci`
4. Add environment variable:
   - `VITE_API_URL` — your HF Space backend URL (e.g. `https://rte404-nemesis-backend.hf.space`)
5. Deploy — Vercel auto-redeploys on every push to `master`

---

## ⚠️ Disclaimer
This tool is built strictly for **authorized security research and internal AI safety evaluation**. Do not use this framework against models, APIs, or systems that you do not own or do not have explicit authorization to red-team.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
