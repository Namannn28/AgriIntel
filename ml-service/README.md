# 🧠 AgriIntel Core ML Microservice (FastAPI)

Production model serving service built with Python 3.10 and FastAPI.

## Capabilities & Endpoints
1. **POST `/predict/disease`**: Leaf image classification for plant diseases using transfer learning (EfficientNet-B0 / MobileNetV2) trained on the PlantVillage dataset.
2. **POST `/predict/price`**: Mandi price forecasting using Facebook Prophet / LSTM with MSP comparison.
3. **POST `/recommend/crop`**: Soil and climate-based crop recommendation using Scikit-Learn (RandomForest / XGBoost).

## Local Development
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
Interactive Swagger docs: `http://localhost:8001/docs`
