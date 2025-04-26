# PersonalityLens App

A simple web application that uses ToughTongueAI to help users discover their personality type.

## Project Structure

- `index.html` - Main HTML file
- `app.js` - Frontend JavaScript application using Preact
- `assessment.js` - Assessment component
- `data.js` - Configuration and data
- `styles.css` - Styling
- `backend/` - Flask backend proxy for the ToughTongueAI API

## Setup Instructions

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Copy the environment variables template
cp .env.sample .env
# Then edit the .env file to add your ToughTongueAI token

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the backend server
python backend.py
# The backend will run on port 8008
```

### Frontend Setup

1. Just serve the HTML/JS/CSS files from a web server. You can use Python for this:

   ```
   python -m http.server 8000
   ```

   Then access the application at http://localhost:8000

2. Alternatively, use any static file server or just open the index.html in a browser.

## Environment Variables

Environment variables are stored in a `.env` file in the backend directory. You can create this file by copying `.env.sample` and updating the values:

```
cp backend/.env.sample backend/.env
```

Available environment variables:

- `API_BASE_URL` - ToughTongueAI API URL (default: https://app.toughtongueai.com/backend/api/public)
- `TTAI_TOKEN` - API token for ToughTongueAI (required)
- `PORT` - Port for the backend server (default: 8008)

## API Endpoints

The backend provides the following endpoints:

- `GET /api/sessions/{session_id}` - Get session data from ToughTongueAI
- `POST /api/analyze` - Submit data for analysis

## Features

- Display various personality types
- Integration with ToughTongue AI for assessments
- Flask backend to handle API calls and avoid CORS issues

## Browser Support

Works best in modern browsers. Chrome is recommended for ToughTongue AI integration.

---

## Appendix

### Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```
