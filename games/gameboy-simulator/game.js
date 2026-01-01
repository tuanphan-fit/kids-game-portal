// GameBoy Simulator - Snake Game

// GameBoy Color Palette (original 4-color green scheme)
const COLORS = {
    DARKEST: '#0f380f',
    DARK: '#306230',
    LIGHT: '#8bac0f',
    LIGHTEST: '#9bbc9f'
};

class GameBoyAudio {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    ensureContext() {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Retro beep sound
    playBeep(frequency = 440, duration = 0.1) {
        if (!this.enabled || !this.audioContext) return;
        this.ensureContext();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'square'; // Square wave for retro sound
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playEat() {
        this.playBeep(523, 0.1); // C5
        setTimeout(() => this.playBeep(659, 0.1), 50); // E5
    }

    playMove() {
        this.playBeep(220, 0.05); // A3
    }

    playGameOver() {
        this.playBeep(330, 0.15); // E4
        setTimeout(() => this.playBeep(294, 0.15), 150); // D4
        setTimeout(() => this.playBeep(262, 0.3), 300); // C4
    }

    playStart() {
        this.playBeep(440, 0.1); // A4
        setTimeout(() => this.playBeep(554, 0.1), 100); // C#5
        setTimeout(() => this.playBeep(659, 0.2), 200); // E5
    }
}

class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audio = new GameBoyAudio();
        this.audioStarted = false;

        // Game state
        this.gridSize = 8;
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = { x: 0, y: 0 };
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        this.lastUpdate = 0;
        this.updateInterval = 200; // Snake speed (ms)

        // Calculate grid dimensions
        this.gridWidth = Math.floor(this.canvas.width / this.gridSize);
        this.gridHeight = Math.floor(this.canvas.height / this.gridSize);

        // Initialize
        this.reset();
    }

    initAudio() {
        if (!this.audioStarted) {
            this.audio.init();
            this.audioStarted = true;
        }
    }

    reset() {
        // Initialize snake in the middle
        const startX = Math.floor(this.gridWidth / 2);
        const startY = Math.floor(this.gridHeight / 2);
        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.spawnFood();
    }

    spawnFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.isOnSnake(this.food));
    }

    isOnSnake(pos) {
        return this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    }

    setDirection(newDir) {
        // Prevent 180-degree turns
        if (this.direction.x + newDir.x !== 0 || this.direction.y + newDir.y !== 0) {
            this.nextDirection = newDir;
        }
    }

    start() {
        this.reset();
        this.gameRunning = true;
        this.audio.playStart();
        this.gameLoop();
    }

    stop() {
        this.gameRunning = false;
    }

    update(timestamp) {
        if (!this.gameRunning || this.gameOver) return;

        if (timestamp - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = timestamp;

        // Update direction
        this.direction = { ...this.nextDirection };

        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= this.gridWidth ||
            newHead.y < 0 || newHead.y >= this.gridHeight) {
            this.gameOver = true;
            this.audio.playGameOver();
            return;
        }

        // Check self collision
        if (this.isOnSnake(newHead)) {
            this.gameOver = true;
            this.audio.playGameOver();
            return;
        }

        // Add new head
        this.snake.unshift(newHead);

        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score++;
            this.audio.playEat();
            this.spawnFood();
            // Speed up slightly
            this.updateInterval = Math.max(80, 200 - this.score * 5);
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    draw() {
        // Clear screen with lightest color
        this.ctx.fillStyle = COLORS.LIGHTEST;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw border
        this.ctx.fillStyle = COLORS.DARKEST;
        this.ctx.fillRect(0, 0, this.canvas.width, 2);
        this.ctx.fillRect(0, 0, 2, this.canvas.height);
        this.ctx.fillRect(0, this.canvas.height - 2, this.canvas.width, 2);
        this.ctx.fillRect(this.canvas.width - 2, 0, 2, this.canvas.height);

        // Draw food (apple)
        this.ctx.fillStyle = COLORS.DARK;
        const foodX = this.food.x * this.gridSize;
        const foodY = this.food.y * this.gridSize;
        this.ctx.fillRect(foodX + 1, foodY + 1, this.gridSize - 2, this.gridSize - 2);

        // Draw snake
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;

            // Head is dark, body is lighter
            this.ctx.fillStyle = index === 0 ? COLORS.DARKEST : COLORS.DARK;
            this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        });

        // Draw score at bottom
        this.ctx.fillStyle = COLORS.DARKEST;
        this.ctx.font = '10px monospace';
        this.ctx.fillText(`SCORE:${this.score}`, 5, this.canvas.height - 5);

        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = COLORS.DARKEST;
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 10);
            this.ctx.font = '10px monospace';
            this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
            this.ctx.fillText('Press A', this.canvas.width / 2, this.canvas.height / 2 + 25);
            this.ctx.textAlign = 'left';
        }

        // Draw start message
        if (!this.gameRunning && !this.gameOver) {
            this.ctx.fillStyle = COLORS.DARKEST;
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SNAKE', this.canvas.width / 2, this.canvas.height / 2 - 15);
            this.ctx.font = '10px monospace';
            this.ctx.fillText('Press A', this.canvas.width / 2, this.canvas.height / 2 + 5);
            this.ctx.fillText('to Start', this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.textAlign = 'left';
        }
    }

    gameLoop(timestamp = 0) {
        if (!this.gameRunning) return;

        this.update(timestamp);
        this.draw();

        if (!this.gameOver) {
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }
}

class GameBoy {
    constructor() {
        this.canvas = document.getElementById('gameScreen');
        this.game = new SnakeGame(this.canvas);
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.finalScore = document.getElementById('finalScore');
        this.backBtn = document.getElementById('backBtn');

        this.setupControls();
        this.setupEventListeners();

        // Initial draw
        this.game.draw();
    }

    setupControls() {
        // D-Pad
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            const direction = btn.dataset.direction;
            btn.addEventListener('click', () => {
                this.game.initAudio();

                const dirMap = {
                    'up': { x: 0, y: -1 },
                    'down': { x: 0, y: 1 },
                    'left': { x: -1, y: 0 },
                    'right': { x: 1, y: 0 }
                };
                this.game.setDirection(dirMap[direction]);
                this.game.audio.playMove();
            });

            // Prevent double-tap zoom on mobile
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.click();
            });
        });

        // A/B Buttons
        document.querySelector('.btn-a').addEventListener('click', () => {
            this.game.initAudio();

            if (this.game.gameOver || !this.game.gameRunning) {
                // Start/restart game
                this.gameOverOverlay.style.display = 'none';
                this.game.start();
            }
        });

        document.querySelector('.btn-b').addEventListener('click', () => {
            this.game.initAudio();
            // B button also restarts
            if (this.game.gameOver || !this.game.gameRunning) {
                this.gameOverOverlay.style.display = 'none';
                this.game.start();
            }
        });

        // Start/Select buttons
        document.querySelector('.btn-start').addEventListener('click', () => {
            this.game.initAudio();
            if (!this.game.gameRunning) {
                this.game.start();
            }
        });

        document.querySelector('.btn-select').addEventListener('click', () => {
            this.game.initAudio();
            // Could be used for pause in future
        });

        // Prevent double-tap zoom on action buttons
        document.querySelectorAll('.action-btn, .meta-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.click();
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.game.initAudio();

            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'KeyZ': 'a', // Z = A button
                'KeyX': 'b', // X = B button
                'Enter': 'start'
            };

            if (keyMap[e.code]) {
                e.preventDefault();
                const action = keyMap[e.code];

                if (action === 'up' || action === 'down' || action === 'left' || action === 'right') {
                    const dirMap = {
                        'up': { x: 0, y: -1 },
                        'down': { x: 0, y: 1 },
                        'left': { x: -1, y: 0 },
                        'right': { x: 1, y: 0 }
                    };
                    this.game.setDirection(dirMap[action]);
                    this.game.audio.playMove();
                } else if (action === 'a' || action === 'start') {
                    if (this.game.gameOver || !this.game.gameRunning) {
                        this.gameOverOverlay.style.display = 'none';
                        this.game.start();
                    }
                }
            }
        });
    }

    setupEventListeners() {
        this.backBtn.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameBoy();
});
