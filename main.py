import json
import os
import traceback  # Add this import
from openai import OpenAI
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Loading .env file
load_dotenv()

# Storing API Key from .env file
api_key = os.getenv('API_KEY')
if not api_key:
    print("WARNING: OpenAI API key not found in environment variables!")

# Initialize the OpenAI client
client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app)

base_url = '/projects/NvidiaDellHackathon-AI-SystemDesignBuilder/applications/AI-System-Design-Builder'

def generate_system_design(user_input):
    if not api_key:
        print("Error: No API key available")
        return {"error": "OpenAI API key not configured"}, 500

    try:
        print(f"Starting generate_system_design with input: {user_input}")
        
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
        adjacency_list_str = response.choices[0].message.content.strip()
        print(f"OpenAI response: {adjacency_list_str}")
        
        adjacency_list = json.loads(adjacency_list_str)
        if not isinstance(adjacency_list, list):
            raise ValueError("Response is not a valid array")
        
        return adjacency_list
        
    except Exception as e:
        print(f"Error in generate_system_design: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return {"error": f"An error occurred: {str(e)}"}, 500

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
        print(f"Processing user input: {user_input}")
        
        result = generate_system_design(user_input)
        
        # Check if result is a tuple containing error response
        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]
        
        return jsonify(result)

    except Exception as e:
        print(f"Error in generate_design: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"Starting Flask app with API key {'configured' if api_key else 'NOT CONFIGURED'}")
    app.run(host='0.0.0.0', port=5000, debug=True)