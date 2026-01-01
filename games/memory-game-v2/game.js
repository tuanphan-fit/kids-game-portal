// Memory Match Game - V2 - Independent Implementation

// Audio Manager - Handles all sound effects using Web Audio API
class AudioManager {
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

    // Play flip sound - quick whoosh
    playFlip() {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // Play match sound based on animal emoji
    playMatch(emoji) {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const soundConfig = this.getAnimalSound(emoji);
        this.playAnimalSound(soundConfig);
    }

    getAnimalSound(emoji) {
        const sounds = {
            '🐶': { freq: 350, type: 'bark', duration: 0.15 },
            '🐱': { freq: 550, type: 'meow', duration: 0.3 },
            '🐼': { freq: 180, type: 'chew', duration: 0.2 },
            '🦊': { freq: 450, type: 'yip', duration: 0.1 },
            '🐸': { freq: 700, type: 'ribbit', duration: 0.15 },
            '🦁': { freq: 120, type: 'roar', duration: 0.4 },
            '🐮': { freq: 220, type: 'moo', duration: 0.3 },
            '🐷': { freq: 320, type: 'oink', duration: 0.25 }
        };
        return sounds[emoji] || { freq: 440, type: 'beep', duration: 0.2 };
    }

    playAnimalSound(config) {
        const now = this.audioContext.currentTime;

        switch (config.type) {
            case 'bark':
                this.playTone(config.freq, now, 0.15, 'square');
                break;
            case 'meow':
                this.playSlidingTone(config.freq * 1.3, config.freq * 0.7, now, 0.3, 'sine');
                break;
            case 'chew':
                for (let i = 0; i < 3; i++) {
                    this.playTone(config.freq, now + (i * 0.06), 0.05, 'triangle');
                }
                break;
            case 'yip':
                this.playSlidingTone(config.freq * 1.5, config.freq, now, 0.08, 'sine');
                break;
            case 'ribbit':
                this.playSlidingTone(config.freq * 0.7, config.freq * 1.1, now, 0.15, 'sine');
                break;
            case 'roar':
                this.playSlidingTone(config.freq, config.freq * 0.6, now, 0.4, 'sawtooth');
                break;
            case 'moo':
                this.playSlidingTone(config.freq * 0.7, config.freq * 1.2, now, 0.3, 'triangle');
                break;
            case 'oink':
                for (let i = 0; i < 2; i++) {
                    this.playTone(config.freq * 1.1, now + (i * 0.1), 0.08, 'square');
                }
                break;
            default:
                this.playTone(config.freq, now, config.duration, 'sine');
        }
    }

    playTone(freq, startTime, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    playSlidingTone(startFreq, endFreq, startTime, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(startFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // Play win melody - ascending arpeggio
    playWin() {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const now = this.audioContext.currentTime;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            const startTime = now + (index * 0.12);
            this.playTone(freq, startTime, 0.25, 'sine');
        });
    }
}

class MemoryGame {
    constructor() {
        // Game configuration
        this.emojis = ['🐶', '🐱', '🐼', '🦊', '🐸', '🦁', '🐮', '🐷'];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isLocked = false;
        this.totalPairs = this.emojis.length;
        this.audioStarted = false;

        // Audio manager
        this.audio = new AudioManager();

        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.movesCount = document.getElementById('movesCount');
        this.winModal = document.getElementById('winModal');
        this.finalMoves = document.getElementById('finalMoves');
        this.restartBtn = document.getElementById('restartBtn');
        this.backBtn = document.getElementById('backBtn');

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => this.startNewGame());
        this.backBtn.addEventListener('click', () => this.goBack());

        // Initialize audio on first interaction
        document.addEventListener('click', () => this.startAudio(), { once: true });
        document.addEventListener('touchstart', () => this.startAudio(), { once: true });
    }

    startAudio() {
        if (!this.audioStarted) {
            this.audio.init();
            this.audioStarted = true;
        }
    }

    startNewGame() {
        // Reset game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isLocked = false;

        // Update UI
        this.movesCount.textContent = '0';
        this.winModal.classList.remove('show');

        // Create card pairs
        const cardPairs = [...this.emojis, ...this.emojis];

        // Shuffle cards
        this.shuffleArray(cardPairs);

        // Render cards
        this.renderCards(cardPairs);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderCards(cardValues) {
        this.gameBoard.innerHTML = '';

        cardValues.forEach((emoji, index) => {
            const card = this.createCard(emoji, index);
            this.gameBoard.appendChild(card);
        });
    }

    createCard(emoji, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.value = emoji;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${emoji}</div>
                <div class="card-back"></div>
            </div>
        `;

        card.addEventListener('click', () => this.handleCardClick(card));
        return card;
    }

    handleCardClick(card) {
        // Check if moves are allowed
        if (
            this.isLocked ||
            card.classList.contains('flipped') ||
            card.classList.contains('matched')
        ) {
            return;
        }

        // Play flip sound
        this.audio.playFlip();

        // Flip the card
        this.flipCard(card);
        this.flippedCards.push(card);

        // Check for match when two cards are flipped
        if (this.flippedCards.length === 2) {
            this.incrementMoves();
            this.checkForMatch();
        }
    }

    flipCard(card) {
        card.classList.add('flipped');
    }

    incrementMoves() {
        this.moves++;
        this.movesCount.textContent = this.moves;
    }

    checkForMatch() {
        this.isLocked = true;

        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            this.handleMatch(card1, card2);
        } else {
            this.handleMismatch(card1, card2);
        }
    }

    handleMatch(card1, card2) {
        const emoji = card1.dataset.value;

        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');

            // Play match sound for this animal
            this.audio.playMatch(emoji);

            this.matchedPairs++;
            this.flippedCards = [];
            this.isLocked = false;

            // Check for win
            if (this.matchedPairs === this.totalPairs) {
                this.handleWin();
            }
        }, 500);
    }

    handleMismatch(card1, card2) {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }

    handleWin() {
        setTimeout(() => {
            this.finalMoves.textContent = this.moves;
            this.winModal.classList.add('show');

            // Play win melody
            this.audio.playWin();
        }, 500);
    }

    goBack() {
        // Navigate back to portal
        window.location.href = '../../index.html';
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
