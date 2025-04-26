import sys
import os
from pathlib import Path

# Add parent directory to Python path to access app.py
sys.path.append(str(Path(__file__).parent.parent))

# Import the Flask app
from app import app

# This is required for Vercel serverless functions
if __name__ == "__main__":
    app.run()
