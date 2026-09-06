from fastapi import APIRouter, Request

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import request_to_dataframe

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, http_request: Request):
    model_service = http_request.app.state.model_service
    row = request_to_dataframe(request, model_service.allowed_locations)
    price = model_service.predict(row)
    return PredictionResponse(predicted_price=price)