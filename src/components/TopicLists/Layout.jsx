import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Layout({ title, topics, backPath }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (backPath) {
      navigate(backPath, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>{title}</h1>
      </header>

      <main className="section-content">
        <ul className="topics-list">
          {topics.map((t) => (
            <li key={t.id} className="topic-item">
              <Link to={t.path} className="topic-link">
                <span className="topic-icon">{t.icon}</span>
                <span className="topic-title">{t.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
