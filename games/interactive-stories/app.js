// Interactive Stories - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    renderStorySelection();
});

// State
let currentStory = null;
let currentPageIndex = 0;

// Render story selection grid
function renderStorySelection() {
    const grid = document.getElementById('storiesGrid');
    grid.innerHTML = '';

    stories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.onclick = () => loadStory(story.id);
        card.style.borderColor = story.color;

        const emoji = document.createElement('div');
        emoji.className = 'story-emoji';
        emoji.textContent = story.emoji;

        const title = document.createElement('div');
        title.className = 'story-name';
        title.textContent = story.title;

        const info = document.createElement('div');
        info.className = 'story-info';
        info.textContent = `${story.pages.length} pages`;

        card.appendChild(emoji);
        card.appendChild(title);
        card.appendChild(info);
        grid.appendChild(card);
    });
}

// Load a story
function loadStory(storyId) {
    currentStory = stories.find(s => s.id === storyId);
    if (!currentStory) return;

    currentPageIndex = 0;

    // Switch to story reader
    document.getElementById('storySelection').style.display = 'none';
    document.getElementById('storyReader').style.display = 'flex';
    document.getElementById('storyComplete').style.display = 'none';

    // Update header
    document.getElementById('currentStoryTitle').textContent = currentStory.title;
    document.getElementById('totalPages').textContent = currentStory.pages.length;

    // Render first page
    renderPage();
}

// Render current page
function renderPage() {
    const page = currentStory.pages[currentPageIndex];

    // Update page indicator
    document.getElementById('currentPage').textContent = currentPageIndex + 1;

    // Update illustration
    const illustrationContainer = document.getElementById('storyIllustration');
    illustrationContainer.innerHTML = '';

    const illustration = document.createElement('div');
    illustration.className = 'illustration-emoji';
    illustration.textContent = page.illustration;
    illustrationContainer.appendChild(illustration);

    // Update text
    const textElement = document.getElementById('storyText');
    textElement.textContent = page.text;

    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentPageIndex === 0;

    if (currentPageIndex === currentStory.pages.length - 1) {
        nextBtn.textContent = 'Finish 🎉';
    } else {
        nextBtn.textContent = 'Next ➡️';
    }

    // Trigger animations
    illustrationContainer.style.animation = 'none';
    setTimeout(() => {
        illustrationContainer.style.animation = 'fadeIn 0.5s ease';
    }, 10);

    textElement.parentElement.style.animation = 'none';
    setTimeout(() => {
        textElement.parentElement.style.animation = 'slideUp 0.5s ease';
    }, 10);
}

// Go to next page
function nextPage() {
    if (currentPageIndex < currentStory.pages.length - 1) {
        currentPageIndex++;
        renderPage();
    } else {
        showStoryComplete();
    }
}

// Go to previous page
function previousPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderPage();
    }
}

// Show story complete screen
function showStoryComplete() {
    document.getElementById('storyComplete').style.display = 'flex';

    // Play celebration sound (optional)
    playCompleteSound();
}

// Restart current story
function restartStory() {
    currentPageIndex = 0;
    document.getElementById('storyComplete').style.display = 'none';
    renderPage();
}

// Go back to story selection
function showStorySelection() {
    document.getElementById('storySelection').style.display = 'flex';
    document.getElementById('storyReader').style.display = 'none';
    document.getElementById('storyComplete').style.display = 'none';
    currentStory = null;
}

// Play completion sound
function playCompleteSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Play happy melody
        const now = audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

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
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Navigate back to portal
function goBack() {
    if (confirm('Go back to the game portal?')) {
        window.location.href = '../../index.html';
    }
}

// Prevent default touch behaviors
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
