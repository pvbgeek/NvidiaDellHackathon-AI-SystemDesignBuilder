import json
import os
from openai import OpenAI
from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv

# Loading .env file
load_dotenv('variables.env')

# Storing API Key from .env file
api_key = os.getenv("API_key")
print(api_key)
# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

# Define base URL for AI Workbench
base_url = '/projects/NvidiaDellHackathon-AI-SystemDesignBuilder/applications/AI-System-Design-Builder'

app = Flask(__name__, 
    static_folder='static',
    template_folder='templates')

# Add this route for serving static files
@app.route(f'{base_url}/static/<path:filename>')
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

def generate_system_design(user_input):
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
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates system design adjacency lists in JSON array format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        adjacency_list_str = response.choices[0].message.content.strip()
        adjacency_list = json.loads(adjacency_list_str)
        
        return adjacency_list
    
    except Exception as e:
        print("An exception occurred:", str(e))
        return {"error": f"An error occurred: {str(e)}"}

@app.route(f'{base_url}/')
@app.route('/')
def home():
    return render_template('index.html', base_url=base_url)

@app.route(f'{base_url}/generate', methods=['POST'])
@app.route('/generate', methods=['POST'])
def generate_design():
    try:
        data = request.json
        user_input = data.get('userInput', '')
        if not user_input:
            return jsonify({"error": "No user input provided."}), 400

        result = generate_system_design(user_input)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)