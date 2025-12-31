// Catch Colors Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
});

// Game state
const gameState = {
    score: 0,
    isPlaying: false,
    currentTargetColor: null,
    balls: [],
    spawnInterval: null,
    gameDuration: 60, // seconds
    timeRemaining: 60,
    timerInterval: null
};

// Audio context
let audioContext = null;

// Colors configuration
const colors = [
    { name: 'RED', hex: '#FF0000', emoji: '🔴' },
    { name: 'BLUE', hex: '#0000FF', emoji: '🔵' },
    { name: 'GREEN', hex: '#00FF00', emoji: '🟢' },
    { name: 'YELLOW', hex: '#FFFF00', emoji: '🟡' },
    { name: 'ORANGE', hex: '#FFA500', emoji: '🟠' },
    { name: 'PURPLE', hex: '#9400D3', emoji: '🟣' }
];

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

// Play catch sound (success)
function playCatchSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;

    // Happy ascending notes
    for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400 + (i * 150), now + (i * 0.1));

        gainNode.gain.setValueAtTime(0.3, now + (i * 0.1));
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.2);

        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + (i * 0.1) + 0.2);
    }
}

// Play wrong color sound (error)
function playWrongSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
}

// Play game over sound
function playGameOverSound() {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;

    // Descending notes
    for (let i = 0; i < 4; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(500 - (i * 100), now + (i * 0.15));

        gainNode.gain.setValueAtTime(0.3, now + (i * 0.15));
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.15) + 0.3);

        oscillator.start(now + (i * 0.15));
        oscillator.stop(now + (i * 0.15) + 0.3);
    }
}

// Start game
function startGame() {
    // Reset state
    gameState.score = 0;
    gameState.isPlaying = true;
    gameState.timeRemaining = gameState.gameDuration;
    gameState.balls = [];

    // Update UI
    document.getElementById('score').textContent = '0';
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';

    // Clear game area
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    // Select random target color
    selectNewTargetColor();

    // Start spawning balls
    gameState.spawnInterval = setInterval(spawnBall, 1500);

    // Start timer
    startTimer();
}

// Select new target color
function selectNewTargetColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    gameState.currentTargetColor = colors[randomIndex];

    // Update target color display
    document.getElementById('targetColor').style.backgroundColor = gameState.currentTargetColor.hex;
    document.getElementById('colorName').textContent = gameState.currentTargetColor.name;
    document.getElementById('colorName').style.color = gameState.currentTargetColor.hex;
}

// Spawn falling ball
function spawnBall() {
    if (!gameState.isPlaying) return;

    const gameArea = document.getElementById('gameArea');
    const ball = document.createElement('div');
    ball.className = 'falling-ball';

    // Select random color (weighted: target color appears 40% of the time)
    let color;
    if (Math.random() < 0.4) {
        color = gameState.currentTargetColor;
    } else {
        const otherColors = colors.filter(c => c.name !== gameState.currentTargetColor.name);
        color = otherColors[Math.floor(Math.random() * otherColors.length)];
    }

    ball.style.backgroundColor = color.hex;
    ball.dataset.colorName = color.name;

    // Random horizontal position
    const maxLeft = gameArea.clientWidth - 80;
    const leftPos = Math.random() * maxLeft;
    ball.style.left = leftPos + 'px';
    ball.style.top = '-80px';

    // Add touch/click event
    ball.addEventListener('touchstart', (e) => {
        e.preventDefault();
        catchBall(ball, color);
    });

    ball.addEventListener('click', () => {
        catchBall(ball, color);
    });

    gameArea.appendChild(ball);

    // Animate falling
    animateBall(ball);
}

// Animate ball falling
function animateBall(ball) {
    const gameArea = document.getElementById('gameArea');
    let posY = -80;
    const speed = 3 + Math.random() * 2;

    function fall() {
        if (!gameState.isPlaying || !ball.parentNode) return;

        posY += speed;
        ball.style.top = posY + 'px';

        // Check if ball fell off screen
        if (posY > gameArea.clientHeight) {
            if (ball.parentNode) {
                ball.parentNode.removeChild(ball);
            }
            return;
        }

        requestAnimationFrame(fall);
    }

    requestAnimationFrame(fall);
}

// Catch ball
function catchBall(ball, color) {
    if (!gameState.isPlaying) return;

    // Remove ball event listeners
    ball.style.pointerEvents = 'none';

    if (color.name === gameState.currentTargetColor.name) {
        // Correct color!
        gameState.score += 10;
        document.getElementById('score').textContent = gameState.score;

        // Visual feedback
        ball.classList.add('caught');
        playCatchSound();
        showScorePop(ball, '+10');

        // Change target color every 5 catches
        if (gameState.score % 50 === 0) {
            setTimeout(() => selectNewTargetColor(), 500);
        }
    } else {
        // Wrong color!
        ball.classList.add('missed');
        playWrongSound();
        showScorePop(ball, '❌', '#FF0000');
    }

    // Remove ball after animation
    setTimeout(() => {
        if (ball.parentNode) {
            ball.parentNode.removeChild(ball);
        }
    }, 300);
}

// Show score popup
function showScorePop(ball, text, color = '#FFD700') {
    const pop = document.createElement('div');
    pop.className = 'score-pop';
    pop.textContent = text;
    pop.style.color = color;
    pop.style.left = ball.style.left;
    pop.style.top = ball.style.top;

    document.getElementById('gameArea').appendChild(pop);

    setTimeout(() => {
        if (pop.parentNode) {
            pop.parentNode.removeChild(pop);
        }
    }, 1000);
}

// Start timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        document.getElementById('instructions').querySelector('.sub-text').textContent =
            `Time: ${gameState.timeRemaining}s`;

        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    gameState.isPlaying = false;

    // Clear intervals
    clearInterval(gameState.spawnInterval);
    clearInterval(gameState.timerInterval);

    // Remove all balls
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    // Play game over sound
    playGameOverSound();

    // Show game over screen
    document.getElementById('finalScore').textContent = gameState.score;

    // Generate message based on score
    let message = '';
    if (gameState.score >= 200) {
        message = '🏆 Amazing! You\'re a Color Master!';
    } else if (gameState.score >= 100) {
        message = '⭐ Great job! Color Champion!';
    } else if (gameState.score >= 50) {
        message = '👏 Good job! Keep practicing!';
    } else {
        message = '💪 Nice try! Play again!';
    }

    document.getElementById('gameMessage').textContent = message;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

// Navigate back to portal
function goBack() {
    if (gameState.isPlaying) {
        if (confirm('Quit the game?')) {
            endGame();
            window.location.href = '../../index.html';
        }
    } else {
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
