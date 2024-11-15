import json
import os
import traceback
from openai import OpenAI
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Loading environment variables
load_dotenv('variables.env')

# Debug print for environment variables
print("Checking for API key in environment...")
api_key = os.getenv('API_KEY')
# Remove any potential whitespace from the API key
if api_key:
    api_key = api_key.strip()
    print(f"First 5 characters of API key: {api_key[:5]}")
    print(f"API key length: {len(api_key)}")
    if not api_key.startswith('sk-'):
        print("WARNING: API key doesn't start with 'sk-'")
# Initialize the OpenAI client with the API key
client = OpenAI(
    api_key=api_key
)

# Define base URL for AI Workbench
base_url = '/projects/NvidiaDellHackathon-AI-SystemDesignBuilder/applications/AI-System-Design-Builder'

app = Flask(__name__)
CORS(app)

@app.route('/api-info')
def api_info():
    if api_key:
        return jsonify({
            "key_length": len(api_key),
            "starts_with_sk": api_key.startswith('sk-'),
            "first_5_chars": api_key[:5]
        })
    return jsonify({"error": "No API key found"})

@app.route(f'{base_url}/test-api')
@app.route('/test-api')
def test_api():
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5
        )
        return jsonify({"status": "success", "message": "API key is working"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route(f'{base_url}/static/<path:filename>')
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

def generate_system_design(user_input):
    try:
        print(f"Starting generation for input: {user_input}")
        
        if not api_key:
            print("Error: API key is missing")
            return {"error": "OpenAI API key is not configured"}, 500

        components = [
            "API gateway", "Message queue", "CDN", "DNS", "Firewall", "Auth server",
            "Load balancer", "Server", "Client", "Cache", "Database", "Cloud"
        ]
        
        prompt = f"""
        Create a system design for: "{user_input}"
        Use the following components: {', '.join(components)}
        Represent each component instance as a JSON object with "component", "id", and "adjacencyList" fields.
        Example: {{"component": "Firewall", "id": 1, "adjacencyList": []}}
        Use unique integer IDs for all components, preferably single or double-digit.
        Provide the design as a valid JSON array, where each element is an object containing "component", "id", and "adjacencyList" fields.
        The "adjacencyList" should be an array of objects representing the components it directly interacts with.
        
        Follow these guidelines:
        1. Client instances can interact with DNS, API gateway, and CDN instances.
        2. DNS instances can interact with CDN and API gateway instances.
        3. API gateway instances can interact with Auth server, Load balancer, and Cache instances.
        4. Firewall protects backend components from direct client access.
        5. Load Balancer instances distribute traffic among Server instances.
        6. Server instances can interact with Database, Cache, and Message Queue instances.
        7. Cloud is a single component that can interact with any other component if relevant.
        8. Components can have bidirectional relationships where appropriate.
        
        Ensure the output is a valid JSON array. Do not include any explanations, only the JSON array.
        """
        
        print("Sending request to OpenAI...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates system design adjacency lists in JSON array format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        print("Received response from OpenAI")
        
        if not response.choices:
            print("Error: No choices in response")
            return {"error": "No response from OpenAI"}, 500
            
        adjacency_list_str = response.choices[0].message.content.strip()
        print(f"Raw response: {adjacency_list_str}")
        
        try:
            adjacency_list = json.loads(adjacency_list_str)
            if not isinstance(adjacency_list, list):
                print("Error: Response is not a list")
                return {"error": "Invalid response format"}, 500
            return adjacency_list
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            return {"error": "Failed to parse OpenAI response"}, 500
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return {"error": f"An unexpected error occurred: {str(e)}"}, 500

@app.route(f'{base_url}/')
@app.route('/')
def home():
    return render_template('index.html', base_url=base_url)

@app.route(f'{base_url}/generate', methods=['POST'])
@app.route('/generate', methods=['POST'])
def generate_design():
    try:
        print("Received generate request")
        data = request.get_json()
        
        if not data or 'userInput' not in data:
            return jsonify({"error": "No user input provided"}), 400

        user_input = data['userInput']
        print(f"Processing input: {user_input}")
        
        result = generate_system_design(user_input)
        
        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]
            
        return jsonify(result)

    except Exception as e:
        print(f"Error in generate_design: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Static folder path: {os.path.abspath('static')}")
    print(f"Templates folder path: {os.path.abspath('templates')}")
    app.run(host='0.0.0.0', port=5000, debug=True)