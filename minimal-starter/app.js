// Use preact with htm for JSX-like syntax without transpilation
const { h, render, Component } = preact;
const { useState, useEffect } = preactHooks;
const html = htm.bind(h);

// Personality types data
const personalityTypes = [
  {
    id: 1,
    title: "The Analyst (INTJ)",
    description:
      "Strategic thinkers who have a plan for everything. They are innovative and driven by logic rather than emotion.",
  },
  {
    id: 2,
    title: "The Diplomat (ENFJ)",
    description:
      "Natural leaders who are charismatic and passionate. They are altruistic and genuinely concerned about others.",
  },
  {
    id: 3,
    title: "The Sentinel (ISTJ)",
    description:
      "Practical and fact-minded individuals who value reliability and honor their commitments.",
  },
  {
    id: 4,
    title: "The Explorer (ESTP)",
    description:
      "Energetic and action-oriented, they are resourceful problem-solvers who enjoy living in the moment.",
  },
  {
    id: 5,
    title: "The Architect (INTP)",
    description:
      "Innovative inventors with an unquenchable thirst for knowledge. They are driven by theories and seek clarity.",
  },
  {
    id: 6,
    title: "The Campaigner (ENFP)",
    description:
      "Enthusiastic, creative, and sociable free spirits who find potential in every opportunity.",
  },
];

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
const PersonalityCard = ({ title, description }) => {
  return html`
    <div class="personality-card">
      <h3 class="personality-title">${title}</h3>
      <p class="personality-description">${description}</p>
    </div>
  `;
};

// ToughTongueAI Component
const ToughTongueAI = () => {
  const [showIframe, setShowIframe] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const toggleIframe = () => {
    setShowIframe(!showIframe);
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Optional: verify the origin for security
      // if (event.origin !== 'https://zap.orca-tone.ts.net') return;

      const data = event.data;

      if (data && data.event) {
        switch (data.event) {
          case "onStart":
            console.log("Session started:", data);
            // You could track analytics here
            break;
          case "onStop":
            console.log("Session stopped:", data);
            // You could show results or next steps here
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Build the iframe URL with customization options
  const buildIframeUrl = () => {
    // Replace SCENARIO_ID with your actual scenario ID
    let baseUrl = "https://zap.orca-tone.ts.net/embed/basic/SCENARIO_ID";

    // Add customization parameters
    const params = new URLSearchParams();

    if (userName) params.append("userName", userName);
    if (userEmail) params.append("userEmail", userEmail);

    // Add custom styling options
    params.append("name", "Personality Assessment");
    params.append("color", "6366f1"); // Primary color from our CSS
    params.append("background", "f8fafc"); // Background color from our CSS

    return `${baseUrl}?${params.toString()}`;
  };

  return html`
    <div class="personality-section">
      <div class="container">
        <h2 class="section-title">Discover Your Personality Type</h2>
        <p class="section-subtitle">
          Talk to our AI assistant to help identify your personality traits and learn more about
          yourself.
        </p>

        ${!showIframe &&
        html`
          <div class="form-group" style="margin-bottom: 1rem;">
            <input
              type="text"
              placeholder="Your Name (optional)"
              value=${userName}
              onInput=${(e) => setUserName(e.target.value)}
              style="padding: 0.5rem; margin-right: 1rem; border: 1px solid var(--light-gray); border-radius: 0.25rem;"
            />
            <input
              type="email"
              placeholder="Your Email (optional)"
              value=${userEmail}
              onInput=${(e) => setUserEmail(e.target.value)}
              style="padding: 0.5rem; border: 1px solid var(--light-gray); border-radius: 0.25rem;"
            />
          </div>
        `}

        <button class="btn" onClick=${toggleIframe}>
          ${showIframe ? "Hide Personality Assessment" : "Start Personality Assessment"}
        </button>

        <div class=${`iframe-container ${showIframe ? "active" : ""}`}>
          <iframe
            src=${buildIframeUrl()}
            width="100%"
            height="100%"
            frameborder="0"
            allow="microphone"
          ></iframe>
        </div>
      </div>
    </div>
  `;
};

// Main App Component
const App = () => {
  return html`
    <${Navbar} />
    <main>
      <section class="personality-section">
        <div class="container">
          <h2 class="section-title">Personality Types</h2>
          <p class="section-subtitle">
            Explore different personality types and their characteristics. Understanding these types
            can help you better understand yourself and others.
          </p>
          <div class="personality-grid">
            ${personalityTypes.map(
              (type) => html`
                <${PersonalityCard}
                  title=${type.title}
                  description=${type.description}
                  key=${type.id}
                />
              `
            )}
          </div>
        </div>
      </section>

      <${ToughTongueAI} />
    </main>
  `;
};

// Render the app
render(html`<${App} />`, document.getElementById("app"));
