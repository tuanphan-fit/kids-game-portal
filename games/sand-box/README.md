# Sand Box Game

A fun, interactive 3D physics sandbox game for kids where they can pour colorful sand, move a bucket, and use various tools!

## Features

### 🏖️ Sand Simulation
- **Multiple Colors**: Sand, Gold, Red, and Blue sand grains
- **Realistic Physics**: Lightweight sand grains with proper friction and minimal bounce
- **High Capacity**: Up to 500 sand grains per session

### 🪣 Bucket
- **Movable**: Drag the bucket anywhere in the scene
- **Physics-based**: Realistic bucket physics that tips and tilts
- **Container**: Sand falls and collects inside the bucket

### 🌊 Pouring Options
- **Auto Pour**: Hold the "Hold to Pour" button for a continuous stream of sand
- **Batch Pour**: Click "Pour All" to drop 50 grains at once

### 🧰 Tools
- **Bucket**: Select to move the bucket around
- **Rake**: Click on sand to rake it
- **Mold**: Click on sand to shape it (visual effect with sound)

### 🔊 Sound Effects
- **Pouring Sound**: Soft sound when pouring sand
- **Drop Sound**: Sound when sand hits the ground
- **Click Sound**: UI interaction sounds
- **Tool Sound**: Sound when using tools
- **Toggle**: Mute/unmute sounds with the sound button

## How to Play

1. **Select a Color**: Choose from Sand, Gold, Red, or Blue
2. **Pour Sand**:
   - Hold the "Hold to Pour" button for continuous stream
   - Or click "Pour All" to drop a batch
3. **Move Bucket**: Click and drag the blue bucket to move it
4. **Use Tools**: Select a tool and click on sand to interact
5. **Reset**: Click the Reset button to clear all sand and restart

## Technical Details

### Technologies Used
- **Three.js r128**: 3D rendering
- **Cannon.js 0.6.2**: Physics simulation
- **Vanilla JavaScript**: Game logic
- **Web Audio API**: Synthesized sound effects

### File Structure
```
sand-box/
├── index.html      # Main game HTML
├── style.css       # Sand-themed styling
├── scene.js        # 3D scene, bucket, lighting
├── physics.js      # Physics world, sand grains, bucket
├── input.js        # Mouse/touch, dragging
├── sounds.js       # Sound effects
└── app.js          # Main game logic
```

### Physics Settings
- **Sand Mass**: 0.1 (lightweight)
- **Friction**: 0.8 (high, realistic for sand)
- **Restitution**: 0.1 (low, minimal bounce)
- **Linear/Angular Damping**: 0.2 (settles quickly)
- **Bucket Mass**: 5.0 (heavy enough to be stable)
- **Solver Iterations**: 15 (for stable stacking)

## Controls

### Desktop
- **Left Click + Drag**: Drag bucket or sand grains
- **Hold Button**: Auto pour sand
- **Click Button**: Batch pour or select tools/colors

### Mobile
- **Touch + Drag**: Drag bucket or sand grains
- **Hold Touch**: Auto pour sand
- **Tap**: Batch pour or select tools/colors

## Performance Tips
- Maximum 500 sand grains to maintain smooth performance
- Physics step: 60 FPS
- Shadow mapping enabled for realistic visuals
- Antialiasing enabled for smooth edges

## Future Enhancements
- More sand colors
- Additional tools (shovel, sieve, molds)
- Bucket tipping mechanics
- Save/load sand configurations
- Different bucket shapes
- Wind effects
- Sound improvements (recorded instead of synthesized)

## Credits
Built based on the Toy Box Builder game, adapted for sand simulation.