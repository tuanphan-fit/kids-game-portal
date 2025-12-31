// Catch Colors Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize fullscreen on first interaction
    GameNavigation.handleFirstInteraction(function() {
        initAudio();
    });
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

// Physics: Trail particles
let trailParticles = null;

// Initialize physics
function initPhysics() {
    if (!trailParticles) {
        trailParticles = new Physics.ParticleSystem(document.getElementById('gameArea'), 100);
    }
}

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
    initPhysics(); // Initialize physics engine

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

// Animate ball falling with physics
function animateBall(ball) {
    const gameArea = document.getElementById('gameArea');

    // Create physics object for the ball
    const ballPhys = new Physics.PhysicsObject(
        parseFloat(ball.style.left),
        -80,
        1 // Mass
    );

    // Add slight horizontal drift
    ballPhys.vx = (Math.random() - 0.5) * 2;
    ballPhys.vy = 2 + Math.random() * 2; // Initial downward velocity

    const gravity = 0.15;
    const bounceFactor = 0.4;
    const gameAreaHeight = gameArea.clientHeight;

    // Trail creation counter
    let frameCount = 0;

    function fall() {
        if (!gameState.isPlaying || !ball.parentNode) return;

        // Update physics
        ballPhys.update(gravity, 0.99);

        // Check for bounce at bottom
        if (ballPhys.y > gameAreaHeight - 80) {
            ballPhys.y = gameAreaHeight - 80;
            ballPhys.vy = -ballPhys.vy * bounceFactor;

            // Squeeze effect on bounce
            ball.style.transform = `scale(1.2, 0.8)`;
            setTimeout(() => {
                if (ball.parentNode) {
                    ball.style.transform = 'scale(1, 1)';
                }
            }, 100);

            // If velocity is very low, remove ball
            if (Math.abs(ballPhys.vy) < 1) {
                if (ball.parentNode) {
                    ball.parentNode.removeChild(ball);
                }
                return;
            }
        }

        // Update ball position
        ball.style.left = ballPhys.x + 'px';
        ball.style.top = ballPhys.y + 'px';

        // Rotate based on velocity
        ballPhys.rotation += ballPhys.vx * 2;
        ball.style.transform += ` rotate(${ballPhys.rotation}deg)`;

        // Create trail particles (30% of frames)
        frameCount++;
        if (frameCount % 3 === 0 && trailParticles) {
            trailParticles.createParticle(
                ballPhys.x + 40,
                ballPhys.y + 40,
                {
                    emoji: '✨',
                    size: 12,
                    velocity: 0,
                    gravity: 0.05,
                    lifetime: 300,
                    scale: 0.6
                }
            );
            trailParticles.start();
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
        endGame();
    }
    GameNavigation.navigateToPortal();
}

// Prevent default touch behaviors
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
