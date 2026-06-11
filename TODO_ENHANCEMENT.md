# TODO_ENHANCEMENT.md - Kids Game Portal Comprehensive Upgrade

**Platform Target:** Safari on iPad 10-inch (1024x768 landscape / 768x1024 portrait)
**Target Audience:** Children ages 3-5
**Created:** May 2026
**Status:** Pending Implementation

---

## Table of Contents

1. [Phase 0: Critical Bugs (P0)](#phase-0-critical-bugs-p0)
2. [Phase 1: Shared Game Layout Framework (P1)](#phase-1-shared-game-layout-framework-p1)
3. [Phase 2: Per-Game UI & Feature Upgrades (P2)](#phase-2-per-game-ui--feature-upgrades-p2)
4. [Phase 3: Design System Enhancements (P3)](#phase-3-design-system-enhancements-p3)
5. [Phase 4: New Features & Content (P4)](#phase-4-new-features--content-p4)
6. [Testing Checklist](#testing-checklist)

---

## Phase 0: Critical Bugs (P0)

> **Goal:** Fix bugs that break gameplay or make the app unusable on target platform.
> **Estimated Time:** 4-5 hours total
> **Priority:** MUST be done first before any other work.

---

### TASK 0.1: Fix `touchmove` Global Prevention (4 Games)

**Severity:** CRITICAL - Blocks all scrolling on the page, making content inaccessible
**Games Affected:** catch-colors, interactive-stories, memory-game, music-time
**Reference:** These games all have `document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false })` which blocks ALL touch scrolling on the entire page.

#### Sub-task 0.1.1: catch-colors

**File:** `games/catch-colors/app.js`
**Location:** Lines 408-411

**Current code (line 408-411):**
```javascript
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });
```

**Replace with:**
```javascript
var gameAreaEl = document.querySelector('.game-area');
if (gameAreaEl) {
    gameAreaEl.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}
```

**Why:** Only prevent touch scrolling within the game area (`.game-area`), not the entire page. This allows users to scroll overlays, modals, and instructions.

#### Sub-task 0.1.2: interactive-stories

**File:** `games/interactive-stories/app.js`
**Location:** Lines 229-232

**Current code (line 229-232):**
```javascript
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });
```

**Replace with:**
```javascript
// REMOVED: global touchmove prevention - it was blocking story text scrolling
// Touch prevention is not needed for this story-reading game
```

**Why:** interactive-stories is a reading app. Users NEED to scroll story text. The global prevention made the story content impossible to read on touch devices.

#### Sub-task 0.1.3: memory-game

**File:** `games/memory-game/app.js`

Find the `touchmove` prevention code. Search for:
```javascript
document.addEventListener('touchmove'
```

**Replace the global version with a scoped version that only prevents on the card grid:**
```javascript
var cardGridEl = document.querySelector('.memory-game');
if (cardGridEl) {
    cardGridEl.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}
```

#### Sub-task 0.1.4: music-time

**File:** `games/music-time/app.js`

Find the `touchmove` prevention code. Search for:
```javascript
document.addEventListener('touchmove'
```

**Replace with:**
```javascript
var keysContainerEl = document.querySelector('.keys-container');
if (keysContainerEl) {
    keysContainerEl.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
}
```

**Acceptance Criteria:**
- [ ] On all 4 games, story text / instructions / overlays can be scrolled by touch
- [ ] Game areas still prevent accidental scrolling during gameplay
- [ ] No `document.addEventListener('touchmove', ...)` with `preventDefault` remains at document level

---

### TASK 0.2: Fix Catch-Colors Ball Position Bug (CRITICAL)

**Severity:** CRITICAL - Falling balls do NOT actually fall; they stack in normal document flow
**Game:** catch-colors
**File:** `games/catch-colors/style.css`

**Problem:** `.falling-ball` has `position: absolute` on line 240, but then `position: relative` is declared on line 261. CSS uses the LAST declaration, so `position: relative` wins. This means balls are positioned in normal document flow instead of being absolutely positioned within the game area.

**Current code (line 239-263):**
```css
.falling-ball {
    position: absolute;       /* LINE 240 - CORRECT */
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;

    /* 3D Sphere Effect */
    background: radial-gradient(...);

    /* Enhanced 3D shadows */
    box-shadow: ...;

    transition: transform 0.15s ease;
    animation: none;
    position: relative;        /* LINE 261 - OVERWRITES absolute! BUG! */
    transform-style: preserve-3d;
}
```

**Fix:** Delete line 261 (`position: relative;`).

**After fix, the `.falling-ball` class should look like:**
```css
.falling-ball {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    background: radial-gradient(circle at 35% 35%,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 255, 255, 0.3) 15%,
        transparent 50%);
    box-shadow:
        inset 0 -8px 16px rgba(0, 0, 0, 0.2),
        inset 0 8px 16px rgba(255, 255, 255, 0.3),
        0 6px 16px rgba(0, 0, 0, 0.25),
        0 2px 4px rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease;
    animation: none;
    transform-style: preserve-3d;
}
```

**Acceptance Criteria:**
- [ ] Balls appear at random horizontal positions within the game area
- [ ] Balls fall from the top of the game area downward
- [ ] Balls do NOT stack in a column on the left side

---

### TASK 0.3: Replace `color-mix()` CSS with Compatible Fallbacks (5 Games)

**Severity:** HIGH - Breaks hover/active states on Safari < 16.2
**Why:** `color-mix(in srgb, ...)` is a CSS Color Level 5 feature. It is NOT supported on Safari versions before 16.2 (released Sep 2022). Older iPads that cannot update past iOS 15 will see broken button styles.

**Games Affected:**
- building-blocks (`style.css`)
- drawing-app (`style.css`)
- sand-box (`style.css`)
- toy-box-builder (`style.css`)
- memory-game (`style.css`)

**Strategy:** Replace each `color-mix()` usage with a pre-computed darker color value. Use the CSS variable system to define hover variants.

#### Sub-task 0.3.1: Add hover color variables to design-system.css

**File:** `css/design-system.css`

Add the following block AFTER the existing color palette section (after line 88, before `/* ===== BORDER COLORS ===== */`):

```css
/* ===== HOVER STATE COLORS (pre-computed for Safari compatibility) ===== */
--primary-500-hover: #009DAD;
--primary-600-hover: #008B98;
--success-hover: #3D9140;
--warning-hover: #E08600;
--danger-hover: #D32F2F;
```

#### Sub-task 0.3.2: Fix building-blocks

**File:** `games/building-blocks/style.css`

Search for ALL instances of `color-mix`. For each one:

**Line 43** - `.btn-reset:hover`:
```css
/* BEFORE */
background-color: color-mix(in srgb, var(--warning) 85%, black 15%);

/* AFTER */
background-color: var(--warning-hover);
```

Search for any other `color-mix` in the same file and replace similarly.

#### Sub-task 0.3.3: Fix drawing-app

**File:** `games/drawing-app/style.css`

Search for ALL instances of `color-mix`. Replace each with the corresponding pre-computed hover variable:

- `color-mix(in srgb, var(--drawing-accent) 85%, black 15%)` → use a pre-computed darker pink like `#E85580`
- `color-mix(in srgb, var(--primary-500) 85%, black 15%)` → `var(--primary-500-hover)`

Add to the top of drawing-app `style.css` (after the `@import`):
```css
:root {
    --drawing-accent-hover: #E85580;
}
```

#### Sub-task 0.3.4: Fix sand-box

**File:** `games/sand-box/style.css`

Search for ALL instances of `color-mix`:
- `color-mix(in srgb, var(--warning) 85%, black 15%)` → `var(--warning-hover)`
- `color-mix(in srgb, var(--danger) 85%, black 15%)` → `var(--danger-hover)`

#### Sub-task 0.3.5: Fix toy-box-builder

**File:** `games/toy-box-builder/style.css`

Search for ALL instances of `color-mix` and replace with the same pattern.

#### Sub-task 0.3.6: Fix memory-game

**File:** `games/memory-game/style.css`

Search for ALL instances of `color-mix`:
- `color-mix(in srgb, var(--memory-accent) 85%, black 15%)` → pre-computed darker orange `#E59A3A`

Add to the top of memory-game `style.css` (after the `@import`):
```css
:root {
    --memory-accent-hover: #E59A3A;
}
```

**Acceptance Criteria:**
- [ ] Run `grep -r "color-mix" games/ css/` - should return ZERO results
- [ ] All button hover states still show a darker color
- [ ] Test on Safari < 16.2 or use BrowserStack to verify buttons work

---

### TASK 0.4: Fix `100vh` to `100dvh` with Fallback (All Games)

**Severity:** MEDIUM - On iOS Safari, the address bar takes space, causing `100vh` to be taller than the visible area. Content gets cut off at the bottom.
**Games Affected:** All games that use `height: 100vh` or `min-height: 100vh`

**Strategy:** The pattern `min-height: 100vh; min-height: 100dvh;` uses `100vh` as fallback and `100dvh` on browsers that support it. Some games already have this. We need to ensure ALL games have it.

#### Files to check and fix:

| Game | File | Current | Fix Needed? |
|------|------|---------|-------------|
| drawing-app | `style.css` line 10-11 | Already has both | NO |
| gameboy-simulator | `styles.css` line 13-14 | Already has both | NO |
| building-blocks | `style.css` line 4 | `height: 100vh` only | YES |
| sand-box | `style.css` | Check and add if missing | MAYBE |
| toy-box-builder | `style.css` | Check and add if missing | MAYBE |
| catch-colors | `style.css` | Check and add if missing | MAYBE |
| music-time | `style.css` line 34 | `height: 100vh` only | YES |
| crocodile-game-v2 | `styles.css` | Check and add if missing | MAYBE |
| memory-game | `style.css` | Check and add if missing | MAYBE |
| memory-game-v2 | `styles.css` | Check and add if missing | MAYBE |
| interactive-stories | `style.css` | Check and add if missing | MAYBE |

**Pattern to apply everywhere:**
```css
/* BEFORE */
height: 100vh;
/* or */
min-height: 100vh;

/* AFTER (two lines, browser ignores second line if unsupported) */
height: 100vh;
height: 100dvh;

/* OR for min-height: */
min-height: 100vh;
min-height: 100dvh;
```

**Acceptance Criteria:**
- [ ] Every game's main container uses the `100vh` + `100dvh` fallback pattern
- [ ] On iOS Safari, no content is hidden behind the address bar area
- [ ] On desktop browsers, layout remains unchanged

---

### TASK 0.5: Add Missing `touch-action: manipulation` (3 Games)

**Severity:** MEDIUM - Causes a 300ms tap delay on older iOS, making games feel sluggish
**Games Affected:** crocodile-game-v2, memory-game-v2, gameboy-simulator

These games do NOT have `touch-action: manipulation` on their body/global styles, causing a noticeable 300ms delay before tap events fire.

#### Sub-task 0.5.1: crocodile-game-v2

**File:** `games/crocodile-game-v2/styles.css`

Add to the `body` rule (or create one if missing):
```css
body {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
```

#### Sub-task 0.5.2: memory-game-v2

**File:** `games/memory-game-v2/styles.css`

Add to the `body` or `html, body` rule:
```css
body {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
```

#### Sub-task 0.5.3: gameboy-simulator

**File:** `games/gameboy-simulator/styles.css`

Add to the `body` rule:
```css
body {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
```

**Acceptance Criteria:**
- [ ] Tapping buttons on all 3 games responds immediately (no 300ms delay)
- [ ] Double-tap-to-zoom is still disabled
- [ ] Pinch-to-zoom is still disabled

---

### TASK 0.6: Fix Hardcoded Back Button Navigation (3 Games)

**Severity:** MEDIUM - Inconsistent navigation; breaks if game is hosted at different path
**Games Affected:** crocodile-game-v2, memory-game-v2, gameboy-simulator

#### Sub-task 0.6.1: crocodile-game-v2

**File:** `games/crocodile-game-v2/game.js`

Find the back button handler. It currently uses:
```javascript
window.location.href = '../../index.html';
```

**Replace with:**
```javascript
// First, add navigation.js to index.html if not already included
// In games/crocodile-game-v2/index.html, add before </body>:
// <script src="../../js/navigation.js"></script>

// Then in game.js, replace the back button handler with:
GameNavigation.navigateToPortal();
```

**Also update `games/crocodile-game-v2/index.html`:**
Add this line BEFORE `<script src="game.js"></script>`:
```html
<script src="../../js/navigation.js"></script>
```

#### Sub-task 0.6.2: memory-game-v2

**File:** `games/memory-game-v2/game.js`

Same pattern:
1. Add `<script src="../../js/navigation.js"></script>` to `index.html` before `game.js`
2. Replace `window.location.href = '../../index.html'` with `GameNavigation.navigateToPortal()`

#### Sub-task 0.6.3: gameboy-simulator

**File:** `games/gameboy-simulator/game.js`

Same pattern:
1. Add `<script src="../../js/navigation.js"></script>` to `index.html` before `game.js`
2. Replace `window.location.href = '../../index.html'` with `GameNavigation.navigateToPortal()`

**Acceptance Criteria:**
- [ ] All 3 games navigate back to portal correctly
- [ ] `window.location.replace()` is used (no history entry created, prevents Safari back-button warning)
- [ ] `grep -r "../../index.html" games/` returns ZERO results

---

### TASK 0.7: Add `env(safe-area-inset-*)` to Games Missing It

**Severity:** MEDIUM - Content clipped by notch on newer iPads (2018+)
**Games Affected:** crocodile-game-v2, memory-game-v2, gameboy-simulator (games that don't use `common.css`)

These games are self-contained (don't import `common.css` or `design-system.css`) and lack safe-area padding.

#### Pattern to add to each game's main container:

**For games with `html, body` styles:**
```css
html, body {
    /* ... existing styles ... */
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
             env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

**For games with a wrapper/container div:**
```css
.game-wrapper {
    /* ... existing styles ... */
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
             env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

**Games to fix:**
- `games/crocodile-game-v2/styles.css` - `.game-wrapper`
- `games/memory-game-v2/styles.css` - main container
- `games/gameboy-simulator/styles.css` - `body` (already has it, verify)

**Acceptance Criteria:**
- [ ] On iPad with notch, game content is not hidden behind the notch area
- [ ] On iPads without notch, layout is unchanged (env() evaluates to 0)

---

## Phase 1: Shared Game Layout Framework (P1)

> **Goal:** Create a reusable layout system that maximizes game area on iPad 10-inch screens.
> **Estimated Time:** 4-5 hours
> **Priority:** HIGH - Foundation for all per-game UI upgrades

---

### TASK 1.1: Create `css/game-layout.css`

**File to create:** `css/game-layout.css`

This file provides a standard layout template for ALL games with the following features:
- Minimal header (40px height)
- Full-screen game area
- Floating toggle button for controls overlay
- Controls appear as overlay, NOT taking space from game area

**File content:**

```css
/* ========================================
   GAME LAYOUT FRAMEWORK
   Standard layout for all games on iPad 10"
   ======================================== */

/* === GAME CONTAINER === */
.game-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    position: relative;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
}

/* === COMPACT HEADER (40px) === */
.game-header-compact {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    height: 40px;
    min-height: 40px;
    background: var(--bg-card, #FFFFFF);
    border-bottom: 2px solid var(--border-light, #E0E0E0);
    flex-shrink: 0;
    z-index: 100;
    gap: 0.5rem;
}

.game-header-compact .header-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary, #212121);
    text-align: center;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.game-header-compact .btn-back {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    min-height: 32px;
    min-width: auto;
    border-radius: 0.5rem;
    flex-shrink: 0;
}

.game-header-compact .header-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.game-header-compact .score-badge {
    background: var(--primary-500, #00BCD4);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    min-width: 3rem;
    text-align: center;
}

/* === GAME AREA (fills remaining space) === */
.game-area-main {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0; /* Important: allows flex child to shrink */
}

/* === FLOATING CONTROLS TOGGLE BUTTON === */
.controls-toggle {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--primary-500, #00BCD4);
    color: white;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.controls-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.controls-toggle:active {
    transform: scale(0.95);
}

/* === CONTROLS OVERLAY PANEL === */
.controls-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    border-top: 3px solid var(--primary-300, #4DD0E1);
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    z-index: 150;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 50vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.controls-overlay.visible {
    transform: translateY(0);
}

.controls-overlay .controls-handle {
    width: 2.5rem;
    height: 0.25rem;
    background: var(--gray-300, #E0E0E0);
    border-radius: 2px;
    margin: 0 auto 1rem;
}

.controls-overlay .controls-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary, #212121);
    margin-bottom: 0.75rem;
    text-align: center;
}

/* === CONTROLS CLOSE BUTTON === */
.controls-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--gray-200, #EEEEEE);
    border: none;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* === INLINE CONTROLS BAR (for minimal controls) === */
.controls-bar-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-top: 2px solid var(--border-light, #E0E0E0);
    flex-shrink: 0;
    z-index: 50;
    min-height: 48px;
}

/* === TOAST NOTIFICATION === */
.game-toast {
    position: fixed;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%) translateY(-120%);
    background: rgba(33, 33, 33, 0.9);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 300;
    transition: transform 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
}

.game-toast.visible {
    transform: translateX(-50%) translateY(0);
}

/* === RESPONSIVE: Portrait Mode === */
@media (orientation: portrait) {
    .controls-overlay {
        max-height: 40vh;
    }
}

/* === RESPONSIVE: Landscape Mode === */
@media (orientation: landscape) {
    .controls-overlay {
        max-height: 60vh;
    }
}

/* === RESPONSIVE: Small screens (< 480px) === */
@media (max-width: 480px) {
    .game-header-compact {
        height: 36px;
        min-height: 36px;
        padding: 0.25rem 0.5rem;
    }

    .game-header-compact .header-title {
        font-size: 1rem;
    }
}
```

**Acceptance Criteria:**
- [ ] File `css/game-layout.css` is created
- [ ] File contains all the classes listed above
- [ ] No `color-mix()` usage
- [ ] Uses `100dvh` with `100vh` fallback

---

### TASK 1.2: Add Toggle Controls JavaScript Utility

**File to create:** `js/controls-toggle.js`

This is a shared utility that any game can use to add show/hide controls functionality.

**File content:**

```javascript
var ControlsToggle = (function() {
    var _overlay = null;
    var _toggleBtn = null;
    var _isVisible = false;

    function init(options) {
        _overlay = document.querySelector(options.overlaySelector || '.controls-overlay');
        _toggleBtn = document.querySelector(options.toggleSelector || '.controls-toggle');

        if (!_overlay || !_toggleBtn) {
            console.warn('ControlsToggle: overlay or toggle button not found');
            return;
        }

        _toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggle();
        });

        _overlay.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        var closeBtn = _overlay.querySelector('.controls-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                hide();
            });
        }

        document.addEventListener('click', function(e) {
            if (_isVisible && !_overlay.contains(e.target) && e.target !== _toggleBtn) {
                hide();
            }
        });

        document.addEventListener('touchstart', function(e) {
            if (_isVisible && !_overlay.contains(e.target) && e.target !== _toggleBtn) {
                hide();
            }
        }, { passive: true });
    }

    function toggle() {
        if (_isVisible) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        if (_overlay) {
            _overlay.classList.add('visible');
            _isVisible = true;
            if (_toggleBtn) {
                _toggleBtn.textContent = '\u2713';
            }
        }
    }

    function hide() {
        if (_overlay) {
            _overlay.classList.remove('visible');
            _isVisible = false;
            if (_toggleBtn) {
                _toggleBtn.textContent = '\u2699';
            }
        }
    }

    function isVisible() {
        return _isVisible;
    }

    return {
        init: init,
        toggle: toggle,
        show: show,
        hide: hide,
        isVisible: isVisible
    };
})();
```

**Acceptance Criteria:**
- [ ] File `js/controls-toggle.js` is created
- [ ] No dependencies on other libraries
- [ ] Works with touch and click events
- [ ] Clicking outside the overlay closes it

---

### TASK 1.3: Add Toast Notification Utility

**File to create:** `js/toast.js`

Replaces `alert()` calls across all games with non-blocking toast notifications.

**File content:**

```javascript
var GameToast = (function() {
    var _toastEl = null;
    var _timeoutId = null;

    function init() {
        _toastEl = document.querySelector('.game-toast');
        if (!_toastEl) {
            _toastEl = document.createElement('div');
            _toastEl.className = 'game-toast';
            document.body.appendChild(_toastEl);
        }
    }

    function show(message, duration) {
        if (!_toastEl) init();

        if (_timeoutId) {
            clearTimeout(_timeoutId);
        }

        _toastEl.textContent = message;
        _toastEl.classList.add('visible');

        _timeoutId = setTimeout(function() {
            hide();
        }, duration || 2000);
    }

    function hide() {
        if (_toastEl) {
            _toastEl.classList.remove('visible');
        }
        if (_timeoutId) {
            clearTimeout(_timeoutId);
            _timeoutId = null;
        }
    }

    return {
        init: init,
        show: show,
        hide: hide
    };
})();
```

**Acceptance Criteria:**
- [ ] File `js/toast.js` is created
- [ ] Calling `GameToast.show("Hello!")` shows a toast at the top of the screen
- [ ] Toast auto-hides after 2 seconds
- [ ] Multiple rapid calls don't create duplicate toasts

---

## Phase 2: Per-Game UI & Feature Upgrades (P2)

> **Goal:** Fix layout issues and add missing features for each individual game.
> **Estimated Time:** 2-4 hours per game
> **Priority:** HIGH for layout fixes, MEDIUM for feature additions

---

### TASK 2.1: Drawing App - Floating Toolbar Layout

**Severity:** HIGH - Tools section consumes 400px+ of vertical space, leaving canvas with only 200-250px on iPad portrait
**Game:** drawing-app
**Files:** `games/drawing-app/style.css`, `games/drawing-app/index.html`, `games/drawing-app/app.js`

#### Sub-task 2.1.1: Restructure HTML to use game-layout.css

**File:** `games/drawing-app/index.html`

1. Add these `<link>` and `<script>` in the `<head>`:
```html
<link rel="stylesheet" href="../../css/game-layout.css">
```

2. Add before `</body>`:
```html
<script src="../../js/controls-toggle.js"></script>
<script src="../../js/toast.js"></script>
```

3. Wrap the canvas area with the `game-area-main` class
4. Move all tool sections (tools, colors, brush size, actions) into a `controls-overlay` div
5. Add the floating toggle button

**Target structure for the coloring screen:**
```html
<div class="drawing-container game-layout">
    <!-- Compact Header -->
    <div class="game-header-compact">
        <button class="btn-back" onclick="goHome()">← Pictures</button>
        <span class="header-title">🎨 Drawing</span>
        <div class="header-info">
            <span class="score-badge" id="toolBadge">Brush</span>
        </div>
    </div>

    <!-- Canvas fills remaining space -->
    <div class="game-area-main" id="canvasWrapper">
        <canvas id="drawingCanvas"></canvas>
    </div>

    <!-- Floating toggle to show/hide tools -->
    <button class="controls-toggle" id="controlsToggle">⚙</button>

    <!-- Tools overlay (slides up from bottom) -->
    <div class="controls-overlay" id="toolsOverlay">
        <div class="controls-handle"></div>
        <button class="controls-close">✕</button>

        <!-- Tool selection row -->
        <div class="tools-row">
            <button class="tool-btn active" data-tool="brush" onclick="selectTool('brush')">🖌️ Brush</button>
            <button class="tool-btn" data-tool="fill" onclick="selectTool('fill')">🪣 Fill</button>
            <button class="tool-btn" data-tool="eraser" onclick="selectTool('eraser')">🧽 Eraser</button>
        </div>

        <!-- Color palette row -->
        <div class="colors-row">
            <!-- Existing color buttons -->
        </div>

        <!-- Brush size row -->
        <div class="size-row">
            <!-- Existing size buttons -->
        </div>

        <!-- Action buttons row -->
        <div class="actions-row">
            <button onclick="undo()">↩️ Undo</button>
            <button onclick="clearCanvas()">🗑️ Clear</button>
            <button onclick="saveDrawing()">💾 Save</button>
        </div>
    </div>
</div>
```

#### Sub-task 2.1.2: Update CSS for floating toolbar

**File:** `games/drawing-app/style.css`

1. Remove the `.tools-section` grid layout that stacks vertically
2. Add new styles for the toolbar rows inside `.controls-overlay`:

```css
.tools-row,
.colors-row,
.size-row,
.actions-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    flex-wrap: wrap;
}

.tools-row {
    border-bottom: 2px solid var(--gray-200);
    padding-bottom: 0.75rem;
    margin-bottom: 0.5rem;
}

.colors-row {
    gap: 0.375rem;
}

/* Canvas fills the entire game-area-main */
#canvasWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
}

#canvasWrapper canvas {
    max-width: 100%;
    max-height: 100%;
    touch-action: none;
}
```

#### Sub-task 2.1.3: Initialize controls toggle in app.js

**File:** `games/drawing-app/app.js`

Add at the end of the initialization (after canvas setup):
```javascript
// Initialize floating controls
if (typeof ControlsToggle !== 'undefined') {
    ControlsToggle.init({
        overlaySelector: '#toolsOverlay',
        toggleSelector: '#controlsToggle'
    });
}
```

#### Sub-task 2.1.4: Replace `confirm()` with custom modal

**File:** `games/drawing-app/app.js`

Search for `confirm(` in the file (likely in the `clearCanvas()` function).

**Current code pattern:**
```javascript
if (confirm('Clear the canvas?')) { ... }
```

**Replace with:**
```javascript
// Show a custom confirmation modal instead of browser confirm()
showConfirmModal('Clear the canvas?', function() {
    // existing clear logic here
});
```

Add a `showConfirmModal` function:
```javascript
function showConfirmModal(message, onConfirm) {
    var modal = document.getElementById('confirmModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.className = 'confirm-modal-overlay';
        modal.innerHTML =
            '<div class="confirm-modal">' +
            '  <p class="confirm-message"></p>' +
            '  <div class="confirm-buttons">' +
            '    <button class="confirm-yes">Yes</button>' +
            '    <button class="confirm-no">No</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(modal);
    }
    modal.querySelector('.confirm-message').textContent = message;
    modal.style.display = 'flex';

    modal.querySelector('.confirm-yes').onclick = function() {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    modal.querySelector('.confirm-no').onclick = function() {
        modal.style.display = 'none';
    };
}
```

Add CSS for the confirm modal:
```css
.confirm-modal-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 500;
    align-items: center;
    justify-content: center;
}

.confirm-modal {
    background: white;
    padding: 2rem;
    border-radius: 1.5rem;
    text-align: center;
    max-width: 80%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.confirm-message {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #333;
}

.confirm-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.confirm-buttons button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 1rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    min-width: 5rem;
    min-height: 3rem;
}

.confirm-yes {
    background: #4CAF50;
    color: white;
}

.confirm-no {
    background: #E0E0E0;
    color: #333;
}
```

**Acceptance Criteria:**
- [ ] Canvas area takes up at least 75% of viewport height
- [ ] Tools are hidden by default, accessible via floating gear button
- [ ] Tools overlay slides up smoothly and doesn't push canvas
- [ ] No `confirm()` dialog used anywhere in the app
- [ ] Touch drawing still works correctly with the new layout

---

### TASK 2.2: GameBoy Simulator - Scale Up & Improve Controls

**Severity:** HIGH - Game screen is 160x144px (tiny on 10-inch iPad). D-pad buttons too small for children.
**Game:** gameboy-simulator
**Files:** `games/gameboy-simulator/styles.css`, `games/gameboy-simulator/game.js`

#### Sub-task 2.2.1: Scale the GameBoy canvas 2x

**File:** `games/gameboy-simulator/game.js`

Find where the canvas is created/resized. The current canvas is 160x144.

**Changes needed:**
1. Keep the internal resolution at 160x144 (game logic stays the same)
2. Use CSS to scale the canvas up 2x-3x

**In the CSS file** (`styles.css`), find `#gameScreen`:

**Current:**
```css
#gameScreen {
    display: block;
    image-rendering: pixelated;
    background: #9bbc9f;
}
```

**Replace with:**
```css
#gameScreen {
    display: block;
    image-rendering: pixelated;
    -webkit-image-rendering: crisp-edges;
    background: #9bbc9f;
    width: 320px;
    height: 288px;
}

@media (min-width: 768px) {
    #gameScreen {
        width: 400px;
        height: 360px;
    }
}
```

This scales the 160x144 canvas to 320x288 (2x) on mobile and 400x360 (2.5x) on tablets.

#### Sub-task 2.2.2: Enlarge D-pad and A/B buttons

**File:** `games/gameboy-simulator/styles.css`

**D-pad buttons - current size is 40x45px. Increase to 55x60px:**

Find `.dpad-up`, `.dpad-down` (currently `width: 40px; height: 45px`):
```css
/* BEFORE */
.dpad-up { width: 40px; height: 45px; }

/* AFTER */
.dpad-up { width: 55px; height: 60px; }
```

Apply the same size increase to `.dpad-down`, `.dpad-left`, `.dpad-right`.

**D-pad center:**
```css
/* BEFORE */
.dpad-center { width: 40px; height: 40px; }

/* AFTER */
.dpad-center { width: 55px; height: 55px; }
```

**D-pad container** (must be enlarged to fit bigger buttons):
```css
/* BEFORE */
.dpad-container { width: 140px; height: 140px; }

/* AFTER */
.dpad-container { width: 170px; height: 170px; }
```

**A/B buttons - current 50px. Increase to 60px:**

Find `.ab-btn`:
```css
/* BEFORE */
.ab-btn { width: 50px; height: 50px; font-size: 18px; }

/* AFTER */
.ab-btn { width: 60px; height: 60px; font-size: 20px; }
```

**Start/Select buttons - add larger touch target:**
```css
/* Find .start-select-btn and update: */
.start-select-btn {
    /* ... existing styles ... */
    padding: 10px 24px;  /* was 8px 20px */
    min-height: 36px;    /* add minimum height */
}
```

#### Sub-task 2.2.3: Add fullscreen mode option

**File:** `games/gameboy-simulator/index.html`

Add a toggle button in the header area:
```html
<button class="fullscreen-btn" id="fullscreenBtn" onclick="toggleGameBoyMode()">
    📺 Full Screen
</button>
```

**File:** `games/gameboy-simulator/game.js` or `styles.css`

Add the toggle function:
```javascript
function toggleGameBoyMode() {
    var gameboy = document.querySelector('.gameboy');
    var isExpanded = gameboy.classList.toggle('expanded-mode');
    var btn = document.getElementById('fullscreenBtn');
    if (btn) {
        btn.textContent = isExpanded ? '🎮 Classic' : '📺 Full Screen';
    }
}
```

Add CSS for expanded mode:
```css
.gameboy.expanded-mode {
    max-width: 95vw;
    padding: 15px;
}

.gameboy.expanded-mode #gameScreen {
    width: 480px;
    height: 432px;
}

.gameboy.expanded-mode .nintendo-logo {
    display: none;
}

.gameboy.expanded-mode .game-header {
    display: none;
}

@media (max-width: 768px) {
    .gameboy.expanded-mode #gameScreen {
        width: 320px;
        height: 288px;
    }
}
```

**Acceptance Criteria:**
- [ ] GameBoy canvas is clearly visible and at least 320x288 on iPad
- [ ] D-pad buttons are at least 55x60px (comfortable for children's fingers)
- [ ] A/B buttons are at least 60px diameter
- [ ] Full-screen mode makes the canvas even larger
- [ ] Pixel art look is preserved (no blurring)

---

### TASK 2.3: Music Time - Responsive Piano Keys

**Severity:** HIGH - 8 piano keys with `min-width: 60px` = 480px minimum, overflows on screens < 480px
**Game:** music-time
**Files:** `games/music-time/style.css`, `games/music-time/app.js`

#### Sub-task 2.3.1: Fix piano key overflow

**File:** `games/music-time/style.css`

Find `.piano-key` and update:

**Current (likely):**
```css
.piano-key {
    min-width: 60px;
    min-height: 180px;
    flex-wrap: nowrap;
}
```

**Replace with:**
```css
.piano-key {
    flex: 1;
    min-width: 0;
    min-height: 160px;
    max-width: 100px;
}

/* For very narrow screens */
@media (max-width: 480px) {
    .piano-key {
        min-height: 120px;
        min-width: 0;
    }
}
```

Find `.keys-row` and ensure:
```css
.keys-row {
    display: flex;
    width: 100%;
    gap: 4px;
    flex-wrap: nowrap;
}
```

#### Sub-task 2.3.2: Add missing `bounce` keyframe animation

**File:** `games/music-time/style.css`

The JavaScript references `'bounce 0.5s ease'` animation but no `bounce` keyframe exists. Add:

```css
@keyframes bounce {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    50% { transform: scale(0.9); }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
```

#### Sub-task 2.3.3: Improve animal mode layout on mobile

**File:** `games/music-time/style.css`

Find `.animal-key` and update for small screens:

```css
.animal-key {
    /* ... existing styles ... */
    min-width: 0;
    flex: 1;
}

@media (max-width: 480px) {
    .animal-key {
        min-height: 80px;
        min-width: 0;
        font-size: 0.75rem;
    }
}
```

#### Sub-task 2.3.4: Complete the demo song

**File:** `games/music-time/app.js`

Find the demo song function. Currently plays only 7 notes of Twinkle Twinkle.

**Extend the demo to play the full first phrase:**
```javascript
// Twinkle Twinkle Little Star - full first section
// C C G G A A G - F F E E D D C
// Notes: [note, durationMs]
var demoNotes = [
    ['C4', 400], ['C4', 400], ['G4', 400], ['G4', 400],
    ['A4', 400], ['A4', 400], ['G4', 800],
    ['F4', 400], ['F4', 400], ['E4', 400], ['E4', 400],
    ['D4', 400], ['D4', 400], ['C4', 800]
];
```

Replace the existing demo implementation with this complete version.

**Acceptance Criteria:**
- [ ] All 8 piano keys fit on a 375px-wide screen without horizontal overflow
- [ ] All 8 animal keys fit in their 2x4 grid on any screen size
- [ ] `bounce` animation works when note display emoji appears
- [ ] Demo song plays the complete first section of Twinkle Twinkle

---

### TASK 2.4: Memory Game - Merge V1 and V2

**Severity:** MEDIUM - Two nearly identical games, V2 has better code but V1 has more features (physics particles, sounds per animal)
**Games:** memory-game (V1), memory-game-v2 (V2)

**Strategy:** Keep V2's class-based code structure (better quality) and port V1's features into it. Then remove V1 and update the portal.

#### Sub-task 2.4.1: Port V1 features to V2

**Features to port from V1 to V2:**
1. Per-animal sounds (bark, meow, ribbit, etc.) - currently in `games/memory-game/app.js`
2. Match celebration particles using `Physics.ParticleSystem` - currently in `games/memory-game/app.js`
3. Win celebration particles
4. Undo functionality (if present)

**File to modify:** `games/memory-game-v2/game.js`

**Step 1:** Add physics engine import to `games/memory-game-v2/index.html`:
```html
<script src="../../js/physics-engine.js"></script>
```

**Step 2:** In `game.js`, add animal-specific sounds to the `AudioManager` class:

Copy the sound synthesis functions from V1's `app.js` (search for functions like `playBark`, `playMeow`, `playFrog`, etc.) and integrate them into V2's `AudioManager`.

**Step 3:** Add particle celebrations on match:

In the `MemoryGame` class, find where a successful match is detected. Add:
```javascript
// After match confirmed
if (typeof Physics !== 'undefined' && this.particlesContainer) {
    var particleSystem = new Physics.ParticleSystem(this.particlesContainer, 20);
    var rect = card1.getBoundingClientRect();
    particleSystem.createExplosion(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        8,
        { emoji: '⭐', size: 20, lifetime: 1000 }
    );
}
```

**Step 4:** Add a `#particlesContainer` div to `games/memory-game-v2/index.html`:
```html
<div id="particlesContainer" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1000;"></div>
```

#### Sub-task 2.4.2: Add difficulty levels to merged game

**File:** `games/memory-game-v2/game.js`

Add a difficulty selection screen before the game starts:

```javascript
// Add to MemoryGame class or as a separate screen
var difficulties = {
    easy:   { pairs: 3, cols: 3, rows: 2, label: 'Easy (6 cards)' },
    medium: { pairs: 8, cols: 4, rows: 4, label: 'Medium (16 cards)' },
    hard:   { pairs: 10, cols: 5, rows: 4, label: 'Hard (20 cards)' }
};
```

Add a difficulty selection screen in `index.html`:
```html
<div class="setup-panel" id="setupPanel">
    <h2>Choose Difficulty</h2>
    <div class="difficulty-buttons">
        <button onclick="startGame('easy')">🌱 Easy (6 cards)</button>
        <button onclick="startGame('medium')">😊 Medium (16 cards)</button>
        <button onclick="startGame('hard')">😰 Hard (20 cards)</button>
    </div>
</div>
```

Make the grid dynamic based on difficulty:
```css
.game-board[data-cols="3"] { grid-template-columns: repeat(3, 1fr); }
.game-board[data-cols="4"] { grid-template-columns: repeat(4, 1fr); }
.game-board[data-cols="5"] { grid-template-columns: repeat(5, 1fr); }
```

#### Sub-task 2.4.3: Update portal to remove V1

**File:** `index.html`

1. Remove the Memory Game V1 card (the one with `data-game="memory-game"`)
2. Update the Memory Match V2 card to be the primary "Memory Game":
```html
<div class="game-card active" data-game="memory-game-v2" onclick="navigateToGame('memory-game-v2')">
    <div class="game-icon">🎴</div>
    <h2 class="game-title">Memory Game</h2>
    <p class="game-description">Match the pairs!</p>
</div>
```

**Acceptance Criteria:**
- [ ] Memory Game V2 has all V1 features (sounds, particles, celebrations)
- [ ] Difficulty selection works (Easy/Medium/Hard)
- [ ] Grid layout adapts to number of columns
- [ ] Portal no longer shows duplicate Memory Game entries
- [ ] Old `games/memory-game/` folder can be safely kept but is no longer linked

---

### TASK 2.5: Catch Colors - UI Improvements

**Severity:** MEDIUM
**Game:** catch-colors

#### Sub-task 2.5.1: Increase ball size for young children

**File:** `games/catch-colors/style.css`

Find `.falling-ball` and increase size:
```css
/* BEFORE */
.falling-ball {
    width: 80px;
    height: 80px;
}

/* AFTER */
.falling-ball {
    width: 90px;
    height: 90px;
}

@media (max-width: 480px) {
    .falling-ball {
        width: 70px;
        height: 70px;
    }
}
```

#### Sub-task 2.5.2: Add No-Timer mode for younger children

**File:** `games/catch-colors/app.js`

Add a mode selection before the game starts. Find the game start logic and add:

```javascript
var gameModes = {
    timed: { timeLimit: 60, label: '60 Seconds' },
    casual: { timeLimit: 0, label: 'No Timer (Relax)' }
};
```

**File:** `games/catch-colors/index.html`

Add mode selection UI:
```html
<div class="mode-selection" id="modeSelection">
    <h2>Choose Mode</h2>
    <button class="mode-btn" data-mode="timed">⏱️ 60 Seconds</button>
    <button class="mode-btn" data-mode="casual">🌈 No Timer</button>
</div>
```

In casual mode, the timer is hidden and the game runs indefinitely (or until the user stops).

**Acceptance Criteria:**
- [ ] Balls are at least 90px on tablet and 70px on phone
- [ ] Casual mode (no timer) is available for younger children
- [ ] Timed mode still works with 60-second countdown

---

### TASK 2.6: Interactive Stories - Fix Scrolling & Add Animation Guard

**Severity:** HIGH - Touch scrolling is completely blocked (fixed in Task 0.1)
**Game:** interactive-stories

#### Sub-task 2.6.1: Add animation throttle for page navigation

**File:** `games/interactive-stories/app.js`

Find the page navigation functions (prev/next). Add a throttle to prevent rapid tapping:

```javascript
var isTransitioning = false;

function nextPage() {
    if (isTransitioning) return;
    isTransitioning = true;

    // ... existing transition code ...

    setTimeout(function() {
        isTransitioning = false;
    }, 400); // Match the CSS transition duration + 100ms buffer
}

function prevPage() {
    if (isTransitioning) return;
    isTransitioning = true;

    // ... existing transition code ...

    setTimeout(function() {
        isTransitioning = false;
    }, 400);
}
```

#### Sub-task 2.6.2: Reuse AudioContext instead of creating new one

**File:** `games/interactive-stories/app.js`

Find the completion melody function. Currently creates a new `AudioContext` each time.

**Replace with:**
```javascript
var _audioCtx = null;

function getAudioContext() {
    if (!_audioCtx) {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioCtx.state === 'suspended') {
        _audioCtx.resume();
    }
    return _audioCtx;
}

// Then replace all "new AudioContext()" with "getAudioContext()"
```

**Acceptance Criteria:**
- [ ] Rapid tapping on next/prev doesn't break page layout
- [ ] Only one AudioContext is created and reused
- [ ] Story text is scrollable on touch devices

---

### TASK 2.7: Sand Box - Implement Actual Tool Functionality

**Severity:** MEDIUM - Tools (rake, mold, bucket) currently only play a sound and show an alert. No real functionality.
**Game:** sand-box
**Files:** `games/sand-box/app.js`, `games/sand-box/input.js`

#### Sub-task 2.7.1: Implement Rake tool

**File:** `games/sand-box/app.js`

Find the `selectTool('rake')` handler and the click/touch interaction code.

**Implementation:**
When the rake tool is selected and the user clicks/taps on sand grains:
1. Find all sand grain physics bodies within a rectangular area around the tap position (use raycasting or XZ proximity check)
2. Set their Y position to a flat level (ground level + small offset)
3. Set their velocity to 0
4. Play rake sound

```javascript
function applyRakeAtPosition(worldX, worldZ) {
    var rakeWidth = 3;
    var flatY = 0.55; // just above ground

    for (var i = 0; i < sandGrains.length; i++) {
        var grain = sandGrains[i];
        var dx = grain.body.position.x - worldX;
        var dz = grain.body.position.z - worldZ;

        if (Math.abs(dx) < rakeWidth && Math.abs(dz) < 0.5) {
            grain.body.position.y = flatY;
            grain.body.velocity.set(0, 0, 0);
            grain.body.angularVelocity.set(0, 0, 0);
        }
    }
}
```

#### Sub-task 2.7.2: Implement Mold tool

When mold tool is selected and user clicks:
1. Find sand grains within a circular radius
2. Move them into a predefined shape (circle or star pattern)
3. Play mold sound

```javascript
function applyMoldAtPosition(worldX, worldZ) {
    var moldRadius = 2;
    var shapeRadius = 1.5;
    var numGrains = 0;

    for (var i = 0; i < sandGrains.length; i++) {
        var grain = sandGrains[i];
        var dx = grain.body.position.x - worldX;
        var dz = grain.body.position.z - worldZ;
        var dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < moldRadius) {
            var angle = (numGrains / 12) * Math.PI * 2;
            grain.body.position.x = worldX + Math.cos(angle) * shapeRadius;
            grain.body.position.z = worldZ + Math.sin(angle) * shapeRadius;
            grain.body.velocity.set(0, 0, 0);
            numGrains++;
        }
    }
}
```

#### Sub-task 2.7.3: Remove alert() calls from tool selection

**File:** `games/sand-box/app.js`

Find the `selectTool` function. Remove the `alert()` call.

**Replace:**
```javascript
alert(toolName + ' selected! Click on sand to use.');
```

**With:**
```javascript
if (typeof GameToast !== 'undefined') {
    GameToast.show(toolName + ' selected', 1500);
}
```

Also add `<script src="../../js/toast.js"></script>` to `games/sand-box/index.html`.

#### Sub-task 2.7.4: Improve 3-column layout for iPad

**File:** `games/sand-box/style.css`

Find `.left-panel, .right-panel`:

**Current:**
```css
.left-panel, .right-panel {
    width: 180px;
    /* ... */
}
```

**Replace with responsive widths:**
```css
.left-panel, .right-panel {
    width: 180px;
    flex-shrink: 0;
}

@media (max-width: 900px) {
    .left-panel, .right-panel {
        width: 140px;
    }
}

@media (max-width: 768px) {
    .game-area {
        flex-direction: column;
    }
    .left-panel, .right-panel {
        width: 100%;
        flex-direction: row;
        overflow-x: auto;
    }
}
```

**Acceptance Criteria:**
- [ ] Rake tool flattens sand grains when clicked on the scene
- [ ] Mold tool arranges sand grains into a circle pattern
- [ ] No `alert()` calls remain in the game
- [ ] 3-column layout adapts to iPad portrait mode

---

### TASK 2.8: Toy Box Builder - Dynamic Canvas & Camera Controls

**Severity:** MEDIUM - Canvas is hardcoded to 400px height; no camera rotation
**Game:** toy-box-builder
**Files:** `games/toy-box-builder/index.html`, `games/toy-box-builder/style.css`, `games/toy-box-builder/scene.js`

#### Sub-task 2.8.1: Fix canvas height to be dynamic

**File:** `games/toy-box-builder/index.html`

**Current (line 28):**
```html
<canvas id="gameCanvas" style="width: 100%; height: 400px;"></canvas>
```

**Replace with:**
```html
<canvas id="gameCanvas"></canvas>
```

**File:** `games/toy-box-builder/style.css`

Add/update the canvas styles:
```css
#gameCanvas {
    flex: 1;
    width: 100%;
    min-height: 0;
    display: block;
    cursor: grab;
}
```

#### Sub-task 2.8.2: Add orbit camera controls

**File:** `games/toy-box-builder/scene.js`

Add simple orbit camera controls that allow the user to rotate the view by dragging with two fingers or right-click:

```javascript
// Add after camera creation
var cameraAngle = Math.PI / 4; // 45 degrees
var cameraElevation = Math.PI / 6; // 30 degrees
var cameraDistance = 20;

function updateCameraPosition() {
    camera.position.x = cameraDistance * Math.sin(cameraAngle) * Math.cos(cameraElevation);
    camera.position.y = cameraDistance * Math.sin(cameraElevation) + 5;
    camera.position.z = cameraDistance * Math.cos(cameraAngle) * Math.cos(cameraElevation);
    camera.lookAt(0, 0, 0);
}

// Add to input handling:
// Two-finger rotation OR Ctrl+drag for desktop
```

**File:** `games/toy-box-builder/input.js`

Add orbit control event handling. This should use two-finger touch or a dedicated rotation gesture.

#### Sub-task 2.8.3: Add more object types and colors

**File:** `games/toy-box-builder/app.js`

Add to the spawnable objects:
- Star (custom geometry)
- Pyramid (cone geometry)
- Torus (donut shape)

Add a color picker (at least 5 colors):
- Pink, Teal, Orange, Yellow, Purple

**Acceptance Criteria:**
- [ ] Canvas fills available vertical space (not fixed 400px)
- [ ] Camera can be rotated by dragging
- [ ] At least 5 object types available
- [ ] At least 5 colors available

---

### TASK 2.9: Building Blocks - Collapsible Controls

**Severity:** MEDIUM - Controls consume 40% of screen on iPad portrait
**Game:** building-blocks
**Files:** `games/building-blocks/style.css`, `games/building-blocks/index.html`

#### Sub-task 2.9.1: Integrate game-layout.css

**File:** `games/building-blocks/index.html`

1. Add `<link rel="stylesheet" href="../../css/game-layout.css">`
2. Add `<script src="../../js/controls-toggle.js"></script>`
3. Restructure the HTML:
   - Move header to use `game-header-compact` class
   - Wrap canvas in `game-area-main`
   - Move toolbar, block-type-selector, color-palette, and actions into a `controls-overlay`
   - Add `controls-toggle` button

#### Sub-task 2.9.2: Move all controls to overlay

**Target HTML structure:**
```html
<div class="building-blocks-container game-layout">
    <div class="game-header-compact">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <span class="header-title">🧱 Building Blocks</span>
        <div class="header-info">
            <span class="score-badge" id="blockCount">0 blocks</span>
        </div>
    </div>

    <div class="game-area-main">
        <canvas id="gameCanvas"></canvas>
    </div>

    <button class="controls-toggle">⚙</button>

    <div class="controls-overlay">
        <div class="controls-handle"></div>
        <button class="controls-close">✕</button>

        <!-- Mode selection -->
        <div class="toolbar">
            <!-- snap, build orbit, delete buttons -->
        </div>

        <!-- Block types -->
        <div class="block-type-selector">
            <!-- block type buttons -->
        </div>

        <!-- Colors -->
        <div class="color-palette">
            <!-- color buttons -->
        </div>

        <!-- Actions -->
        <div class="actions">
            <!-- save, load buttons -->
        </div>
    </div>
</div>
```

#### Sub-task 2.9.3: Initialize controls toggle

Add to `games/building-blocks/app.js`:
```javascript
if (typeof ControlsToggle !== 'undefined') {
    ControlsToggle.init();
}
```

**Acceptance Criteria:**
- [ ] Canvas takes up at least 75% of viewport height on iPad
- [ ] All controls accessible via floating toggle button
- [ ] Controls overlay doesn't overlap the canvas in a confusing way
- [ ] All existing functionality (spawn, delete, save, load) still works

---

### TASK 2.10: Crocodile Game V2 - Integrate Design System

**Severity:** MEDIUM - Game uses self-contained CSS, looks visually inconsistent with portal
**Game:** crocodile-game-v2

#### Sub-task 2.10.1: Add design-system.css import

**File:** `games/crocodile-game-v2/index.html`

Add to `<head>`:
```html
<link rel="stylesheet" href="../../css/design-system.css">
```

#### Sub-task 2.10.2: Update CSS to use design system variables

**File:** `games/crocodile-game-v2/styles.css`

Replace hardcoded color values with CSS variables:
- `#66BB6A` → `var(--crocodile-accent)`
- `#4CAF50` → `var(--success)`
- Font families → `var(--font-display)`
- Border radius values → use consistent values from design system

**Acceptance Criteria:**
- [ ] Game visually matches the portal's design language
- [ ] Colors, fonts, and border-radius are consistent with other games
- [ ] Game still functions correctly

---

## Phase 3: Design System Enhancements (P3)

> **Goal:** Improve the shared design system for consistency and better iPad support.
> **Estimated Time:** 2-3 hours
> **Priority:** MEDIUM

---

### TASK 3.1: Add Safari-Specific CSS Utilities

**File:** `css/design-system.css`

Add at the end of the file:

```css
/* ========================================
   10. SAFARI/iOS UTILITIES
   ======================================== */

/* Prevent iOS bounce scroll on fixed containers */
.ios-no-bounce {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Prevent text selection on game elements */
.no-select {
    user-select: none;
    -webkit-user-select: none;
}

/* Prevent callout on long-press (iOS) */
.no-callout {
    -webkit-touch-callout: none;
}

/* Safe area padding utilities */
.safe-area-padding {
    padding-top: env(safe-area-inset-top, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
}

.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Touch-optimized: no delay, no highlight */
.touch-optimized {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
```

### TASK 3.2: Standardize Game HTML Template

Create a reference template that all games should follow. Document this in a comment at the top of `game-layout.css`:

```css
/*
 * STANDARD GAME HTML TEMPLATE
 * ===========================
 *
 * <!DOCTYPE html>
 * <html lang="en">
 * <head>
 *     <meta charset="UTF-8">
 *     <meta name="viewport" content="width=device-width, initial-scale=1.0,
 *         maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
 *     <meta name="apple-mobile-web-app-capable" content="yes">
 *     <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
 *     <meta name="apple-mobile-web-app-title" content="Game Name">
 *     <title>Game Name - My Game World</title>
 *     <link rel="stylesheet" href="../../css/common.css">
 *     <link rel="stylesheet" href="../../css/game-layout.css">
 *     <link rel="stylesheet" href="style.css">
 * </head>
 * <body>
 *     <div class="game-layout">
 *         <!-- Compact Header (40px) -->
 *         <div class="game-header-compact">
 *             <button class="btn-back" onclick="goBack()">← Back</button>
 *             <span class="header-title">🎮 Game Name</span>
 *             <div class="header-info">
 *                 <span class="score-badge">Score: 0</span>
 *             </div>
 *         </div>
 *
 *         <!-- Game Area (fills remaining space) -->
 *         <div class="game-area-main">
 *             <!-- Game content here -->
 *         </div>
 *
 *         <!-- Floating controls toggle -->
 *         <button class="controls-toggle">⚙</button>
 *
 *         <!-- Controls overlay -->
 *         <div class="controls-overlay">
 *             <div class="controls-handle"></div>
 *             <button class="controls-close">✕</button>
 *             <!-- Controls here -->
 *         </div>
 *     </div>
 *
 *     <script src="../../js/navigation.js"></script>
 *     <script src="../../js/toast.js"></script>
 *     <script src="../../js/controls-toggle.js"></script>
 *     <script src="app.js"></script>
 * </body>
 * </html>
 */
```

---

## Phase 4: New Features & Content (P4)

> **Goal:** Add new content and features to make games more engaging.
> **Estimated Time:** 3-5 hours per task
> **Priority:** LOW - Nice to have, do after all fixes

---

### TASK 4.1: GameBoy - Add Pong Game

**Game:** gameboy-simulator
**File:** `games/gameboy-simulator/game.js`

Add a second game to the GameBoy simulator alongside Snake:

1. Add a game selection menu when GameBoy starts
2. Implement Pong with:
   - Player paddle (controlled by D-pad up/down)
   - AI paddle
   - Ball with collision detection
   - Score tracking
   - Game over at 5 points

**Key implementation details:**
- Reuse the existing `GameBoy` class
- Add a `PongGame` class similar to `SnakeGame`
- Draw on the same 160x144 canvas
- Use the same color palette (#0f380f, #306230, #8bac0f, #9bbc0f)

### TASK 4.2: Interactive Stories - Add Branching Choices

**Game:** interactive-stories
**File:** `games/interactive-stories/stories.js`

Update the story data structure to support branching:

```javascript
{
    page: 5,
    text: "The bunny found two paths. Which way should it go?",
    illustration: "🐰 fork in road",
    choices: [
        { text: "Go left to the forest", nextPage: 6 },
        { text: "Go right to the river", nextPage: 8 }
    ]
}
```

Update the story reader UI to show choice buttons when available instead of just next/prev.

### TASK 4.3: Drawing App - Add Picture Categories

**Game:** drawing-app
**Files:** `games/drawing-app/pictures.js`, `games/drawing-app/app.js`

Group the 25+ pictures into categories:
- Animals (bunny, cat, dog, fish)
- Princesses (princess, castle, crown)
- Vehicles (car, boat, train)
- Nature (flower, tree, rainbow)

Add tab navigation above the picture grid:
```html
<div class="category-tabs">
    <button class="tab active" data-category="all">All</button>
    <button class="tab" data-category="animals">Animals</button>
    <button class="tab" data-category="princesses">Princesses</button>
    <button class="tab" data-category="vehicles">Vehicles</button>
    <button class="tab" data-category="nature">Nature</button>
</div>
```

Add a `category` field to each picture in `pictures.js` and filter based on selected tab.

### TASK 4.4: Offline CDN Bundles

**Games Affected:** building-blocks, sand-box, toy-box-builder (all use Three.js + Cannon.js from CDN)

**Strategy:** Download the CDN libraries and host them locally in a `vendor/` directory.

#### Steps:
1. Create directory: `vendor/`
2. Download Three.js r128: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` → `vendor/three.min.js`
3. Download Cannon.js 0.6.2: `https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js` → `vendor/cannon.min.js`

4. Update all games to reference local files:

**Before:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"></script>
```

**After:**
```html
<script src="../../vendor/three.min.js"></script>
<script src="../../vendor/cannon.min.js"></script>
```

**Acceptance Criteria:**
- [ ] All games work without internet connection
- [ ] No CDN URLs remain in any HTML file
- [ ] Library versions match the originals (Three.js r128, Cannon.js 0.6.2)

---

## Testing Checklist

After completing all phases, verify the following on each game:

### Per-Game Test Matrix

| Test | How to Verify |
|------|---------------|
| **Loads without console errors** | Open Safari Web Inspector, check Console tab |
| **No overlapping buttons** | Visual inspection on 1024x768 and 768x1024 |
| **No hidden elements** | Check all buttons are visible and accessible |
| **Game area >= 60% viewport** | Measure with Safari Web Inspector |
| **Touch targets >= 44px** | All interactive elements should be at least 44px |
| **No `color-mix()` in CSS** | Run `grep -r "color-mix" games/ css/` |
| **No global `touchmove` prevention** | Run `grep -r "document.addEventListener('touchmove'" games/` |
| **Back button uses `GameNavigation`** | Run `grep -r "../../index.html" games/` |
| **No `alert()` calls** | Run `grep -r "alert(" games/` |
| **No `confirm()` calls** | Run `grep -r "confirm(" games/` |
| **`100dvh` with fallback** | Check main container height CSS |
| **`env(safe-area-inset-*)`** | Check main container padding CSS |
| **Audio works after first tap** | Tap once, then play sounds |
| **Portrait mode works** | Rotate iPad, verify layout adapts |
| **Landscape mode works** | Rotate iPad, verify layout adapts |
| **No horizontal scroll** | Check no content extends past viewport width |

### Cross-Game Grep Commands

Run these from the project root to verify no regressions:

```bash
# Should return ZERO results:
grep -r "color-mix" games/ css/
grep -r "document.addEventListener('touchmove'" games/
grep -r "../../index.html" games/ --include="*.js"
grep -r "alert(" games/ --include="*.js"
grep -r "confirm(" games/ --include="*.js"
```

### iPad Safari Specific Tests

1. **Address bar handling:** Verify no content is hidden behind the top address bar area
2. **Home screen app mode:** Add to home screen, launch, verify full-screen mode works
3. **Orientation change:** Rotate between portrait/landscape, verify layout adapts without breaking
4. **Touch responsiveness:** All buttons respond within 100ms of tap
5. **No accidental zoom:** Double-tap or pinch should NOT zoom the page
6. **Audio after silent mode:** Verify audio works when device is not in silent mode (note: iOS mutes audio in silent mode by design for non-media content)

---

## Implementation Priority Summary

| Phase | Tasks | Priority | Est. Time |
|-------|-------|----------|-----------|
| **P0** | 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7 | CRITICAL | 5-6h |
| **P1** | 1.1, 1.2, 1.3 | HIGH | 4-5h |
| **P2** | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10 | HIGH/MEDIUM | 20-30h |
| **P3** | 3.1, 3.2 | MEDIUM | 2-3h |
| **P4** | 4.1, 4.2, 4.3, 4.4 | LOW | 15-20h |

**Total Estimated Effort:** 46-64 hours

---

## Notes for Junior Engineers

1. **Always test on actual iPad Safari** - iOS Safari has unique behaviors that desktop Chrome/Firefox do not replicate
2. **Use Safari Web Inspector** - Connect iPad to Mac, enable Web Inspector in Safari > Develop menu
3. **Test both orientations** - Many layout bugs only appear in one orientation
4. **Preserve existing functionality** - Never remove features, only enhance
5. **Keep the target audience in mind** - Children ages 3-5 need large buttons (min 44px), simple layouts, and bright colors
6. **Test with chubby fingers** - Touch targets should be at least 44x44px, ideally 60x60px for this age group
7. **Run the grep commands** after each task to verify no regressions
8. **Commit frequently** - One commit per completed task, with message format: `fix(game-name): description`
