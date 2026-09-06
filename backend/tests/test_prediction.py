import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path(client):
    payload = {
        "location": "gurgaon",
        "area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
        "overlooking": "Garden/Park",
        "status": "Ready to Move",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0


def test_predict_invalid_input(client):
    payload = {
        "location": "gurgaon",
        "area_sqft": -5,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
        "overlooking": "Garden/Park",
        "status": "Ready to Move",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422