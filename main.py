import json
import os
import traceback
from openai import OpenAI
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from crypto_helper import decrypt_api_key

# Loading environment variables
load_dotenv('.env.encrypted')

# Get and decrypt API key
encrypted_api_key = os.getenv('ENCRYPTED_API_KEY')
api_key = decrypt_api_key(encrypted_api_key) if encrypted_api_key else None

print("Checking for API key in environment...")
if api_key:
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
        
        prompt = f"""Create a detailed system design for: "{user_input}"
        Use the following components: {', '.join(components)}
        Output a JSON array where each element follows this structure:
        {{
            "component": "ComponentName",
            "id": uniqueNumber,
            "adjacencyList": [
                {{"id": connectedComponentId, "component": "ConnectedComponentName"}}
            ]
        }}

        CONNECTION OPTIMIZATION RULES:
        - If component A connects to component B, do NOT add B->A connection separately
        - Each connection should appear ONLY ONCE in the entire design
        - For bi-directional relationships, only define the connection in ONE component's adjacencyList
        - Prefer defining connections in the component that initiates the primary flow (e.g., Client->DNS, not DNS->Client)

        PREFERRED CONNECTION DIRECTIONS:
        1. Client -> DNS, CDN, API Gateway
        2. API Gateway -> Auth Server, Load Balancer, Cache
        3. Load Balancer -> Servers
        4. Servers -> Database, Cache, Message Queue
        5. Cloud -> All infrastructure components
        6. Firewall -> Components it protects

        MANDATORY COMPONENT RULES:

        1. CLIENT COMPONENT:
        - MUST connect to DNS for domain resolution
        - MUST connect to API Gateway (directly or via DNS) for API requests
        - MUST connect to CDN for static content
        - MUST NOT connect directly to any backend services

        2. DNS COMPONENT:
        - MUST connect to API Gateway and CDN
        - Connections defined from Client->DNS

        3. FIREWALL COMPONENT:
        - MUST protect all backend services
        - MUST connect to minimum 3 backend components
        - Define connections FROM Firewall TO protected components

        4. API GATEWAY COMPONENT:
        - MUST connect to Auth Server and Load Balancer
        - SHOULD connect to Cache
        - Protected by Firewall

        5. LOAD BALANCER COMPONENT:
        - MUST connect to minimum 2 Server instances
        - Protected by Firewall

        6. SERVER COMPONENTS:
        - MUST connect to Database
        - SHOULD connect to Cache and Message Queue
        - All server instances must have identical connections
        - Protected by Firewall

        7. DATABASE, CACHE, MESSAGE QUEUE COMPONENTS:
        - Connections should be defined FROM the components that access them
        - Protected by Firewall

        8. CLOUD COMPONENT:
        - MUST connect to all infrastructure
        - Define connections FROM Cloud TO other components

        SECURITY AND FLOW PATTERNS:
        1. All backend components behind Firewall
        2. All requests authenticated through Auth Server
        3. Static content through CDN
        4. Cache for performance
        5. Message Queue for async operations

        RESPONSE REQUIREMENTS:
        1. Use unique integer IDs (1-99)
        2. Include all relevant components
        3. No duplicate connections
        4. Return only valid JSON array
        5. No explanations in output

        Output only the JSON array without any additional text or explanations.
        """
        
        print("Sending request to OpenAI...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": """You are an expert system design architect specializing in creating precise, well-connected distributed systems.
        You always ensure:
        - All components are properly connected
        - Security best practices are followed
        - No standalone components exist
        - System designs are complete and practical
        Your output is always a valid JSON array with no additional explanations."""
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more consistent outputs
            max_tokens=3000,  # Increased for complex designs
            top_p=0.9,        # Slightly constrained sampling
            presence_penalty=0.0,  # No need to encourage new topics
            frequency_penalty=0.0   # No need to penalize repetition for JSON
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