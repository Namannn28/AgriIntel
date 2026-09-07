# 📜 AgriIntel API Interface Contracts

This document formalizes the agreed request and response payloads between the **Express API Gateway**, the **FastAPI ML Service**, and the **FastAPI RAG Service**.

---

## 1. Authentication & Identity (`/api/auth`)

### `POST /api/auth/register`
**Request:**
```json
{
  "phone": "9876543210",
  "name": "Ramesh Kumar",
  "role": "farmer",
  "state": "Madhya Pradesh",
  "district": "Sehore"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ramesh Kumar",
    "phone": "9876543210",
    "role": "farmer",
    "digilockerVerified": false,
    "aadhaarSimVerified": false
  }
}
```

### `POST /api/auth/aadhaar/simulate`
**Request:**
```json
{
  "aadhaarNumber": "123456789012",
  "otp": "123456"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "verified": true,
  "message": "Aadhaar verified via simulated eKYC"
}
```

---

## 2. Core ML Service Contracts (FastAPI `:8001`)

### `POST /predict/disease`
**Request:** `multipart/form-data`
- `file`: Leaf image binary (`image/jpeg`, `image/png`)

**Response (200 OK):**
```json
{
  "crop": "Tomato",
  "disease": "Early Blight (Alternaria solani)",
  "confidence": 0.942,
  "treatment": "Apply Mancozeb or Copper-based fungicides. Remove infected lower leaves.",
  "prevention": "Ensure drip irrigation to keep foliage dry. Rotate crops every 2 seasons."
}
```

### `POST /predict/price`
**Request:**
```json
{
  "crop_name": "Wheat",
  "state": "Madhya Pradesh",
  "district": "Sehore",
  "forecast_days": 15
}
```
**Response (200 OK):**
```json
{
  "crop_name": "Wheat",
  "state": "Madhya Pradesh",
  "current_avg_price": 2450.0,
  "msp_price": 2275.0,
  "predicted_trend": "UPWARD",
  "forecast_days": 15,
  "forecast_series": [
    {"day": 1, "predicted_price": 2465.0, "confidence_lower": 2410.0, "confidence_upper": 2520.0},
    {"day": 5, "predicted_price": 2510.0, "confidence_lower": 2440.0, "confidence_upper": 2580.0},
    {"day": 15, "predicted_price": 2600.0, "confidence_lower": 2500.0, "confidence_upper": 2700.0}
  ]
}
```

---

## 3. RAG Knowledge Service Contracts (FastAPI `:8002`)

### `POST /rag/query`
**Request:**
```json
{
  "query": "Am I eligible for PM-KISAN if I own 1.5 hectares in Punjab?",
  "language": "en",
  "user_state": "Punjab",
  "farmer_category": "marginal"
}
```
**Response (200 OK):**
```json
{
  "query": "Am I eligible for PM-KISAN if I own 1.5 hectares in Punjab?",
  "answer": "Yes, you are eligible. PM-KISAN provides income support of ₹6,000 per year to small and marginal farmer families owning cultivable land up to 2 hectares.",
  "citations": [
    {
      "title": "PM-KISAN Operational Guidelines - Ministry of Agriculture",
      "doc_type": "subsidy_scheme",
      "source_url": "https://pmkisan.gov.in/",
      "snippet": "All landholding farmer families having cultivable landholding up to 2 hectares are eligible for benefit under the scheme."
    }
  ],
  "latency_ms": 142.5
}
```
