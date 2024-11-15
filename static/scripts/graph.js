/*// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');

// Add event listeners to each component in the component panel
const components = document.querySelectorAll('.component');

components.forEach(component => {
    component.addEventListener('click', function() {
        // Get the component's ID, tooltip (name), and background color
        const componentId = this.id;
        const componentName = this.getAttribute('data-tooltip');
        const componentColor = window.getComputedStyle(this).backgroundColor;

        // Create a new component in the main window
        createComponentInGraphWindow(componentId, componentName, componentColor);
    });
});

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    // Create a div for the component
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');  // Add a class for styling
    newComponent.setAttribute('data-tooltip', componentName);  // For displaying tooltip
    newComponent.style.backgroundColor = componentColor;  // Set the color to match the left panel

    // Set the content (icon) for the new component
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
        default:
            return;  // Exit if the component ID is unrecognized
    }

    // Create a label to show the name of the component
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';  // Position label outside the circle
    label.style.top = '70px';  // Slightly below the component
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';  // Center it horizontally
    label.style.fontWeight = 'bold';  // Make text bold
    label.style.color = 'black';  // Black color for better contrast
    label.style.fontSize = '14px';  // Slightly larger text

    // Add the label below the component
    newComponent.appendChild(label);

    // Add draggable functionality
    newComponent.style.position = 'absolute';  // Absolute positioning
    const componentSize = 60; // Size of the component
    newComponent.style.top = getRandomPosition(graphWindow.offsetHeight, componentSize) + 'px';  // Random top position
    newComponent.style.left = getRandomPosition(graphWindow.offsetWidth, componentSize) + 'px';  // Random left position
    makeDraggable(newComponent);  // Make the component draggable

    // Append the component to the main window
    graphWindow.appendChild(newComponent);
}

// Function to make the component draggable
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
    
        // Calculate new positions
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        // Get current component dimensions and position
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
    
        // Get the boundaries of the main window
        const windowWidth = graphWindow.offsetWidth;
        const windowHeight = graphWindow.offsetHeight;
        
        // Get the height of the black input bar (bottom bar)
        const bottomBarHeight = document.querySelector('.input-bar').offsetHeight;
    
        // Calculate new top and left positions, ensuring the component stays inside the main window
        let newTop = element.offsetTop - offsetY;
        let newLeft = element.offsetLeft - offsetX;
    
        // Boundary checks to prevent dragging outside the main window
        if (newTop < 0) newTop = 0; // Prevent moving above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent moving to the left of the boundary
        if (newTop + elementHeight > windowHeight - bottomBarHeight) newTop = windowHeight - bottomBarHeight - elementHeight; // Prevent moving below the black line
        if (newLeft + elementWidth > windowWidth) newLeft = windowWidth - elementWidth; // Prevent moving beyond the right boundary
    
        // Apply the new top and left values
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
        

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to generate a random position, ensuring it stays within the main window
function getRandomPosition(max, elementSize) {
    return Math.floor(Math.random() * (max - elementSize - 20)) + 10;
}*/


/*// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');

// Add event listeners to each component in the component panel
const components = document.querySelectorAll('.component');

components.forEach(component => {
    component.addEventListener('click', function() {
        // Get the component's ID, tooltip (name), and background color
        const componentId = this.id;
        const componentName = this.getAttribute('data-tooltip');
        const componentColor = window.getComputedStyle(this).backgroundColor;

        // Create a new component in the main window
        createComponentInGraphWindow(componentId, componentName, componentColor);
    });
});

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    // Create a div for the component
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');  // Add a class for styling
    newComponent.setAttribute('data-tooltip', componentName);  // For displaying tooltip
    newComponent.style.backgroundColor = componentColor;  // Set the color to match the left panel

    // Set the content (icon) for the new component
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
        default:
            return;  // Exit if the component ID is unrecognized
    }

    // Create a label to show the name of the component
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';  // Position label outside the circle
    label.style.top = '70px';  // Slightly below the component
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';  // Center it horizontally
    label.style.fontWeight = 'bold';  // Make text bold
    label.style.color = 'black';  // Black color for better contrast
    label.style.fontSize = '14px';  // Slightly larger text

    // Add the label below the component
    newComponent.appendChild(label);

    // Add draggable functionality
    newComponent.style.position = 'absolute';  // Absolute positioning
    const componentSize = 60; // Size of the component
    const labelHeight = 30; // Approximate height of the label
    const bottomBarHeight = document.querySelector('.input-bar').offsetHeight; // Get the height of the bottom bar

    // Ensure the component and label appear within the correct boundaries (considering the bottom bar and label height)
    const maxTop = graphWindow.offsetHeight - componentSize - labelHeight - bottomBarHeight;
    const maxLeft = graphWindow.offsetWidth - componentSize;

    newComponent.style.top = getRandomPosition(maxTop, componentSize) + 'px';  // Random top position with boundaries
    newComponent.style.left = getRandomPosition(maxLeft, componentSize) + 'px';  // Random left position with boundaries

    makeDraggable(newComponent);  // Make the component draggable

    // Append the component to the main window
    graphWindow.appendChild(newComponent);
}

// Function to make the component draggable
function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
    
        // Calculate new positions
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
    
        // Get current component dimensions and position
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const labelHeight = 30; // Approximate height of the label
    
        // Get the boundaries of the main window
        const windowWidth = graphWindow.offsetWidth;
        const windowHeight = graphWindow.offsetHeight;
        
        // Get the height of the black input bar (bottom bar)
        const bottomBarHeight = document.querySelector('.input-bar').offsetHeight;
    
        // Calculate new top and left positions, ensuring the component stays inside the main window
        let newTop = element.offsetTop - offsetY;
        let newLeft = element.offsetLeft - offsetX;
    
        // Boundary checks to prevent dragging outside the main window (considering the label)
        if (newTop < 0) newTop = 0; // Prevent moving above the top boundary
        if (newLeft < 0) newLeft = 0; // Prevent moving to the left of the boundary
        if (newTop + elementHeight + labelHeight > windowHeight - bottomBarHeight) newTop = windowHeight - bottomBarHeight - elementHeight - labelHeight; // Prevent moving below the black line
        if (newLeft + elementWidth > windowWidth) newLeft = windowWidth - elementWidth; // Prevent moving beyond the right boundary
    
        // Apply the new top and left values
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
        
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Function to generate a random position, ensuring it stays within the main window
function getRandomPosition(max, elementSize) {
    return Math.floor(Math.random() * (max - elementSize - 20)) + 10;
}*/

// 

// // Select the main window where components will be placed
// const graphWindow = document.getElementById('graph-window');
// const components = document.querySelectorAll('.component');

// // Initial column layout setup
// const columnLayout = {
//     left: [],
//     middle: [],
//     right: []
// };

// // Configuration constants
// const COLUMN_PADDING = 100;
// const VERTICAL_SPACING = 120;

// // Add click listeners to component panel
// components.forEach(component => {
//     component.addEventListener('click', function() {
//         createComponent(this);
//     });
// });

// function getColumnForComponent(componentName) {
//     const name = componentName.toLowerCase();
//     if (name.includes('database') || name.includes('cache') || name.includes('queue')) {
//         return 'left';
//     } else if (name.includes('client') || name.includes('firewall') || name.includes('cdn')) {
//         return 'right';
//     }
//     return 'middle';
// }

// function calculateColumnPosition(column) {
//     const width = graphWindow.offsetWidth;
//     switch(column) {
//         case 'left': return COLUMN_PADDING;
//         case 'right': return width - COLUMN_PADDING;
//         default: return width / 2;
//     }
// }

// function updateComponentPositions() {
//     const height = graphWindow.offsetHeight - 100;

//     ['left', 'middle', 'right'].forEach(column => {
//         const components = columnLayout[column];
//         const totalHeight = components.length * VERTICAL_SPACING;
//         let startY = Math.max(50, (height - totalHeight) / 2);
//         const xPosition = calculateColumnPosition(column);

//         components.forEach((component, index) => {
//             const element = document.querySelector(`[name="${component}"]`);
//             // Only position if element exists and isn't being dragged
//             if (element && !element.isDragging) {
//                 const baseX = xPosition - (column === 'right' ? 60 : column === 'left' ? 0 : 30);
//                 element.style.left = `${baseX}px`;
//                 element.style.top = `${startY + (index * VERTICAL_SPACING)}px`;
//             }
//         });
//     });

//     updateArrows();
// }

// function createComponent(component, name = null) {
//     const componentId = component.id;
//     const componentName = name || component.getAttribute('data-tooltip');
//     const componentColor = window.getComputedStyle(component).backgroundColor;
//     createComponentInGraphWindow(componentId, componentName, componentColor);
// }

// function createComponentInGraphWindow(componentId, componentName, componentColor) {
//     const newComponent = document.createElement('div');
//     newComponent.classList.add('graph-component');
//     newComponent.setAttribute('data-tooltip', componentName);
//     newComponent.setAttribute('name', componentName);
//     newComponent.style.backgroundColor = componentColor;

//     // Set the icon based on component type
//     switch (componentId) {
//         case 'load_balancer':
//             newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
//             break;
//         case 'server':
//             newComponent.innerHTML = '<i class="fas fa-server"></i>';
//             break;
//         case 'client':
//             newComponent.innerHTML = '<i class="fas fa-user"></i>';
//             break;
//         case 'cache':
//             newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
//             break;
//         case 'database':
//             newComponent.innerHTML = '<i class="fas fa-database"></i>';
//             break;
//         case 'aws':
//             newComponent.innerHTML = '<i class="fab fa-aws"></i>';
//             break;
//         case 'api_gateway':
//             newComponent.innerHTML = '<i class="fa-solid fa-code"></i>';
//             break;
//         case 'msg_queue':
//             newComponent.innerHTML = '<i class="fa-solid fa-message"></i>';
//             break;
//         case 'cdn':
//             newComponent.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> <i class="fa-solid fa-cloud-download-alt"></i>';
//             break;
//         case 'dns':
//             newComponent.innerHTML = '<i class="fas fa-globe"></i><i class="fas fa-address-book"></i>';
//             break;
//         case 'firewall':
//             newComponent.innerHTML = '<i class="fas fa-shield-halved"></i><i class="fas fa-fire"></i>';
//             break;
//         case 'aths':
//             newComponent.innerHTML = '<i class="fas fa-server"></i><i class="fas fa-user"></i>';
//             break;
//         default:
//             return;
//     }

//     // Create and style the label
//     const label = document.createElement('span');
//     label.innerText = componentName;
//     label.style.position = 'absolute';
//     label.style.top = '70px';
//     label.style.left = '50%';
//     label.style.transform = 'translateX(-50%)';
//     label.style.fontWeight = 'bold';
//     label.style.color = 'black';
//     label.style.fontSize = '14px';
//     label.style.whiteSpace = 'nowrap';
//     newComponent.appendChild(label);

//     // Position the component
//     const column = getColumnForComponent(componentName);
//     columnLayout[column].push(componentName);
    
//     newComponent.style.position = 'absolute';
    
//     // Initial positioning
//     const width = graphWindow.offsetWidth;
//     const height = graphWindow.offsetHeight;
//     const columnX = calculateColumnPosition(column);
//     const index = columnLayout[column].length - 1;
//     const yPos = 100 + (index * VERTICAL_SPACING);
    
//     newComponent.style.left = `${columnX}px`;
//     newComponent.style.top = `${yPos}px`;

//     // Make component draggable and add to graph
//     makeDraggable(newComponent);
//     graphWindow.appendChild(newComponent);
    
//     // Ensure SVG exists for arrows
//     if (d3.select(graphWindow).select('svg').empty()) {
//         initializeSVG();
//     }

//     updateComponentPositions();
// }

// function makeDraggable(element) {
//     let isDragging = false;
//     let initialX, initialY;
    
//     element.addEventListener('mousedown', startDragging);
//     document.addEventListener('mousemove', drag);
//     document.addEventListener('mouseup', stopDragging);

//     function startDragging(e) {
//         if (e.target === element || element.contains(e.target)) {
//             isDragging = true;
//             element.isDragging = true;
//             const rect = element.getBoundingClientRect();
//             initialX = e.clientX - rect.left;
//             initialY = e.clientY - rect.top;
//             e.preventDefault();
//             element.style.zIndex = '1000';
//         }
//     }

//     function drag(e) {
//         if (!isDragging) return;
        
//         e.preventDefault();
//         const x = e.clientX - initialX;
//         const y = e.clientY - initialY;
        
//         // Boundary checks
//         const bounds = graphWindow.getBoundingClientRect();
//         const maxX = bounds.width - element.offsetWidth;
//         const maxY = bounds.height - element.offsetHeight - 50;

//         element.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
//         element.style.top = `${Math.max(0, Math.min(y, maxY))}px`;

//         updateArrows();
//     }

//     function stopDragging() {
//         if (isDragging) {
//             isDragging = false;
//             element.isDragging = false;
//             element.style.zIndex = '1';
//             // No column snapping - component stays where it was dragged
//         }
//     }
// }

// function initializeSVG() {
//     // Remove any existing SVG
//     d3.select(graphWindow).select('svg').remove();

//     // Create new SVG with improved arrow marker
//     const svg = d3.select(graphWindow)
//         .append('svg')
//         .attr('width', '100%')
//         .attr('height', '100%')
//         .style('position', 'absolute')
//         .style('top', 0)
//         .style('left', 0)
//         .style('pointer-events', 'none');

//     // Define arrow marker with better visibility
//     svg.append('defs')
//         .append('marker')
//         .attr('id', 'arrowhead')
//         .attr('viewBox', '-10 -5 10 10')
//         .attr('refX', 0)
//         .attr('refY', 0)
//         .attr('markerWidth', 6)
//         .attr('markerHeight', 6)
//         .attr('orient', 'auto')
//         .append('path')
//         .attr('d', 'M -10 -5 L 0 0 L -10 5 z')
//         .attr('fill', '#000');

//     return svg;
// }

// function updateArrows() {
//     const svg = d3.select(graphWindow).select('svg');
//     if (!svg.empty()) {
//         svg.selectAll('line').each(function() {
//             const line = d3.select(this);
//             const sourceElement = document.querySelector(`[name="${line.attr('data-source')}"]`);
//             const targetElement = document.querySelector(`[name="${line.attr('data-target')}"]`);
            
//             if (sourceElement && targetElement) {
//                 const sourceRect = sourceElement.getBoundingClientRect();
//                 const targetRect = targetElement.getBoundingClientRect();
//                 const graphRect = graphWindow.getBoundingClientRect();

//                 // Calculate centers
//                 const sourceX = sourceRect.left + sourceRect.width/2 - graphRect.left;
//                 const sourceY = sourceRect.top + sourceRect.height/2 - graphRect.top;
//                 const targetX = targetRect.left + targetRect.width/2 - graphRect.left;
//                 const targetY = targetRect.top + targetRect.height/2 - graphRect.top;

//                 // Calculate angle
//                 const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
//                 const radius = sourceRect.width/2;

//                 // Adjust start and end points
//                 const startX = sourceX + Math.cos(angle) * radius;
//                 const startY = sourceY + Math.sin(angle) * radius;
//                 const endX = targetX - Math.cos(angle) * (radius + 5);
//                 const endY = targetY - Math.sin(angle) * (radius + 5);

//                 line
//                     .attr('x1', startX)
//                     .attr('y1', startY)
//                     .attr('x2', endX)
//                     .attr('y2', endY)
//                     .attr('stroke', 'black')
//                     .attr('stroke-width', 2)
//                     .attr('marker-end', 'url(#arrowhead)');
//             }
//         });
//     }
// }

// // Event Listeners
// window.addEventListener('load', () => {
//     initializeSVG();
// });

// window.addEventListener('resize', () => {
//     updateComponentPositions();
// });


// Select the main window where components will be placed
const graphWindow = document.getElementById('graph-window');
const components = document.querySelectorAll('.component');

// Initial column layout setup
const columnLayout = {
    left: [],
    middle: [],
    right: []
};

// Configuration constants
const COLUMN_PADDING = 100;
const VERTICAL_SPACING = 120;

// Add click listeners to component panel
components.forEach(component => {
    component.addEventListener('click', function() {
        createComponent(this);
    });
});

function getColumnForComponent(componentName) {
    const name = componentName.toLowerCase();
    if (name.includes('database') || name.includes('cache') || name.includes('queue')) {
        return 'left';
    } else if (name.includes('client') || name.includes('firewall') || name.includes('cdn')) {
        return 'right';
    }
    return 'middle';
}

function calculateColumnPosition(column) {
    const width = graphWindow.offsetWidth;
    switch(column) {
        case 'left': return COLUMN_PADDING;
        case 'right': return width - COLUMN_PADDING;
        default: return width / 2;
    }
}

function updateComponentPositions(excludeElement = null) {
    const height = graphWindow.offsetHeight - 100;

    ['left', 'middle', 'right'].forEach(column => {
        const components = columnLayout[column];
        const totalHeight = components.length * VERTICAL_SPACING;
        let startY = Math.max(50, (height - totalHeight) / 2);
        const xPosition = calculateColumnPosition(column);

        components.forEach((component, index) => {
            const element = document.querySelector(`[name="${component}"]`);
            // Only position if element exists, isn't being dragged, and isn't the excluded element
            if (element && !element.isDragging && element !== excludeElement) {
                const baseX = xPosition - (column === 'right' ? 60 : column === 'left' ? 0 : 30);
                element.style.left = `${baseX}px`;
                element.style.top = `${startY + (index * VERTICAL_SPACING)}px`;
            }
        });
    });

    // Only update arrows if we're not dragging
    if (!excludeElement) {
        updateArrows();
    }
}

function createComponent(component, name = null) {
    const componentId = component.id;
    const componentName = name || component.getAttribute('data-tooltip');
    const componentColor = window.getComputedStyle(component).backgroundColor;
    createComponentInGraphWindow(componentId, componentName, componentColor);
}

function createComponentInGraphWindow(componentId, componentName, componentColor) {
    const newComponent = document.createElement('div');
    newComponent.classList.add('graph-component');
    newComponent.setAttribute('data-tooltip', componentName);
    newComponent.setAttribute('name', componentName);
    newComponent.style.backgroundColor = componentColor;

    // Set the icon based on component type
    switch (componentId) {
        case 'load_balancer':
            newComponent.innerHTML = '<i class="fas fa-network-wired"></i>';
            break;
        case 'server':
            newComponent.innerHTML = '<i class="fas fa-server"></i>';
            break;
        case 'client':
            newComponent.innerHTML = '<i class="fas fa-user"></i>';
            break;
        case 'cache':
            newComponent.innerHTML = '<i class="fa-solid fa-memory"></i>';
            break;
        case 'database':
            newComponent.innerHTML = '<i class="fas fa-database"></i>';
            break;
        case 'aws':
            newComponent.innerHTML = '<i class="fab fa-aws"></i>';
            break;
        case 'api_gateway':
            newComponent.innerHTML = '<i class="fa-solid fa-code"></i>';
            break;
        case 'msg_queue':
            newComponent.innerHTML = '<i class="fa-solid fa-message"></i>';
            break;
        case 'cdn':
            newComponent.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> <i class="fa-solid fa-cloud-download-alt"></i>';
            break;
        case 'dns':
            newComponent.innerHTML = '<i class="fas fa-globe"></i><i class="fas fa-address-book"></i>';
            break;
        case 'firewall':
            newComponent.innerHTML = '<i class="fas fa-shield-halved"></i><i class="fas fa-fire"></i>';
            break;
        case 'aths':
            newComponent.innerHTML = '<i class="fas fa-server"></i><i class="fas fa-user"></i>';
            break;
        default:
            return;
    }

    // Create label
    const label = document.createElement('span');
    label.innerText = componentName;
    label.style.position = 'absolute';
    label.style.top = '70px';
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.fontWeight = 'bold';
    label.style.color = 'black';
    label.style.fontSize = '14px';
    label.style.whiteSpace = 'nowrap';
    newComponent.appendChild(label);

    // Position the component
    const column = getColumnForComponent(componentName);
    columnLayout[column].push(componentName);
    
    newComponent.style.position = 'absolute';
    
    // Initial positioning
    const width = graphWindow.offsetWidth;
    const columnX = calculateColumnPosition(column);
    const index = columnLayout[column].length - 1;
    const yPos = 100 + (index * VERTICAL_SPACING);
    
    newComponent.style.left = `${columnX}px`;
    newComponent.style.top = `${yPos}px`;

    // Make component draggable and add to graph
    makeDraggable(newComponent);
    graphWindow.appendChild(newComponent);
    
    // Ensure SVG exists for arrows
    if (d3.select(graphWindow).select('svg').empty()) {
        initializeSVG();
    }

    updateComponentPositions();
}

function makeDraggable(element) {
    let offsetX = 0;
    let offsetY = 0;
    let originalX = 0;
    let originalY = 0;
    let isDragging = false;

    element.addEventListener('mousedown', startDragging);

    function startDragging(e) {
        if (e.button !== 0) return; // Only left mouse button
        e.preventDefault();
        e.stopPropagation();

        isDragging = true;
        element.isDragging = true;
        
        // Get initial positions
        const rect = element.getBoundingClientRect();
        const parentRect = graphWindow.getBoundingClientRect();
        
        originalX = rect.left - parentRect.left;
        originalY = rect.top - parentRect.top;
        
        // Calculate offset from mouse position to element edge
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Set high z-index while dragging
        element.style.zIndex = '1000';

        // Add move and up listeners
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDragging);
    }

    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const parentRect = graphWindow.getBoundingClientRect();
        
        // Calculate new position
        let newX = e.clientX - parentRect.left - offsetX;
        let newY = e.clientY - parentRect.top - offsetY;

        // Apply boundaries
        const maxX = parentRect.width - element.offsetWidth;
        const maxY = parentRect.height - element.offsetHeight - 50;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Update position
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;

        // Update arrows in real-time
        requestAnimationFrame(updateArrows);
    }

    function stopDragging() {
        if (!isDragging) return;
        
        isDragging = false;
        element.isDragging = false;
        element.style.zIndex = '1';

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDragging);
    }
}

function initializeSVG() {
    d3.select(graphWindow).select('svg').remove();

    const svg = d3.select(graphWindow)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
        .style('pointer-events', 'none');

    svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-10 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M -10 -5 L 0 0 L -10 5 z')
        .attr('fill', '#000');

    return svg;
}

function updateArrows() {
    const svg = d3.select(graphWindow).select('svg');
    if (!svg.empty()) {
        svg.selectAll('line').each(function() {
            const line = d3.select(this);
            const sourceElement = document.querySelector(`[name="${line.attr('data-source')}"]`);
            const targetElement = document.querySelector(`[name="${line.attr('data-target')}"]`);
            
            if (sourceElement && targetElement) {
                const parentRect = graphWindow.getBoundingClientRect();
                const sourceRect = sourceElement.getBoundingClientRect();
                const targetRect = targetElement.getBoundingClientRect();

                // Calculate positions relative to the graph window
                const sourceX = sourceRect.left - parentRect.left + sourceRect.width/2;
                const sourceY = sourceRect.top - parentRect.top + sourceRect.height/2;
                const targetX = targetRect.left - parentRect.left + targetRect.width/2;
                const targetY = targetRect.top - parentRect.top + targetRect.height/2;

                // Calculate angle for arrow position
                const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
                const radius = sourceRect.width/2;

                // Calculate points on the circumference
                const startX = sourceX + Math.cos(angle) * radius;
                const startY = sourceY + Math.sin(angle) * radius;
                const endX = targetX - Math.cos(angle) * (radius + 5);
                const endY = targetY - Math.sin(angle) * (radius + 5);

                line
                    .attr('x1', startX)
                    .attr('y1', startY)
                    .attr('x2', endX)
                    .attr('y2', endY)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .attr('marker-end', 'url(#arrowhead)');
            }
        });
    }
}

// Event Listeners
window.addEventListener('load', () => {
    initializeSVG();
});

window.addEventListener('resize', () => {
    updateComponentPositions();
});