// Interactive Stories - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize fullscreen on first interaction
    GameNavigation.handleFirstInteraction(function() {
        renderStorySelection();
    });
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

// Go to next page with 3D flip transition
function nextPage() {
    if (currentPageIndex < currentStory.pages.length - 1) {
        const storyContent = document.querySelector('.story-content');

        // Add 3D flip out animation
        storyContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
        storyContent.style.transform = 'translateX(-50px) rotateY(-15deg)';
        storyContent.style.opacity = '0';

        setTimeout(() => {
            currentPageIndex++;
            renderPage();

            // Reset and animate new page in from opposite direction
            storyContent.style.transform = 'translateX(50px) rotateY(15deg)';

            setTimeout(() => {
                storyContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
                storyContent.style.transform = 'translateX(0) rotateY(0deg)';
                storyContent.style.opacity = '1';

                // Clear transition after animation completes
                setTimeout(() => {
                    storyContent.style.transition = '';
                }, 400);
            }, 50);
        }, 400);
    } else {
        showStoryComplete();
    }
}

// Go to previous page with 3D flip transition
function previousPage() {
    if (currentPageIndex > 0) {
        const storyContent = document.querySelector('.story-content');

        // Add 3D flip out animation (opposite direction)
        storyContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
        storyContent.style.transform = 'translateX(50px) rotateY(15deg)';
        storyContent.style.opacity = '0';

        setTimeout(() => {
            currentPageIndex--;
            renderPage();

            // Reset and animate new page in from opposite direction
            storyContent.style.transform = 'translateX(-50px) rotateY(-15deg)';

            setTimeout(() => {
                storyContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
                storyContent.style.transform = 'translateX(0) rotateY(0deg)';
                storyContent.style.opacity = '1';

                // Clear transition after animation completes
                setTimeout(() => {
                    storyContent.style.transition = '';
                }, 400);
            }, 50);
        }, 400);
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
    GameNavigation.navigateToPortal();
}

// Prevent default touch behaviors
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
