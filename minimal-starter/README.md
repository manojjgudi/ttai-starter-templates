# PersonalityLens App

A Flask web application that uses ToughTongueAI API to help users discover their personality type.

## Setup

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Configure environment
cp .env.sample .env  # Then add your TTAI_TOKEN

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py  # Server starts at http://localhost:8008
```

## Project Structure

- `app.py` - Flask application (API + static file server)
- `www/` - Frontend assets (HTML, JS, CSS)
  - `app.js` - Main application entry point
  - `assessment.js` - Assessment page handling iframe communication and API calls
  - `components/` - Reusable UI components
    - `results.js` - Pure component for rendering assessment results
  - `config.js` - Configuration for personality types and API endpoints
  - `styles.css` - Application styling
- `requirements.txt` - Python dependencies

## Application Architecture

The application follows a modular structure:

- The main app (`app.js`) handles the display of personality types and navigation between pages
- The assessment page (`assessment.js`) handles the iframe communication with ToughTongueAI and API calls
- The results component (`components/results.js`) is a pure component for rendering assessment data

## Environment Variables

In your `.env` file:

- `TTAI_TOKEN` - ToughTongueAI API token (required)
- `API_BASE_URL` - API endpoint (default: https://api.toughtongueai.com/api/public)
- `PORT` - Server port (default: 8008)

## API Endpoints

- `POST /api/analyze` - Submit session ID for personality analysis
