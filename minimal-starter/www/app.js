// Use preact with htm for JSX-like syntax without transpilation
const { h, render, Component } = preact;
const { useState, useEffect } = preactHooks;
const html = htm.bind(h);

// Import data from data.js
import { personalityTypes, toughTongueConfig, apiConfig } from "/config.js";
// Import the AssessmentPage component
import { AssessmentPage } from "/assessment.js";

// Function to call our Flask backend
const analyzeSession = async (sessionId) => {
  try {
    const response = await fetch(apiConfig.endpoints.sessions(sessionId));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error: ${response.status}`, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error || "Unknown error"}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error analyzing session:", error);
    return {
      error: true,
      message: error.message || "Failed to analyze session. Please try again.",
    };
  }
};

// Format test results helper functions
const formatAnalysisResults = (result) => {
  const traits =
    result.traits && Array.isArray(result.traits)
      ? result.traits.map((trait) => `- ${trait}\n`).join("")
      : "- Analytical thinker\n- Detail-oriented\n- Strong communication skills";

  const recommendations =
    result.recommendations && Array.isArray(result.recommendations)
      ? result.recommendations.map((rec) => `- ${rec}\n`).join("")
      : "- Consider practicing active listening\n- Explore collaborative projects\n- Develop more patience in complex situations";

  return `
# Your Personality Assessment Results

## Key Traits
${traits}

## Recommended Growth Areas
${recommendations}

*This assessment was completed on ${new Date().toLocaleDateString()}*
  `;
};

const formatErrorResults = (message) => {
  return `
# Analysis Error

${message}

*Please try the assessment again or contact support if this issue persists.*
  `;
};

const getDefaultResults = () => {
  return `
# Your Personality Assessment Results

## Key Traits
- Analytical thinker
- Detail-oriented
- Strong communication skills

## Recommended Growth Areas
- Consider practicing active listening
- Explore collaborative projects
- Develop more patience in complex situations

*This assessment was completed on ${new Date().toLocaleDateString()}*
  `;
};

// Navbar Component
const Navbar = () => {
  return html`
    <nav class="navbar">
      <div class="container navbar-container">
        <div class="logo">PersonalityLens</div>
      </div>
    </nav>
  `;
};

// Personality Card Component
const PersonalityCard = ({ title, description, mbti }) => {
  return html`
    <div class="personality-card">
      <h3 class="personality-title">${title}</h3>
      <p class="personality-description">${description}</p>
      ${mbti && html`<p class="personality-mbti"><strong>MBTI:</strong> ${mbti}</p>`}
    </div>
  `;
};

// ToughTongueAI Component
const ToughTongueAI = ({ onAssessmentStart, onAssessmentEnd }) => {
  const [showIframe, setShowIframe] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [testResults, setTestResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionIdInput, setSessionIdInput] = useState("");

  const toggleIframe = () => {
    const newState = !showIframe;
    setShowIframe(newState);

    // Notify parent component about state change
    if (newState) {
      onAssessmentStart();
      // Reset session data when toggling iframe
      setSessionData(null);
      setShowAssessment(false);
      setTestResults("");
      setSessionCompleted(false);
      setSessionIdInput("");
    } else {
      onAssessmentEnd();
    }
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      const data = event.data;

      if (data && data.event) {
        console.log("Received event:", data);

        switch (data.event) {
          case "onStart":
            console.log("Session started:", data);
            // Store the session ID
            setSessionData({
              sessionId: data.sessionId,
              status: "started",
              timestamp: data.timestamp,
            });
            setSessionIdInput(data.sessionId);
            break;

          case "onStop":
            console.log("Session stopped:", data);
            // Update session status but keep iframe visible
            const sessionId = data.sessionId || (sessionData && sessionData.sessionId);

            setSessionData((prevData) => ({
              ...prevData,
              status: "completed",
              timestamp: data.timestamp,
            }));

            // Mark session as completed, but don't hide iframe or load assessment yet
            setSessionCompleted(true);
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [sessionData]);

  // Function to manually get analysis results
  const getAnalysisResults = async () => {
    const sessionIdToAnalyze = sessionIdInput.trim();

    if (!sessionIdToAnalyze) {
      alert("Please enter a valid session ID.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await analyzeSession(sessionIdToAnalyze);
      if (result) {
        console.log("Session analysis:", result);
        // Handle error case from analyzeSession
        if (result.error) {
          setTestResults(formatErrorResults(result.message));
        } else {
          // Process the actual analysis data
          setTestResults(formatAnalysisResults(result));
        }
      }
    } catch (error) {
      console.error("Failed to analyze session:", error);
      setTestResults(formatErrorResults("Failed to complete your personality assessment."));
    } finally {
      setIsLoading(false);
      setShowAssessment(true);

      // Update sessionData with the analyzed session ID if it's different
      if (sessionData?.sessionId !== sessionIdToAnalyze) {
        setSessionData({
          sessionId: sessionIdToAnalyze,
          status: "external",
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  // Handle session ID input change
  const handleSessionIdChange = (e) => {
    setSessionIdInput(e.target.value);
  };

  // Build the iframe URL with customization options
  const buildIframeUrl = () => {
    // Use the minimal embed URL format
    let baseUrl = `${toughTongueConfig.baseUrl}/embed/${toughTongueConfig.scenarioId}`;

    // Add customization parameters
    const params = new URLSearchParams();

    // Add custom styling options
    params.append("name", toughTongueConfig.defaultStyles.name);
    params.append("color", toughTongueConfig.defaultStyles.color);
    params.append("bg", toughTongueConfig.defaultStyles.background || "black");

    // Enable features as per the example
    params.append("pulse", "true");
    params.append("transcribe", "true");

    return `${baseUrl}?${params.toString()}`;
  };

  const handleBackFromAssessment = () => {
    setShowAssessment(false);
    setShowIframe(false);
    onAssessmentEnd();
  };

  // Show only iframe content when it's active
  if (showIframe) {
    return html`
      <div class="container full-page-iframe">
        <button class="btn back-button" onClick=${toggleIframe}>Back to Main Page</button>

        <div class="iframe-container active">
          <iframe
            src=${buildIframeUrl()}
            width="100%"
            height="100%"
            frameborder="0"
            allow="microphone"
          ></iframe>
        </div>

        <div class="session-id-box">
          <label for="session-id-input">Session ID:</label>
          <input
            id="session-id-input"
            type="text"
            value=${sessionIdInput}
            onChange=${handleSessionIdChange}
            placeholder="Enter session ID"
            class="session-id-input"
          />
        </div>

        <div style="margin: 20px 0; text-align: center;">
          <button class="btn" onClick=${getAnalysisResults}>Get Assessment Results</button>
        </div>

        ${isLoading
          ? html`
              <div class="loading-container">
                <h2>Processing your assessment...</h2>
                <div class="loading-spinner"></div>
              </div>
            `
          : ""}
        ${showAssessment && sessionData
          ? html`
              <${AssessmentPage} sessionData=${sessionData} onBack=${handleBackFromAssessment} />
            `
          : ""}
      </div>
    `;
  }

  return html`
    <div class="personality-section">
      <div class="container">
        <h2 class="section-title">Discover Your Personality Type</h2>
        <p class="section-subtitle">
          Talk to our AI assistant to help identify your personality traits and learn more about
          yourself.
        </p>

        <button class="btn" onClick=${toggleIframe}>Start Personality Assessment</button>
      </div>
    </div>
  `;
};

// Main App Component
const App = () => {
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);

  const handleAssessmentStart = () => {
    setIsAssessmentActive(true);
  };

  const handleAssessmentEnd = () => {
    setIsAssessmentActive(false);
  };

  return html`
    <${Navbar} />
    <main>
      ${!isAssessmentActive &&
      html`
        <section class="personality-section">
          <div class="container">
            <h2 class="section-title">Personality Types</h2>
            <p class="section-subtitle">
              Explore different personality types and their characteristics. Understanding these
              types can help you better understand yourself and others.
            </p>
            <div class="personality-grid">
              ${personalityTypes.map(
                (type) => html`
                  <${PersonalityCard}
                    title=${type.title}
                    description=${type.description}
                    mbti=${type.mbti}
                    key=${type.id}
                  />
                `
              )}
            </div>
          </div>
        </section>
      `}

      <${ToughTongueAI}
        onAssessmentStart=${handleAssessmentStart}
        onAssessmentEnd=${handleAssessmentEnd}
      />
    </main>
  `;
};

// Render the app
render(html`<${App} />`, document.getElementById("app"));
