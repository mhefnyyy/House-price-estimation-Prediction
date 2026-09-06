import joblib
import pandas as pd


class ModelService:
    def __init__(self, model_path: str, locations_path: str):
        self.model = joblib.load(model_path)
        with open(locations_path) as f:
            import json
            self.allowed_locations = json.load(f)

    def predict(self, row: pd.DataFrame) -> float:
        prediction = self.model.predict(row)
        return float(prediction[0])