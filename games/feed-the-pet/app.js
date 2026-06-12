// Feed the Pet - kid-friendly pet care (ages 3-5)
// Tap a food on the tray and it flies into the kitty's mouth. Nom nom!
// Fill the happiness bar to make the kitty dance. No way to lose.

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

function playNom() {
    playTone(260, 0.1, 'triangle', 0.14);
    setTimeout(() => playTone(200, 0.1, 'triangle', 0.14), 120);
    setTimeout(() => playTone(320, 0.12, 'triangle', 0.12), 240);
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const FOODS = ['🍎', '🍌', '🍪', '🍕', '🥕', '🍦'];
const FEED_AMOUNT = 12;          // % happiness per snack
const PET_IDLE = '🐱';
const PET_EAT = '😺';
const PET_YUM = '😋';
const PET_LOVE = '😻';
const YUMS = ['Yummy! 😋', 'Nom nom! 🍴', 'More please! 🥰', 'Delicious! 💖'];

let happiness = 0;
let level = 1;
let feeding = false;
let danceTimer = null;

// ========================================
// SETUP
// ========================================
function initGame() {
    const tray = document.getElementById('foodTray');
    for (const food of FOODS) {
        const btn = document.createElement('button');
        btn.className = 'food-btn';
        btn.textContent = food;
        btn.addEventListener('pointerdown', (e) => feed(food, btn));
        tray.appendChild(btn);
    }

    // sleepy blink while idle
    setInterval(() => {
        const pet = document.getElementById('pet');
        if (feeding || pet.classList.contains('dance')) return;
        pet.textContent = '😸';
        setTimeout(() => {
            if (!feeding && !pet.classList.contains('dance')) pet.textContent = PET_IDLE;
        }, 350);
    }, 4000);
}

// ========================================
// FEEDING
// ========================================
function feed(food, btn) {
    if (feeding) return;
    feeding = true;

    const pet = document.getElementById('pet');
    pet.textContent = PET_EAT; // kitty notices the food

    // food flies from the tray to the kitty's mouth
    const fromRect = btn.getBoundingClientRect();
    const petRect = pet.getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'flying-food';
    flyer.textContent = food;
    flyer.style.left = '0px';
    flyer.style.top = '0px';
    const startX = fromRect.left + fromRect.width / 2 - 28;
    const startY = fromRect.top + fromRect.height / 2 - 28;
    const endX = petRect.left + petRect.width / 2 - 28;
    const endY = petRect.top + petRect.height * 0.62 - 28;
    flyer.style.transform = `translate(${startX}px, ${startY}px)`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
        flyer.style.transform = `translate(${endX}px, ${endY}px) scale(0.5)`;
    });

    setTimeout(() => {
        flyer.remove();
        chomp();
    }, 560);
}

function chomp() {
    const pet = document.getElementById('pet');
    pet.textContent = PET_YUM;
    pet.classList.remove('chomp');
    void pet.offsetWidth;
    pet.classList.add('chomp');
    playNom();
    floatHeart();

    happiness = Math.min(100, happiness + FEED_AMOUNT);
    document.getElementById('happyFill').style.width = happiness + '%';

    if (happiness >= 100) {
        celebrate();
        return;
    }

    showSpeech(YUMS[Math.floor(Math.random() * YUMS.length)]);
    setTimeout(() => {
        pet.textContent = PET_IDLE;
        feeding = false;
    }, 700);
}

function celebrate() {
    const pet = document.getElementById('pet');
    level++;
    document.getElementById('level').textContent = level;
    pet.textContent = PET_LOVE;
    pet.classList.add('dance');
    playCheer();
    dropConfetti();
    showSpeech('🎉 So happy! 🎉');

    if (danceTimer) clearTimeout(danceTimer);
    danceTimer = setTimeout(() => {
        pet.classList.remove('dance');
        pet.textContent = PET_IDLE;
        happiness = 0;
        document.getElementById('happyFill').style.width = '0%';
        feeding = false;
    }, 2200);
}

// ========================================
// EFFECTS
// ========================================
function showSpeech(text) {
    const el = document.getElementById('petSpeech');
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
}

function floatHeart() {
    const stage = document.getElementById('petStage');
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = ['💖', '💕', '💗', '❤️'][Math.floor(Math.random() * 4)];
    heart.style.left = (35 + Math.random() * 30) + '%';
    heart.style.top = (30 + Math.random() * 20) + '%';
    stage.appendChild(heart);
    setTimeout(() => heart.remove(), 1300);
}

function dropConfetti() {
    const layer = document.getElementById('confettiLayer');
    const emojis = ['🎉', '⭐', '🍎', '🍪', '💖', '✨'];
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
