// Memory Match Game - V2 - Independent Implementation

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
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
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
        }, 500);
    }

    goBack() {
        // Navigate back to portal
        window.location.href = '../index.html';
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
