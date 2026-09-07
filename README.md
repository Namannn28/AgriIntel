# 🌾 AgriIntel — AI-Integrated Digital Platform for Farmer Empowerment

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA-brightgreen)](#)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI%20%2B%20PyTorch-blue)](#)
[![RAG](https://img.shields.io/badge/RAG-LangChain%20%2B%20Chroma-purple)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

> **AgriIntel** is an end-to-end digital ecosystem built to tackle four critical vulnerabilities facing Indian farmers: middlemen margins in crop sales, delayed leaf disease diagnosis, manual discovery of government subsidies, and informal labor hiring.

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React.js Web App (PWA)                    │
│        Farmer / Buyer / Worker / Admin dashboards            │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS (REST) + WSS (Socket.io)
┌──────────────────────────▼───────────────────────────────────┐
│               Node.js + Express.js API Gateway               │
│ Auth | Listings | Orders | Jobs | Chat | Subsidy | Notify    │
└───┬──────────────┬──────────────┬───────────────┬────────────┘
    │              │              │               │
┌───▼─────┐  ┌─────▼──────┐ ┌────▼─────────┐ ┌────▼────────────┐
│ MongoDB  │  │ FastAPI ML   │ │ FastAPI RAG   │ │ External APIs   │
│ Atlas    │  │ Service      │ │ Service       │ │ Twilio, Razorpay│
│          │  │ - CV Disease │ │ - Chroma DB   │ │ Cloudinary,     │
│          │  │ - Forecast   │ │ - LangChain   │ │ DigiLocker,     │
│          │  │ - Recommend  │ │ - Whisper STT │ │ Open-Meteo      │
└──────────┘  └──────────────┘ └───────────────┘ └─────────────────┘
```

---

## 🚀 Repository Structure

```text
agriintel/
├── client/                 # React.js PWA frontend (TailwindCSS, Zustand/Redux)
├── server/                 # Node.js + Express.js API Gateway & WebSocket Server
├── ml-service/             # FastAPI ML microservice (PyTorch CV, Time Series, Reco)
├── rag-service/            # FastAPI RAG microservice (LangChain, Chroma, LLM, Whisper)
├── docs/                   # Architecture, Schemas, API contracts & Research Notes
├── .github/workflows/      # CI/CD automation pipelines (lint, test, build, deploy)
├── docker-compose.yml      # Local multi-service orchestration
├── PROJECT_MASTER.md       # 26-week master project & execution specification
└── README.md
```

---

## 🧩 Core Modules & Capabilities

### 1. Spine Modules (MVP — Fully Working)
1. **Identity & Auth**: Multi-tier authentication supporting DigiLocker partner sandbox (OAuth) and simulated Aadhaar eKYC.
2. **Crop Marketplace**: Direct farm-to-buyer listings, negotiation, order lifecycle, and Razorpay test payments.
3. **Labor Marketplace**: Two-way agricultural job matching, worker profiles, skill tags, and transparent hiring workflows.
4. **Computer Vision Disease Detection**: Upload crop leaf photographs for instant classification (EfficientNet-B0/MobileNetV2) and actionable treatment recommendations.
5. **Price Forecasting & MSP Comparison**: Mandatory mandi price trend forecasting vs Government Minimum Support Price (MSP) floor.
6. **Subsidy Eligibility Engine**: Algorithmic matching of farmer profiles (land size, state, crops) against central/state scheme criteria.
7. **RAG-Grounded Assistant**: RAG assistant powered by LangChain + Chroma + local embeddings (`all-MiniLM-L6-v2`) answering questions strictly grounded in verified government documents.

### 2. Extended Differentiators
8. **Agri-Inputs Marketplace**: Fertilizer, machinery, and tractor/truck rental listings.
9. **Admin Analytics Dashboard**: Disease heatmaps, mandi price fluctuations, and user demographics via MongoDB Aggregation Pipelines.
10. **Weather Alerts & Notifications**: Proactive agro-meteorological alerts using Open-Meteo and SMS/push notifications.
11. **Logistics & Delivery Tracking**: Pickup scheduling, dispatch checkpoints, and order transit status.
12. **Voice Interface**: Multilingual query input using OpenAI Whisper STT with local speech generation.

---

## 👥 Team Work Allocation (5 Engineers)

| Engineer | Lead Area | Primary Deliverables |
|---|---|---|
| **Person A** | **Marketplace & Logistics** | Crop & input listings, checkout/orders, Razorpay payments, logistics tracking |
| **B** | **Labor Marketplace** | Worker profiles, job postings/bidding, rating system, Socket.io real-time chat |
| **C** | **Core ML & Data Science** | PlantVillage disease classifier, Mandi price forecasting, crop recommendation |
| **D** | **RAG & Voice Assistant** | Document ingestion, Chroma vector DB, RAG pipeline, DigiLocker OAuth & Whisper STT |
| **E** | **DevOps & Analytics** | Admin dashboard, Open-Meteo alerts, CI/CD GitHub Actions, Docker & QA |

---

## 🛠 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, PWA Workbox, Zustand |
| **Backend API** | Node.js, Express.js, Socket.io, JWT, Mongoose |
| **Primary Database** | MongoDB Atlas (Geospatial 2dsphere indexing & aggregation pipelines) |
| **ML Service** | Python 3.10+, FastAPI, PyTorch / Torchvision, Scikit-learn, Prophet |
| **RAG Service** | LangChain, ChromaDB, Sentence-Transformers, HuggingFace / OpenAI API |
| **Speech / Voice** | OpenAI Whisper STT, Web Speech API / TTS |
| **Infra & DevOps** | Docker, Docker Compose, GitHub Actions, Vercel, Render / Railway |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/) installed, OR
- Node.js (v18+) and Python (v3.10+)

### Running with Docker Compose
```bash
# Clone the repository
git clone https://github.com/Namannn28/AgriIntel.git
cd AgriIntel

# Copy environment template
cp .env.example .env

# Spin up all 4 microservices + local services
docker-compose up --build
```

Access services:
- **Client (Web App)**: `http://localhost:3000`
- **Express API Gateway**: `http://localhost:5000`
- **FastAPI ML Service**: `http://localhost:8001/docs`
- **FastAPI RAG Service**: `http://localhost:8002/docs`

---

## 📅 26-Week Implementation Roadmap

- **Sprints 0-1 (Weeks 1-4)**: Architecture, CI skeleton, JWT auth, DigiLocker/Aadhaar shell, React baseline.
- **Sprints 2-3 (Weeks 5-8)**: Crop marketplace CRUD, Razorpay test payment flow, Vector DB initialization.
- **Sprints 4-5 (Weeks 9-12)**: Labor marketplace, job applications, Socket.io chat, RAG retrieval engine.
- **Sprints 6-8 (Weeks 13-18)**: CV disease detection model, mandi price forecasting model, subsidy engine, voice STT.
- **Sprint 9 (Weeks 19-20)**: **Full 5-engineer system integration** (Feature freeze).
- **Sprints 10-12 (Weeks 21-24)**: Admin analytics, weather triggers, stress testing (k6), containerized cloud deployment.
- **Sprint 13 (Weeks 25-26)**: Project report, defense presentation, demo video, and documentation signoff.

---

## 📄 License & Attribution

Distributed under the MIT License. See `LICENSE` for more information.
Designed and engineered by the **AgriIntel Team**.
