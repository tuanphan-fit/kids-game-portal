// Balloon Pop - kid-friendly balloon popping (ages 3-5)
// Balloons float up the screen. Tap to pop them for stars!
// Escaped balloons just float away - no penalty, no game over.

document.addEventListener('DOMContentLoaded', function() {
    GameNavigation.handleFirstInteraction(function() {
        initAudio();
    });
    initGame();
});

function goBack() {
    GameNavigation.navigateToPortal();
}

// ========================================
// AUDIO
// ========================================
let audioContext = null;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playTone(freq, duration, type, volume) {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume || 0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
    } catch (e) { /* ignore */ }
}

function playPop() {
    playTone(500 + Math.random() * 300, 0.12, 'square', 0.1);
    setTimeout(() => playTone(900 + Math.random() * 300, 0.1, 'sine', 0.1), 40);
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const BALLOON_COLORS = [
    '#EF5350', '#FFCA28', '#66BB6A', '#42A5F5',
    '#AB47BC', '#FF7043', '#EC407A', '#26C6DA'
];
const MILESTONE = 20;
const MAX_BALLOONS = 6;
const RAINBOW_CHANCE = 0.1;

let gameArea;
let balloons = []; // {el, x, y, speed, popped, rainbow}
let score = 0;
let spawnTimer = 0;
let lastTime = 0;

// ========================================
// SETUP
// ========================================
function initGame() {
    gameArea = document.getElementById('gameArea');
    requestAnimationFrame(loop);
}

// ========================================
// BALLOONS
// ========================================
function spawnBalloon() {
    const H = gameArea.clientHeight;
    const W = gameArea.clientWidth;
    const size = 70 + Math.random() * 50; // big targets for little fingers
    const rainbow = Math.random() < RAINBOW_CHANCE;
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    const el = document.createElement('div');
    el.className = 'balloon';
    el.style.width = size + 'px';
    el.style.height = size * 1.35 + 'px';

    const body = document.createElement('div');
    body.className = 'balloon-body';
    if (rainbow) {
        body.style.background = 'linear-gradient(135deg, #EF5350, #FFCA28, #66BB6A, #42A5F5, #AB47BC)';
    } else {
        body.style.background = `radial-gradient(circle at 35% 30%, ${lighten(color)}, ${color})`;
    }
    const string = document.createElement('div');
    string.className = 'balloon-string';
    el.appendChild(body);
    el.appendChild(string);

    const b = {
        el,
        x: 20 + Math.random() * Math.max(40, W - size - 40),
        y: H + size,
        speed: (H * 0.06) + Math.random() * (H * 0.05), // slow and gentle
        popped: false,
        rainbow
    };
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.transform = `translate(${b.x}px, ${b.y}px)`;

    el.addEventListener('pointerdown', () => pop(b));
    gameArea.appendChild(el);
    balloons.push(b);
}

function lighten(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (n >> 16) + 70);
    const g = Math.min(255, ((n >> 8) & 255) + 70);
    const bl = Math.min(255, (n & 255) + 70);
    return `rgb(${r},${g},${bl})`;
}

function pop(b) {
    if (b.popped) return;
    b.popped = true;
    b.el.classList.add('popped');
    playPop();

    // little stars burst out
    const rect = b.el.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();
    const cx = rect.left - areaRect.left + rect.width / 2;
    const cy = rect.top - areaRect.top + rect.height / 2;
    const burst = b.rainbow ? ['🌈', '⭐', '✨', '💖', '🌟'] : ['⭐', '✨'];
    for (let i = 0; i < (b.rainbow ? 8 : 4); i++) {
        const star = document.createElement('span');
        star.className = 'pop-star';
        star.textContent = burst[Math.floor(Math.random() * burst.length)];
        star.style.left = cx + 'px';
        star.style.top = cy + 'px';
        const a = Math.random() * Math.PI * 2;
        const d = 40 + Math.random() * 70;
        star.style.setProperty('--dx', Math.cos(a) * d + 'px');
        star.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
        gameArea.appendChild(star);
        setTimeout(() => star.remove(), 700);
    }

    score += b.rainbow ? 5 : 1;
    document.getElementById('score').textContent = score;

    if (b.rainbow) {
        playCheer();
        dropConfetti();
    } else if (score % MILESTONE === 0) {
        playCheer();
        dropConfetti();
        showBanner('🎉 ' + score + ' stars! 🎉');
        setTimeout(hideBanner, 1500);
    }

    setTimeout(() => removeBalloon(b), 300);
}

function removeBalloon(b) {
    b.el.remove();
    balloons = balloons.filter(x => x !== b);
}

// ========================================
// MAIN LOOP
// ========================================
function loop(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;

    spawnTimer -= dt;
    const interval = Math.max(0.6, 1.1 - score * 0.005);
    if (spawnTimer <= 0 && balloons.length < MAX_BALLOONS) {
        spawnBalloon();
        spawnTimer = interval;
    }

    for (const b of balloons) {
        if (b.popped) continue;
        b.y -= b.speed * dt;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    }

    // balloons that float off the top just disappear quietly
    const escaped = balloons.filter(b => !b.popped && b.y < -200);
    for (const b of escaped) removeBalloon(b);

    requestAnimationFrame(loop);
}

// ========================================
// EFFECTS
// ========================================
function showBanner(text) {
    const el = document.getElementById('banner');
    el.textContent = text;
    el.style.display = 'block';
}

function hideBanner() {
    document.getElementById('banner').style.display = 'none';
}

function dropConfetti() {
    const layer = document.getElementById('confettiLayer');
    const emojis = ['🎉', '⭐', '🎈', '💖', '✨'];
    for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        span.className = 'confetti';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (1.2 + Math.random() * 1.5) + 's';
        span.style.animationDelay = (Math.random() * 0.4) + 's';
        layer.appendChild(span);
        setTimeout(() => span.remove(), 3500);
    }
}
