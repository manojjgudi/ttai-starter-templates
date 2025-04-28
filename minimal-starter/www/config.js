// Base API URL is always relative since we're serving from the same Flask app
const API_BASE_URL = "/api";

// ToughTongueAI configuration
export const toughTongueConfig = {
  baseUrl: "https://app.toughtongueai.com",

  // Scenario and authentication
  scenarioId: "680df71436e4c33b7d517adc",

  // Default styling options
  defaultStyles: {
    name: "Dutch Language Tutor",
    color: "indigo-500",
    background: "white",
  },
};

// Backend API configuration
export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    analyze: `${API_BASE_URL}/analyze`,
  },
};
