let soundEnabled = true;

const SOUNDS = {
    pour: null,
    drop: null,
    click: null,
    tool: null
};

function initSounds() {
    try {
        SOUNDS.pour = createSynthesizedSound('pour', 0.3);
        SOUNDS.drop = createSynthesizedSound('drop', 0.2);
        SOUNDS.click = createSynthesizedSound('click', 0.1);
        SOUNDS.tool = createSynthesizedSound('tool', 0.2);
    } catch (error) {
        console.warn('Sound initialization failed:', error);
    }
}

function createSynthesizedSound(type, duration) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        return function() {
            if (!soundEnabled) return;

            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                switch(type) {
                    case 'pour':
                        oscillator.frequency.value = 2000;
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                        break;
                    case 'drop':
                        oscillator.frequency.value = 800;
                        oscillator.type = 'triangle';
                        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                        break;
                    case 'click':
                        oscillator.frequency.value = 1200;
                        oscillator.type = 'square';
                        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                        break;
                    case 'tool':
                        oscillator.frequency.value = 600;
                        oscillator.type = 'sawtooth';
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                        break;
                }

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('Sound playback failed:', error);
            }
        };
    } catch (error) {
        console.warn('Audio context creation failed:', error);
        return function() {};
    }
}

function playSound(type) {
    if (SOUNDS[type]) {
        SOUNDS[type]();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('soundToggle');

    if (soundBtn) {
        soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
        soundBtn.classList.toggle('muted', !soundEnabled);
    }

    playSound('click');
}

function isSoundEnabled() {
    return soundEnabled;
}

window.initSounds = initSounds;
window.playSound = playSound;
window.toggleSound = toggleSound;
window.isSoundEnabled = isSoundEnabled;