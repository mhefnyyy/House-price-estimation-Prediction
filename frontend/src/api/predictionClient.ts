import type { PredictionRequest, PredictionResponse } from "../types/prediction";
import type { CategoryOptions } from "../types/prediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class PredictionApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PredictionApiError";
    this.status = status;
  }
}

/**
 * Sends property details to the backend and returns the predicted price.
 * Throws PredictionApiError with a message safe to show to the user.
 */
export async function predict(payload: PredictionRequest): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new PredictionApiError(
      "Couldn't reach the valuation service. Check that the backend is running and try again.",
      0
    );
  }

  if (!response.ok) {
    let detail = `The valuation service returned an error (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // response body wasn't JSON — keep the default message
    }
    throw new PredictionApiError(detail, response.status);
  }

  return response.json();
}

/** Fetches the list of locations the model was trained on, for the dropdown. */
export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch("/locations.json");
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Pings the backend health check. */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/** Fetches the dropdown category options the model was trained on. */
export async function fetchCategories(): Promise<CategoryOptions | null> {
  try {
    const response = await fetch("/categories.json");
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}