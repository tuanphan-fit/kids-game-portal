// Drawing App - Coloring Book Feature
document.addEventListener('DOMContentLoaded', function() {
    // Initialize fullscreen on first interaction
    GameNavigation.handleFirstInteraction(function() {
        initApp();
    });
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
let lastTime = 0; // For velocity calculation
let history = [];
let historyIndex = -1;
const maxHistory = 20;
let currentPicture = null;

// Physics: Particle system for splash effects
let splashParticles = null;
let sparkleParticles = null;

// Initialize physics
function initPhysics() {
    if (!splashParticles) {
        splashParticles = new Physics.ParticleSystem(document.body, 50);
    }
    if (!sparkleParticles) {
        sparkleParticles = new Physics.ParticleSystem(document.body, 30);
    }
}

// Initialize the app
function initApp() {
    initPhysics(); // Initialize physics engine
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
    const wrapperHeight = canvasWrapper.clientHeight > 80
        ? canvasWrapper.clientHeight - 40
        : window.innerHeight * 0.6;

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
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.tool-btn')).find(btn => {
        if (btn.dataset.tool === tool) {
            btn.classList.add('active');
            return true;
        }
        return false;
    });

    // Sparkle particle effect on tool selection
    if (activeBtn && sparkleParticles) {
        const rect = activeBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create 8 sparkle particles in diamond shape
        const sparkleEmojis = ['⭐', '✨', '💫', '🌟', '⚡'];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2; // Radial explosion
            const emoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

            sparkleParticles.createParticle(centerX, centerY, {
                emoji: emoji,
                size: 18 + Math.random() * 12,
                velocity: 3 + Math.random() * 3,
                angle: angle,
                gravity: 0.1,
                lifetime: 800,
                scale: 1,
                rotation: Math.random() * 360
            });
        }
        sparkleParticles.start();
    }

    // Update cursor
    if (canvas && tool === 'fill') {
        canvas.style.cursor = 'crosshair';
    } else if (canvas) {
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
    lastTime = Date.now();
}

// Draw with velocity-based brush size
function draw(e) {
    if (!isDrawing) return;
    if (currentTool === 'fill') return;

    const x = e.offsetX;
    const y = e.offsetY;
    const currentTime = Date.now();

    // Calculate velocity (pixels per ms)
    const deltaTime = Math.max(currentTime - lastTime, 1);
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Adjust brush size based on velocity (slower = thicker, faster = thinner)
    let dynamicSize = currentSize;
    if (currentTool === 'brush') {
        const sizeMultiplier = Math.max(0.5, Math.min(1.5, 1 - (velocity / 3)));
        dynamicSize = currentSize * sizeMultiplier;
    } else if (currentTool === 'eraser') {
        dynamicSize = currentSize * 2;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = dynamicSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = x;
    lastY = y;
    lastTime = currentTime;
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

    // Splash particle effect
    if (splashParticles) {
        const canvasRect = canvas.getBoundingClientRect();
        const screenX = canvasRect.left + startX;
        const screenY = canvasRect.top + startY;

        // Create color droplets
        const dropEmojis = ['💧', '✨', '⭐', '🌟'];
        for (let i = 0; i < 12; i++) {
            const emoji = dropEmojis[Math.floor(Math.random() * dropEmojis.length)];
            splashParticles.createParticle(screenX, screenY, {
                emoji: emoji,
                size: 20 + Math.random() * 15,
                velocity: 4 + Math.random() * 4,
                gravity: 0.3,
                lifetime: 1200,
                scale: 0.8 + Math.random() * 0.4
            });
        }
        splashParticles.start();
    }

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
    showConfirm('Clear all your coloring?', function() {
        if (currentPicture) {
            initCanvas(currentPicture.svg);
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    });
}

function showConfirm(message, onConfirm) {
    var modal = document.getElementById('confirmModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:500;align-items:center;justify-content:center;';
        modal.innerHTML = '<div style="background:white;padding:2rem;border-radius:1.5rem;text-align:center;max-width:80%;box-shadow:0 8px 32px rgba(0,0,0,0.2);">' +
            '<p style="font-size:1.25rem;font-weight:600;margin-bottom:1.5rem;color:#333;" class="confirm-message"></p>' +
            '<div style="display:flex;gap:1rem;justify-content:center;">' +
            '<button style="padding:0.75rem 2rem;border:none;border-radius:1rem;font-size:1rem;font-weight:700;cursor:pointer;min-width:5rem;min-height:3rem;background:#4CAF50;color:white;" class="confirm-yes">Yes</button>' +
            '<button style="padding:0.75rem 2rem;border:none;border-radius:1rem;font-size:1rem;font-weight:700;cursor:pointer;min-width:5rem;min-height:3rem;background:#E0E0E0;color:#333;" class="confirm-no">No</button>' +
            '</div></div>';
        document.body.appendChild(modal);
    }
    modal.querySelector('.confirm-message').textContent = message;
    modal.style.display = 'flex';

    modal.querySelector('.confirm-yes').onclick = function() {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    modal.querySelector('.confirm-no').onclick = function() {
        modal.style.display = 'none';
    };
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
    GameNavigation.navigateToPortal();
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
