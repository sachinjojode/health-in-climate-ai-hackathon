#!/usr/bin/env python3
"""
WSGI entry point for production deployment
"""
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import create_app

# Create the Flask application
application = create_app()

if __name__ == "__main__":
    application.run(host='0.0.0.0', port=5000, debug=False)
