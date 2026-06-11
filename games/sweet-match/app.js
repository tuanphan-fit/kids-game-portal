// Sweet Match - kid-friendly match-3 (ages 3-5)
// Tap a candy then tap its neighbor (or swipe) to swap.
// No timers, no move limits, no losing. Idle hints wiggle a valid move.

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

function playSwap() {
    playTone(330, 0.1, 'triangle', 0.1);
}

function playMatch(chain) {
    const base = 440 + chain * 110;
    [0, 1, 2].forEach(i => setTimeout(() => playTone(base + i * 130, 0.18, 'sine', 0.15), i * 70));
}

function playCheer() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'triangle', 0.18), i * 120));
}

// ========================================
// GAME STATE
// ========================================
const SIZE = 6;
const CANDIES = ['🍭', '🍬', '🍩', '🧁'];
const POINTS_PER_CANDY = 10;
const POINTS_PER_LEVEL = 200;

let board = [];      // board[r][c] = { type, el } or null
let tileSize = 0;
let busy = false;
let selected = null; // {r, c}
let score = 0;
let level = 1;
let gesture = null;  // pointer gesture in progress
let hintTimer = null;
let hintCells = [];

const sleep = ms => new Promise(res => setTimeout(res, ms));

// ========================================
// SETUP
// ========================================
function initGame() {
    const boardEl = document.getElementById('board');
    window.addEventListener('resize', layoutBoard);
    layoutBoard();
    fillInitialBoard();

    boardEl.addEventListener('pointerdown', onPointerDown);
    boardEl.addEventListener('pointermove', onPointerMove);
    boardEl.addEventListener('pointerup', onPointerUp);
    boardEl.addEventListener('pointercancel', () => { gesture = null; });

    resetHintTimer();
}

function layoutBoard() {
    const area = document.getElementById('gameArea');
    const boardEl = document.getElementById('board');
    const size = Math.min(area.clientWidth, area.clientHeight) - 16;
    boardEl.style.width = size + 'px';
    boardEl.style.height = size + 'px';
    tileSize = size / SIZE;
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const t = board[r] && board[r][c];
            if (t) {
                t.el.classList.add('no-anim');
                positionTile(t.el, r, c);
                sizeTile(t.el);
                // force reflow so the transition removal applies cleanly
                void t.el.offsetWidth;
                t.el.classList.remove('no-anim');
            }
        }
    }
}

function sizeTile(el) {
    el.style.width = tileSize + 'px';
    el.style.height = tileSize + 'px';
    el.querySelector('.tile-inner').style.fontSize = (tileSize * 0.6) + 'px';
}

function positionTile(el, r, c) {
    el.style.transform = `translate(${c * tileSize}px, ${r * tileSize}px)`;
}

function makeTile(type, r, c, fromAbove) {
    const el = document.createElement('div');
    el.className = 'tile';
    const inner = document.createElement('div');
    inner.className = 'tile-inner';
    inner.textContent = type;
    el.appendChild(inner);
    sizeTile(el);
    if (fromAbove) {
        el.classList.add('no-anim');
        positionTile(el, r - SIZE, c);
        void el.offsetWidth;
        el.classList.remove('no-anim');
    }
    positionTile(el, r, c);
    document.getElementById('board').appendChild(el);
    return { type, el };
}

function fillInitialBoard() {
    board = [];
    for (let r = 0; r < SIZE; r++) {
        const row = [];
        for (let c = 0; c < SIZE; c++) {
            let type;
            do {
                type = CANDIES[Math.floor(Math.random() * CANDIES.length)];
            } while (
                (c >= 2 && row[c - 1].type === type && row[c - 2].type === type) ||
                (r >= 2 && board[r - 1][c].type === type && board[r - 2][c].type === type)
            );
            row.push(makeTile(type, r, c));
        }
        board.push(row);
    }
    if (!findValidMove()) shuffleBoard();
}

// ========================================
// INPUT
// ========================================
function cellFromEvent(e) {
    const rect = document.getElementById('board').getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / tileSize);
    const r = Math.floor((e.clientY - rect.top) / tileSize);
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null;
    return { r, c };
}

function onPointerDown(e) {
    resetHintTimer();
    if (busy) return;
    const cellAt = cellFromEvent(e);
    if (!cellAt) return;
    gesture = { start: cellAt, x: e.clientX, y: e.clientY, swiped: false };
}

function onPointerMove(e) {
    if (!gesture || gesture.swiped || busy) return;
    const dx = e.clientX - gesture.x;
    const dy = e.clientY - gesture.y;
    if (Math.hypot(dx, dy) < tileSize * 0.4) return;
    gesture.swiped = true;
    const { r, c } = gesture.start;
    let target;
    if (Math.abs(dx) > Math.abs(dy)) {
        target = { r, c: c + Math.sign(dx) };
    } else {
        target = { r: r + Math.sign(dy), c };
    }
    if (target.r >= 0 && target.r < SIZE && target.c >= 0 && target.c < SIZE) {
        clearSelection();
        trySwap(gesture.start, target);
    }
    gesture = null;
}

function onPointerUp(e) {
    if (!gesture || busy) { gesture = null; return; }
    const cellAt = cellFromEvent(e);
    gesture = null;
    if (!cellAt) return;

    if (selected) {
        const prev = selected;
        clearSelection();
        const adjacent = Math.abs(prev.r - cellAt.r) + Math.abs(prev.c - cellAt.c) === 1;
        if (adjacent) {
            trySwap(prev, cellAt);
            return;
        }
        // tapping the selected candy again deselects it
        if (prev.r === cellAt.r && prev.c === cellAt.c) return;
    }
    selected = cellAt;
    board[cellAt.r][cellAt.c].el.classList.add('selected');
    playTone(520, 0.08, 'sine', 0.08);
}

function clearSelection() {
    if (selected) {
        board[selected.r][selected.c].el.classList.remove('selected');
        selected = null;
    }
}

// ========================================
// SWAPPING & MATCHING
// ========================================
async function trySwap(a, b) {
    busy = true;
    clearHint();
    playSwap();
    swapTiles(a, b);
    await sleep(280);

    const matches = findMatches();
    if (matches.size === 0) {
        swapTiles(a, b); // bounce back
        await sleep(280);
        busy = false;
        return;
    }
    await resolveBoard(matches);
    busy = false;
    resetHintTimer();
}

function swapTiles(a, b) {
    const ta = board[a.r][a.c];
    const tb = board[b.r][b.c];
    board[a.r][a.c] = tb;
    board[b.r][b.c] = ta;
    positionTile(ta.el, b.r, b.c);
    positionTile(tb.el, a.r, a.c);
}

function findMatches() {
    const matched = new Set();
    // rows
    for (let r = 0; r < SIZE; r++) {
        let run = 1;
        for (let c = 1; c <= SIZE; c++) {
            if (c < SIZE && board[r][c].type === board[r][c - 1].type) {
                run++;
            } else {
                if (run >= 3) {
                    for (let k = c - run; k < c; k++) matched.add(r + ',' + k);
                }
                run = 1;
            }
        }
    }
    // columns
    for (let c = 0; c < SIZE; c++) {
        let run = 1;
        for (let r = 1; r <= SIZE; r++) {
            if (r < SIZE && board[r][c].type === board[r - 1][c].type) {
                run++;
            } else {
                if (run >= 3) {
                    for (let k = r - run; k < r; k++) matched.add(k + ',' + c);
                }
                run = 1;
            }
        }
    }
    return matched;
}

async function resolveBoard(firstMatches) {
    let matches = firstMatches || findMatches();
    let chain = 0;

    while (matches.size > 0) {
        chain++;
        playMatch(chain);
        addScore(matches.size * POINTS_PER_CANDY);

        // pop animation
        for (const key of matches) {
            const [r, c] = key.split(',').map(Number);
            board[r][c].el.classList.add('pop');
        }
        await sleep(320);
        for (const key of matches) {
            const [r, c] = key.split(',').map(Number);
            board[r][c].el.remove();
            board[r][c] = null;
        }

        // gravity + refill
        for (let c = 0; c < SIZE; c++) {
            const remaining = [];
            for (let r = SIZE - 1; r >= 0; r--) {
                if (board[r][c]) remaining.push(board[r][c]);
            }
            for (let r = SIZE - 1, i = 0; r >= 0; r--, i++) {
                if (i < remaining.length) {
                    board[r][c] = remaining[i];
                    positionTile(remaining[i].el, r, c);
                } else {
                    const type = CANDIES[Math.floor(Math.random() * CANDIES.length)];
                    board[r][c] = makeTile(type, r, c, true);
                }
            }
        }
        await sleep(350);
        matches = findMatches();
    }

    await checkLevelUp();
    if (!findValidMove()) {
        await shuffleBoard();
    }
}

// ========================================
// VALID MOVES, HINTS, SHUFFLE
// ========================================
function wouldMatchAt(r, c) {
    const t = board[r][c].type;
    const same = (rr, cc) => rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && board[rr][cc].type === t;
    // horizontal
    let run = 1;
    for (let cc = c - 1; same(r, cc); cc--) run++;
    for (let cc = c + 1; same(r, cc); cc++) run++;
    if (run >= 3) return true;
    // vertical
    run = 1;
    for (let rr = r - 1; same(rr, c); rr--) run++;
    for (let rr = r + 1; same(rr, c); rr++) run++;
    return run >= 3;
}

function findValidMove() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            for (const [dr, dc] of [[0, 1], [1, 0]]) {
                const r2 = r + dr, c2 = c + dc;
                if (r2 >= SIZE || c2 >= SIZE) continue;
                if (board[r][c].type === board[r2][c2].type) continue;
                // virtual swap
                const tmp = board[r][c];
                board[r][c] = board[r2][c2];
                board[r2][c2] = tmp;
                const ok = wouldMatchAt(r, c) || wouldMatchAt(r2, c2);
                board[r2][c2] = board[r][c];
                board[r][c] = tmp;
                if (ok) return [{ r, c }, { r: r2, c: c2 }];
            }
        }
    }
    return null;
}

function resetHintTimer() {
    clearHint();
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(showHint, 8000);
}

function showHint() {
    if (busy) { resetHintTimer(); return; }
    const move = findValidMove();
    if (!move) return;
    hintCells = move;
    for (const { r, c } of move) {
        board[r][c].el.classList.add('hint');
    }
}

function clearHint() {
    for (const { r, c } of hintCells) {
        if (board[r] && board[r][c]) board[r][c].el.classList.remove('hint');
    }
    hintCells = [];
}

async function shuffleBoard() {
    showBanner('✨ New candies! ✨');
    await sleep(900);
    hideBanner();
    const types = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) types.push(board[r][c].type);
    }
    let tries = 0;
    do {
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                board[r][c].type = types[r * SIZE + c];
                board[r][c].el.querySelector('.tile-inner').textContent = board[r][c].type;
            }
        }
        tries++;
    } while ((findMatches().size > 0 || !findValidMove()) && tries < 50);

    // if shuffling accidentally made matches, let the kids enjoy them
    const matches = findMatches();
    if (matches.size > 0) await resolveBoard(matches);
}

// ========================================
// SCORE, LEVELS, CELEBRATION
// ========================================
function addScore(n) {
    score += n;
    document.getElementById('score').textContent = score;
    const progress = (score % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;
    document.getElementById('levelFill').style.width = progress + '%';
}

async function checkLevelUp() {
    const newLevel = Math.floor(score / POINTS_PER_LEVEL) + 1;
    if (newLevel > level) {
        level = newLevel;
        document.getElementById('levelLabel').textContent = 'Level ' + level;
        playCheer();
        dropConfetti();
        showBanner('🎉 Level ' + level + '! 🎉');
        await sleep(1600);
        hideBanner();
    }
}

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
    const emojis = ['🎉', '⭐', '🍬', '🍭', '💖', '✨'];
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
