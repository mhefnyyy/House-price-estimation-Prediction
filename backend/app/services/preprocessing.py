import pandas as pd

from app.schemas.prediction import PredictionRequest


def request_to_dataframe(request: PredictionRequest, allowed_locations: list[str]) -> pd.DataFrame:
    location = request.location if request.location in allowed_locations else "other"

    row = {
        "area_sqft": request.area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "car_parking": request.car_parking,
        "location_grouped": location,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
        "overlooking": request.overlooking,
        "Status": request.status,
    }

    return pd.DataFrame([row])