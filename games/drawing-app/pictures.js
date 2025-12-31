// Coloring Book Pictures - Original Characters
// All characters are original creations, not based on any copyrighted material

const coloringPictures = [
    // PRINCESSES
    {
        id: 'ice-princess',
        name: 'Ice Princess ❄️',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Dress -->
            <path d="M200,280 L150,480 L250,480 Z" fill="#E8F4F8" stroke="#4A90A4" stroke-width="3"/>
            <path d="M200,280 L120,480 L150,480 Z" fill="#E8F4F8" stroke="#4A90A4" stroke-width="3"/>
            <path d="M200,280 L250,480 L280,480 Z" fill="#E8F4F8" stroke="#4A90A4" stroke-width="3"/>
            <!-- Cape -->
            <path d="M100,300 Q200,250 300,300 L320,480 Q200,500 80,480 Z" fill="#B8E5F8" stroke="#7AB8D9" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="320" rx="50" ry="60" fill="#FFE4E1" stroke="#D4A5A5" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="70" fill="#FFE4E1" stroke="#D4A5A5" stroke-width="3"/>
            <!-- Hair -->
            <path d="M130,180 Q130,100 200,90 Q270,100 270,180" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <path d="M130,180 L140,280 L200,280 L200,180" fill="#87CEEB"/>
            <path d="M270,180 L260,280 L200,280 L200,180" fill="#87CEEB"/>
            <!-- Tiara -->
            <path d="M160,140 L200,100 L240,140" fill="none" stroke="#FFD700" stroke-width="4"/>
            <circle cx="200" cy="115" r="8" fill="#FF69B4"/>
            <circle cx="180" cy="120" r="6" fill="#87CEEB"/>
            <circle cx="220" cy="120" r="6" fill="#87CEEB"/>
            <!-- Face -->
            <circle cx="180" cy="175" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#FF69B9" stroke-width="3"/>
            <!-- Snowflakes around -->
            <text x="50" y="100" font-size="30" fill="#87CEEB">❄</text>
            <text x="320" y="150" font-size="25" fill="#87CEEB">❄</text>
            <text x="100" y="400" font-size="28" fill="#87CEEB">❄</text>
        </svg>`
    },
    {
        id: 'castle-princess',
        name: 'Castle Princess 👑',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Gown -->
            <path d="M200,280 L140,480 L260,480 Z" fill="#FFB6C1" stroke="#E594B3" stroke-width="3"/>
            <path d="M140,350 L100,480 L140,480 Z" fill="#FFC0CB" stroke="#E594B3" stroke-width="3"/>
            <path d="M260,350 L300,480 L260,480 Z" fill="#FFC0CB" stroke="#E594B3" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="300" rx="45" ry="50" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="65" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M135,180 Q140,80 200,70 Q260,80 265,180" fill="#8B4513" stroke="#6B3410" stroke-width="3"/>
            <ellipse cx="150" cy="160" rx="20" ry="40" fill="#8B4513"/>
            <ellipse cx="250" cy="160" rx="20" ry="40" fill="#8B4513"/>
            <!-- Crown -->
            <path d="M160,130 L170,100 L185,120 L200,90 L215,120 L230,100 L240,130" fill="none" stroke="#FFD700" stroke-width="4"/>
            <circle cx="200" cy="105" r="10" fill="#FF69B4"/>
            <circle cx="180" cy="110" r="7" fill="#87CEEB"/>
            <circle cx="220" cy="110" r="7" fill="#50C878"/>
            <!-- Face -->
            <circle cx="180" cy="175" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#E75480" stroke-width="3"/>
            <!-- Glass slipper -->
            <path d="M320,450 Q330,420 340,450 L350,480 L330,480 Z" fill="#B8E5F8" stroke="#7AB8D9" stroke-width="2"/>
        </svg>`
    },
    {
        id: 'mermaid-princess',
        name: 'Mermaid Princess 🧜‍♀️',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Tail -->
            <path d="M200,350 Q100,400 80,480 Q200,500 320,480 Q300,400 200,350" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <ellipse cx="280" cy="420" rx="25" ry="35" fill="#7FD8BE" stroke="#50C878" stroke-width="2"/>
            <ellipse cx="320" cy="450" rx="20" ry="30" fill="#7FD8BE" stroke="#50C878" stroke-width="2"/>
            <!-- Body -->
            <ellipse cx="200" cy="320" rx="40" ry="50" fill="#FFB6C1" stroke="#E594B3" stroke-width="2"/>
            <!-- Shell top -->
            <path d="M170,280 Q200,260 230,280 L220,320 L180,320 Z" fill="#9370DB" stroke="#7B68EE" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="60" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M140,180 Q130,120 200,100 Q270,120 260,180" fill="#FF6B9D" stroke="#E75480" stroke-width="3"/>
            <!-- Starfish in hair -->
            <polygon points="150,140 155,130 160,140 170,140 160,150 155,155 145,155" fill="#FFD700"/>
            <!-- Crown with seashells -->
            <path d="M165,140 L170,115 L185,130 L200,110 L215,130 L230,115 L235,140" fill="none" stroke="#50C878" stroke-width="3"/>
            <circle cx="200" cy="125" r="8" fill="#FFB6C1"/>
            <!-- Eyes -->
            <circle cx="180" cy="175" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#E75480" stroke-width="3"/>
            <!-- Bubbles -->
            <circle cx="50" cy="200" r="10" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <circle cx="350" cy="150" r="8" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
        </svg>`
    },
    {
        id: 'sunshine-fairy',
        name: 'Sunshine Fairy ☀️',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Wings -->
            <ellipse cx="120" cy="300" rx="40" ry="70" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <ellipse cx="280" cy="300" rx="40" ry="70" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <path d="M90,280 Q70,350 110,400" fill="none" stroke="#FFA500" stroke-width="2"/>
            <path d="M310,280 Q330,350 290,400" fill="none" stroke="#FFA500" stroke-width="2"/>
            <!-- Dress -->
            <path d="M200,300 L160,480 L240,480 Z" fill="#FFFACD" stroke="#F0E68C" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="290" rx="35" ry="40" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="55" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M145,180 Q150,130 200,120 Q250,130 255,180" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <circle cx="150" cy="150" rx="15" ry="25" fill="#FFD700"/>
            <circle cx="250" cy="150" rx="15" ry="25" fill="#FFD700"/>
            <!-- Sun rays hair -->
            <line x1="200" y1="110" x2="200" y2="70" stroke="#FFD700" stroke-width="4"/>
            <line x1="160" y1="120" x2="130" y2="90" stroke="#FFD700" stroke-width="4"/>
            <line x1="240" y1="120" x2="270" y2="90" stroke="#FFD700" stroke-width="4"/>
            <!-- Wand -->
            <rect x="290" y="250" width="8" height="60" fill="#DAA520" stroke="#B8860B" stroke-width="2"/>
            <polygon points="294,250 286,230 302,230" fill="#FFD700"/>
            <!-- Face -->
            <circle cx="180" cy="175" r="7" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="7" fill="#4A4A4A"/>
            <path d="M185,195 Q200,205 215,195" fill="none" stroke="#FF6B9B" stroke-width="3"/>
            <!-- Sparkles -->
            <text x="60" y="100" font-size="20">✨</text>
            <text x="320" y="120" font-size="18">✨</text>
        </svg>`
    },
    {
        id: 'moonlight-princess',
        name: 'Moonlight Princess 🌙',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Dress -->
            <path d="M200,300 L160,480 L240,480 Z" fill="#9370DB" stroke="#7B68EE" stroke-width="3"/>
            <path d="M160,380 L120,480 L160,480 Z" fill="#B39DDB" stroke="#9370DB" stroke-width="3"/>
            <path d="M240,380 L280,480 L240,480 Z" fill="#B39DDB" stroke="#9370DB" stroke-width="3"/>
            <!-- Stars on dress -->
            <polygon points="200,350 203,340 213,340 206,346 209,356" fill="#FFD700"/>
            <polygon points="180,420 183,410 193,410 186,416 189,426" fill="#FFD700"/>
            <polygon points="220,420 223,410 233,410 226,416 229,426" fill="#FFD700"/>
            <!-- Body -->
            <ellipse cx="200" cy="310" rx="40" ry="45" fill="#E6E6FA" stroke="#B39DDB" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="60" fill="#E6E6FA" stroke="#B39DDB" stroke-width="3"/>
            <!-- Hair -->
            <path d="M140,180 Q130,110 200,100 Q270,110 260,180" fill="#4B0082" stroke="#2E0854" stroke-width="3"/>
            <ellipse cx="140" cy="170" rx="25" ry="50" fill="#4B0082"/>
            <ellipse cx="260" cy="170" rx="25" ry="50" fill="#4B0082"/>
            <!-- Moon crown -->
            <path d="M170,140 Q200,110 230,140" fill="none" stroke="#FFD700" stroke-width="4"/>
            <circle cx="200" cy="125" r="12" fill="#F5F5DC"/>
            <!-- Face -->
            <circle cx="180" cy="175" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#9370DB" stroke-width="3"/>
            <!-- Stars around -->
            <polygon points="60,150 63,140 73,140 66,146 69,156" fill="#FFD700"/>
            <polygon points="330,200 333,190 343,190 336,196 339,206" fill="#FFD700"/>
            <polygon points="100,350 103,340 113,340 106,346 109,356" fill="#FFD700"/>
        </svg>`
    },

    // ANIMALS
    {
        id: 'cute-dog',
        name: 'Cute Puppy 🐕',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <ellipse cx="200" cy="350" rx="100" ry="80" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <!-- Head -->
            <circle cx="200" cy="200" r="80" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <!-- Ears -->
            <ellipse cx="130" cy="150" rx="30" ry="50" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <ellipse cx="270" cy="150" rx="30" ry="50" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <ellipse cx="130" cy="150" rx="15" ry="30" fill="#FFB6C1"/>
            <ellipse cx="270" cy="150" rx="15" ry="30" fill="#FFB6C1"/>
            <!-- Face -->
            <circle cx="170" cy="190" r="12" fill="white"/>
            <circle cx="230" cy="190" r="12" fill="white"/>
            <circle cx="172" cy="192" r="6" fill="#4A4A4A"/>
            <circle cx="232" cy="192" r="6" fill="#4A4A4A"/>
            <ellipse cx="200" cy="220" rx="12" ry="8" fill="#4A3728"/>
            <path d="M200,225 Q190,235 180,230" fill="#4A3728"/>
            <path d="M200,225 Q210,235 220,230" fill="#4A3728"/>
            <!-- Tongue -->
            <ellipse cx="200" cy="250" rx="15" ry="8" fill="#FF69B4"/>
            <!-- Tail -->
            <path d="M300,350 Q350,320 340,380" fill="none" stroke="#D2691E" stroke-width="8" stroke-linecap="round"/>
        </svg>`
    },
    {
        id: 'cute-cat',
        name: 'Kitty Cat 🐱',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <ellipse cx="200" cy="380" rx="80" ry="70" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
            <!-- Head -->
            <circle cx="200" cy="200" r="90" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
            <!-- Ears -->
            <path d="M120,150 L140,80 L180,140 Z" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
            <path d="M280,150 L260,80 L220,140 Z" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
            <path d="M130,140 L145,95 L165,135 Z" fill="#FFB6C1"/>
            <path d="M270,140 L255,95 L235,135 Z" fill="#FFB6C1"/>
            <!-- Stripes -->
            <path d="M170,210 L190,200 L190,240" fill="#FF8C00" stroke="#FF8C00" stroke-width="2"/>
            <path d="M210,200 L230,210 L210,240" fill="#FF8C00" stroke="#FF8C00" stroke-width="2"/>
            <!-- Face -->
            <ellipse cx="170" cy="190" rx="15" ry="18" fill="white"/>
            <ellipse cx="230" cy="190" rx="15" ry="18" fill="white"/>
            <ellipse cx="172" cy="192" rx="8" ry="10" fill="#4A4A4A"/>
            <ellipse cx="232" cy="192" rx="8" ry="10" fill="#4A4A4A"/>
            <ellipse cx="175" cy="185" rx="3" ry="4" fill="white"/>
            <ellipse cx="235" cy="185" rx="3" ry="4" fill="white"/>
            <!-- Nose -->
            <ellipse cx="200" cy="215" rx="10" ry="8" fill="#4A3728"/>
            <!-- Mouth -->
            <path d="M200,223 Q195,233 190,228" fill="none" stroke="#4A3728" stroke-width="2"/>
            <path d="M200,223 Q205,233 210,228" fill="none" stroke="#4A3728" stroke-width="2"/>
            <!-- Whiskers -->
            <line x1="140" y1="210" x2="100" y2="200" stroke="#4A3728" stroke-width="2"/>
            <line x1="140" y1="215" x2="100" y2="215" stroke="#4A3728" stroke-width="2"/>
            <line x1="140" y1="220" x2="100" y2="230" stroke="#4A3728" stroke-width="2"/>
            <line x1="260" y1="210" x2="300" y2="200" stroke="#4A3728" stroke-width="2"/>
            <line x1="260" y1="215" x2="300" y2="215" stroke="#4A3728" stroke-width="2"/>
            <line x1="260" y1="220" x2="300" y2="230" stroke="#4A3728" stroke-width="2"/>
            <!-- Tail -->
            <path d="M280,380 Q340,360 350,400 Q340,420 300,400" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
        </svg>`
    },
    {
        id: 'unicorn',
        name: 'Rainbow Unicorn 🦄',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <ellipse cx="200" cy="380" rx="70" ry="60" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <!-- Legs -->
            <rect x="150" y="430" width="20" height="50" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <rect x="230" y="430" width="20" height="50" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <!-- Neck -->
            <ellipse cx="200" cy="300" rx="30" ry="40" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <!-- Head -->
            <ellipse cx="200" cy="220" rx="50" ry="60" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <!-- Horn -->
            <path d="M200,160 L180,100 L220,100 Z" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <path d="M195,160 L192,130 L200,125 L208,130 L205,160" fill="#FFA500"/>
            <!-- Mane -->
            <path d="M160,200 Q140,180 150,220 Q130,250 150,280" fill="#FF69B4" stroke="#FF1493" stroke-width="2"/>
            <path d="M170,190 Q150,170 160,210" fill="#FFB6C1" stroke="#FF69B9" stroke-width="2"/>
            <path d="M150,230 Q130,260 145,290" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <!-- Ear -->
            <ellipse cx="155" cy="180" rx="15" ry="25" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <ellipse cx="245" cy="180" rx="15" ry="25" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <ellipse cx="155" cy="180" rx="8" ry="15" fill="#FFB6C1"/>
            <ellipse cx="245" cy="180" rx="8" ry="15" fill="#FFB6C1"/>
            <!-- Eye -->
            <circle cx="185" cy="210" r="10" fill="#4A4A4A"/>
            <circle cx="188" cy="207" r="4" fill="white"/>
            <!-- Smile -->
            <path d="M190,235 Q200,245 210,235" fill="none" stroke="#4A4A4A" stroke-width="2"/>
            <!-- Nostrils -->
            <ellipse cx="195" cy="225" rx="4" ry="5" fill="#E8E8E8" stroke="#CCCCCC" stroke-width="1"/>
            <ellipse cx="205" cy="225" rx="4" ry="5" fill="#E8E8E8" stroke="#CCCCCC" stroke-width="1"/>
        </svg>`
    },
    {
        id: 'cute-dragon',
        name: 'Friendly Dragon 🐉',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <ellipse cx="200" cy="380" rx="80" ry="70" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <!-- Belly -->
            <ellipse cx="200" cy="390" rx="50" ry="50" fill="#90EE90" stroke="#50C878" stroke-width="2"/>
            <!-- Wings -->
            <path d="M120,350 Q60,300 80,380" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <path d="M280,350 Q340,300 320,380" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <!-- Tail -->
            <path d="M280,400 Q350,380 360,420 Q350,450 300,430" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <path d="M360,420 L380,415 L375,425" fill="#FF6347" stroke="#FF4500" stroke-width="2"/>
            <!-- Neck -->
            <ellipse cx="200" cy="290" rx="35" ry="40" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <!-- Head -->
            <ellipse cx="200" cy="200" rx="55" ry="50" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <!-- Spikes -->
            <path d="M180,160 L170,120 L190,150 Z" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <path d="M200,155 L200,110 L205,150 Z" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <path d="M220,160 L230,120 L210,150 Z" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <!-- Eyes -->
            <ellipse cx="175" cy="190" rx="12" ry="15" fill="yellow"/>
            <ellipse cx="225" cy="190" rx="12" ry="15" fill="yellow"/>
            <circle cx="177" cy="192" r="6" fill="#4A4A4A"/>
            <circle cx="227" cy="192" r="6" fill="#4A4A4A"/>
            <!-- Nose -->
            <ellipse cx="200" cy="215" rx="8" ry="6" fill="#3DA35D"/>
            <!-- Smile -->
            <path d="M185,230 Q200,250 215,230" fill="none" stroke="#3DA35D" stroke-width="3"/>
            <!-- Smoke -->
            <circle cx="300" cy="120" r="15" fill="#E8E8E8" stroke="#CCCCCC" stroke-width="2"/>
            <circle cx="330" cy="100" r="12" fill="#E8E8E8" stroke="#CCCCCC" stroke-width="2"/>
            <circle cx="350" cy="130" r="10" fill="#E8E8E8" stroke="#CCCCCC" stroke-width="2"/>
        </svg>`
    },

    // NATURE
    {
        id: 'sunshine',
        name: 'Sunny Day ☀️',
        category: 'Nature',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sun rays -->
            <line x1="200" y1="50" x2="200" y2="10" stroke="#FFD700" stroke-width="6"/>
            <line x1="200" y1="450" x2="200" y2="490" stroke="#FFD700" stroke-width="6"/>
            <line x1="50" y1="250" x2="10" y2="250" stroke="#FFD700" stroke-width="6"/>
            <line x1="350" y1="250" x2="390" y2="250" stroke="#FFD700" stroke-width="6"/>
            <line x1="90" y1="130" x2="60" y2="100" stroke="#FFD700" stroke-width="6"/>
            <line x1="310" y1="130" x2="340" y2="100" stroke="#FFD700" stroke-width="6"/>
            <line x1="90" y1="370" x2="60" y2="400" stroke="#FFD700" stroke-width="6"/>
            <line x1="310" y1="370" x2="340" y2="400" stroke="#FFD700" stroke-width="6"/>
            <!-- Sun -->
            <circle cx="200" cy="250" r="120" fill="#FFD700" stroke="#FFA500" stroke-width="4"/>
            <!-- Face -->
            <circle cx="170" cy="240" r="15" fill="white"/>
            <circle cx="230" cy="240" r="15" fill="white"/>
            <circle cx="172" cy="242" r="8" fill="#4A4A4A"/>
            <circle cx="232" cy="242" r="8" fill="#4A4A4A"/>
            <path d="M170,280 Q200,300 230,280" fill="none" stroke="#FF8C00" stroke-width="4"/>
            <!-- Blush -->
            <ellipse cx="150" cy="270" rx="15" ry="10" fill="#FFB6C1" opacity="0.5"/>
            <ellipse cx="250" cy="270" rx="15" ry="10" fill="#FFB6C1" opacity="0.5"/>
            <!-- Clouds -->
            <ellipse cx="80" cy="80" rx="40" ry="25" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <ellipse cx="320" cy="60" rx="35" ry="20" fill="white" stroke="#E8E8E8" stroke-width="2"/>
        </svg>`
    },
    {
        id: 'rainbow',
        name: 'Rainbow 🌈',
        category: 'Nature',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sky -->
            <rect width="400" height="500" fill="#87CEEB"/>
            <!-- Rainbow arcs -->
            <path d="M50,400 Q200,100 350,400" fill="none" stroke="#FF0000" stroke-width="20" opacity="0.8"/>
            <path d="M70,400 Q200,130 330,400" fill="none" stroke="#FF7F00" stroke-width="20" opacity="0.8"/>
            <path d="M90,400 Q200,160 310,400" fill="none" stroke="#FFFF00" stroke-width="20" opacity="0.8"/>
            <path d="M110,400 Q200,190 290,400" fill="none" stroke="#00FF00" stroke-width="20" opacity="0.8"/>
            <path d="M130,400 Q200,220 270,400" fill="none" stroke="#0000FF" stroke-width="20" opacity="0.8"/>
            <path d="M150,400 Q200,250 250,400" fill="none" stroke="#4B0082" stroke-width="20" opacity="0.8"/>
            <!-- Clouds -->
            <ellipse cx="100" cy="80" rx="50" ry="30" fill="white"/>
            <ellipse cx="130" cy="70" rx="40" ry="25" fill="white"/>
            <ellipse cx="70" cy="75" rx="35" ry="22" fill="white"/>
            <ellipse cx="300" cy="100" rx="45" ry="28" fill="white"/>
            <ellipse cx="330" cy="90" rx="38" ry="23" fill="white"/>
            <ellipse cx="270" cy="95" rx="32" ry="20" fill="white"/>
            <!-- Sun -->
            <circle cx="50" cy="60" r="35" fill="#FFD700"/>
            <!-- Grass -->
            <rect x="0" y="400" width="400" height="100" fill="#90EE90"/>
            <ellipse cx="100" cy="420" rx="30" ry="15" fill="#7FD8BE"/>
            <ellipse cx="200" cy="430" rx="35" ry="18" fill="#7FD8BE"/>
            <ellipse cx="300" cy="420" rx="30" ry="15" fill="#7FD8BE"/>
        </svg>`
    },

    // VEHICLES/THINGS
    {
        id: 'rocket',
        name: 'Space Rocket 🚀',
        category: 'Vehicles',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Background space -->
            <rect width="400" height="500" fill="#1a1a2e"/>
            <!-- Stars -->
            <circle cx="50" cy="80" r="2" fill="white"/>
            <circle cx="100" cy="50" r="2" fill="white"/>
            <circle cx="300" cy="100" r="2" fill="white"/>
            <circle cx="350" cy="60" r="2" fill="white"/>
            <circle cx="150" cy="120" r="1" fill="white"/>
            <circle cx="250" cy="80" r="2" fill="white"/>
            <!-- Rocket body -->
            <ellipse cx="200" cy="300" rx="60" ry="150" fill="#E74C3C" stroke="#C0392B" stroke-width="4"/>
            <!-- Window -->
            <circle cx="200" cy="280" r="30" fill="#87CEEB" stroke="#5FB3D9" stroke-width="4"/>
            <circle cx="215" cy="275" r="8" fill="white" opacity="0.5"/>
            <!-- Fins -->
            <path d="M140,350 L100,420 L140,400 Z" fill="#C0392B" stroke="#922B21" stroke-width="3"/>
            <path d="M260,350 L300,420 L260,400Z" fill="#C0392B" stroke="#922B21" stroke-width="3"/>
            <!-- Flame -->
            <path d="M185,450 L200,520 L215,450 Z" fill="#FF6B6B"/>
            <path d="M190,460 L200,500 L210,460 Z" fill="#FFD700"/>
            <path d="M195,470 L200,490 L205,470Z" fill="#FFF8DC"/>
            <!-- Window frame -->
            <circle cx="200" cy="280" r="30" fill="none" stroke="#C0392B" stroke-width="3"/>
        </svg>`
    },
    {
        id: 'castle',
        name: 'Magic Castle 🏰',
        category: 'Vehicles',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sky -->
            <rect width="400" height="500" fill="#87CEEB"/>
            <!-- Ground -->
            <rect x="0" y="400" width="400" height="100" fill="#90EE90"/>
            <!-- Main building -->
            <rect x="100" y="200" width="200" height="200" fill="#FFB6C1" stroke="#E594B3" stroke-width="3"/>
            <!-- Towers -->
            <rect x="80" y="150" width="60" height="250" fill="#FFC0CB" stroke="#E594B3" stroke-width="3"/>
            <rect x="260" y="150" width="60" height="250" fill="#FFC0CB" stroke="#E594B3" stroke-width="3"/>
            <!-- Tower tops -->
            <polygon points="80,150 110,100 140,150" fill="#9370DB" stroke="#7B68EE" stroke-width="3"/>
            <polygon points="260,150 300,100 340,150" fill="#9370DB" stroke="#7B68EE" stroke-width="3"/>
            <polygon points="110,100 200,50 290,100 200,150" fill="#9370DB" stroke="#7B68EE" stroke-width="3"/>
            <!-- Flag -->
            <rect x="195" y="20" width="10" height="30" fill="#8B4513"/>
            <polygon points="205,20 230,35 205,50" fill="#FF6B6B"/>
            <!-- Door -->
            <rect x="170" y="300" width="60" height="100" fill="#8B4513" stroke="#6B3410" stroke-width="3"/>
            <circle cx="220" cy="350" r="5" fill="#FFD700"/>
            <!-- Windows -->
            <rect x="115" y="180" width="30" height="30" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <rect x="255" y="180" width="30" height="30" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <rect x="130" y="240" width="25" height="25" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <rect x="245" y="240" width="25" height="25" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <!-- Balcony -->
            <rect x="160" y="220" width="80" height="10" fill="#FFD700"/>
            <path d="M160,220 L165,230 L175,230 L175,220" fill="none" stroke="#FFD700" stroke-width="2"/>
            <path d="M225,220 L225,230 L235,230 L235,220" fill="none" stroke="#FFD700" stroke-width="2"/>
        </svg>`
    },

    // EDUCATIONAL
    {
        id: 'number-1',
        name: 'Number One 1️⃣',
        category: 'Numbers',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <!-- Large number -->
            <text x="200" y="350" font-size="300" font-family="Arial" fill="#E74C3C" stroke="#C0392B" stroke-width="5" text-anchor="middle">1</text>
            <!-- One apple -->
            <circle cx="200" cy="450" r="30" fill="#FF6B6B" stroke="#E74C3C" stroke-width="3"/>
            <path d="M200,420 L200,410" stroke="#8B4513" stroke-width="3"/>
            <ellipse cx="210" cy="415" rx="8" ry="4" fill="#8B4513"/>
            <!-- Stars -->
            <polygon points="50,80 55,65 70,65 58,72 62,85 48,85 52,72 40,65 55,65" fill="#FFD700"/>
            <polygon points="350,100 355,85 370,85 358,92 362,105 348,105 352,92 340,85 355,85" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'letter-A',
        name: 'Letter A 🔤',
        category: 'Alphabet',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <!-- Large letter -->
            <text x="200" y="380" font-size="350" font-family="Arial" fill="#9370DB" stroke="#7B68EE" stroke-width="5" text-anchor="middle">A</text>
            <!-- Apple -->
            <circle cx="350" cy="450" r="25" fill="#FF6B6B" stroke="#E74C3C" stroke-width="3"/>
            <!-- Stars -->
            <polygon points="50,80 55,65 70,65 58,72 62,85 48,85 52,72 40,65 55,65" fill="#FFD700"/>
            <polygon points="100,50 105,35 120,35 108,42 112,55 98,55 102,42 90,35 105,35" fill="#FF69B4"/>
        </svg>`
    },

    // MORE PRINCESSES & CHARACTERS
    {
        id: 'forest-princess',
        name: 'Forest Princess 🌸',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Dress -->
            <path d="M200,300 L160,480 L240,480 Z" fill="#90EE90" stroke="#3DA35D" stroke-width="3"/>
            <!-- Leaf decorations -->
            <ellipse cx="170" cy="350" rx="20" ry="30" fill="#7FD8BE" stroke="#50C878" stroke-width="2"/>
            <ellipse cx="230" cy="400" rx="18" ry="25" fill="#7FD8BE" stroke="#50C878" stroke-width="2"/>
            <!-- Body -->
            <ellipse cx="200" cy="310" rx="40" ry="45" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="185" r="60" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair with flowers -->
            <path d="M140,185 Q140,120 200,110 Q260,120 260,185" fill="#228B22" stroke="#006400" stroke-width="3"/>
            <circle cx="160" cy="150" r="12" fill="#FF69B4"/>
            <circle cx="240" cy="150" r="12" fill="#FFD700"/>
            <circle cx="200" cy="140" r="15" fill="#FF6B6B"/>
            <!-- Flower crown -->
            <circle cx="180" cy="135" r="15" fill="#FFB6C1" stroke="#FF69B9" stroke-width="2"/>
            <circle cx="220" cy="135" r="15" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <!-- Face -->
            <circle cx="180" cy="180" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="180" r="8" fill="#4A4A4A"/>
            <path d="M185,205 Q200,215 215,205" fill="none" stroke="#E75480" stroke-width="3"/>
            <!-- Butterflies -->
            <text x="50" y="120" font-size="24">🦋</text>
            <text x="330" y="140" font-size="20">🦋</text>
        </svg>`
    },
    {
        id: 'star-warrior',
        name: 'Star Warrior ⭐',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Cape -->
            <path d="M100,280 Q200,250 300,280 L320,480 Q200,500 80,480 Z" fill="#4169E1" stroke="#2854A8" stroke-width="3"/>
            <!-- Suit -->
            <rect x="160" y="280" width="80" height="200" fill="#2E4A62" stroke="#1A2332" stroke-width="3"/>
            <!-- Star emblem -->
            <polygon points="200,330 210,290 230,330 200,345 170,330" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="200" r="55" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Mask -->
            <path d="M150,210 L200,240 L250,210" fill="#2E4A62" stroke="#1A2332" stroke-width="3"/>
            <ellipse cx="170" cy="195" rx="15" ry="12" fill="white" stroke="#2E4A62" stroke-width="2"/>
            <ellipse cx="230" cy="195" rx="15" ry="12" fill="white" stroke="#2E4A62" stroke-width="2"/>
            <circle cx="172" cy="197" r="7" fill="#4A4A4A"/>
            <circle cx="232" cy="197" r="7" fill="#4A4A4A"/>
            <!-- Hair -->
            <path d="M145,200 Q150,150 200,140 Q250,150 255,200" fill="#2C1810" stroke="#1A120B" stroke-width="3"/>
            <!-- Hero crest -->
            <polygon points="320,300 330,285 340,285 330,290 332,300" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'garden-fairy',
        name: 'Garden Fairy 🌷',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Wings -->
            <ellipse cx="120" cy="300" rx="45" ry="75" fill="#98FB98" stroke="#3CB371" stroke-width="3"/>
            <ellipse cx="280" cy="300" rx="45" ry="75" fill="#98FB98" stroke="#3CB371" stroke-width="3"/>
            <!-- Dress -->
            <path d="M200,300 L150,480 L250,480 Z" fill="#FFB6C1" stroke="#E594B3" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="290" rx="35" ry="40" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="180" r="55" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M145,180 Q150,130 200,120 Q250,130 255,180" fill="#228B22" stroke="#006400" stroke-width="3"/>
            <!-- Flowers in hair -->
            <circle cx="170" cy="140" r="12" fill="#FF69B4"/>
            <circle cx="200" cy="135" r="10" fill="#FFD700"/>
            <circle cx="230" cy="140" r="12" fill="#87CEEB"/>
            <!-- Face -->
            <circle cx="180" cy="175" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="175" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#FF69B9" stroke-width="3"/>
            <!-- Wand -->
            <rect x="290" y="250" width="6" height="55" fill="#8B4513"/>
            <polygon points="293,250 285,230 301,230" fill="#98FB98"/>
            <!-- Flowers -->
            <text x="60" y="400" font-size="25">🌸</text>
            <text x="320" y="380" font-size="22">🌷</text>
            <text x="200" y="450" font-size="20">🌼</text>
        </svg>`
    },
    {
        id: 'rainbow-unicorn',
        name: 'Rainbow Unicorn 🌈',
        category: 'Fantasy',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Same as regular unicorn but with rainbow mane -->
            <ellipse cx="200" cy="380" rx="70" ry="60" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <rect x="150" y="430" width="20" height="50" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <rect x="230" y="430" width="20" height="50" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <ellipse cx="200" cy="300" rx="30" ry="40" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <ellipse cx="200" cy="220" rx="50" ry="60" fill="white" stroke="#E8E8E8" stroke-width="3"/>
            <path d="M200,160 L180,100 L220,100 Z" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <!-- Rainbow mane -->
            <path d="M160,200 Q140,180 150,220 Q130,250 150,280" fill="#FF0000" stroke="#FF1493" stroke-width="2"/>
            <path d="M165,210 Q145,190 155,230" fill="#FFA500" stroke="#FF8C00" stroke-width="2"/>
            <path d="M170,220 Q150,200 160,240" fill="#FFFF00" stroke="#FFD700" stroke-width="2"/>
            <ellipse cx="155" cy="180" rx="15" ry="25" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <ellipse cx="245" cy="180" rx="15" ry="25" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <circle cx="185" cy="210" r="10" fill="#4A4A4A"/>
            <circle cx="215" cy="210" r="10" fill="#4A4A4A"/>
            <path d="M190,235 Q200,245 210,235" fill="none" stroke="#4A4A4A" stroke-width="2"/>
        </svg>`
    },

    // MORE ANIMALS
    {
        id: 'elephant',
        name: 'Elephant 🐘',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <ellipse cx="200" cy="380" rx="120" ry="80" fill="#808080" stroke="#696969" stroke-width="3"/>
            <!-- Head -->
            <ellipse cx="200" cy="220" rx="90" ry="70" fill="#808080" stroke="#696969" stroke-width="3"/>
            <!-- Ears -->
            <ellipse cx="110" cy="180" rx="40" ry="50" fill="#808080" stroke="#696969" stroke-width="3"/>
            <ellipse cx="290" cy="180" rx="40" ry="50" fill="#808080" stroke="#696969" stroke-width="3"/>
            <ellipse cx="110" cy="180" rx="25" ry="35" fill="#FFB6C1"/>
            <ellipse cx="290" cy="180" rx="25" ry="35" fill="#FFB6C1"/>
            <!-- Trunk -->
            <path d="M200,270 Q180,350 200,380 Q220,350 200,270" fill="#808080" stroke="#696969" stroke-width="3"/>
            <ellipse cx="200" cy="380" rx="15" ry="8" fill="#A9A9A9"/>
            <!-- Eyes -->
            <circle cx="170" cy="210" r="12" fill="white"/>
            <circle cx="230" cy="210" r="12" fill="white"/>
            <circle cx="172" cy="212" r="6" fill="#4A4A4A"/>
            <circle cx="232" cy="212" r="6" fill="#4A4A4A"/>
            <!-- Tusks -->
            <path d="M170,270 L140,290" stroke="white" stroke-width="4" stroke-linecap="round"/>
            <path d="M230,270 L260,290" stroke="white" stroke-width="4" stroke-linecap="round"/>
            <!-- Legs -->
            <rect x="140" y="440" width="25" height="50" fill="#808080" stroke="#696969" stroke-width="2"/>
            <rect x="235" y="440" width="25" height="50" fill="#808080" stroke="#696969" stroke-width="2"/>
            <!-- Tail -->
            <path d="M320,380 Q360,360 350,400 Q340,420 310,400" fill="#808080" stroke="#696969" stroke-width="3"/>
        </svg>`
    },
    {
        id: 'butterfly',
        name: 'Butterfly 🦋',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Upper left wing -->
            <ellipse cx="150" cy="250" rx="100" ry="130" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <path d="M120,180 Q150,220 180,200" fill="none" stroke="#FF1493" stroke-width="2"/>
            <path d="M100,220 Q140,260 170,240" fill="none" stroke="#FF1493" stroke-width="2"/>
            <path d="M90,260 Q130,300 160,280" fill="none" stroke="#FF1493" stroke-width="2"/>
            <!-- Upper right wing -->
            <ellipse cx="250" cy="250" rx="100" ry="130" fill="#FF69B9" stroke="#E75480" stroke-width="3"/>
            <path d="M280,180 Q250,220 220,200" fill="none" stroke="#FF1493" stroke-width="2"/>
            <path d="M300,220 Q260,260 230,240" fill="none" stroke="#FF1493" stroke-width="2"/>
            <path d="M310,260 Q270,300 240,280" fill="none" stroke="#FF1493" stroke-width="2"/>
            <!-- Lower left wing -->
            <ellipse cx="150" cy="330" rx="70" ry="80" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <!-- Lower right wing -->
            <ellipse cx="250" cy="330" rx="70" ry="80" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="300" rx="25" ry="80" fill="#4A0080" stroke="#2E0057" stroke-width="3"/>
            <!-- Head -->
            <ellipse cx="200" cy="200" rx="25" ry="30" fill="#4A0080" stroke="#2E0057" stroke-width="2"/>
            <!-- Eyes -->
            <circle cx="193" cy="195" r="5" fill="white"/>
            <circle cx="207" cy="195" r="5" fill="white"/>
            <circle cx="194" cy="196" r="3" fill="black"/>
            <circle cx="208" cy="196" r="3" fill="black"/>
            <!-- Antennae -->
            <path d="M190,175 L180,140" stroke="#4A0080" stroke-width="2"/>
            <path d="M210,175 L220,140" stroke="#4A0080" stroke-width="2"/>
            <circle cx="180" cy="140" r="5" fill="#4A0080"/>
            <circle cx="220" cy="140" r="5" fill="#4A0080"/>
            <!-- Spots on wings -->
            <circle cx="130" cy="250" r="8" fill="white"/>
            <circle cx="160" cy="280" r="6" fill="white"/>
            <circle cx="270" cy="250" r="8" fill="white"/>
            <circle cx="240" cy="280" r="6" fill="white"/>
        </svg>`
    },
    {
        id: 'fish',
        name: 'Fishy Friend 🐟',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Water background -->
            <rect width="400" height="500" fill="#E0F7FA"/>
            <!-- Bubbles -->
            <circle cx="80" cy="100" r="10" fill="white" stroke="#87CEEB" stroke-width="2"/>
            <circle cx="320" cy="150" r="8" fill="white" stroke="#87CEEB" stroke-width="2"/>
            <circle cx="200" cy="80" r="12" fill="white" stroke="#87CEEB" stroke-width="2"/>
            <!-- Body -->
            <ellipse cx="200" cy="280" rx="80" ry="50" fill="#FF6B6B" stroke="#E75480" stroke-width="3"/>
            <!-- Stripes -->
            <path d="M150,270 Q200,260 250,270" fill="none" stroke="#FF8C00" stroke-width="4"/>
            <path d="M150,290 Q200,280 250,290" fill="none" stroke="#FF8C00" stroke-width="4"/>
            <!-- Tail -->
            <path d="M280,280 Q340,260 360,290 Q340,320 280,300" fill="#FF6B6B" stroke="#E75480" stroke-width="3"/>
            <!-- Fin on top -->
            <path d="M180,230 L200,180 L220,230" fill="#FF6B6B" stroke="#E75480" stroke-width="3"/>
            <!-- Side fins -->
            <ellipse cx="150" cy="290" rx="15" ry="25" fill="#FF8C00"/>
            <ellipse cx="250" cy="290" rx="15" ry="25" fill="#FF8C00"/>
            <!-- Eye -->
            <circle cx="140" cy="270" r="15" fill="white" stroke="#E75480" stroke-width="2"/>
            <circle cx="142" cy="272" r="8" fill="#4A4A4A"/>
            <circle cx="145" cy="268" r="3" fill="white"/>
            <!-- Mouth -->
            <ellipse cx="135" cy="285" rx="8" ry="5" fill="#E75480"/>
            <!-- Bubbles -->
            <circle cx="330" cy="270" r="6" fill="white" stroke="#87CEEB" stroke-width="1"/>
            <circle cx="350" cy="250" r="8" fill="white" stroke="#87CEEB" stroke-width="1"/>
        </svg>`
    },
    {
        id: 'bird',
        name: 'Bird Tweet 🐦',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sky -->
            <rect width="400" height="500" fill="#87CEEB"/>
            <!-- Branch -->
            <rect x="0" y="250" width="400" height="30" fill="#8B4513"/>
            <ellipse cx="50" cy="265" rx="30" ry="12" fill="#228B22"/>
            <!-- Body -->
            <ellipse cx="200" cy="240" rx="50" ry="35" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <!-- Belly -->
            <ellipse cx="200" cy="245" rx="30" ry="22" fill="#B0E0E6"/>
            <!-- Wing -->
            <path d="M150,230 Q100,250 120,280" fill="#5FB3D9" stroke="#4A90A4" stroke-width="3"/>
            <path d="M250,230 Q300,250 280,280" fill="#5FB3D9" stroke="#4A90A4" stroke-width="3"/>
            <!-- Head -->
            <circle cx="200" cy="190" r="30" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <!-- Eye -->
            <circle cx="190" cy="185" r="8" fill="white"/>
            <circle cx="192" cy="187" r="4" fill="#4A4A4A"/>
            <!-- Beak -->
            <polygon points="160,195 180,200 160,205" fill="#FFA500"/>
            <!-- Tail feathers -->
            <ellipse cx="280" cy="220" rx="25" ry="12" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <ellipse cx="300" cy="210" rx="20" ry="10" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <ellipse cx="290" cy="235" rx="22" ry="11" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <!-- Feet -->
            <path d="M180,275 L170,295 L190,295 Z" fill="#FFA500"/>
            <path d="M220,275 L210,295 L230,295 Z" fill="#FFA500"/>
            <!-- Song notes -->
            <text x="250" y="150" font-size="20">♪</text>
            <text x="280" y="180" font-size="18">♫</text>
        </svg>`
    },

    // NATURE
    {
        id: 'flower',
        name: 'Pretty Flower 🌷',
        category: 'Nature',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sky -->
            <rect width="400" height="500" fill="#87CEEB"/>
            <!-- Ground -->
            <rect x="0" y="400" width="400" height="100" fill="#90EE90"/>
            <!-- Stem -->
            <rect x="195" y="300" width="10" height="150" fill="#228B22" stroke="#006400" stroke-width="3"/>
            <!-- Leaves -->
            <ellipse cx="160" cy="350" rx="25" ry="12" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <ellipse cx="240" cy="380" rx="25" ry="12" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <ellipse cx="170" cy="400" rx="22" ry="10" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <ellipse cx="230" cy="420" rx="22" ry="10" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <!-- Petals -->
            <ellipse cx="200" cy="200" rx="40" ry="60" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <ellipse cx="150" cy="220" rx="35" ry="50" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <ellipse cx="250" cy="220" rx="35" ry="50" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <ellipse cx="130" cy="260" rx="30" ry="45" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <ellipse cx="270" cy="260" rx="30" ry="45" fill="#FF69B4" stroke="#E75480" stroke-width="3"/>
            <!-- Center -->
            <circle cx="200" cy="240" r="25" fill="#FFD700" stroke="#FFA500" stroke-width="3"/>
            <!-- Butterflies -->
            <text x="80" y="150" font-size="18">🦋</text>
            <text x="300" y="200" font-size="16">🦋</text>
            <!-- Sun -->
            <circle cx="50" cy="50" r="30" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'tree',
        name: "Magic Tree 🌳",
        category: 'Nature',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Sky -->
            <rect width="400" height="500" fill="#87CEEB"/>
            <!-- Ground -->
            <rect x="0" y="400" width="400" height="100" fill="#90EE90"/>
            <!-- Trunk -->
            <rect x="185" y="250" width="30" height="150" fill="#8B4513" stroke="#6B3410" stroke-width="3"/>
            <!-- Foliage -->
            <circle cx="200" cy="200" r="80" fill="#228B22" stroke="#006400" stroke-width="3"/>
            <circle cx="140" cy="220" r="50" fill="#32CD32" stroke="#228B22" stroke-width="2"/>
            <circle cx="260" cy="220" r="50" fill="#32CD32" stroke="#228B22" stroke-width="2"/>
            <circle cx="170" cy="160" r="45" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <circle cx="230" cy="160" r="45" fill="#228B22" stroke="#006400" stroke-width="2"/>
            <circle cx="150" cy="270" r="35" fill="#32CD32" stroke="#228B22" stroke-width="2"/>
            <circle cx="250" cy="270" r="35" fill="#32CD32" stroke="#228B22" stroke-width="2"/>
            <!-- Branches -->
            <path d="M200,200 L130,170" stroke="#8B4513" stroke-width="8" stroke-linecap="round"/>
            <path d="M200,200 L270,170" stroke="#8B4513" stroke-width="8" stroke-linecap="round"/>
            <path d="M130,170 L100,140" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
            <path d="M270,170 L300,140" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
            <!-- Fruit -->
            <circle cx="100" cy="140" r="12" fill="#FF6B6B"/>
            <circle cx="300" cy="140" r="12" fill="#FFD700"/>
            <!-- Birds -->
            <text x="300" y="100" font-size="16">🐦</text>
            <!-- Sun -->
            <circle cx="50" cy="50" r="35" fill="#FFD700"/>
        </svg>`
    },

    // EDUCATIONAL
    {
        id: 'number-2',
        name: 'Two Ducks 2️⃣',
        category: 'Numbers',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <text x="200" y="350" font-size="300" font-family="Arial" fill="#50C878" stroke="#3DA35D" stroke-width="5" text-anchor="middle">2</text>
            <!-- Two ducks -->
            <ellipse cx="150" cy="440" rx="30" ry="20" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <circle cx="145" cy="435" r="5" fill="black"/>
            <ellipse cx="250" cy="440" rx="30" ry="20" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <circle cx="245" cy="435" r="5" fill="black"/>
            <!-- Stars -->
            <polygon points="50,80 55,65 70,65 58,72 62,85 48,85 52,72 40,65 55,65" fill="#FFD700"/>
            <polygon points="350,100 355,85 370,85 358,92 362,105 348,105 352,92 340,85 355,85" fill="#FF69B4"/>
        </svg>`
    },
    {
        id: 'number-3',
        name: 'Three Bears 3️⃣',
        category: 'Numbers',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <text x="200" y="350" font-size="300" font-family="Arial" fill="#DDA0DD" stroke="#9370DB" stroke-width="5" text-anchor="middle">3</text>
            <!-- Three bears -->
            <ellipse cx="140" cy="440" rx="25" ry="18" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
            <circle cx="135" cy="435" r="4" fill="black"/>
            <ellipse cx="200" cy="450" rx="30" ry="22" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
            <circle cx="195" cy="445" r="4" fill="black"/>
            <ellipse cx="270" cy="435" rx="28" ry="20" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
            <circle cx="265" cy="430" r="4" fill="black"/>
            <!-- Stars -->
            <polygon points="60,90 65,75 80,75 68,82 72,95 58,95 62,82 50,75 65,75" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'letter-B',
        name: 'Letter B & Ball 🎾',
        category: 'Alphabet',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <text x="200" y="380" font-size="350" font-family="Arial" fill="#FF6B6B" stroke="#E75480" stroke-width="5" text-anchor="middle">B</text>
            <circle cx="330" cy="450" r="30" fill="#FF8C00" stroke="#FFA500" stroke-width="3"/>
            <path d="M310,450 Q330,430 350,450" fill="white" stroke="#CCCCCC" stroke-width="2"/>
            <!-- Stars -->
            <polygon points="70,80 75,65 90,65 78,72 82,85 68,85 72,72 60,65 75,65" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'letter-C',
        name: 'Letter C & Cat 🐱',
        category: 'Alphabet',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <text x="200" y="380" font-size="350" font-family="Arial" fill="#9370DB" stroke="#7B68EE" stroke-width="5" text-anchor="middle">C</text>
            <!-- Simple cat -->
            <circle cx="330" cy="450" r="25" fill="#FFA500" stroke="#FF8C00" stroke-width="3"/>
            <path d="M320,430 Q330,420 340,430" fill="#FFA500"/>
            <circle cx="323" cy="445" r="5" fill="white"/>
            <circle cx="337" cy="445" r="5" fill="white"/>
            <path d="M325,455 Q330,460 335,455" fill="black"/>
            <!-- Whiskers -->
            <line x1="305" y1="448" x2="285" y2="445" stroke="#4A4A4A" stroke-width="2"/>
            <line x1="305" y1="452" x2="285" y2="452" stroke="#4A4A4A" stroke-width="2"/>
            <line x1="355" y1="448" x2="375" y2="445" stroke="#4A4A4A" stroke-width="2"/>
            <line x1="355" y1="452" x2="375" y2="452" stroke="#4A4A4A" stroke-width="2"/>
            <polygon points="50,80 55,65 70,65 58,72 62,85 48,85 52,72 40,65 55,65" fill="#87CEEB"/>
        </svg>`
    },

    // VEHICLES
    {
        id: 'car',
        name: 'Race Car 🏎️',
        category: 'Vehicles',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <!-- Car body -->
            <path d="M80,320 Q80,280 120,280 L280,280 Q320,280 320,320 L320,380 L80,380 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="4"/>
            <!-- Windows -->
            <path d="M130,290 L200,290 L200,330 L130,330 Z" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <path d="M210,290 L270,290 L270,330 L210,330 Z" fill="#87CEEB" stroke="#5FB3D9" stroke-width="3"/>
            <!-- Racing stripe -->
            <rect x="195" y="280" width="10" height="100" fill="white" stroke="#E8E8E8" stroke-width="2"/>
            <!-- Number -->
            <circle cx="200" cy="330" r="15" fill="white"/>
            <text x="200" y="338" font-size="18" fill="#E74C3C" text-anchor="middle">5</text>
            <!-- Wheels -->
            <circle cx="130" cy="380" r="30" fill="#333" stroke="#222" stroke-width="4"/>
            <circle cx="130" cy="380" r="15" fill="#666"/>
            <circle cx="130" cy="380" r="5" fill="#999"/>
            <circle cx="270" cy="380" r="30" fill="#333" stroke="#222" stroke-width="4"/>
            <circle cx="270" cy="380" r="15" fill="#666"/>
            <circle cx="270" cy="380" r="5" fill="#999"/>
            <!-- Headlights -->
            <ellipse cx="90" cy="335" rx="12" ry="10" fill="#FFD700"/>
            <ellipse cx="310" cy="335" rx="12" ry="10" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'train',
        name: 'Choo Choo Train 🚂',
        category: 'Vehicles',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <!-- Track -->
            <rect x="20" y="420" width="360" height="15" fill="#8B4513"/>
            <line x1="30" y1="428" x2="370" y2="428" stroke="#6B3410" stroke-width="3"/>
            <!-- Engine -->
            <rect x="80" y="320" width="120" height="100" fill="#E74C3C" stroke="#C0392B" stroke-width="3"/>
            <!-- Chimney -->
            <rect x="110" y="280" width="30" height="40" fill="#333" stroke="#222" stroke-width="3"/>
            <!-- Smoke -->
            <circle cx="125" cy="260" r="10" fill="#CCCCCC" opacity="0.6"/>
            <circle cx="135" cy="245" r="8" fill="#CCCCCC" opacity="0.4"/>
            <!-- Cab -->
            <rect x="120" y="350" width="60" height="70" fill="#E74C3C" stroke="#C0392B" stroke-width="3"/>
            <rect x="130" y="360" width="40" height="50" fill="#87CEEB" stroke="#5FB3D9" stroke-width="2"/>
            <!-- Wheels -->
            <circle cx="120" cy="420" r="25" fill="#333" stroke="#222" stroke-width="3"/>
            <circle cx="120" cy="420" r="12" fill="#666"/>
            <circle cx="180" cy="420" r="25" fill="#333" stroke="#222" stroke-width="3"/>
            <circle cx="180" cy="420" r="12" fill="#666"/>
            <!-- Car -->
            <rect x="210" y="340" width="100" height="80" fill="#3CB371" stroke="#2E8B57" stroke-width="3"/>
            <rect x="220" y="350" width="80" height="50" fill="#90EE90" stroke="#3CB371" stroke-width="2"/>
            <circle cx="250" cy="420" r="20" fill="#333" stroke="#222" stroke-width="3"/>
            <circle cx="250" cy="420" r="10" fill="#666"/>
            <circle cx="290" cy="420" r="20" fill="#333" stroke="#222" stroke-width="3"/>
            <circle cx="290" cy="420" r="10" fill="#666"/>
            <!-- Text -->
            <text x="200" y="150" font-size="60">🚂</text>
        </svg>`
    },

    // MORE ORIGINAL CHARACTERS
    {
        id: 'ocean-princess',
        name: 'Ocean Princess 🌊',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Background -->
            <rect width="400" height="500" fill="#E0F7FA"/>
            <!-- Tail -->
            <path d="M200,350 Q100,400 80,480 Q200,500 320,480 Q300,400 200,350" fill="#50C878" stroke="#3DA35D" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="320" rx="40" ry="45" fill="#FFB6C1" stroke="#E594B3" stroke-width="2"/>
            <!-- Shell top -->
            <path d="M170,300 Q200,280 230,300 L220,320 L180,320 Z" fill="#40E0D0" stroke="#20B2AA" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="190" r="55" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M145,190 Q140,130 200,120 Q260,130 255,190" fill="#00CED1" stroke="#008B8B" stroke-width="3"/>
            <!-- Sea creatures in hair -->
            <circle cx="160" cy="150" r="8" fill="#FFD700"/>
            <circle cx="240" cy="150" r="8" fill="#87CEEB"/>
            <circle cx="200" cy="140" r="6" fill="#FF69B4"/>
            <!-- Crown -->
            <path d="M170,150 L200,120 L230,150" fill="none" stroke="#50C878" stroke-width="3"/>
            <circle cx="200" cy="135" r="8" fill="#40E0D0"/>
            <!-- Face -->
            <circle cx="180" cy="185" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="185" r="8" fill="#4A4A4A"/>
            <path d="M185,205 Q200,215 215,205" fill="none" stroke="#E75480" stroke-width="3"/>
            <!-- Fish friends -->
            <text x="50" y="400" font-size="22">🐠</text>
            <text x="330" y="380" font-size="18">🐟</text>
            <text x="360" y="430" font-size="16">🐡</text>
        </svg>`
    },
    {
        id: 'star-princess',
        name: 'Star Princess ⭐',
        category: 'Princesses',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Dress -->
            <path d="M200,300 L150,480 L250,480 Z" fill="#9370DB" stroke="#7B68EE" stroke-width="3"/>
            <!-- Sparkles on dress -->
            <polygon points="180,350 183,340 193,340 186,346 189,356" fill="#FFD700"/>
            <polygon points="220,350 223,340 233,340 226,346 229,356" fill="#FFD700"/>
            <polygon points="200,400 203,390 213,390 206,396 209,406" fill="#FFD700"/>
            <polygon points="170,430 173,420 183,420 176,426 179,436" fill="#FFD700"/>
            <polygon points="230,430 233,420 243,420 236,426 239,436" fill="#FFD700"/>
            <!-- Body -->
            <ellipse cx="200" cy="310" rx="40" ry="45" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="2"/>
            <!-- Head -->
            <circle cx="200" cy="185" r="58" fill="#FFE4C4" stroke="#E8B4B8" stroke-width="3"/>
            <!-- Hair -->
            <path d="M142,185 Q140,110 200,100 Q260,110 258,185" fill="#2C3E50" stroke="#1A252F" stroke-width="3"/>
            <!-- Stars in hair -->
            <polygon points="170,160 173,150 183,150 176,156 179,166" fill="#FFD700"/>
            <polygon points="230,160 233,150 243,150 236,156 239,166" fill="#FFD700"/>
            <polygon points="200,140 203,130 213,130 206,136 209,146" fill="#FFD700"/>
            <!-- Crown -->
            <path d="M170,140 L175,110 200,95 225,110 230,140" fill="#FFD700" stroke="#FFA500" stroke-width="4"/>
            <circle cx="200" cy="118" r="10" fill="#FF69B4"/>
            <circle cx="185" cy="120" r="7" fill="#87CEEB"/>
            <circle cx="215" cy="120" r="7" fill="#50C878"/>
            <!-- Face -->
            <circle cx="180" cy="180" r="8" fill="#4A4A4A"/>
            <circle cx="220" cy="180" r="8" fill="#4A4A4A"/>
            <path d="M185,200 Q200,210 215,200" fill="none" stroke="#E75480" stroke-width="3"/>
            <!-- Stars around -->
            <polygon points="50,150 55,135 70,135 58,142 62,155 48,155 52,142 40,135 55,135" fill="#FFD700"/>
            <polygon points="350,180 355,165 370,165 358,172 362,185 348,185 352,172 340,165 355,165" fill="#FFD700"/>
            <polygon points="80,350 85,335 100,335 88,342 92,355 78,355 82,342 70,335 85,335" fill="#FFD700"/>
            <polygon points="320,300 325,285 340,285 328,292 332,305 318,305 322,292 310,285 325,285" fill="#FFD700"/>
        </svg>`
    },
    {
        id: 'heart',
        name: 'Love Heart ❤️',
        category: 'Nature',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <!-- Big heart -->
            <path d="M200,400 Q80,300 80,220 Q80,150 200,100 Q320,150 320,220 Q320,300 200,400" fill="#FF69B4" stroke="#E75480" stroke-width="4"/>
            <!-- Shine -->
            <path d="M140,220 Q160,200 180,200" fill="none" stroke="white" stroke-width="4" opacity="0.6"/>
            <!-- Arrow through heart -->
            <path d="M150,250 L250,250" fill="none" stroke="#FFB6C1" stroke-width="3"/>
            <polygon points="250,250 235,240 235,260" fill="none" stroke="#FFB6C1" stroke-width="3"/>
            <!-- Small hearts -->
            <text x="80" y="150" font-size="30">❤️</text>
            <text x="300" y="180" font-size="24">💕</text>
            <text x="150" y="120" font-size="28">💗</text>
            <text x="280" y="280" font-size="26">💖</text>
        </svg>`
    },

    // MORE EDUCATIONAL
    {
        id: 'shape-circle',
        name: 'Circle ⭕',
        category: 'Shapes',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <circle cx="200" cy="250" r="150" fill="none" stroke="#E74C3C" stroke-width="8"/>
            <!-- Circle label -->
            <text x="200" y="450" font-size="60" fill="#E74C3C" text-anchor="middle">CIRCLE</text>
            <!-- Decorative dots along circle -->
            <circle cx="200" cy="100" r="5" fill="#E74C3C"/>
            <circle cx="200" cy="400" r="5" fill="#E74C3C"/>
            <circle cx="50" cy="250" r="5" fill="#E74C3C"/>
            <circle cx="350" cy="250" r="5" fill="#E74C3C"/>
            <!-- Stars -->
            <polygon points="50,80 55,65 70,65 58,72 62,85 48,85 52,72 40,65 55,65" fill="#FFD700"/>
            <polygon points="350,80 355,65 370,65 358,72 362,85 348,85 352,72 340,65 355,65" fill="#FF69B4"/>
        </svg>`
    },
    {
        id: 'shape-star',
        name: 'Star ⭐',
        category: 'Shapes',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="white"/>
            <polygon points="200,100 250,180 280,270 200,240 120,270 150,180 200,100" fill="none" stroke="#FFD700" stroke-width="5"/>
            <!-- Star label -->
            <text x="200" y="450" font-size="60" fill="#FFD700" text-anchor="middle">STAR</text>
            <!-- Smaller stars -->
            <polygon points="80,150 85,135 100,135 88,142 92,155 78,155 82,142 70,135 85,135" fill="#FFD700"/>
            <polygon points="320,150 325,135 340,135 328,142 332,155 318,155 322,142 310,135 325,135" fill="#87CEEB"/>
            <polygon points="200,80 203,65 213,65 206,72 209,82 191,82 194,72 187,65 203,65" fill="#FF69B4"/>
        </svg>`
    },

    // FANTASY CREATURES
    {
        id: 'teddy-bear',
        name: 'Teddy Bear 🧸',
        category: 'Animals',
        svg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Ears -->
            <circle cx="130" cy="150" r="40" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <circle cx="130" cy="150" r="25" fill="#DEB887"/>
            <circle cx="270" cy="150" r="40" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <circle cx="270" cy="150" r="25" fill="#DEB887"/>
            <!-- Head -->
            <ellipse cx="200" cy="220" rx="90" ry="75" fill="#D2691E" stroke="#8B4513" stroke-width="4"/>
            <!-- Muzzle -->
            <ellipse cx="200" cy="250" rx="50" ry="35" fill="#DEB887" stroke="#D2B48C" stroke-width="2"/>
            <!-- Eyes -->
            <circle cx="165" cy="210" r="12" fill="white" stroke="#8B4513" stroke-width="2"/>
            <circle cx="235" cy="210" r="12" fill="white" stroke="#8B4513" stroke-width="2"/>
            <circle cx="167" cy="212" r="6" fill="#4A4A4A"/>
            <circle cx="237" cy="212" r="6" fill="#4A4A4A"/>
            <circle cx="164" cy="207" r="3" fill="white"/>
            <circle cx="234" cy="207" r="3" fill="white"/>
            <!-- Nose -->
            <ellipse cx="200" cy="235" rx="12" ry="8" fill="#8B4513"/>
            <!-- Mouth -->
            <path d="M175,260 Q200,280 225,260" fill="none" stroke="#4A3728" stroke-width="3"/>
            <!-- Body -->
            <ellipse cx="200" cy="350" rx="100" ry="90" fill="#D2691E" stroke="#8B4513" stroke-width="4"/>
            <!-- Belly -->
            <ellipse cx="200" cy="360" rx="70" ry="65" fill="#DEB887" stroke="#D2B48C" stroke-width="2"/>
            <!-- Arms -->
            <ellipse cx="100" cy="350" rx="25" ry="40" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <ellipse cx="300" cy="350" rx="25" ry="40" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <!-- Legs -->
            <rect x="160" y="420" width="30" height="50" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <rect x="210" y="420" width="30" height="50" fill="#D2691E" stroke="#8B4513" stroke-width="3"/>
            <!-- Feet -->
            <ellipse cx="175" cy="470" rx="25" ry="15" fill="#DEB887" stroke="#D2B48C" stroke-width="2"/>
            <ellipse cx="225" cy="470" rx="25" ry="15" fill="#DEB887" stroke="#D2B48C" stroke-width="2"/>
            <!-- Bow tie -->
            <polygon points="200,320 185,310 215,320 200,330" fill="#FF6B9B"/>
            <polygon points="185,310 200,320 215,320 200,330 185,320" fill="#E75480"/>
        </svg>`
    }
];

// Color palette for coloring
const colorPalette = [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#9400D3', // Purple
    '#000000', // Black
    '#FFFFFF', // White
    '#FFC0CB', // Pink
    '#87CEEB', // Sky Blue
    '#FFD700', // Gold
    '#90EE90', // Light Green
    '#FFB6C1', // Light Pink
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#FF6B6B'  // Coral
];

