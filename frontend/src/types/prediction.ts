// Mirrors backend/app/schemas/prediction.py
export interface PredictionRequest {
  location: string;
  area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  car_parking: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
  overlooking: string;
  status: string;
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface ApiError {
  detail: string;
}

export interface CategoryOptions {
  furnishing: string[];
  transaction: string[];
  ownership: string[];
  facing: string[];
  overlooking: string[];
  status: string[];
}