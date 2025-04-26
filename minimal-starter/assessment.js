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
              </div>

              <h3>Transcript</h3>
              <div class="transcript-container">
                ${assessment.transcript && assessment.transcript.length
                  ? html`
                      <div class="transcript">
                        ${assessment.transcript.map(
                          (item) => html`
                            <div class="transcript-item ${item.role}">
                              <strong>${item.role === "assistant" ? "AI" : "You"}:</strong>
                              ${item.content}
                            </div>
                          `
                        )}
                      </div>
                    `
                  : html`<p class="empty-message">Transcript not available</p>`}
              </div>

              <h3>Analysis</h3>
              <div class="analysis-container">
                ${assessment.analysis
                  ? html`
                      <pre class="analysis-json">
${JSON.stringify(assessment.analysis, null, 2)}</pre
                      >
                    `
                  : html`<p class="empty-message">Analysis not available</p>`}
              </div>
            </div>
          `
        : html`<p class="empty-message">No assessment data available</p>`}

      <button class="btn return-btn" onClick=${onBack}>Return to Home</button>
    </div>
  `;
};
