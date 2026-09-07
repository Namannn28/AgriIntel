# AgriIntel
## AI-Integrated Digital Platform for Farmer Empowerment
### Master Project Document

**Team size:** 5 | **Duration:** 26 weeks (6 months) | **Category:** Full-Stack (MERN) + AI/ML + Data Science + GovTech

This is the single reference document for the project — what we're building, why, how it's architected, what tech is used, how work is split across 5 people, and the week-by-week plan to ship it. Anyone on the team should be able to read this and understand the full project without needing another document.

---

# PART 1 — PROJECT OVERVIEW

## 1.1 Problem Statement

Indian farmers face four disconnected problems today, each currently solved (badly) by a different party:
1. **No direct market access** — middlemen capture margin between farm-gate and mandi prices
2. **No easy way to diagnose crop disease** — delayed diagnosis = crop loss
3. **No visibility into eligible government subsidies** — schemes exist but discovery is manual, offline, and inconsistent across states
4. **No structured way to hire/find farm labor** — entirely informal, word-of-mouth today

AgriIntel solves all four in one platform, with AI/ML woven into the core (not bolted on) at three points: crop disease detection, price forecasting, and a retrieval-grounded assistant for scheme/crop queries.

## 1.2 Target Users
- **Farmers** (primary): sell crops, check prices, diagnose disease, find subsidies, hire labor
- **Buyers**: purchase crops directly from farmers
- **Workers**: find farm labor jobs
- **Admins**: platform oversight, analytics

## 1.3 Core Value Proposition
> One platform where a farmer logs in, checks if their crop looks diseased, sees what price they should actually be getting (vs MSP), finds out what government subsidies they qualify for, sells directly to a buyer, and hires help — all without a middleman, and in their own language.

---

# PART 2 — COMPLETE FEATURE LIST

## 2.1 Core Modules (MVP — must ship, fully working)

| # | Module | What it does |
|---|---|---|
| 1 | **Identity & Auth** | Login via DigiLocker sandbox (real) or simulated Aadhaar eKYC (disclosed simulation) |
| 2 | **Crop Marketplace** | Farmers list crops, buyers browse/order, direct trade, payments |
| 3 | **Labor Marketplace** | Two-way: workers build profiles + apply to jobs; farmers post jobs + hire |
| 4 | **Disease Detection (CV)** | Upload leaf photo → AI diagnoses disease + treatment suggestion |
| 5 | **Price Forecasting + MSP Comparison** | Predicts near-term mandi price, compares against government MSP floor |
| 6 | **Subsidy Eligibility Engine** | Matches farmer profile against central/state scheme rules, shows what they qualify for |
| 7 | **RAG-Based Farmer Assistant** | Ask free-form questions about schemes/crops/prices; answers are grounded in real documents with cited sources (not hallucinated) |

## 2.2 Extended Modules (build after MVP is solid)

| # | Module | What it does |
|---|---|---|
| 8 | **Agri-Inputs Marketplace** | Fertilizer, equipment, truck rental listings |
| 9 | **Admin Analytics Dashboard** | Disease heatmaps, price trends, platform usage stats |
| 10 | **Weather Alerts + Notifications** | SMS/push alerts for weather risk, price drops, subsidy deadlines |
| 11 | **Delivery/Logistics Tracking** | Order pickup scheduling, delivery status |
| 12 | **Voice Interface** | Voice query (Hindi/English) layered on top of the RAG assistant, using Whisper STT + TTS |

---

# PART 3 — SYSTEM ARCHITECTURE

## 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React.js Web App (PWA)                       │
│         Farmer / Buyer / Worker / Admin dashboards               │
└──────────────────────────┬────────────────────────────────────┘
                            │ HTTPS (REST) + WSS (Socket.io)
┌──────────────────────────▼────────────────────────────────────┐
│               Node.js + Express.js API Gateway                   │
│  Auth | Listings | Orders | Jobs | Chat | Subsidy | Notifications │
└───┬──────────────┬──────────────┬───────────────┬────────────┘
    │              │              │               │
┌───▼─────┐  ┌─────▼──────┐ ┌────▼─────────┐ ┌────▼────────────┐
│ MongoDB   │  │ FastAPI ML   │ │ FastAPI RAG   │ │ External services │
│ Atlas     │  │ Service      │ │ Service       │ │ Twilio, Cloudinary,│
│ (all app  │  │ - CV disease │ │ - Vector DB    │ │ Razorpay, Open-    │
│  data)    │  │ - Forecasting│ │   (Chroma)     │ │ Meteo, DigiLocker  │
│           │  │ - Recommend  │ │ - LLM query    │ │                    │
└───────────┘  └──────────────┘ │ - Whisper STT  │ └────────────────────┘
                                 └────────────────┘
```

## 3.2 Data Flow — Example: "Farmer checks a crop's price and asks about subsidy"
1. Farmer opens crop listing → frontend calls `/api/listings/crop/:id/price-comparison`
2. Express calls FastAPI ML service `/predict/price` → returns forecast + MSP
3. Frontend displays: asking price vs MSP vs forecast (visual comparison)
4. Farmer types/speaks a question ("what subsidy applies to me?") → frontend calls `/api/rag/query`
5. RAG service embeds the query, retrieves relevant scheme document chunks from Chroma, constructs a prompt, calls the LLM, returns a grounded answer + source citation
6. Response is displayed (and read aloud via TTS if voice mode)

## 3.3 Why microservices split (Node + 2x FastAPI) instead of one monolith
- Node/Express handles all transactional, CRUD-heavy, real-time work (its strength)
- Python/FastAPI handles ML inference and RAG — Python's ML/AI ecosystem (PyTorch, LangChain, sentence-transformers) has no real Node equivalent
- Keeping ML/RAG as separate services means they can be redeployed, scaled, or swapped independently without touching the main app — a legitimate production pattern, and a strong point to explain in your viva

---

# PART 4 — COMPLETE TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Frontend | React.js, Redux Toolkit/Zustand, TailwindCSS | Fast, resume-standard, component reuse across dashboards |
| Frontend delivery | PWA (installable, offline-tolerant shell) | Farmers often have low/unreliable data |
| Backend | Node.js + Express.js | REST API, JWT auth, business logic |
| Real-time | Socket.io | Chat, live application status |
| Primary DB | MongoDB (Atlas) | Flexible schema fits varied listing/profile types |
| ML service | Python + FastAPI | Model serving |
| CV model | PyTorch/TensorFlow + transfer learning (EfficientNet-B0/MobileNetV2) | Disease detection |
| Forecasting | Prophet or LSTM (Keras) | Price prediction |
| Recommendation | scikit-learn (RandomForest/XGBoost) | Crop recommendation |
| **RAG orchestration** | **LangChain** | Chunking, retrieval, prompt assembly |
| **Vector DB** | **Chroma** (self-hosted, free) | Stores document embeddings |
| **Embeddings** | **sentence-transformers (all-MiniLM-L6-v2)** | Free, runs locally, no API cost |
| **LLM (generation)** | **Claude/OpenAI API (trial credits) or Ollama (Llama 3 8B, self-hosted)** | Answer generation grounded in retrieved context |
| Voice | Whisper (STT) + browser/TTS API | Voice query support |
| Identity | DigiLocker Partner Sandbox (real) + simulated Aadhaar (disclosed) | Farmer verification |
| Notifications | Twilio SMS / Firebase Cloud Messaging | Weather/price/subsidy alerts |
| File storage | Cloudinary or AWS S3 | Images, docs |
| Payments | Razorpay (test mode) | Order checkout |
| Containerization | Docker + Docker Compose | Consistent local/prod parity |
| CI/CD | GitHub Actions | Lint → test → build → deploy |
| Hosting | Vercel (frontend), Render/Railway (Node + both FastAPI services), Atlas (DB) | Free-tier friendly |
| Monitoring | Sentry (errors), UptimeRobot (uptime) | Production-mindset polish |

---

# PART 5 — DATABASE SCHEMA (MongoDB)

```js
User { _id, phone (unique), name, role: farmer|worker|buyer|admin,
       state, district, digilockerVerified, aadhaarSimVerified, createdAt }

CropListing { _id, farmerId, cropName, quantity, unit, askingPrice,
              mspPrice, forecastPrice, images[], status, location, createdAt }

AgriInputListing { _id, sellerId, category: fertilizer|equipment|truck,
                    itemName, price, rentalUnit, subsidyEligible, location }

Order { _id, buyerId, listingId, listingType, quantity, agreedPrice,
        status, paymentId, deliveryStatus, pickupDate,
        deliveryAddress, trackingUpdates[], createdAt }

WorkerProfile { _id, userId (unique), skills[], dailyWage, experienceYears,
                availability, location{lat,lng,city}, rating{avg,count},
                completedJobs, profilePhoto }

JobPosting { _id, farmerId, taskType, wageOffered, workersNeeded,
             startDate, endDate, location, status,
             applicants: [{workerId, status, appliedAt}], createdAt }

SubsidyScheme { _id, name, level: central|state, state,
                 eligibilityRules{cropTypes[], landSizeMaxAcres, category[]},
                 benefitAmount, applicationLink }

KnowledgeDocument { _id, title, docType: subsidy_scheme|disease_guide|msp_policy|best_practice,
                     sourceUrl, state, ingestedAt, chunkCount }

RAGQueryLog { _id, userId, queryText, language, retrievedDocIds[],
              answer, latencyMs, timestamp }

ChatMessage { _id, senderId, receiverId, contextType: order|job, contextId,
              message, timestamp }

Review { _id, contextType, contextId, fromUserId, toUserId, rating, comment, createdAt }
```

---

# PART 6 — TEAM STRUCTURE & WORK DIVISION (5 members)

| Person | Role | Primary Ownership |
|---|---|---|
| **A** | Marketplace & Logistics Lead | Crop + agri-input listings, orders, payments, delivery tracking |
| **B** | Labor Marketplace Lead | Worker profiles, job postings, applications, ratings, real-time chat |
| **C** | Core ML Lead | Disease CV model, price forecasting, crop recommendation, FastAPI serving |
| **D** | RAG & Intelligent Assistant Lead | Document ingestion, vector DB, RAG query service, voice interface, identity (DigiLocker/Aadhaar), subsidy document curation |
| **E** | Analytics, Notifications & DevOps Lead | Admin dashboard, weather alerts/notifications, CI/CD, deployment, QA coordination |

---

# PART 7 — FULL IMPLEMENTATION TIMELINE (26 weeks / 13 sprints)

| Sprint | Weeks | Theme | Key outputs |
|---|---|---|---|
| 0 | 1-2 | Research & setup | Wireframes, repo/CI skeleton, dataset + document collection starts |
| 1 | 3-4 | Auth + shell | JWT auth, DigiLocker OAuth, Aadhaar sim, base React app |
| 2 | 5-6 | Crop marketplace | Listing CRUD, search/filter, image upload |
| 3 | 7-8 | Orders + logistics | Payments (Razorpay), delivery tracking, Chroma vector DB set up |
| 4 | 9-10 | Labor marketplace core | Worker profiles, job postings; RAG query service build begins |
| 5 | 11-12 | Hiring flow + reviews | Application/hire flow, ratings; RAG generation integrated |
| 6 | 13-14 | CV model | Disease detection trained + served; RAG eval test set built |
| 7 | 15-16 | Forecasting + MSP | Price model live, MSP comparison UI; RAG retrieval tuning |
| 8 | 17-18 | Recommendation + subsidy engine | Crop recommendation live, subsidy rules engine; voice STT integration |
| 9 | 19-20 | **Full integration (all 5)** | Every module wired end-to-end, no new features |
| 10 | 21-22 | Extended features | Admin dashboard, weather alerts, agri-inputs marketplace, voice polish |
| 11 | 23 | Testing & hardening | Full test suite run, security pass, RAG evaluation finalized |
| 12 | 24 | Deployment | All services containerized and deployed, monitoring live |
| 13 | 25-26 | Documentation & demo | Final report, demo video, presentation, resume writeups |

---

# PART 8 — API DESIGN SUMMARY

```
AUTH        POST /api/auth/register, /otp/verify, /digilocker/callback, /aadhaar/simulate
USERS       GET/PUT /api/users/me
LISTINGS    CRUD /api/listings/crop, /api/listings/inputs
            GET  /api/listings/crop/:id/price-comparison
ORDERS      POST /api/orders, GET /api/orders/mine, PUT /api/orders/:id/status
            POST /api/payments/create-order, /verify
WORKERS     POST/GET /api/workers/profile, GET /api/workers
JOBS        CRUD /api/jobs, POST /api/jobs/:id/apply
            PUT  /api/jobs/:id/applicants/:workerId
REVIEWS     POST /api/reviews, GET /api/reviews/user/:id
CHAT        GET /api/chat/:contextId/messages + Socket.io events
SUBSIDY     GET /api/subsidies/eligible, GET /api/subsidies
RAG         POST /api/rag/query, POST /api/rag/ingest (admin)
VOICE       POST /api/voice/query
WEATHER     GET /api/weather/:location
NOTIFY      POST /api/notifications/subscribe
ADMIN       GET /api/admin/analytics/disease-heatmap, /price-trends, /platform-stats
ML PROXY    POST /api/ml/disease-detect, /price-forecast, /crop-recommend

FastAPI ML  POST /predict/disease, /predict/price, /recommend/crop
FastAPI RAG POST /rag/query (internal), ingestion pipeline scripts (offline)
```

---

# PART 9 — TESTING PLAN

| Type | Tool | Covers |
|---|---|---|
| Unit (backend) | Jest + Supertest | All route handlers, middleware |
| Unit (ML/RAG) | Pytest | Model I/O shape, retrieval function correctness |
| Integration | Postman/Newman | Every API endpoint |
| E2E | Cypress/Playwright | Register→list→order; post job→apply→hire; ask RAG question→get grounded answer |
| ML validation | Confusion matrix, MAPE/RMSE | CV and forecasting model quality |
| RAG evaluation | Hit-rate@k, faithfulness review, latency | 30-50 question test set |
| Load | k6 | 100 concurrent users on search/chat/RAG query |
| Security | Manual + npm audit | JWT handling, rate limiting, input sanitization |

---

# PART 10 — DEPLOYMENT PLAN

1. Dockerfile per service: `client/`, `server/`, `ml-service/`, `rag-service/`
2. `docker-compose.yml` mirrors production topology for local dev
3. GitHub Actions: PR → lint+test; merge to `main` → build+deploy
4. Hosting: Vercel (frontend) · Render/Railway (Express, ML, RAG services) · MongoDB Atlas (DB)
5. Secrets via platform environment variable managers, `.env.example` committed
6. Sentry for error tracking, UptimeRobot for uptime monitoring
7. Post-deploy smoke test (Newman collection) against production URL before demo day
