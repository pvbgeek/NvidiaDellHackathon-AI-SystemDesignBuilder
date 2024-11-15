import json
import os
from openai import OpenAI
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Loading .env file
load_dotenv()

# Storing API Key from .env file
api_key = os.getenv('API_KEY')

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

# Define base URL for AI Workbench
base_url = '/projects/NvidiaDellHackathon-AI-SystemDesignBuilder/applications/AI-System-Design-Builder'

# Initialize Flask app with correct configuration
app = Flask(__name__)
CORS(app)

# Serve static files with base_url
@app.route(f'{base_url}/static/<path:filename>')
@app.route('/static/<path:filename>')  # Fallback for local development
def serve_static(filename):
    return send_from_directory('static', filename)

def generate_system_design(user_input):
    # Your existing generate_system_design function code here
    pass

@app.route(f'{base_url}/')
@app.route('/')
def home():
    return render_template('index.html', base_url=base_url)

@app.route(f'{base_url}/generate', methods=['POST'])
@app.route('/generate', methods=['POST'])
def generate_design():
    try:
        data = request.get_json()
        if not data or 'userInput' not in data:
            return jsonify({"error": "No user input provided"}), 400

        user_input = data['userInput']
        result = generate_system_design(user_input)
        return jsonify(result)

    except Exception as e:
        print(f"Error in generate_design: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Print debug info
    print(f"Static folder path: {os.path.abspath('static')}")
    print(f"Templates folder path: {os.path.abspath('templates')}")
    print(f"API Key configured: {'Yes' if api_key else 'No'}")
    app.run(host='0.0.0.0', port=5000, debug=True)