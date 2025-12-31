// Drawing App - Main JavaScript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    initEventListeners();
    updateBrushPreview();
});

// Global variables
let canvas;
let currentTool = 'brush';
let currentColor = '#FF0000';
let currentSize = 15;
let history = [];
let historyIndex = -1;
const maxHistory = 20;

// Initialize Fabric.js Canvas
function initCanvas() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const wrapperWidth = canvasWrapper.clientWidth - 40;
    const wrapperHeight = Math.min(600, window.innerHeight * 0.5);

    canvas = new fabric.Canvas('drawing-canvas', {
        width: wrapperWidth,
        height: wrapperHeight,
        isDrawingMode: true,
        backgroundColor: '#FFFFFF'
    });

    // Set up drawing brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = currentSize;
    canvas.freeDrawingBrush.color = currentColor;

    // Save initial state for undo
    saveState();

    // Handle window resize
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Handle canvas resize
function handleResize() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const wrapperWidth = canvasWrapper.clientWidth - 40;
    const wrapperHeight = Math.min(600, window.innerHeight * 0.5);

    const imageData = canvas.toDataURL();

    canvas.setDimensions({
        width: wrapperWidth,
        height: wrapperHeight
    });

    // Restore image after resize
    fabric.Image.fromURL(imageData, function(img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize event listeners
function initEventListeners() {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', handleToolClick);
    });

    // Color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', handleColorClick);
    });

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', handleSizeClick);
    });

    // Action buttons
    document.querySelector('.undo-btn').addEventListener('click', undo);
    document.querySelector('.clear-btn').addEventListener('click', clearCanvas);
    document.querySelector('.save-btn').addEventListener('click', saveImage);

    // Canvas events for undo
    canvas.on('path:created', saveState);
    canvas.on('object:added', saveState);
}

// Handle tool selection
function handleToolClick(e) {
    const tool = e.currentTarget.dataset.tool;

    // Update active state
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    currentTool = tool;

    if (tool === 'brush') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = currentColor;
        canvas.freeDrawingBrush.width = currentSize;
    } else if (tool === 'eraser') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = '#FFFFFF';
        canvas.freeDrawingBrush.width = currentSize * 2;
    } else if (tool === 'fill') {
        canvas.isDrawingMode = false;
        fillCanvas(currentColor);
    }

    updateBrushPreview();
}

// Handle color selection
function handleColorClick(e) {
    const color = e.currentTarget.dataset.color;

    // Update active state
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    currentColor = color;

    if (currentTool === 'brush') {
        canvas.freeDrawingBrush.color = currentColor;
    }

    updateBrushPreview();
}

// Handle brush size selection
function handleSizeClick(e) {
    const size = parseInt(e.currentTarget.dataset.size);

    // Update active state
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    currentSize = size;

    if (currentTool === 'brush' || currentTool === 'eraser') {
        const brushSize = currentTool === 'eraser' ? currentSize * 2 : currentSize;
        canvas.freeDrawingBrush.width = brushSize;
    }

    updateBrushPreview();
}

// Update brush preview
function updateBrushPreview() {
    const preview = document.getElementById('brushPreview');
    const size = currentTool === 'eraser' ? currentSize * 2 : currentSize;
    const color = currentTool === 'eraser' ? '#FFFFFF' : currentColor;

    preview.style.width = Math.min(60, Math.max(20, size * 2)) + 'px';
    preview.style.height = Math.min(60, Math.max(20, size * 2)) + 'px';
    preview.style.background = color;

    if (color === '#FFFFFF') {
        preview.style.border = '3px solid #000';
    } else {
        preview.style.border = '4px solid #FFD700';
    }
}

// Fill canvas with color
function fillCanvas(color) {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    saveState();
}

// Save canvas state for undo
function saveState() {
    // Remove any redo history
    history = history.slice(0, historyIndex + 1);

    // Save current state
    const json = JSON.stringify(canvas.toJSON());
    history.push(json);

    // Limit history size
    if (history.length > maxHistory) {
        history.shift();
    } else {
        historyIndex++;
    }
}

// Undo last action
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const state = history[historyIndex];
        canvas.loadFromJSON(state, function() {
            canvas.renderAll();
        });
    }
}

// Clear canvas
function clearCanvas() {
    if (confirm('Are you sure you want to clear your drawing?')) {
        canvas.clear();
        canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));
        saveState();
    }
}

// Save image
function saveImage() {
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'my-drawing-' + Date.now() + '.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    showNotification('Drawing saved! 🎨');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: popIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'popOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    @keyframes popOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigate back to portal
function goBack() {
    if (confirm('Go back to the game portal?')) {
        window.location.href = '../../index.html';
    }
}
