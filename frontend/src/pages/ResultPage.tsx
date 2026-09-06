import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const predictedPrice = (location.state as { predictedPrice?: number } | null)?.predictedPrice;

  if (predictedPrice === undefined) {
    return (
      <div className="result-page">
        <h1>No prediction found</h1>
        <p>Please fill out the form to get a price estimate.</p>
        <button onClick={() => navigate("/")}>Back to Form</button>
      </div>
    );
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(predictedPrice);

  return (
    <div className="result-page">
      <h1>Estimated Price</h1>
      <p className="price">{formatted}</p>
      <button onClick={() => navigate("/")}>Predict Another</button>
    </div>
  );
}