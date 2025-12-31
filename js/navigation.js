// Game Navigation Utility
// Shared module for all games to handle navigation consistently

const GameNavigation = {
    // Navigate to portal without creating history entry
    // This prevents Safari's back button warning
    navigateToPortal: function() {
        window.location.replace('../../index.html');
    },

    // Check if running on iOS Safari
    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },

    // Check if already in standalone mode (added to home screen)
    isStandalone: function() {
        return window.navigator.standalone === true;
    },

    // Handle first user interaction
    // Shows "Tap to Start" overlay with iOS-specific instructions
    handleFirstInteraction: function(callback) {
        const isIOS = this.isIOS();
        const isStandalone = this.isStandalone();

        // Update overlay text based on platform
        const overlay = document.getElementById('tapToStartOverlay');
        if (overlay) {
            if (isIOS && !isStandalone) {
                // Show iOS Add to Home Screen instructions
                overlay.innerHTML = `
                    <div class="tap-content">
                        <div class="tap-icon">📱</div>
                        <h1 class="tap-title">Add to Home Screen!</h1>
                        <div class="tap-instructions">
                            <p class="tap-step">1. Tap the <strong>Share</strong> button</p>
                            <p class="tap-step">2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                            <p class="tap-step">3. Tap <strong>"Add"</strong> in the top right</p>
                            <p class="tap-or">OR</p>
                            <p class="tap-subtitle">Tap anywhere to play in browser</p>
                        </div>
                    </div>
                `;
            }
            // For standalone mode or other platforms, keep default "Tap to Start" message
        }

        const handler = function() {
            // Hide the overlay
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
    }
};

