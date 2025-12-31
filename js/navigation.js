// Game Navigation Utility
// Shared module for all games to handle fullscreen and navigation consistently

const GameNavigation = {
    // Navigate to portal without creating history entry
    // This prevents Safari's back button warning
    navigateToPortal: function() {
        window.location.replace('../../index.html');
    },

    // Request fullscreen (Safari-compatible)
    // Works across different browsers and iOS Safari variants
    requestFullscreen: function() {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(); // iOS Safari (note: capital S)
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    },

    // Exit fullscreen
    exitFullscreen: function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },

    // Handle first user interaction for fullscreen
    // Shows "Tap to Start" overlay, then enters fullscreen on first tap/click
    handleFirstInteraction: function(callback) {
        const handler = function() {
            // Request fullscreen
            GameNavigation.requestFullscreen();

            // Hide the overlay
            const overlay = document.getElementById('tapToStartOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }

            // Execute callback (game initialization)
            if (callback) callback();

            // Clean up event listeners
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('click', handler);
        };

        // Listen for both touch and click events (only triggers once)
        document.addEventListener('touchstart', handler, { once: true });
        document.addEventListener('click', handler, { once: true });
    },

    // Check if currently in fullscreen mode
    isFullscreen: function() {
        return !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.webkitCurrentFullScreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);
    }
};
