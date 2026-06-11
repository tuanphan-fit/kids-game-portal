// Cake Tower - kid-friendly cake stacking game (ages 3-5)
// A cake layer slides back and forth. Tap to drop it on the tower.
// Close drops snap perfectly. Missed layers just tumble away - no game over.

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

function playThunk() {
    playTone(160, 0.15, 'triangle', 0.18);
}

function playPerfect() {
    playTone(880, 0.2, 'sine', 0.15);
    setTimeout(() => playTone(1175, 0.3, 'sine', 0.15), 100);
}

function playWobble() {
    playTone(220, 0.15, 'sawtooth', 0.08);
    setTimeout(() => playTone(180, 0.2, 'sawtooth', 0.08), 120);
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const PALETTE = [
    ['#F48FB1', '#F8BBD0'], // strawberry
    ['#FFCC80', '#FFE0B2'], // orange cream
    ['#A5D6A7', '#C8E6C9'], // pistachio
    ['#90CAF9', '#BBDEFB'], // blueberry
    ['#CE93D8', '#E1BEE7'], // berry
    ['#FFF59D', '#FFF9C4']  // lemon
];
const DECORATIONS = ['🍓', '🍒', '🫐', '🍇'];
const PERFECT_SNAP = 0.38;   // within 38% of layer width counts as perfect
const MIN_WIDTH_FRAC = 0.22; // a layer never shrinks below this fraction of screen

let canvas, ctx, gameArea;
let W = 0, H = 0, DPR = 1;
let layerH = 40;
let groundY = 0;
let initialW = 0;

let layers = [];   // {x (center), w, colorIdx, deco}
let moving = null; // {x, w, colorIdx}
let dropping = null;
let cuts = [];     // falling trimmed pieces {x, y, w, colorIdx, vx, vy, rot, vr}
let sparkles = [];
let clouds = [];
let cameraY = 0;
let cameraTarget = 0;
let t = 0;
let lastTime = 0;

function baseSpeed() {
    return Math.min(2.4, 1.3 + layers.length * 0.04);
}

// ========================================
// SETUP
// ========================================
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameArea = document.getElementById('gameArea');

    window.addEventListener('resize', resize);
    resize();

    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.7,
            s: 0.7 + Math.random() * 0.8,
            v: 8 + Math.random() * 12
        });
    }

    spawnMovingLayer();
    canvas.addEventListener('pointerdown', dropLayer);
    requestAnimationFrame(loop);
}

function resize() {
    DPR = window.devicePixelRatio || 1;
    W = gameArea.clientWidth;
    H = gameArea.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layerH = Math.max(34, Math.round(H * 0.055));
    groundY = H - Math.round(H * 0.06);
    initialW = Math.round(W * 0.5);
    if (moving) moving.w = Math.min(moving.w, W * 0.9);
}

function towerTop() {
    // the layer (or plate) the next cake lands on
    if (layers.length === 0) return { x: W / 2, w: initialW * 1.15 };
    return layers[layers.length - 1];
}

function layerWorldY(i) {
    // top edge of layer i (world coordinates, before camera shift)
    return groundY - (i + 1) * layerH;
}

function spawnMovingLayer() {
    const top = towerTop();
    moving = {
        x: W / 2,
        w: layers.length === 0 ? initialW : Math.max(top.w, initialW * MIN_WIDTH_FRAC * 2),
        colorIdx: layers.length % PALETTE.length
    };
}

// ========================================
// DROPPING
// ========================================
function dropLayer() {
    if (!moving || dropping) return;
    dropping = {
        x: moving.x,
        y: layerWorldY(layers.length) - layerH * 2.2,
        w: moving.w,
        colorIdx: moving.colorIdx,
        vy: 0
    };
    moving = null;
}

function landLayer() {
    const d = dropping;
    dropping = null;
    const top = towerTop();

    const left = Math.max(d.x - d.w / 2, top.x - top.w / 2);
    const right = Math.min(d.x + d.w / 2, top.x + top.w / 2);
    const overlap = right - left;

    if (overlap <= 4) {
        // Complete miss: the layer tumbles away, no penalty
        cuts.push({
            x: d.x, y: layerWorldY(layers.length), w: d.w,
            colorIdx: d.colorIdx,
            vx: (d.x < top.x ? -1 : 1) * 120,
            vy: -60, rot: 0,
            vr: (d.x < top.x ? -1 : 1) * 2.5
        });
        playWobble();
        showMessage('Almost! 💪');
        spawnMovingLayer();
        return;
    }

    let newX, newW, perfect = false;

    if (Math.abs(d.x - top.x) <= d.w * PERFECT_SNAP) {
        // Generous perfect snap for little hands
        perfect = true;
        newX = top.x;
        newW = Math.min(initialW, Math.max(d.w, top.w) * 1.05);
        playPerfect();
        showMessage(['Perfect! ⭐', 'Yummy! 😋', 'Wow! 🌟'][layers.length % 3]);
        addSparkles(top.x, layerWorldY(layers.length) + layerH / 2);
    } else {
        // Trim the overhang, but never shrink too small
        newX = (left + right) / 2;
        newW = Math.max(overlap, W * MIN_WIDTH_FRAC);
        const cutW = d.w - overlap;
        if (cutW > 6) {
            const cutX = d.x < top.x ? left - cutW / 2 : right + cutW / 2;
            cuts.push({
                x: cutX, y: layerWorldY(layers.length), w: cutW,
                colorIdx: d.colorIdx,
                vx: (d.x < top.x ? -1 : 1) * 100,
                vy: -40, rot: 0,
                vr: (d.x < top.x ? -1 : 1) * 3
            });
        }
        playThunk();
    }

    layers.push({
        x: newX,
        w: newW,
        colorIdx: d.colorIdx,
        deco: perfect ? DECORATIONS[layers.length % DECORATIONS.length] : null
    });
    document.getElementById('height').textContent = layers.length;

    // milestone celebration every 5 layers
    if (layers.length % 5 === 0) {
        playCheer();
        dropConfetti();
        showMessage('🎂 ' + layers.length + ' layers! 🎉');
    }

    // camera follows the tower up
    const topScreenY = layerWorldY(layers.length);
    cameraTarget = Math.max(0, H * 0.45 - topScreenY);

    spawnMovingLayer();
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

function addSparkles(x, worldY) {
    for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 140 + 60;
        sparkles.push({
            x, y: worldY,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 80,
            life: 0.8
        });
    }
}

function dropConfetti() {
    const layer = document.getElementById('confettiLayer');
    const emojis = ['🎉', '⭐', '🍰', '🧁', '🍓', '✨'];
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
// MAIN LOOP
// ========================================
function loop(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    t += dt;

    // moving layer slides side to side
    if (moving) {
        const amp = Math.max(20, (W - moving.w) / 2 - 8);
        moving.x = W / 2 + Math.sin(t * baseSpeed()) * amp;
    }

    // dropping layer falls
    if (dropping) {
        dropping.vy += 2400 * dt;
        dropping.y += dropping.vy * dt;
        if (dropping.y >= layerWorldY(layers.length)) {
            dropping.y = layerWorldY(layers.length);
            landLayer();
        }
    }

    // trimmed pieces tumble
    for (const c of cuts) {
        c.vy += 1500 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.vr * dt;
    }
    cuts = cuts.filter(c => c.y + cameraY < H + 200);

    // sparkles
    for (const s of sparkles) {
        s.vy += 400 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
    }
    sparkles = sparkles.filter(s => s.life > 0);

    // clouds drift
    for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x > W + 60) c.x = -60;
    }

    // smooth camera
    cameraY += (cameraTarget - cameraY) * Math.min(1, dt * 4);

    draw();
    requestAnimationFrame(loop);
}

// ========================================
// DRAWING
// ========================================
function drawCakeLayer(x, topY, w, colorIdx, deco, rot) {
    const [main, frosting] = PALETTE[colorIdx % PALETTE.length];
    ctx.save();
    ctx.translate(x, topY + layerH / 2);
    if (rot) ctx.rotate(rot);

    const r = Math.min(10, w / 4);
    // cake body
    ctx.fillStyle = main;
    roundRect(-w / 2, -layerH / 2, w, layerH, r);
    ctx.fill();
    // frosting band on top
    ctx.fillStyle = frosting;
    roundRect(-w / 2, -layerH / 2, w, layerH * 0.42, r);
    ctx.fill();
    // frosting drips
    ctx.fillStyle = frosting;
    const drips = Math.max(2, Math.floor(w / 36));
    for (let i = 1; i <= drips; i++) {
        const dx = -w / 2 + (w / (drips + 1)) * i;
        ctx.beginPath();
        ctx.arc(dx, -layerH / 2 + layerH * 0.42, layerH * 0.16, 0, Math.PI);
        ctx.fill();
    }
    // decoration on perfect layers
    if (deco) {
        ctx.font = Math.round(layerH * 0.7) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(deco, 0, -layerH * 0.05);
    }
    ctx.restore();
}

function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function draw() {
    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#FFF8E1');
    sky.addColorStop(1, '#FFE0B2');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // clouds
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const c of clouds) {
        ctx.font = Math.round(40 * c.s) + 'px sans-serif';
        ctx.globalAlpha = 0.8;
        ctx.fillText('☁️', c.x, c.y);
        ctx.globalAlpha = 1;
    }

    ctx.save();
    ctx.translate(0, cameraY);

    // table + plate
    ctx.fillStyle = '#BCAAA4';
    ctx.fillRect(0, groundY + layerH * 0.2, W, H);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(W / 2, groundY + 4, initialW * 0.72, layerH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 3;
    ctx.stroke();

    // tower
    for (let i = 0; i < layers.length; i++) {
        const L = layers[i];
        drawCakeLayer(L.x, layerWorldY(i), L.w, L.colorIdx, L.deco, 0);
    }

    // falling cut pieces
    for (const c of cuts) {
        drawCakeLayer(c.x, c.y, c.w, c.colorIdx, null, c.rot);
    }

    // dropping layer
    if (dropping) {
        drawCakeLayer(dropping.x, dropping.y, dropping.w, dropping.colorIdx, null, 0);
    }

    // moving layer
    if (moving) {
        const y = layerWorldY(layers.length) - layerH * 2.2 + Math.sin(t * 5) * 3;
        drawCakeLayer(moving.x, y, moving.w, moving.colorIdx, null, 0);
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

    ctx.restore();
}
