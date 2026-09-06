import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { predict, fetchLocations, fetchCategories, PredictionApiError } from "../api/predictionClient";
import type { PredictionRequest, CategoryOptions } from "../types/prediction";
import "./PredictionForm.css";

const emptyForm = {
  location: "",
  area_sqft: "",
  floor_num: "",
  bathroom: "",
  balcony: "",
  car_parking: "",
  furnishing: "",
  transaction: "",
  ownership: "",
  facing: "",
  overlooking: "",
  status: "",
};

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOptions | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations().then(setLocations);
    fetchCategories().then(setCategories);
  }, []);

  function handleChange(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof typeof emptyForm)[] = [
      "location", "area_sqft", "floor_num", "bathroom", "balcony",
      "car_parking", "furnishing", "transaction", "ownership",
      "facing", "overlooking", "status",
    ];
    for (const field of requiredFields) {
      if (!form[field]) newErrors[field] = "This field is required.";
    }
    if (form.area_sqft && Number(form.area_sqft) <= 0) {
      newErrors.area_sqft = "Area must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    const payload: PredictionRequest = {
      location: form.location,
      area_sqft: Number(form.area_sqft),
      floor_num: Number(form.floor_num),
      bathroom: Number(form.bathroom),
      balcony: Number(form.balcony),
      car_parking: Number(form.car_parking),
      furnishing: form.furnishing,
      transaction: form.transaction,
      ownership: form.ownership,
      facing: form.facing,
      overlooking: form.overlooking,
      status: form.status,
    };

    setLoading(true);
    try {
      const result = await predict(payload);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      if (err instanceof PredictionApiError) {
        setApiError(err.message);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select id="location" value={form.location} onChange={(e) => handleChange("location", e.target.value)}>
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        {errors.location && <span className="error">{errors.location}</span>}
      </div>

      <div className="field">
        <label htmlFor="area_sqft">Area (sqft)</label>
        <input
          id="area_sqft"
          type="number"
          min="1"
          value={form.area_sqft}
          onChange={(e) => handleChange("area_sqft", e.target.value)}
        />
        {errors.area_sqft && <span className="error">{errors.area_sqft}</span>}
      </div>

      <div className="field">
        <label htmlFor="floor_num">Floor Number</label>
        <input
          id="floor_num"
          type="number"
          value={form.floor_num}
          onChange={(e) => handleChange("floor_num", e.target.value)}
        />
        {errors.floor_num && <span className="error">{errors.floor_num}</span>}
      </div>

      <div className="field">
        <label htmlFor="bathroom">Bathrooms</label>
        <input
          id="bathroom"
          type="number"
          min="0"
          value={form.bathroom}
          onChange={(e) => handleChange("bathroom", e.target.value)}
        />
        {errors.bathroom && <span className="error">{errors.bathroom}</span>}
      </div>

      <div className="field">
        <label htmlFor="balcony">Balconies</label>
        <input
          id="balcony"
          type="number"
          min="0"
          value={form.balcony}
          onChange={(e) => handleChange("balcony", e.target.value)}
        />
        {errors.balcony && <span className="error">{errors.balcony}</span>}
      </div>

      <div className="field">
        <label htmlFor="car_parking">Car Parking Spots</label>
        <input
          id="car_parking"
          type="number"
          min="0"
          value={form.car_parking}
          onChange={(e) => handleChange("car_parking", e.target.value)}
        />
        {errors.car_parking && <span className="error">{errors.car_parking}</span>}
      </div>

      <div className="field">
        <label htmlFor="furnishing">Furnishing</label>
        <select id="furnishing" value={form.furnishing} onChange={(e) => handleChange("furnishing", e.target.value)}>
          <option value="">Select furnishing</option>
          {categories?.furnishing.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.furnishing && <span className="error">{errors.furnishing}</span>}
      </div>

      <div className="field">
        <label htmlFor="transaction">Transaction Type</label>
        <select id="transaction" value={form.transaction} onChange={(e) => handleChange("transaction", e.target.value)}>
          <option value="">Select transaction type</option>
          {categories?.transaction.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.transaction && <span className="error">{errors.transaction}</span>}
      </div>

      <div className="field">
        <label htmlFor="ownership">Ownership</label>
        <select id="ownership" value={form.ownership} onChange={(e) => handleChange("ownership", e.target.value)}>
          <option value="">Select ownership</option>
          {categories?.ownership.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.ownership && <span className="error">{errors.ownership}</span>}
      </div>

      <div className="field">
        <label htmlFor="facing">Facing</label>
        <select id="facing" value={form.facing} onChange={(e) => handleChange("facing", e.target.value)}>
          <option value="">Select facing direction</option>
          {categories?.facing.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.facing && <span className="error">{errors.facing}</span>}
      </div>

      <div className="field">
        <label htmlFor="overlooking">Overlooking</label>
        <select id="overlooking" value={form.overlooking} onChange={(e) => handleChange("overlooking", e.target.value)}>
          <option value="">Select what the property overlooks</option>
          {categories?.overlooking.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.overlooking && <span className="error">{errors.overlooking}</span>}
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
          <option value="">Select status</option>
          {categories?.status.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.status && <span className="error">{errors.status}</span>}
      </div>

      {apiError && <div className="api-error">{apiError}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Calculating..." : "Get Predicted Price"}
      </button>
    </form>
  );
}