// Get base URL from meta tag
const baseUrl = document.querySelector('meta[name="base-url"]')?.content || '';
const apiUrl = `${baseUrl}/generate`;

console.log("Initialized with API URL:", apiUrl);

// DOM elements
const sendButton = document.getElementById('send-button');
const textArea = document.getElementById('user-input');
const componentsMap = new Map(Array.from(document.querySelectorAll('.component')).map(component => [component.getAttribute('data-tooltip'), component]));

// Function to send input to Flask and receive graph JSON
async function fetchGraphJson(userInput) {
    setLoadingState(true);
    try {
        console.log("Sending request to:", apiUrl);
        console.log("Request payload:", { userInput });

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ userInput })
        });

        const responseData = await response.json();
        console.log("Raw server response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.error || `Server error: ${response.statusText}`);
        }

        if (responseData.error) {
            throw new Error(responseData.error);
        }

        setLoadingState(false);
        return responseData;

    } catch (error) {
        console.error("Error in fetchGraphJson:", error);
        setLoadingState(false);
        alert(`Error: ${error.message || 'Could not generate system design. Please try again.'}`);
        return null;
    }
}

const setLoadingState = (showLoading) => {
    const staticState = document.getElementById('static-state');
    const loadingState = document.getElementById('loading-state');

    if(showLoading) {
        console.log("Setting loading state: true");
        staticState.style.display = 'none';
        loadingState.style.display = 'block';
    } else {
        console.log("Setting loading state: false");
        staticState.style.display = 'block';
        loadingState.style.display = 'none';
    }
}

// Event listener for Send button click
sendButton.addEventListener('click', async () => {
    const userInput = textArea.value.trim();

    if (!userInput) {
        alert("Please enter a description of your system.");
        return;
    }

    console.log("Processing user input:", userInput);

    const graph = await fetchGraphJson(userInput);

    if (graph) {
        console.log("Received graph data:", graph);
        processGraph(graph);
    }
});

// Function to process the received graph data
function processGraph(graph) {
    if (!Array.isArray(graph)) {
        console.error("Invalid graph format received. Expected an array.");
        return;
    }

    console.log("Processing graph data:", graph);
    clearPreviousGraph();

    const nodeCategories = new Map();

    const addNode = ({ id, component }) => {
        const nodeList = nodeCategories.get(component) || [];
        const nodeAlreadyExists = !!nodeList.find(node => node.component === component && node.id === id);
        if (!nodeAlreadyExists) nodeList.push({ id, component });
        nodeCategories.set(component, nodeList);
    };

    graph.forEach(node => {
        addNode(node);
        node.adjacencyList.forEach(addNode);
    });

    const nodes = new Map();

    const getNodeName = ({ id, component }) => {
        const category = nodeCategories.get(component);
        const nodeCount = category ? category.length : 0;
        return nodeCount > 1 ? `${component} ${id}` : component;
    };

    const createNode = ({ id, component }) => {
        const nodeKey = `${component}_${id}`;
        const node = nodes.get(nodeKey);
        if (!node) {
            const componentElement = componentsMap.get(titleCase(component));
            if (componentElement) {
                const nodeName = getNodeName({ id, component });
                createComponent(componentElement, nodeName);
            }
            nodes.set(nodeKey, { id, component });
        }
    };

    graph.forEach(node => {
        createNode(node);
        node.adjacencyList.forEach(createNode);
    });

    graph.forEach(node => {
        const sourceNode = document.querySelector(`#graph-window div[name='${getNodeName(node)}']`);
        node.adjacencyList.forEach(adjacentNode => {
            const destinationNode = document.querySelector(`#graph-window div[name='${getNodeName(adjacentNode)}']`);
            if (sourceNode && destinationNode) {
                createArrowBetweenComponents(sourceNode, destinationNode);
            }
        });
    });
}

function clearPreviousGraph() {
    document.querySelectorAll('.graph-component').forEach(node => node.remove());
    d3.select('#graph-window svg').remove();
}

const titleCase = (string) =>
    string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ').trim();