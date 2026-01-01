// Crocodile Dentist V2 - Independent Implementation

// Audio Manager - Handles all sound effects
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

    // Play tooth click sound - gentle click
    playToothClick() {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);

        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    // Play safe tooth sound - gentle ding
    playSafeTooth() {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const now = this.audioContext.currentTime;

        // Create a pleasant ding sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.3);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    // Play SNAP sound - loud crunch when mouth closes
    playSnap() {
        if (!this.enabled || !this.audioContext) return;

        this.ensureContext();
        const now = this.audioContext.currentTime;

        // Create a noise burst for the snap
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);

        noiseGain.gain.setValueAtTime(0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        noise.start(now);
        noise.stop(now + 0.3);

        // Add a low thud for the jaw closing
        const oscillator = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();

        oscillator.connect(oscGain);
        oscGain.connect(this.audioContext.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);

        oscGain.gain.setValueAtTime(0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }
}

class CrocodileGame {
    constructor() {
        // Game state
        this.totalTeeth = 10;
        this.soreToothIndex = 0;
        this.teethClicked = [];
        this.gameActive = false;

        // Audio
        this.audio = new AudioManager();
        this.audioStarted = false;

        // DOM elements
        this.setupPanel = document.getElementById('setupPanel');
        this.gameArea = document.getElementById('gameArea');
        this.upperTeeth = document.getElementById('upperTeeth');
        this.lowerTeeth = document.getElementById('lowerTeeth');
        this.lowerJaw = document.getElementById('lowerJaw');
        this.crocodileContainer = document.getElementById('crocodileContainer');
        this.gameOver = document.getElementById('gameOver');
        this.teethCount = document.getElementById('teethCount');
        this.backBtn = document.getElementById('backBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Difficulty buttons
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const teeth = parseInt(btn.dataset.teeth);
                this.startGame(teeth);
            });
        });

        // Back and restart buttons
        this.backBtn.addEventListener('click', () => this.goBack());
        this.restartBtn.addEventListener('click', () => this.showSetup());

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

    startGame(numTeeth) {
        this.totalTeeth = numTeeth;
        this.teethClicked = [];
        this.gameActive = true;

        // Randomly select sore tooth
        this.soreToothIndex = Math.floor(Math.random() * this.totalTeeth);

        // Update UI
        this.teethCount.textContent = this.totalTeeth;
        this.setupPanel.style.display = 'none';
        this.gameArea.style.display = 'block';
        this.gameOver.style.display = 'none';
        this.crocodileContainer.classList.remove('mouth-closed', 'snapping');

        // Generate teeth
        this.generateTeeth();
    }

    generateTeeth() {
        // Clear existing teeth
        this.upperTeeth.innerHTML = '';
        this.lowerTeeth.innerHTML = '';

        // Calculate teeth distribution (split between upper and lower)
        const upperCount = Math.ceil(this.totalTeeth / 2);
        const lowerCount = this.totalTeeth - upperCount;

        // Create upper teeth
        for (let i = 0; i < upperCount; i++) {
            const tooth = this.createTooth(i);
            this.upperTeeth.appendChild(tooth);
        }

        // Create lower teeth
        for (let i = 0; i < lowerCount; i++) {
            const tooth = this.createTooth(upperCount + i);
            this.lowerTeeth.appendChild(tooth);
        }
    }

    createTooth(index) {
        const tooth = document.createElement('div');
        tooth.className = 'tooth';
        tooth.dataset.index = index;

        tooth.addEventListener('click', () => this.handleToothClick(tooth, index));
        return tooth;
    }

    handleToothClick(tooth, index) {
        if (!this.gameActive || tooth.classList.contains('clicked')) {
            return;
        }

        // Mark tooth as clicked
        tooth.classList.add('clicked');
        this.teethClicked.push(index);

        // Play click sound
        this.audio.playToothClick();

        // Check if this is the sore tooth
        if (index === this.soreToothIndex) {
            // SNAP! Game over
            this.handleSnap();
        } else {
            // Safe tooth
            setTimeout(() => {
                this.audio.playSafeTooth();
            }, 100);

            // Check if all safe teeth are clicked
            if (this.teethClicked.length === this.totalTeeth) {
                // Shouldn't happen since sore tooth is always included
                this.showSetup();
            }
        }
    }

    handleSnap() {
        this.gameActive = false;

        // Play snap sound
        setTimeout(() => {
            this.audio.playSnap();
        }, 200);

        // Animate mouth closing
        this.crocodileContainer.classList.add('snapping');
        setTimeout(() => {
            this.crocodileContainer.classList.add('mouth-closed');
        }, 300);

        // Show game over message
        setTimeout(() => {
            this.gameOver.style.display = 'block';
        }, 800);
    }

    showSetup() {
        this.setupPanel.style.display = 'block';
        this.gameArea.style.display = 'none';
        this.gameOver.style.display = 'none';
        this.crocodileContainer.classList.remove('mouth-closed', 'snapping');
    }

    goBack() {
        window.location.href = '../../index.html';
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CrocodileGame();
});
