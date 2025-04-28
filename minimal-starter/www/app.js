// Use preact with htm for JSX-like syntax without transpilation
const { h, render } = preact;
const { useState } = preactHooks;
const html = htm.bind(h);

// Import the AssessmentPage component
import { AssessmentPage } from "/assessment.js";

// Navbar Component
const Navbar = () => {
  return html`
    <nav class="navbar">
      <div class="container navbar-container">
        <div class="logo">Dutch Tutor</div>
      </div>
    </nav>
  `;
};

// Main App Component
const App = () => {
  const [showAssessment, setShowAssessment] = useState(false);

  const startAssessment = () => {
    setShowAssessment(true);
  };

  const handleBackFromAssessment = () => {
    setShowAssessment(false);
  };

  if (showAssessment) {
    return html`<${AssessmentPage} onBack=${handleBackFromAssessment} />`;
  }

  return html`
    <${Navbar} />
    <main>
      <section class="personality-section">
        <div class="container">
          <h2 class="section-title"></h2>
          <p class="section-subtitle">
            Talk to our AI assistant to learn Dutch
          </p>

          <button class="btn" onClick=${startAssessment}>
            Start learning Dutch
          </button>
        </div>
      </section>
    </main>
  `;
};

// Render the app
render(html`<${App} />`, document.getElementById("app"));
