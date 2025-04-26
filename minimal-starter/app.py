from flask import Flask, request, jsonify, send_from_directory
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
import pathlib

# Load environment variables from .env file
load_dotenv()

# Get the directory where the Flask app is located
BASE_DIR = pathlib.Path(__file__).parent.absolute()
WWW_DIR = BASE_DIR / "www"

app = Flask(__name__, static_folder=None)  # Disable default static handling
CORS(app)  # Enable CORS for all routes

API_BASE_URL = "https://api.toughtongueai.com/api/public"
TTAI_TOKEN = os.environ.get("TTAI_TOKEN")

assert API_BASE_URL is not None, "API_BASE_URL is not set"
assert TTAI_TOKEN is not None, "TTAI_TOKEN is not set"


def tryy(response):
    try:
        return jsonify(response.json()), response.status_code
    except requests.exceptions.JSONDecodeError:
        return (
            jsonify(
                {
                    "error": "Invalid response from API",
                    "status": response.status_code,
                    "text": response.text,
                }
            ),
            500,
        )


@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    response = requests.post(
        f"{API_BASE_URL}/sessions/analyze",
        json=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TTAI_TOKEN}",
        },
    )
    return tryy(response)


@app.route("/api/sessions/<session_id>", methods=["GET"])
def get_session(session_id):
    response = requests.get(
        f"{API_BASE_URL}/sessions/{session_id}",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TTAI_TOKEN}",
        },
    )
    print(response)
    return tryy(response)


# Serve static files
@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def serve_static(path):
    # Special case for the root path
    if path == "index.html" or path == "":
        return send_from_directory(WWW_DIR, "index.html")

    # Return the requested static file
    return send_from_directory(WWW_DIR, path)


if __name__ == "__main__":
    try:
        # Run the app on port 8008
        port = int(os.environ.get("PORT", 8008))
        print(f"Starting server on port {port}...")
        print(f"API_BASE_URL set to: {API_BASE_URL}")
        print(f"Using API token: {TTAI_TOKEN[:5]}...")
        print(f"Serving static files from: {WWW_DIR}")
        print("Press CTRL+C to quit")
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
