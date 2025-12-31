# 🎮 Kids Game Portal

A fun, colorful game portal built for young children (ages 3-5)! Now with 2 exciting games!

## 🎨 Features

### Game Portal Homepage
- Colorful, kid-friendly interface
- Large, easy-to-click buttons
- Animated game cards
- Multiple games to play and more coming soon!

### 🎨 Drawing App
- **Freehand Drawing** - Draw with mouse or touch
- **Brush Tool** - Smooth drawing with adjustable colors
- **Fill Bucket** - Fill the canvas with colors
- **Eraser** - Fix mistakes easily
- **8 Color Palette** - Red, Orange, Yellow, Green, Blue, Purple, Black, White
- **3 Brush Sizes** - Small, Medium, Large
- **Undo** - Go back if you make a mistake
- **Clear Canvas** - Start fresh
- **Save Drawing** - Download your masterpiece as PNG

### 🎴 Memory Card Game
- **Card Matching** - Flip cards to find matching pairs
- **8 Cute Animals** - Dog, Cat, Panda, Fox, Frog, Lion, Cow, Pig
- **Move Counter** - Track how many moves you've made
- **Flip Animations** - Beautiful 3D card flip effects
- **Match Celebration** - Fun animations when you find a pair
- **Win Celebration** - Particle effects and congratulations when you win!
- **Play Again** - Easy restart for endless fun

## 🚀 How to Run

### Option 1: Direct File Opening (Simplest)
1. Open `index.html` in your web browser
2. Click on the Drawing game card
3. Start drawing!

### Option 2: Local Server (Recommended)
Using Python:
```bash
cd C:\Users\pttuan\kids-game-portal
python -m http.server 8000
```
Then open: http://localhost:8000

Using Node.js:
```bash
cd C:\Users\pttuan\kids-game-portal
npx serve
```

Using VS Code:
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📁 Project Structure
```
kids-game-portal/
├── index.html                 # Game portal homepage
├── css/
│   └── common.css            # Shared styles
├── games/
│   ├── drawing-app/
│   │   ├── index.html        # Drawing app
│   │   ├── style.css         # Drawing app styles
│   │   └── app.js            # Drawing app logic
│   └── memory-game/
│       ├── index.html        # Memory game
│       ├── style.css         # Memory game styles
│       └── app.js            # Memory game logic
└── README.md                 # This file
```

## 🛠️ Tech Stack
- **Vanilla JavaScript** - No frameworks, simple and fast
- **Plain CSS** - Easy to customize
- **Fabric.js 5.3.0** - Powerful canvas library (loaded via CDN)

## 👶 Designed for Kids
- Extra-large buttons (60px minimum)
- Bright, high-contrast colors
- Minimal text, lots of icons
- Touch-friendly for tablets
- No reading required
- Positive feedback with animations

## 🎯 Future Games
- 🧮 Math Fun - Bubble pop numbers game
- 🎴 Memory Game - Match pairs
- 🎯 Catch Colors - Color matching game
- 🎹 Music Time - Animal sound piano
- 📖 Stories - Interactive storybooks

## 🎨 How to Use the Drawing App

1. **Select a Tool**
   - 🖌️ Brush - Draw freehand
   - 🪣 Fill - Fill the canvas with color
   - 🧽 Eraser - Erase mistakes

2. **Pick a Color**
   - Click any color circle to change colors
   - 8 bright colors to choose from

3. **Choose Brush Size**
   - ⚫ Small - Details
   - ⚫⚫ Medium - Regular drawing
   - ⚫⚫⚫ Large - Big strokes

4. **Actions**
   - ↩️ Undo - Go back one step
   - 🗑️ Clear - Start over (asks first)
   - 💾 Save - Download your drawing

5. **Go Back**
   - Click "← Back" to return to the game portal

## 🎴 How to Play Memory Game

1. **Start the Game**
   - Click the Memory Game card from the portal
   - Cards will be shuffled and placed face down

2. **Flip Cards**
   - Click any card to flip it over
   - Try to remember where each animal is!
   - Click a second card to find a match

3. **Match Pairs**
   - If two cards match, they stay flipped
   - If they don't match, they flip back over
   - Find all 8 pairs to win!

4. **Win the Game**
   - Match all pairs to see the celebration!
   - Your moves are counted - try to beat your record!
   - Click "Play Again" to start a new game

5. **Go Back**
   - Click "← Back" to return to the game portal

**Game Features:**
- 16 cards (8 pairs of cute animals)
- Move counter to track your progress
- Beautiful flip animations
- Celebration particles when you win!
- No timer - play at your own pace

## 💡 Tips
- Works best on tablet or desktop
- Touch screen supported
- Canvas auto-sizes to fit screen
- Undo remembers up to 20 actions
- Saved drawings go to your Downloads folder

## 🌈 Customization

Want to change the colors? Edit `css/common.css`:
```css
/* Change the gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change button colors */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Want to add more colors? Edit `games/drawing-app/index.html`:
```html
<button class="color-btn" data-color="#YOUR_COLOR" style="background: #YOUR_COLOR;"></button>
```

## 📝 Notes
- Requires internet connection for Fabric.js CDN
- Works offline after first load (if cached)
- No tracking, no ads, completely safe for kids
- All data stays local - nothing is uploaded

## 🎉 Have Fun!

Made with ❤️ for kids to learn, create, and play!

---

**Version:** 1.0.0
**Last Updated:** December 2025
