// Crocodile Dentist Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
    initGame();
});

// Game state
const gameState = {
    teeth: [],
    soreToothIndex: null,
    safePresses: 0,
    gameOver: false,
    isProcessing: false
};

// Audio context
let audioContext = null;

// Teeth configuration
const UPPER_TEETH_COUNT = 8;
const LOWER_TEETH_COUNT = 7;
const TOTAL_TEETH = UPPER_TEETH_COUNT + LOWER_TEETH_COUNT;

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Resume audio context if suspended
function resumeAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Play tooth press sound (safe)
function playToothPressSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

// Play tooth wiggle sound (sore tooth)
function playToothWiggleSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;

    // Create creaking/ratcheting sound
    for (let i = 0; i < 5; i++) {
        const time = now + (i * 0.06);
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300 + (i * 50), time);
        oscillator.frequency.exponentialRampToValueAtTime(200, time + 0.05);

        gainNode.gain.setValueAtTime(0.2, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

        oscillator.start(time);
        oscillator.stop(time + 0.05);
    }
}

// Play CHOMP sound (snap)
function playChompSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Loud sawtooth wave for bite effect
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
}

// Initialize game
function initGame() {
    // Reset state
    gameState.teeth = [];
    gameState.soreToothIndex = Math.floor(Math.random() * TOTAL_TEETH);
    gameState.safePresses = 0;
    gameState.gameOver = false;
    gameState.isProcessing = false;

    // Update UI
    document.getElementById('safePresses').textContent = '0';
    document.getElementById('playAgainBtn').style.display = 'none';
    document.getElementById('chompMessage').classList.remove('show');

    // Reset crocodile
    resetCrocodile();

    // Generate teeth
    generateTeeth();
}

// Generate SVG teeth
function generateTeeth() {
    const upperTeethGroup = document.getElementById('upperTeeth');
    const lowerTeethGroup = document.getElementById('lowerTeeth');

    // Clear existing teeth
    upperTeethGroup.innerHTML = '';
    lowerTeethGroup.innerHTML = '';

    // Upper teeth positions (along the gum line)
    const upperPositions = [
        { x: 150, y: 315, rx: 20, ry: 35 },
        { x: 230, y: 310, rx: 22, ry: 38 },
        { x: 310, y: 307, rx: 24, ry: 40 },
        { x: 390, y: 305, rx: 25, ry: 42 },
        { x: 470, y: 305, rx: 25, ry: 42 },
        { x: 550, y: 307, rx: 24, ry: 40 },
        { x: 630, y: 310, rx: 22, ry: 38 },
        { x: 710, y: 315, rx: 20, ry: 35 }
    ];

    // Lower teeth positions (along the gum line)
    const lowerPositions = [
        { x: 200, y: 400, rx: 20, ry: 35 },
        { x: 290, y: 405, rx: 22, ry: 37 },
        { x: 380, y: 408, rx: 24, ry: 38 },
        { x: 470, y: 410, rx: 25, ry: 38 },
        { x: 560, y: 408, rx: 24, ry: 38 },
        { x: 650, y: 405, rx: 22, ry: 37 },
        { x: 740, y: 400, rx: 20, ry: 35 }
    ];

    // Create upper teeth
    upperPositions.forEach((pos, index) => {
        createTooth(upperTeethGroup, pos, index);
    });

    // Create lower teeth
    lowerPositions.forEach((pos, index) => {
        createTooth(lowerTeethGroup, pos, index + UPPER_TEETH_COUNT);
    });
}

// Create individual tooth
function createTooth(group, position, index) {
    const tooth = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    tooth.setAttribute('cx', position.x);
    tooth.setAttribute('cy', position.y);
    tooth.setAttribute('rx', position.rx);
    tooth.setAttribute('ry', position.ry);
    tooth.setAttribute('fill', 'url(#toothWhite)');
    tooth.setAttribute('stroke', '#BDC3C7');
    tooth.setAttribute('stroke-width', '2');
    tooth.setAttribute('class', 'tooth');
    tooth.setAttribute('data-index', index);

    // Touch event for iPad
    tooth.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleToothPress(index);
    });

    // Click event for testing
    tooth.addEventListener('click', () => {
        handleToothPress(index);
    });

    group.appendChild(tooth);
    gameState.teeth.push(tooth);
}

// Handle tooth press
function handleToothPress(index) {
    if (gameState.gameOver || gameState.isProcessing) return;

    gameState.isProcessing = true;

    if (index === gameState.soreToothIndex) {
        // SORE TOOTH - Trigger snap!
        triggerSnap();
    } else {
        // Safe tooth
        const tooth = gameState.teeth[index];
        tooth.classList.add('pressed');
        playToothPressSound();

        gameState.safePresses++;
        document.getElementById('safePresses').textContent = gameState.safePresses;

        gameState.isProcessing = false;
    }
}

// Trigger snap animation
function triggerSnap() {
    const soreTooth = gameState.teeth[gameState.soreToothIndex];

    // Wiggle the sore tooth
    soreTooth.classList.add('sore');
    playToothWiggleSound();

    // After wiggle, snap!
    setTimeout(() => {
        playChompSound();
        snapJaws();
        showChompMessage();
        surpriseEyes();
        screenShake();

        gameState.gameOver = true;

        // Show play again button after a delay
        setTimeout(() => {
            document.getElementById('playAgainBtn').style.display = 'block';
        }, 2000);
    }, 500);
}

// Snap jaws animation
function snapJaws() {
    const upperJaw = document.getElementById('upperJaw');
    const lowerJaw = document.getElementById('lowerJaw');

    upperJaw.classList.add('snapping');
    lowerJaw.classList.add('snapping');
}

// Show CHOMP message
function showChompMessage() {
    const message = document.getElementById('chompMessage');
    message.classList.add('show');

    setTimeout(() => {
        message.classList.remove('show');
    }, 1500);
}

// Make eyes surprised
function surpriseEyes() {
    const eyes = document.querySelectorAll('.eye');
    const eyebrows = document.querySelectorAll('.eyebrow');

    eyes.forEach(eye => eye.classList.add('surprised'));
    eyebrows.forEach(brow => brow.classList.add('raised'));
}

// Screen shake effect
function screenShake() {
    const container = document.querySelector('.crocodile-container');
    container.classList.add('shake');

    setTimeout(() => {
        container.classList.remove('shake');
    }, 300);
}

// Reset crocodile to default state
function resetCrocodile() {
    const upperJaw = document.getElementById('upperJaw');
    const lowerJaw = document.getElementById('lowerJaw');

    upperJaw.classList.remove('snapping');
    lowerJaw.classList.remove('snapping');

    const eyes = document.querySelectorAll('.eye');
    const eyebrows = document.querySelectorAll('.eyebrow');

    eyes.forEach(eye => eye.classList.remove('surprised'));
    eyebrows.forEach(brow => brow.classList.remove('raised'));

    const container = document.querySelector('.crocodile-container');
    container.classList.remove('shake');
}

// Reset game
function resetGame() {
    initGame();
}

// Navigate back to portal
function goBack() {
    if (confirm('Go back to the game portal?')) {
        window.location.href = '../../index.html';
    }
}

// Prevent default touch behaviors
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
