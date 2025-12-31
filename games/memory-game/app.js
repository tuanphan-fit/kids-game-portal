// Memory Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    initAudio();
});

// Game variables
const cards = [
    '🐶', '🐱', '🐼', '🦊',
    '🐸', '🦁', '🐮', '🐷'
];

let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;
let audioContext = null;

// Sound effects for each animal
const animalSounds = {
    '🐶': { freq: 300, type: 'bark' },
    '🐱': { freq: 600, type: 'meow' },
    '🐼': { freq: 200, type: 'chew' },
    '🦊': { freq: 400, type: 'yip' },
    '🐸': { freq: 800, type: 'ribbit' },
    '🦁': { freq: 150, type: 'roar' },
    '🐮': { freq: 250, type: 'moo' },
    '🐷': { freq: 350, type: 'oink' }
};

// Initialize audio context
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Play fun sound effect
function playMatchSound(animal) {
    if (!audioContext) return;

    // Resume audio context if suspended (required by browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const soundData = animalSounds[animal];
    const now = audioContext.currentTime;

    // Create oscillator for the sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sound patterns for different animals
    switch (soundData.type) {
        case 'bark':
            // Dog: Short, sharp barks
            oscillator.frequency.setValueAtTime(soundData.freq, now);
            oscillator.frequency.exponentialRampToValueAtTime(soundData.freq * 0.5, now + 0.1);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;

        case 'meow':
            // Cat: Sliding pitch
            oscillator.frequency.setValueAtTime(soundData.freq * 1.5, now);
            oscillator.frequency.exponentialRampToValueAtTime(soundData.freq * 0.8, now + 0.3);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'chew':
            // Panda: Short, rhythmic chewing
            for (let i = 0; i < 3; i++) {
                const time = now + (i * 0.08);
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(soundData.freq, time);
                osc.frequency.exponentialRampToValueAtTime(soundData.freq * 0.7, time + 0.05);
                gain.gain.setValueAtTime(0.3, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
                osc.start(time);
                osc.stop(time + 0.05);
            }
            return;

        case 'yip':
            // Fox: Quick, high-pitched yips
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(soundData.freq * 2, now);
            oscillator.frequency.exponentialRampToValueAtTime(soundData.freq, now + 0.08);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;

        case 'ribbit':
            // Frog: Rising pitch
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(soundData.freq * 0.8, now);
            oscillator.frequency.exponentialRampToValueAtTime(soundData.freq * 1.2, now + 0.15);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;

        case 'roar':
            // Lion: Low, rumbling
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(soundData.freq, now);
            oscillator.frequency.exponentialRampToValueAtTime(soundData.freq * 0.6, now + 0.4);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
            break;

        case 'moo':
            // Cow: Low to high slide
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(soundData.freq * 0.8, now);
            oscillator.frequency.linearRampToValueAtTime(soundData.freq * 1.3, now + 0.3);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'oink':
            // Pig: Short, nasal oinks
            oscillator.type = 'square';
            for (let i = 0; i < 2; i++) {
                const time = now + (i * 0.12);
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(soundData.freq * 1.2, time);
                osc.frequency.exponentialRampToValueAtTime(soundData.freq * 0.9, time + 0.1);
                gain.gain.setValueAtTime(0.25, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                osc.start(time);
                osc.stop(time + 0.1);
            }
            return;
    }
}

// Play celebration sound (win)
function playWinSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Play a happy melody
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now + (index * 0.15));

        gainNode.gain.setValueAtTime(0.3, now + (index * 0.15));
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.15) + 0.3);

        oscillator.start(now + (index * 0.15));
        oscillator.stop(now + (index * 0.15) + 0.3);
    });
}

// Play flip sound
function playFlipSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

// Initialize game
function initGame() {
    // Create pairs
    gameCards = [...cards, ...cards];

    // Shuffle cards
    shuffleCards();

    // Create HTML elements
    renderCards();

    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    updateMoves();
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
}

// Render cards to the DOM
function renderCards() {
    const gameContainer = document.getElementById('memoryGame');
    gameContainer.innerHTML = '';

    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.dataset.value = card;

        cardElement.innerHTML = `
            <div class="card-front">${card}</div>
            <div class="card-back"></div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameContainer.appendChild(cardElement);
    });
}

// Flip card
function flipCard(card) {
    // Check if card can be flipped
    if (!canFlip) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (card.classList.contains('disappear')) return;
    if (flippedCards.length >= 2) return;

    // Play flip sound
    playFlipSound();

    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);

    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateMoves();
        checkMatch();
    }
}

// Check if two cards match
function checkMatch() {
    canFlip = false;

    const [card1, card2] = flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
        // Match found!
        setTimeout(() => {
            // Play the animal sound
            playMatchSound(card1.dataset.value);

            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canFlip = true;

            // Make cards disappear after a short delay
            setTimeout(() => {
                card1.classList.add('disappear');
                card2.classList.add('disappear');
            }, 800);

            // Check if game is won
            if (matchedPairs === cards.length) {
                setTimeout(() => {
                    playWinSound();
                    showWinModal();
                }, 1500);
            }
        }, 500);
    } else {
        // No match - flip back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Update moves display
function updateMoves() {
    const movesElement = document.getElementById('moves');
    movesElement.textContent = moves;
}

// Show win modal
function showWinModal() {
    const modal = document.getElementById('winModal');
    const finalMoves = document.getElementById('finalMoves');

    finalMoves.textContent = moves;
    modal.classList.add('show');

    // Create celebration particles
    createParticles();
}

// Hide win modal
function hideWinModal() {
    const modal = document.getElementById('winModal');
    modal.classList.remove('show');
}

// Restart game
function restartGame() {
    hideWinModal();
    initGame();
}

// Create celebration particles
function createParticles() {
    const container = document.getElementById('particlesContainer');
    const emojis = ['🎉', '⭐', '🌟', '✨', '💫', '🎊', '🎈', '🏆', '👏', '💖'];

    // Create 50 particles
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Random position
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';

            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 4000);
        }, i * 50);
    }
}

// Navigate back to portal
function goBack() {
    if (confirm('Go back to the game portal? Your progress will be lost!')) {
        window.location.href = '../../index.html';
    }
}
