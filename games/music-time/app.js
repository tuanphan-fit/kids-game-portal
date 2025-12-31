// Music Time Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
    initPianoKeys();
    initAnimalKeys();
    setMode('piano');
});

// Audio context
let audioContext = null;
let currentMode = 'piano';
let isPlayingDemo = false;

// Piano notes configuration
const pianoKeys = [
    { note: 'C', frequency: 261.63, label: 'Do', type: 'white' },
    { note: 'D', frequency: 293.66, label: 'Re', type: 'white' },
    { note: 'E', frequency: 329.63, label: 'Mi', type: 'white' },
    { note: 'F', frequency: 349.23, label: 'Fa', type: 'white' },
    { note: 'G', frequency: 392.00, label: 'Sol', type: 'white' },
    { note: 'A', frequency: 440.00, label: 'La', type: 'white' },
    { note: 'B', frequency: 493.88, label: 'Si', type: 'white' },
    { note: 'C2', frequency: 523.25, label: 'Do', type: 'white' }
];

// Animal sounds configuration
const animalKeys = [
    { name: 'Dog', emoji: '🐕', sound: 'Woof!', baseFreq: 300, type: 'bark' },
    { name: 'Cat', emoji: '🐱', sound: 'Meow!', baseFreq: 600, type: 'meow' },
    { name: 'Cow', emoji: '🐮', sound: 'Moo!', baseFreq: 250, type: 'moo' },
    { name: 'Pig', emoji: '🐷', sound: 'Oink!', baseFreq: 350, type: 'oink' },
    { name: 'Duck', emoji: '🦆', sound: 'Quack!', baseFreq: 500, type: 'quack' },
    { name: 'Frog', emoji: '🐸', sound: 'Ribbit!', baseFreq: 200, type: 'ribbit' },
    { name: 'Bird', emoji: '🐦', sound: 'Tweet!', baseFreq: 800, type: 'tweet' },
    { name: 'Sheep', emoji: '🐑', sound: 'Baa!', baseFreq: 400, type: 'baa' }
];

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Resume audio context
function resumeAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Initialize piano keys
function initPianoKeys() {
    const container = document.getElementById('keysContainer');

    // Create row for piano keys
    const row = document.createElement('div');
    row.className = 'keys-row piano-keys-row';
    row.style.display = 'none';

    pianoKeys.forEach((key, index) => {
        const keyElement = document.createElement('div');
        keyElement.className = `piano-key ${key.type}`;
        keyElement.dataset.note = key.note;
        keyElement.dataset.frequency = key.frequency;
        keyElement.style.minWidth = '70px';
        keyElement.style.height = '180px';

        const label = document.createElement('span');
        label.className = 'key-label';
        label.textContent = key.label;

        const note = document.createElement('span');
        note.className = 'key-note';
        note.textContent = key.note;

        keyElement.appendChild(label);
        keyElement.appendChild(note);

        // Touch event
        keyElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playPianoNote(key.frequency, key.note, keyElement);
        });

        // Click event
        keyElement.addEventListener('mousedown', () => {
            playPianoNote(key.frequency, key.note, keyElement);
        });

        row.appendChild(keyElement);
    });

    container.appendChild(row);
}

// Initialize animal keys
function initAnimalKeys() {
    const container = document.getElementById('keysContainer');

    // Create rows for animal keys (2 rows of 4)
    for (let row = 0; row < 2; row++) {
        const keysRow = document.createElement('div');
        keysRow.className = 'keys-row animal-keys-row';
        keysRow.style.display = 'none';

        const start = row * 4;
        const end = start + 4;

        for (let i = start; i < end && i < animalKeys.length; i++) {
            const animal = animalKeys[i];
            const keyElement = document.createElement('div');
            keyElement.className = 'animal-key';
            keyElement.dataset.animal = animal.name;
            keyElement.style.minWidth = '100px';
            keyElement.style.height = '120px';

            const emoji = document.createElement('div');
            emoji.className = 'animal-emoji';
            emoji.textContent = animal.emoji;

            const name = document.createElement('div');
            name.className = 'animal-name';
            name.textContent = animal.name;

            const sound = document.createElement('div');
            sound.className = 'animal-sound';
            sound.textContent = animal.sound;

            keyElement.appendChild(emoji);
            keyElement.appendChild(name);
            keyElement.appendChild(sound);

            // Touch event
            keyElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                playAnimalSound(animal, keyElement);
            });

            // Click event
            keyElement.addEventListener('mousedown', () => {
                playAnimalSound(animal, keyElement);
            });

            keysRow.appendChild(keyElement);
        }

        container.appendChild(keysRow);
    }
}

// Set mode (piano or animals)
function setMode(mode) {
    currentMode = mode;

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    // Show/hide keys
    const pianoRows = document.querySelectorAll('.piano-keys-row');
    const animalRows = document.querySelectorAll('.animal-keys-row');

    if (mode === 'piano') {
        pianoRows.forEach(row => row.style.display = 'flex');
        animalRows.forEach(row => row.style.display = 'none');
        document.getElementById('instructionText').textContent = '🎵 Tap the keys to play music!';
    } else {
        pianoRows.forEach(row => row.style.display = 'none');
        animalRows.forEach(row => row.style.display = 'flex');
        document.getElementById('instructionText').textContent = '🐾 Tap the animals to hear their sounds!';
    }
}

// Play piano note
function playPianoNote(frequency, noteName, keyElement) {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;

    // Create oscillator for the note
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Piano-like tone
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);

    // Envelope for piano sound
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);

    oscillator.start(now);
    oscillator.stop(now + 1);

    // Visual feedback
    keyElement.classList.add('pressed');
    setTimeout(() => keyElement.classList.remove('pressed'), 200);

    // Update display
    updateNoteDisplay('🎵', noteName);

    // Add harmonics for richer sound
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now);
    gain2.gain.setValueAtTime(0.1, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc2.start(now);
    osc2.stop(now + 0.5);
}

// Play animal sound
function playAnimalSound(animal, keyElement) {
    if (!audioContext) return;
    resumeAudio();

    const now = audioContext.currentTime;

    switch (animal.type) {
        case 'bark':
            playBark(now, animal.baseFreq);
            break;
        case 'meow':
            playMeow(now, animal.baseFreq);
            break;
        case 'moo':
            playMoo(now, animal.baseFreq);
            break;
        case 'oink':
            playOink(now, animal.baseFreq);
            break;
        case 'quack':
            playQuack(now, animal.baseFreq);
            break;
        case 'ribbit':
            playRibbit(now, animal.baseFreq);
            break;
        case 'tweet':
            playTweet(now, animal.baseFreq);
            break;
        case 'baa':
            playBaa(now, animal.baseFreq);
            break;
    }

    // Visual feedback
    keyElement.classList.add('pressed');
    setTimeout(() => keyElement.classList.remove('pressed'), 300);

    // Update display
    updateNoteDisplay(animal.emoji, animal.sound);
}

// Animal sound implementations
function playBark(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.15);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
}

function playMeow(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.7, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
}

function playMoo(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.5, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
}

function playOink(now, freq) {
    for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq + (i * 50), now + (i * 0.1));
        gain.gain.setValueAtTime(0.2, now + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.08);
        osc.start(now + (i * 0.1));
        osc.stop(now + (i * 0.1) + 0.08);
    }
}

function playQuack(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.8, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
}

function playRibbit(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.8, now);
    osc.frequency.linearRampToValueAtTime(freq, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
}

function playTweet(now, freq) {
    for (let i = 0; i < 2; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, now + (i * 0.08));
        osc.frequency.linearRampToValueAtTime(freq * 2, now + (i * 0.08) + 0.05);
        gain.gain.setValueAtTime(0.15, now + (i * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.08) + 0.06);
        osc.start(now + (i * 0.08));
        osc.stop(now + (i * 0.08) + 0.06);
    }
}

function playBaa(now, freq) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.6, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.5, now + 0.4);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
}

// Update note display
function updateNoteDisplay(emoji, text) {
    const emojiEl = document.getElementById('noteEmoji');
    const textEl = document.getElementById('noteName');

    emojiEl.textContent = emoji;
    textEl.textContent = text;

    // Reset animation
    emojiEl.style.animation = 'none';
    setTimeout(() => {
        emojiEl.style.animation = 'bounce 0.5s ease';
    }, 10);
}

// Play demo song
function playDemo() {
    if (isPlayingDemo) return;
    isPlayingDemo = true;

    const demoBtn = document.querySelector('.demo-btn');
    demoBtn.textContent = '🎵 Playing...';
    demoBtn.disabled = true;

    if (currentMode === 'piano') {
        playPianoDemo();
    } else {
        playAnimalDemo();
    }
}

// Play piano demo (Twinkle Twinkle Little Star)
function playPianoDemo() {
    const melody = [
        { note: 'C', duration: 400 },
        { note: 'C', duration: 400 },
        { note: 'G', duration: 400 },
        { note: 'G', duration: 400 },
        { note: 'A', duration: 400 },
        { note: 'A', duration: 400 },
        { note: 'G', duration: 800 }
    ];

    let delay = 0;
    melody.forEach((item, index) => {
        setTimeout(() => {
            const keyData = pianoKeys.find(k => k.note === item.note);
            if (keyData) {
                const keyElement = document.querySelector(`[data-note="${item.note}"]`);
                playPianoNote(keyData.frequency, item.note, keyElement);
            }

            if (index === melody.length - 1) {
                setTimeout(() => {
                    isPlayingDemo = false;
                    const demoBtn = document.querySelector('.demo-btn');
                    demoBtn.textContent = '✨ Play Demo Song';
                    demoBtn.disabled = false;
                }, item.duration);
            }
        }, delay);
        delay += item.duration;
    });
}

// Play animal demo
function playAnimalDemo() {
    let delay = 0;

    animalKeys.forEach((animal, index) => {
        setTimeout(() => {
            const keyElement = document.querySelector(`[data-animal="${animal.name}"]`);
            playAnimalSound(animal, keyElement);

            if (index === animalKeys.length - 1) {
                setTimeout(() => {
                    isPlayingDemo = false;
                    const demoBtn = document.querySelector('.demo-btn');
                    demoBtn.textContent = '✨ Play Demo Song';
                    demoBtn.disabled = false;
                }, 500);
            }
        }, delay);
        delay += 600;
    });
}

// Navigate back
function goBack() {
    window.location.href = '../../index.html';
}

// Prevent default touch behaviors
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
