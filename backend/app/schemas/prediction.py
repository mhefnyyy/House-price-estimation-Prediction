from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str
    area_sqft: float = Field(gt=0, description="Property area in square feet")
    floor_num: int
    bathroom: int = Field(ge=0)
    balcony: int = Field(ge=0)
    car_parking: int = Field(ge=0)
    furnishing: str  # "Furnished" | "Semi-Furnished" | "Unfurnished"
    transaction: str  # "New Property" | "Resale"
    ownership: str
    facing: str
    overlooking: str
    status: str


class PredictionResponse(BaseModel):
    predicted_price: float