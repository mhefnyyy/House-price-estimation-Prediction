import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}