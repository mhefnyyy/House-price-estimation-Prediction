import PredictionForm from "../components/PredictionForm";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>House Price Predictor</h1>
      <p>Enter the property details below to get an estimated price.</p>
      <PredictionForm />
    </div>
  );
}