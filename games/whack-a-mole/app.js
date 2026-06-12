// Whack-a-Mole - kid-friendly critter bonking (ages 3-5)
// Critters pop out of holes. Tap them before they hide!
// No misses, no timer - just bonking fun. Confetti every 10 bonks.

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

function playBonk() {
    playTone(220, 0.1, 'square', 0.12);
    setTimeout(() => playTone(660, 0.18, 'sine', 0.15), 60);
}

function playPeek() {
    playTone(520 + Math.random() * 200, 0.1, 'triangle', 0.05);
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const CRITTERS = ['🐹', '🐭', '🐰', '🦔', '🐸'];
const HOLES = 9;
const MILESTONE = 10;
const UP_TIME = 1800;     // how long a critter stays up (ms)
const MIN_SPAWN = 900;    // fastest spawn interval (ms)
const START_SPAWN = 1400; // starting spawn interval (ms)

let holes = [];  // {wrap, critterEl, up, bonked, hideTimer}
let score = 0;

// ========================================
// SETUP
// ========================================
function initGame() {
    const gridEl = document.getElementById('moleGrid');
    for (let i = 0; i < HOLES; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'hole-wrap';

        const critter = document.createElement('div');
        critter.className = 'critter';
        critter.textContent = CRITTERS[0];

        const hole = document.createElement('div');
        hole.className = 'hole';

        wrap.appendChild(critter);
        wrap.appendChild(hole);
        gridEl.appendChild(wrap);

        const state = { wrap, critterEl: critter, up: false, bonked: false, hideTimer: null };
        wrap.addEventListener('pointerdown', () => bonk(state));
        holes.push(state);
    }
    scheduleSpawn();
}

function spawnInterval() {
    return Math.max(MIN_SPAWN, START_SPAWN - score * 10);
}

function scheduleSpawn() {
    setTimeout(() => {
        popUp();
        scheduleSpawn();
    }, spawnInterval());
}

// ========================================
// CRITTER LOGIC
// ========================================
function popUp() {
    const down = holes.filter(h => !h.up);
    // keep it gentle: at most 2 critters up at once
    if (holes.length - down.length >= 2 || down.length === 0) return;

    const h = down[Math.floor(Math.random() * down.length)];
    h.up = true;
    h.bonked = false;
    h.critterEl.textContent = CRITTERS[Math.floor(Math.random() * CRITTERS.length)];
    h.wrap.classList.remove('bonked');
    void h.wrap.offsetWidth;
    h.wrap.classList.add('up');
    playPeek();

    h.hideTimer = setTimeout(() => hide(h), UP_TIME);
}

function hide(h) {
    if (h.hideTimer) { clearTimeout(h.hideTimer); h.hideTimer = null; }
    h.wrap.classList.remove('up');
    h.up = false;
}

function bonk(h) {
    if (!h.up || h.bonked) return;
    h.bonked = true;
    if (h.hideTimer) { clearTimeout(h.hideTimer); h.hideTimer = null; }

    h.critterEl.textContent = '💫';
    h.wrap.classList.remove('up');
    h.wrap.classList.add('bonked');
    playBonk();
    setTimeout(() => {
        h.wrap.classList.remove('bonked');
        h.up = false;
    }, 420);

    score++;
    document.getElementById('score').textContent = score;
    if (score % MILESTONE === 0) {
        playCheer();
        dropConfetti();
        showBanner('🎉 ' + score + ' bonks! 🎉');
        setTimeout(hideBanner, 1500);
    }
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
    const emojis = ['🎉', '⭐', '🐹', '🐰', '✨'];
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
