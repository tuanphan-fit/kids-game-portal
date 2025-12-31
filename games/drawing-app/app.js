// Drawing App - Coloring Book Feature
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Global variables
let canvas;
let ctx;
let currentTool = 'brush';
let currentColor = '#FF0000';
let currentSize = 15;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let history = [];
let historyIndex = -1;
const maxHistory = 20;
let currentPicture = null;

// Initialize the app
function initApp() {
    renderPictureSelection();
    generateColorPalette();
    setupEventListeners();
}

// Render picture selection grid
function renderPictureSelection() {
    const grid = document.getElementById('picturesGrid');
    grid.innerHTML = '';

    coloringPictures.forEach(picture => {
        const card = document.createElement('div');
        card.className = 'picture-card';
        card.onclick = () => loadPicture(picture.id);

        // Parse SVG and create a thumbnail
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(picture.svg, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        // Set viewBox and preserve aspect ratio
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.setAttribute('viewBox', '0 0 400 500');
        svgElement.style.borderRadius = '10px';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'picture-name';
        nameDiv.textContent = picture.name;

        const categorySpan = document.createElement('span');
        categorySpan.className = 'picture-category';
        categorySpan.textContent = picture.category;

        card.appendChild(svgElement);
        card.appendChild(nameDiv);
        card.appendChild(categorySpan);
        grid.appendChild(card);
    });
}

// Generate color palette from pictures.js data
function generateColorPalette() {
    const palette = document.getElementById('colorPalette');
    palette.innerHTML = '';

    colorPalette.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = color;
        btn.dataset.color = color;
        btn.onclick = () => setColor(color);
        if (index === 0) btn.classList.add('active');
        palette.appendChild(btn);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Event listeners will be set after canvas is initialized
}

// Load a picture onto the canvas
function loadPicture(pictureId) {
    currentPicture = coloringPictures.find(p => p.id === pictureId);
    if (!currentPicture) return;

    // Switch to coloring screen
    document.getElementById('pictureSelection').style.display = 'none';
    document.getElementById('coloringScreen').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'block';

    // Initialize canvas
    initCanvas(currentPicture.svg);
}

// Initialize canvas with SVG
function initCanvas(svgContent) {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const wrapperWidth = canvasWrapper.clientWidth - 40;
    const wrapperHeight = Math.min(600, window.innerHeight * 0.5);

    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');

    canvas.width = wrapperWidth;
    canvas.height = wrapperHeight;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load SVG onto canvas
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(
            canvas.width / 400,
            canvas.height / 500
        );
        const scaledWidth = 400 * scale;
        const scaledHeight = 500 * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        URL.revokeObjectURL(url);
        saveState();

        // Setup canvas event listeners
        setupCanvasListeners();
    };

    img.src = url;
}

// Setup canvas event listeners
function setupCanvasListeners() {
    canvas.onmousedown = startDrawing;
    canvas.onmousemove = draw;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;

    // Touch support
    canvas.ontouchstart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        startDrawing({ offsetX: x, offsetY: y });
    };

    canvas.ontouchmove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        draw({ offsetX: x, offsetY: y });
    };

    canvas.ontouchend = stopDrawing;
}

// Set tool (brush, fill, eraser)
function setTool(tool) {
    currentTool = tool;

    // Update active state
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tool === tool) {
            btn.classList.add('active');
        }
    });

    // Update cursor
    if (tool === 'fill') {
        canvas.style.cursor = 'crosshair';
    } else {
        canvas.style.cursor = 'crosshair';
    }
}

// Set color
function setColor(color) {
    currentColor = color;

    // Update active state
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

// Set brush size
function setSize(size) {
    currentSize = size;

    // Update active state
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(size === 5 ? '⚫' : size === 15 ? '⚫⚫' : '⚫⚫⚫')) {
            btn.classList.add('active');
        }
    });
}

// Start drawing
function startDrawing(e) {
    if (currentTool === 'fill') {
        floodFill(e.offsetX, e.offsetY, currentColor);
        return;
    }

    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
}

// Draw
function draw(e) {
    if (!isDrawing) return;
    if (currentTool === 'fill') return;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = currentTool === 'eraser' ? currentSize * 2 : currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = x;
    lastY = y;
}

// Stop drawing
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

// Flood fill algorithm
function floodFill(startX, startY, fillColor) {
    // Convert hex color to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const fill = hexToRgb(fillColor);
    if (!fill) return;

    // Get canvas pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Get starting pixel color
    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // Don't fill if same color
    if (startR === fill.r && startG === fill.g && startB === fill.b && startA === 255) return;

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();

    const tolerance = 50;

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

        const pos = (y * canvas.width + x) * 4;

        // Check if pixel matches starting color (with tolerance)
        if (Math.abs(data[pos] - startR) > tolerance ||
            Math.abs(data[pos + 1] - startG) > tolerance ||
            Math.abs(data[pos + 2] - startB) > tolerance) {
            continue;
        }

        visited.add(key);

        // Fill pixel
        data[pos] = fill.r;
        data[pos + 1] = fill.g;
        data[pos + 2] = fill.b;
        data[pos + 3] = 255;

        // Add neighbors to stack
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
    saveState();
}

// Save canvas state for undo
function saveState() {
    history = history.slice(0, historyIndex + 1);
    history.push(canvas.toDataURL());

    if (history.length > maxHistory) {
        history.shift();
    } else {
        historyIndex++;
    }
}

// Undo
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
    }
}

// Clear canvas
function clearCanvas() {
    if (confirm('Clear all your coloring?')) {
        if (currentPicture) {
            initCanvas(currentPicture.svg);
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    }
}

// Save image
function saveImage() {
    const link = document.createElement('a');
    link.download = `coloring-${currentPicture?.name || 'drawing'}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showNotification('Saved! 🎨');
}

// Show picture selection (go back home)
function showPictureSelection() {
    document.getElementById('pictureSelection').style.display = 'block';
    document.getElementById('coloringScreen').style.display = 'none';
    document.getElementById('backBtn').style.display = 'block';
    document.getElementById('homeBtn').style.display = 'none';
    currentPicture = null;
}

// Go back to portal
function goBack() {
    if (confirm('Go back to the game portal?')) {
        window.location.href = '../../index.html';
    }
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
