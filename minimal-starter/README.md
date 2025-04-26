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
- `requirements.txt` - Python dependencies

## Environment Variables

In your `.env` file:

- `TTAI_TOKEN` - ToughTongueAI API token (required)
- `API_BASE_URL` - API endpoint (default: https://api.toughtongueai.com/api/public)
- `PORT` - Server port (default: 8008)

## API Endpoints

- `GET /api/sessions/{session_id}` - Retrieve session data
- `POST /api/analyze` - Submit data for personality analysis
