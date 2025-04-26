// Use preact with htm for JSX-like syntax without transpilation
const { h } = preact;
const { useState, useEffect } = preactHooks;
const html = htm.bind(h);

// Import configuration
import { toughTongueConfig, apiConfig } from "./config.js";

// Assessment Page Component
export const AssessmentPage = ({ sessionData, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        // Call the analysis API to get session data
        const response = await fetch(apiConfig.endpoints.analyze, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionData.sessionId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch assessment");
        }

        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionData && sessionData.sessionId) {
      fetchAssessment();
    } else {
      setError("Invalid session data");
      setLoading(false);
    }
  }, [sessionData]);

  if (loading) {
    return html`<div class="container assessment-loading">
      <h2>Loading your assessment...</h2>
      <div class="loading-spinner"></div>
    </div>`;
  }

  if (error) {
    return html`<div class="container assessment-error">
      <h2>Error loading assessment</h2>
      <p>${error}</p>
      <button class="btn" onClick=${onBack}>Go Back</button>
    </div>`;
  }

  return html`
    <div class="container assessment-container">
      <h2 class="section-title">Your Assessment Results</h2>

      ${assessment
        ? html`
            <div class="assessment-content">
              <h3>Session Summary</h3>
              <div class="summary-info">
                <p><strong>Session ID:</strong> ${sessionData.sessionId}</p>
                <p>
                  <strong>Completed:</strong> ${new Date(sessionData.timestamp).toLocaleString()}
                </p>
                ${assessment.evaluation?.overall_score &&
                html`<p><strong>Overall Score:</strong> ${assessment.evaluation.overall_score}</p>`}
              </div>

              ${assessment.evaluation &&
              html`
                <h3>Evaluation</h3>
                <div class="evaluation-container">
                  ${assessment.evaluation.detailed_feedback &&
                  html`
                    <div class="feedback-section">
                      <h4>Detailed Feedback</h4>
                      <p>${assessment.evaluation.detailed_feedback}</p>
                    </div>
                  `}

                  <div class="strengths-weaknesses">
                    ${assessment.evaluation.strengths &&
                    html`
                      <div class="strengths">
                        <h4>Strengths</h4>
                        <p>${assessment.evaluation.strengths}</p>
                      </div>
                    `}
                    ${assessment.evaluation.weaknesses &&
                    html`
                      <div class="weaknesses">
                        <h4>Areas for Improvement</h4>
                        <p>${assessment.evaluation.weaknesses}</p>
                      </div>
                    `}
                  </div>
                </div>
              `}
              ${assessment.improvement &&
              html`
                <h3>Improvement Plan</h3>
                <div class="improvement-container">
                  ${assessment.improvement.improvement_areas &&
                  html`
                    <div class="improvement-areas">
                      <h4>Focus Areas</h4>
                      <p>${assessment.improvement.improvement_areas}</p>
                    </div>
                  `}
                  ${assessment.improvement.action_items &&
                  html`
                    <div class="action-items">
                      <h4>Action Items</h4>
                      <pre>${assessment.improvement.action_items}</pre>
                    </div>
                  `}
                  ${assessment.improvement.resources &&
                  html`
                    <div class="resources">
                      <h4>Recommended Resources</h4>
                      <div class="markdown-content">
                        <pre>${assessment.improvement.resources}</pre>
                      </div>
                    </div>
                  `}
                </div>
              `}
            </div>
          `
        : html`<p class="empty-message">No assessment data available</p>`}

      <button class="btn return-btn" onClick=${onBack}>Return to Home</button>
    </div>
  `;
};
