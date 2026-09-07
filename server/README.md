# 🔌 AgriIntel Express.js API Gateway

Core transactional backend handling authentication, marketplace listings, orders, payments, and reverse-proxying ML inference.

## Responsibilities
- **Authentication**: JWT, DigiLocker OAuth sandbox integration, simulated Aadhaar verification.
- **Transactional CRUD**: Crop listings, input listings, orders, labor jobs, and worker profiles.
- **Payment Processing**: Razorpay order generation and webhook signature verification.
- **Real-Time Communication**: Socket.io server for direct farmer-buyer / farmer-worker chats.
- **ML/RAG Reverse Proxy**: Secure internal routing to FastAPI ML (`:8001`) and RAG (`:8002`) microservices.

## Getting Started
```bash
npm install
npm run dev
```
Runs on `http://localhost:5000`.
