// Bubble Pop - kid-friendly bubble shooter (ages 3-5)
// Aim and shoot bubbles, match 3+ of the same color to pop them.
// No game over: bubbles that land too low pop by themselves with sparkles.

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

function playShoot() {
    playTone(300, 0.12, 'triangle', 0.1);
}

function playPop(count) {
    for (let i = 0; i < Math.min(count, 6); i++) {
        setTimeout(() => playTone(450 + i * 90, 0.18, 'sine', 0.15), i * 60);
    }
}

function playCheer() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 130));
}

// ========================================
// GAME STATE
// ========================================
const COLORS = ['#FF6B6B', '#FFD93D', '#4D96FF', '#6BCB77'];
const COLS = 8;
const MAX_ROWS = 12;
const SELF_POP_ROW = 10; // bubbles landing this low pop by themselves
const START_ROWS = 5;

let canvas, ctx, gameArea;
let W = 0, H = 0, DPR = 1;
let cell = 0, R = 0, rowH = 0;
const topPad = 8;

let grid = [];          // grid[r][c] = color index or -1
let shooter = { x: 0, y: 0, color: 0, nextColor: 1 };
let flying = null;      // bubble in flight
let fallers = [];       // detached bubbles falling
let pops = [];          // pop animations
let sparkles = [];      // particles
let aimPoint = null;
let score = 0;
let celebrating = false;
let lastTime = 0;

function rowLen(r) {
    return r % 2 === 0 ? COLS : COLS - 1;
}

function cellPos(r, c) {
    return {
        x: c * cell + R + (r % 2 ? R : 0),
        y: topPad + R + r * rowH
    };
}

function validCell(r, c) {
    return r >= 0 && r < MAX_ROWS && c >= 0 && c < rowLen(r);
}

function neighbors(r, c) {
    const o = r % 2 === 0 ? -1 : 0; // diagonal column offset
    return [
        [r, c - 1], [r, c + 1],
        [r - 1, c + o], [r - 1, c + o + 1],
        [r + 1, c + o], [r + 1, c + o + 1]
    ].filter(([rr, cc]) => validCell(rr, cc));
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
    newBoard();
    pickShooterColors(true);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', () => { aimPoint = null; });

    requestAnimationFrame(loop);
}

function resize() {
    DPR = window.devicePixelRatio || 1;
    W = gameArea.clientWidth;
    H = gameArea.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cell = W / COLS;
    R = cell / 2;
    rowH = cell * 0.866;
    shooter.x = W / 2;
    shooter.y = H - R - 16;
}

function newBoard() {
    grid = [];
    for (let r = 0; r < MAX_ROWS; r++) {
        const row = [];
        for (let c = 0; c < rowLen(r); c++) {
            row.push(r < START_ROWS ? Math.floor(Math.random() * COLORS.length) : -1);
        }
        grid.push(row);
    }
}

function boardColors() {
    const present = new Set();
    for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < rowLen(r); c++) {
            if (grid[r][c] >= 0) present.add(grid[r][c]);
        }
    }
    return [...present];
}

function pickShooterColors(both) {
    const present = boardColors();
    const pick = () => {
        if (present.length === 0) return Math.floor(Math.random() * COLORS.length);
        return present[Math.floor(Math.random() * present.length)];
    };
    if (both) shooter.color = pick();
    else shooter.color = shooter.nextColor;
    shooter.nextColor = pick();
}

// ========================================
// INPUT
// ========================================
function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onPointerDown(e) {
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* keep aiming anyway */ }
    aimPoint = pointerPos(e);
}

function onPointerMove(e) {
    if (aimPoint) aimPoint = pointerPos(e);
}

function onPointerUp(e) {
    if (!aimPoint) return;
    const target = pointerPos(e);
    aimPoint = null;
    shoot(target);
}

function aimDirection(target) {
    let dx = target.x - shooter.x;
    let dy = target.y - shooter.y;
    // Always shoot upward, even if the tap is low on the screen
    if (dy > -10) dy = -10;
    const len = Math.hypot(dx, dy);
    let nx = dx / len, ny = dy / len;
    // Clamp so shots are never too flat (kids tap everywhere)
    if (ny > -0.25) {
        ny = -0.25;
        nx = Math.sign(nx || 1) * Math.sqrt(1 - ny * ny);
    }
    return { x: nx, y: ny };
}

function shoot(target) {
    if (flying || celebrating) return;
    const dir = aimDirection(target);
    const speed = Math.max(W, H) * 1.6; // px per second
    flying = {
        x: shooter.x,
        y: shooter.y,
        vx: dir.x * speed,
        vy: dir.y * speed,
        color: shooter.color
    };
    playShoot();
    pickShooterColors(false);
}

// ========================================
// FLIGHT & LANDING
// ========================================
function updateFlying(dt) {
    if (!flying) return;
    const dist = Math.hypot(flying.vx, flying.vy) * dt;
    const steps = Math.max(1, Math.ceil(dist / (R * 0.5)));
    const sdt = dt / steps;
    for (let i = 0; i < steps; i++) {
        flying.x += flying.vx * sdt;
        flying.y += flying.vy * sdt;
        if (flying.x < R) { flying.x = R; flying.vx = -flying.vx; }
        if (flying.x > W - R) { flying.x = W - R; flying.vx = -flying.vx; }
        if (flying.y <= topPad + R || hitsBubble(flying.x, flying.y)) {
            landBubble();
            return;
        }
    }
}

function hitsBubble(x, y) {
    for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < rowLen(r); c++) {
            if (grid[r][c] < 0) continue;
            const p = cellPos(r, c);
            if (Math.hypot(x - p.x, y - p.y) < 2 * R * 0.82) return true;
        }
    }
    return false;
}

function landBubble() {
    const b = flying;
    flying = null;

    // Find nearest empty cell that touches the top row or an occupied bubble
    let best = null, bestDist = Infinity;
    for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < rowLen(r); c++) {
            if (grid[r][c] >= 0) continue;
            const attached = r === 0 ||
                neighbors(r, c).some(([rr, cc]) => grid[rr][cc] >= 0);
            if (!attached) continue;
            const p = cellPos(r, c);
            const d = Math.hypot(b.x - p.x, b.y - p.y);
            if (d < bestDist) { bestDist = d; best = { r, c }; }
        }
    }

    if (!best) {
        // Board is somehow full near the impact: just pop the bubble
        addPop(b.x, b.y, b.color);
        addScore(1);
        return;
    }

    grid[best.r][best.c] = b.color;

    // Kid-friendly safety: anything landing too low pops by itself
    if (best.r >= SELF_POP_ROW) {
        popCells([[best.r, best.c]]);
        addScore(1);
        playPop(1);
        return;
    }

    resolveMatches(best.r, best.c);
}

// ========================================
// MATCHING
// ========================================
function resolveMatches(r, c) {
    const color = grid[r][c];
    const cluster = collectCluster(r, c, color);

    if (cluster.length >= 3) {
        popCells(cluster);
        addScore(cluster.length);
        playPop(cluster.length);
        dropFloaters();
    }

    if (boardColors().length === 0) {
        celebrate();
    } else {
        // Make sure the shooter color still exists on the board
        const present = boardColors();
        if (!present.includes(shooter.color)) {
            shooter.color = present[Math.floor(Math.random() * present.length)];
        }
        if (!present.includes(shooter.nextColor)) {
            shooter.nextColor = present[Math.floor(Math.random() * present.length)];
        }
    }
}

function collectCluster(r, c, color) {
    const seen = new Set([r + ',' + c]);
    const stack = [[r, c]];
    const out = [];
    while (stack.length) {
        const [cr, cc] = stack.pop();
        out.push([cr, cc]);
        for (const [nr, nc] of neighbors(cr, cc)) {
            const key = nr + ',' + nc;
            if (!seen.has(key) && grid[nr][nc] === color) {
                seen.add(key);
                stack.push([nr, nc]);
            }
        }
    }
    return out;
}

function popCells(cells) {
    for (const [r, c] of cells) {
        const p = cellPos(r, c);
        addPop(p.x, p.y, grid[r][c]);
        grid[r][c] = -1;
    }
}

function dropFloaters() {
    // Anything not connected to the top row falls down
    const seen = new Set();
    const stack = [];
    for (let c = 0; c < rowLen(0); c++) {
        if (grid[0][c] >= 0) { seen.add('0,' + c); stack.push([0, c]); }
    }
    while (stack.length) {
        const [cr, cc] = stack.pop();
        for (const [nr, nc] of neighbors(cr, cc)) {
            const key = nr + ',' + nc;
            if (!seen.has(key) && grid[nr][nc] >= 0) {
                seen.add(key);
                stack.push([nr, nc]);
            }
        }
    }
    let dropped = 0;
    for (let r = 1; r < MAX_ROWS; r++) {
        for (let c = 0; c < rowLen(r); c++) {
            if (grid[r][c] >= 0 && !seen.has(r + ',' + c)) {
                const p = cellPos(r, c);
                fallers.push({
                    x: p.x, y: p.y,
                    vx: (Math.random() - 0.5) * 120,
                    vy: -80,
                    color: grid[r][c]
                });
                grid[r][c] = -1;
                dropped++;
            }
        }
    }
    if (dropped > 0) addScore(dropped * 2);
}

function celebrate() {
    celebrating = true;
    addScore(10);
    playCheer();
    const el = document.getElementById('celebrate');
    const texts = ['🎉 Amazing! 🎉', '🌟 Super! 🌟', '🥳 You did it! 🥳'];
    document.getElementById('celebrateText').textContent =
        texts[Math.floor(Math.random() * texts.length)];
    el.style.display = 'flex';
    for (let i = 0; i < 40; i++) {
        sparkles.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.6,
            vx: (Math.random() - 0.5) * 200,
            vy: Math.random() * 150 + 50,
            life: 1.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
    }
    setTimeout(() => {
        el.style.display = 'none';
        newBoard();
        pickShooterColors(true);
        celebrating = false;
    }, 2000);
}

// ========================================
// EFFECTS & SCORE
// ========================================
function addPop(x, y, colorIdx) {
    pops.push({ x, y, color: COLORS[colorIdx] || '#FFF', t: 0 });
    for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 150 + 60;
        sparkles.push({
            x, y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 60,
            life: 0.6,
            color: COLORS[colorIdx] || '#FFF'
        });
    }
}

function addScore(n) {
    score += n;
    document.getElementById('score').textContent = score;
}

// ========================================
// MAIN LOOP
// ========================================
function loop(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;

    updateFlying(dt);

    for (const f of fallers) {
        f.vy += 900 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
    }
    fallers = fallers.filter(f => f.y < H + R * 2);

    for (const p of pops) p.t += dt;
    pops = pops.filter(p => p.t < 0.3);

    for (const s of sparkles) {
        s.vy += 500 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
    }
    sparkles = sparkles.filter(s => s.life > 0);

    draw();
    requestAnimationFrame(loop);
}

// ========================================
// DRAWING
// ========================================
function drawBubble(x, y, radius, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    const grad = ctx.createRadialGradient(
        x - radius * 0.35, y - radius * 0.35, radius * 0.1,
        x, y, radius
    );
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.25, color);
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // shine dot
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(x - radius * 0.35, y - radius * 0.4, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawAimLine() {
    if (!aimPoint || flying || celebrating) return;
    const dir = aimDirection(aimPoint);
    let x = shooter.x, y = shooter.y;
    let dx = dir.x, dy = dir.y;
    const step = R * 0.7;
    ctx.save();
    ctx.fillStyle = 'rgba(33, 150, 243, 0.55)';
    for (let i = 0; i < 60; i++) {
        x += dx * step;
        y += dy * step;
        if (x < R) { x = R; dx = -dx; }
        if (x > W - R) { x = W - R; dx = -dx; }
        if (y <= topPad + R || hitsBubble(x, y)) break;
        if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, W, H);

    // grid bubbles
    for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < rowLen(r); c++) {
            if (grid[r][c] < 0) continue;
            const p = cellPos(r, c);
            drawBubble(p.x, p.y, R * 0.92, COLORS[grid[r][c]]);
        }
    }

    // pop animations (expanding fading rings)
    for (const p of pops) {
        const k = p.t / 0.3;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 5 * (1 - k);
        ctx.beginPath();
        ctx.arc(p.x, p.y, R * (0.9 + k * 0.8), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // falling detached bubbles
    for (const f of fallers) {
        drawBubble(f.x, f.y, R * 0.92, COLORS[f.color]);
    }

    // sparkles
    for (const s of sparkles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, s.life * 2));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawAimLine();

    // flying bubble
    if (flying) drawBubble(flying.x, flying.y, R * 0.92, COLORS[flying.color]);

    // shooter base
    ctx.save();
    ctx.fillStyle = 'rgba(33, 150, 243, 0.15)';
    ctx.beginPath();
    ctx.arc(shooter.x, shooter.y, R * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!flying) drawBubble(shooter.x, shooter.y, R * 1.05, COLORS[shooter.color]);

    // next bubble preview
    drawBubble(shooter.x + R * 3, shooter.y + R * 0.3, R * 0.6, COLORS[shooter.nextColor], 0.8);
}
