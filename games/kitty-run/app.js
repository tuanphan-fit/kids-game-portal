// Kitty Run - kid-friendly endless runner (ages 3-5)
// The kitty runs along a 3-lane road. Tap left/right (or swipe) to change lanes.
// Collect coins! Bumping an obstacle just slows you down - no game over.

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

function playCoin() {
    playTone(988, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(1319, 0.15, 'sine', 0.12), 70);
}

function playBump() {
    playTone(180, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(140, 0.25, 'sawtooth', 0.08), 130);
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const OBSTACLES = ['📦', '🪨', '🛢️'];
const DECOR = ['🌳', '🌲', '🌼', '🌷', '🍄'];
const COIN_MILESTONE = 25;

let canvas, ctx, gameArea;
let W = 0, H = 0, DPR = 1;
let roadW = 0, laneW = 0;

let player = { lane: 1, x: 0, y: 0, bumpT: 0, invincibleT: 0 };
let items = [];      // {lane, y, type, emoji, hit}
let decor = [];      // {x, y, emoji, size}
let sparkles = [];
let coins = 0;
let speed = 0;
let baseSpeed = 0;
let dashOffset = 0;
let spawnTimer = 0;
let decorTimer = 0;
let gesture = null;
let lastTime = 0;

// ========================================
// SETUP
// ========================================
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameArea = document.getElementById('gameArea');

    window.addEventListener('resize', resize);
    resize();
    player.x = laneX(player.lane);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', () => { gesture = null; });

    requestAnimationFrame(loop);
}

function resize() {
    DPR = window.devicePixelRatio || 1;
    W = gameArea.clientWidth;
    H = gameArea.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    roadW = Math.min(W * 0.86, 560);
    laneW = roadW / 3;
    baseSpeed = H * 0.35;
    if (!speed) speed = baseSpeed;
    player.y = H * 0.8;
}

function laneX(i) {
    return W / 2 + (i - 1) * laneW;
}

// ========================================
// INPUT
// ========================================
function onPointerDown(e) {
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    gesture = { x: e.clientX, swiped: false };
}

function onPointerMove(e) {
    if (!gesture || gesture.swiped) return;
    const dx = e.clientX - gesture.x;
    if (Math.abs(dx) > 40) {
        gesture.swiped = true;
        changeLane(Math.sign(dx));
    }
}

function onPointerUp(e) {
    if (!gesture) return;
    const wasSwipe = gesture.swiped;
    gesture = null;
    if (wasSwipe) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    changeLane(x < W / 2 ? -1 : 1);
}

function changeLane(dir) {
    const next = Math.max(0, Math.min(2, player.lane + dir));
    if (next !== player.lane) {
        player.lane = next;
        playTone(440, 0.08, 'triangle', 0.08);
    }
}

// ========================================
// SPAWNING
// ========================================
function spawnItem() {
    const lane = Math.floor(Math.random() * 3);
    if (Math.random() < 0.65) {
        items.push({ lane, y: -laneW, type: 'coin', emoji: '🪙', hit: false });
    } else {
        // never block all lanes: skip obstacle if the two other lanes
        // already have an obstacle near the top
        const nearTop = items.filter(it => it.type === 'obstacle' && it.y < laneW * 2);
        if (nearTop.length >= 2) {
            items.push({ lane, y: -laneW, type: 'coin', emoji: '🪙', hit: false });
        } else {
            items.push({
                lane, y: -laneW, type: 'obstacle',
                emoji: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
                hit: false
            });
        }
    }
}

function spawnDecor() {
    const side = Math.random() < 0.5 ? -1 : 1;
    const margin = (W - roadW) / 2;
    if (margin < 30) return;
    decor.push({
        x: W / 2 + side * (roadW / 2 + margin * (0.3 + Math.random() * 0.5)),
        y: -60,
        emoji: DECOR[Math.floor(Math.random() * DECOR.length)],
        size: 30 + Math.random() * 25
    });
}

// ========================================
// MAIN LOOP
// ========================================
function loop(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;

    update(dt);
    draw(time / 1000);
    requestAnimationFrame(loop);
}

function update(dt) {
    // speed gently grows with coins, resets a bit on bumps
    const targetSpeed = Math.min(baseSpeed + coins * 2, H * 0.62);
    speed += (targetSpeed - speed) * dt * 0.5;

    dashOffset = (dashOffset + speed * dt) % (laneW * 0.8);

    // kitty glides toward its lane
    player.x += (laneX(player.lane) - player.x) * Math.min(1, dt * 12);
    if (player.bumpT > 0) player.bumpT -= dt;
    if (player.invincibleT > 0) player.invincibleT -= dt;

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
        spawnItem();
        spawnTimer = 0.9 + Math.random() * 0.5;
    }
    decorTimer -= dt;
    if (decorTimer <= 0) {
        spawnDecor();
        decorTimer = 0.7 + Math.random() * 0.8;
    }

    for (const it of items) it.y += speed * dt;
    for (const d of decor) d.y += speed * dt;

    // collisions
    for (const it of items) {
        if (it.hit || Math.abs(it.y - player.y) > laneW * 0.35) continue;
        if (Math.abs(laneX(it.lane) - player.x) > laneW * 0.45) continue;
        it.hit = true;
        if (it.type === 'coin') {
            collectCoin(it);
        } else if (player.invincibleT <= 0) {
            bump();
        }
    }

    items = items.filter(it => it.y < H + laneW && !(it.hit && it.type === 'coin'));
    decor = decor.filter(d => d.y < H + 80);

    for (const s of sparkles) {
        s.vy += 400 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
    }
    sparkles = sparkles.filter(s => s.life > 0);
}

function collectCoin(it) {
    coins++;
    document.getElementById('coins').textContent = coins;
    playCoin();
    for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 120 + 50;
        sparkles.push({
            x: laneX(it.lane), y: it.y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 60,
            life: 0.6
        });
    }
    if (coins % COIN_MILESTONE === 0) {
        playCheer();
        dropConfetti();
        showMessage('🌟 ' + coins + ' coins! 🌟');
    }
}

function bump() {
    player.bumpT = 0.6;
    player.invincibleT = 1.8;
    speed = baseSpeed;
    playBump();
    showMessage('Oops! 😅');
}

// ========================================
// EFFECTS
// ========================================
function showMessage(text) {
    const el = document.getElementById('message');
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
}

function dropConfetti() {
    const layer = document.getElementById('confettiLayer');
    const emojis = ['🎉', '⭐', '🪙', '🐾', '✨'];
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

// ========================================
// DRAWING
// ========================================
function draw(t) {
    // grass
    ctx.fillStyle = '#A5D6A7';
    ctx.fillRect(0, 0, W, H);

    // road
    const roadL = W / 2 - roadW / 2;
    ctx.fillStyle = '#90A4AE';
    ctx.fillRect(roadL, 0, roadW, H);
    ctx.fillStyle = '#B0BEC5';
    ctx.fillRect(roadL - 8, 0, 8, H);
    ctx.fillRect(roadL + roadW, 0, 8, H);

    // lane dashes
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 6;
    ctx.setLineDash([laneW * 0.4, laneW * 0.4]);
    ctx.lineDashOffset = -dashOffset;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(roadL + laneW * i, -laneW);
        ctx.lineTo(roadL + laneW * i, H + laneW);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // roadside decorations
    for (const d of decor) {
        ctx.font = Math.round(d.size) + 'px sans-serif';
        ctx.fillText(d.emoji, d.x, d.y);
    }

    // items
    const itemSize = Math.round(laneW * 0.52);
    for (const it of items) {
        if (it.hit && it.type === 'obstacle') ctx.globalAlpha = 0.4;
        ctx.font = itemSize + 'px sans-serif';
        ctx.fillText(it.emoji, laneX(it.lane), it.y);
        ctx.globalAlpha = 1;
    }

    // sparkles
    for (const s of sparkles) {
        ctx.globalAlpha = Math.max(0, Math.min(1, s.life * 2));
        ctx.fillStyle = '#FFD54F';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // kitty (blinks while invincible, sad face on bump)
    const blink = player.invincibleT > 0 && Math.floor(t * 10) % 2 === 0;
    ctx.globalAlpha = blink ? 0.4 : 1;
    const bob = Math.sin(t * 10) * 4;
    const wobble = player.bumpT > 0 ? Math.sin(t * 40) * 6 : 0;
    ctx.font = Math.round(laneW * 0.72) + 'px sans-serif';
    ctx.fillText(player.bumpT > 0 ? '😿' : '🐱', player.x + wobble, player.y + bob);
    ctx.globalAlpha = 1;
}
