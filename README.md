<div align="center">
  
# Nemesis: AI Red Teaming Platform

An automated AI Red Teaming Platform for discovering, executing, and evaluating LLM vulnerabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](#)

</div>

## 📌 Overview

**Nemesis** is a modern, modular AI Red Teaming platform built to systematically evaluate Large Language Models (LLMs) against adversarial attacks. It automatically discovers vulnerabilities, executes dynamic attack campaigns (e.g., Jailbreaks, Prompt Injections, Roleplay extraction), and quantitatively evaluates the target models using a Hybrid Evaluation approach (Regex/Rule-based + LLM-as-a-Judge). 

Unlike manual red-teaming scripts, Nemesis provides a complete orchestrator, a robust metric scoring system, and an interactive glassmorphism UI for continuous tracking and experimentation.

---

## 🚀 Features

* 🎯 **Dynamic Attack Generation**: Uses Litellm to abstract and dynamically generate unique adversarial prompts for predefined categories (Jailbreaks, Prompt Injections, Roleplay, etc.).
* 🧬 **Lineage Tracking & Mutations**: Evolve successful attacks across generations to increase efficacy over time.
* ⚖️ **Hybrid Evaluation**: 
  * *Rule-based Evaluator*: Fast, regex-based heuristic checks.
  * *LLM-as-a-Judge Evaluator*: A sophisticated LLM judge accurately classifies if the model successfully mitigated the attack or fell victim.
* 📊 **Campaign Orchestrator**: Run asynchronous multi-attack campaigns against any target model.
* 🖥️ **Stunning Dashboard**: A fully responsive, React-based UI that presents vulnerability scores, success rates, and live reports.

---

## 🛠️ Architecture

Nemesis is built with a modern tech stack designed for scalability and research experimentation.

* **Backend**: FastAPI (Python)
* **Database**: SQLite (via SQLAlchemy ORM)
* **LLM Orchestration**: LiteLLM (Supports Gemini, OpenAI, Anthropic, Meta, Mistral, Groq, Cohere, etc.)
* **Frontend**: React + Vite (Vanilla CSS)

---

## ⚙️ Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- API Keys for the models you wish to use as Attack Generators or Judges (e.g. `GEMINI_API_KEY`).

### 1. Clone the Repository
```bash
git clone https://github.com/RTE404/Nemesis.git
cd Nemesis
```

### 2. Backend Setup
Navigate to the `backend` directory, set up your virtual environment, and install dependencies:
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
Create a `.env` file inside the `backend` directory and add your API keys. LiteLLM handles the routing.
```env
# Example .env configuration
GEMINI_API_KEY=your_google_gemini_key_here
# OPENAI_API_KEY=your_openai_key_here
# ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Frontend Setup
Navigate to the `frontend` directory and install the Node dependencies:
```bash
cd ../frontend
npm install
```

---

## ⚡ Quickstart

### Starting the Servers

1. **Start the FastAPI Backend**
   ```bash
   cd backend
   # Ensure virtual environment is activated
   python api/main.py
   ```
   *The backend runs on `http://localhost:8000`*

2. **Start the React Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`*

### Running your first Campaign
1. Open the UI at `http://localhost:5173`.
2. Navigate to **Models** and click `Register Model`.
3. Choose your target model from the list of pre-configured options (e.g., `Gemini 3.5 Flash`).
4. Navigate to **Campaigns** and click `Launch Campaign`.
5. Select the newly registered model, choose your attack categories, and configure the attack count.
6. Once the background orchestrator finishes, click `View Report` to see the live vulnerability scoring!

---

## 🧠 Supported Attack Categories
- **Prompt Injection**: Overriding primary instructions.
- **Jailbreak**: Bypassing safety and alignment guardrails.
- **Roleplay**: Forcing the model into an unrestricted persona.
- **System Extraction**: Attempting to leak the hidden system prompt.
- **Context Manipulation**: Modifying the context window to confuse alignment heuristics.

---

## ⚠️ Disclaimer
This tool is built strictly for **authorized security research and internal AI safety evaluation**. Do not use this framework against models, APIs, or systems that you do not own or do not have explicit authorization to red-team.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
