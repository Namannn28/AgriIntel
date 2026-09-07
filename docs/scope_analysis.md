# 🔬 AgriIntel: Comprehensive Project Scope & Architectural Analysis

**Project Title:** AgriIntel — AI-Integrated Digital Platform for Farmer Empowerment  
**Team Allocation:** 5 Engineers | **Duration:** 26 Weeks (13 Sprints)  
**Document Type:** Strategic Scope Analysis, Risk Audit & Execution Blueprint  

---

## 1. Executive Summary & Viability Assessment

AgriIntel is an ambitious, high-impact GovTech + AgriTech initiative that unifies four historically fragmented agricultural pillars:
1. Direct crop marketplace (disintermediating exploitative commission agents/middlemen).
2. Computer-vision-driven crop disease diagnosis with actionable agronomic intervention.
3. RAG-grounded discovery and automated eligibility checking for central and state government agricultural subsidies.
4. Two-sided hyper-local agricultural labor marketplace with verified identity.

### Viability Scorecard
| Metric | Rating | Assessment |
|---|---|---|
| **Technical Ambition** | High (8.5/10) | Multi-model ML pipeline + RAG + WebSockets + Distributed Microservices. |
| **Team Feasibility** | Achievable (8.0/10) | Work is logically decoupled across 5 specialized roles with clear boundaries. |
| **Academic & Industry Value** | Exceptional (9.5/10) | Unusually strong capstone/portfolio story; avoids the "generic clone" trap. |
| **Risk of Over-Engineering** | Medium-High (7.0/10) | Microservices introduce network overhead, CORS, auth forwarding, and CI/CD complexity. |

---

## 2. Architectural Scope Analysis: Microservices vs. Monolith

The project adopts an asynchronous, distributed topology:
```
React.js PWA (Client) ──► Node.js / Express Gateway ──┬──► MongoDB Atlas (Transactional)
                                                     ├──► FastAPI ML Service (:8001)
                                                     ├──► FastAPI RAG Service (:8002)
                                                     └──► Third-Party APIs (Razorpay, Twilio, etc.)
```

### Why This Architecture Works
- **Language Optimization:** Python dominates ML/AI (PyTorch, LangChain, Sentence-Transformers, ChromaDB), while Node.js/Express excels at high-concurrency I/O, WebSockets (Socket.io), and fast CRUD transactions.
- **Resource Isolation:** CV image inference and embedding generation are CPU/GPU-intensive. Separating them prevents blocking Node's event loop during heavy user traffic.
- **Team Concurrency:** Person A and B can build full-stack marketplace routes in Node/React without conflicting with Person C (FastAPI ML) or Person D (FastAPI RAG).

### Latent Architectural Hazards & Solutions
1. **Network Latency & Free-Tier Cold Starts:**
   - *Risk:* Deploying Node, ML, and RAG across separate Render/Railway free-tier containers means spinning down after inactivity. A user request hitting the Gateway and proxying to an inactive ML service will suffer 30-50s cold start timeouts.
   - *Mitigation:* Implement lightweight health-check pingers, or run the ML models locally quantized (e.g., ONNX runtime or TorchScript) to minimize memory footprints.
2. **Identity & Auth Context Propagation:**
   - *Risk:* RAG and ML endpoints need user context (e.g., farmer state, land size) without re-validating JWTs redundantly.
   - *Mitigation:* Have Express Gateway validate JWT and inject sanitized headers (`X-User-ID`, `X-User-State`) before forwarding calls internally.

---

## 3. Workload Balance & Team Division Audit

The 5-engineer split is cleanly delineated:

### Person A — Marketplace & Logistics Lead
- **Scope:** Crop Listing CRUD, Agri-Inputs, Order State Machine, Razorpay Sandbox, Logistics Checkpoints.
- **Workload Assessment:** **Balanced.** Heavy transactional frontend + backend integration. E-commerce workflows are well-documented and predictable.

### Person B — Labor Marketplace & Real-Time Lead
- **Scope:** Worker Profiles, 2dsphere Geospatial Indexing, Job Application Life Cycle, Socket.io Chat, Review Engine.
- **Workload Assessment:** **Balanced.** Primary complexity lies in Socket.io connection state management and room-based messaging between farmers and workers.

### Person C — Core ML & Data Science Lead
- **Scope:** 3 distinct models:
  1. *CV Disease Detection* (PlantVillage dataset, transfer learning via EfficientNet/MobileNet).
  2. *Price Forecasting* (Mandi price historical time-series via Prophet/LSTM).
  3. *Crop Recommendation* (Tabular N-P-K classification via Random Forest/XGBoost).
- **Workload Assessment:** **High Intensity.** Data wrangling, cleaning noisy government mandi datasets, handling missing time-series records, and model quantization require significant ML engineering discipline.

### Person D — RAG, Assistant & GovTech Identity Lead
- **Scope:** Ingestion pipeline (PDF parsing, text chunking, metadata extraction), Chroma vector DB, LangChain prompt orchestration, DigiLocker Sandbox OAuth + Aadhaar Simulation, Whisper STT.
- **Workload Assessment:** **High Intensity.** RAG retrieval fidelity (mitigating hallucination) and DigiLocker partner sandbox approval are external friction points.

### Person E — Analytics, Notifications & DevOps Lead
- **Scope:** MongoDB Aggregation pipelines (disease heatmap, price trend aggregation), Open-Meteo weather rules, Twilio SMS/FCM notifications, Docker Compose, GitHub Actions CI/CD, k6 stress testing.
- **Workload Assessment:** **Moderate in early sprints; peaks in Sprints 9-12.** Acts as the system glue, release manager, and QA coordinator.

---

## 4. Deep Dive: AI/ML & RAG Technical Scope

### 4.1 Computer Vision Leaf Disease Detection
- **Dataset:** PlantVillage (54,303 images, 38 crop-disease pairs).
- **Architecture Choice:** `EfficientNet-B0` or `MobileNetV2`. Both have <15M parameters and run comfortably within 200ms on a standard CPU.
- **Production Gotcha:** PlantVillage has uniform laboratory backgrounds. Real farmer photos will feature noisy backgrounds, varied lighting, and multiple leaves.
- **Recommendation:** Implement synthetic data augmentation (color jitter, random crops, background overlays) and enforce a minimum confidence threshold (e.g., if confidence < 65%, return *"Unclear sample — please upload a closer leaf photo"*).

### 4.2 Mandi Price Forecasting & MSP Comparison
- **Dataset:** Agmarknet / data.gov.in (Daily mandi arrivals and modal prices across agricultural markets in India).
- **Modeling Choice:** Facebook `Prophet` is strongly recommended over deep LSTMs for MVP. Prophet naturally handles missing dates, seasonal agricultural harvest cycles, and national holidays.
- **MSP Grounding:** A curated JSON/MongoDB table of CACP (Commission for Agricultural Costs and Prices) mandated MSP rates for Kharif and Rabi crops.

### 4.3 RAG Knowledge Assistant & Anti-Hallucination Guardrails
- **Embeddings:** `all-MiniLM-L6-v2` (384-dimensional dense vectors, fast local inference, zero API fees).
- **Vector Database:** Self-hosted `ChromaDB` (embedded mode stored locally or containerized).
- **Strict Grounding:** Prompts must enforce:
  > *"You are AgriIntel's verified agricultural assistant. Base your answer strictly on the provided government scheme excerpts. If the information is not contained in the context, explicitly state that no verified policy matches the query. Cite the document title and clause."*
- **Evaluation Metric:** Implement Hit-rate@k (retrieval recall) and Faithfulness checks on a standardized 30-question benchmark set.

---

## 5. Risk Matrix & Mitigation Strategies

| Risk Category | Specific Failure Mode | Severity | Probability | Concrete Mitigation |
|---|---|---|---|---|
| **Identity / Regulatory** | DigiLocker Sandbox approval takes weeks or rejects student application | HIGH | MEDIUM | Provide a simulated Aadhaar eKYC service with OTP verification from Day 1; swap to DigiLocker once credentials arrive. |
| **Microservice Drift** | Frontend and ML teams implement incompatible API payload shapes | HIGH | HIGH | Define strict OpenAPI (Swagger) and JSON schema contracts in `docs/api_contracts.md` before writing code. |
| **Cloud Hosting Costs** | ML libraries (PyTorch, Torchvision, Chroma) exceed 512MB RAM free-tier limits | HIGH | MEDIUM | Export models to ONNX Runtime format. Quantize weights to INT8 to reduce RAM consumption by ~70%. |
| **Data Scarcity** | Government mandi APIs suffer downtime or irregular formatting | MEDIUM | MEDIUM | Pre-ingest 3-5 years of historical CSV data from Agmarknet for major staple crops (Wheat, Paddy, Tomato, Onion, Cotton) as baseline cache. |
| **Integration Bottleneck** | Sprint 9 encounters cross-service integration paralysis | CRITICAL | MEDIUM | Strict feature freeze in Sprint 9. Run automated Newman/Postman integration suites across all routes. |

---

## 6. Strategic Recommendations

1. **Adopt Contract-Driven Development Immediately:**
   Every route in Part 8 of the Master Document must have mock payloads running in Express before the ML or RAG models are fully trained.
2. **Prioritize the "Spine" (Modules 1-7):**
   Do not start building Agri-Inputs (Module 8) or Voice TTS (Module 12) until the Crop Marketplace, Disease CV, Price Forecast, and Subsidy RAG work seamlessly end-to-end.
3. **PWA Mobile-First UI:**
   Farmers interact primarily via low-cost Android smartphones. Ensure Tailwind layout is fully responsive and touch-optimized with high-contrast text and regional language readiness.
4. **Git Branching Discipline:**
   Adopt GitFlow: `main` (production), `develop` (staging), and feature branches (`feature/A-crop-listing`, `feature/C-cv-model`, `feature/D-rag-engine`).
