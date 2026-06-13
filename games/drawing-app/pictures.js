// Coloring Book Pictures — clean outline coloring pages
// Bold dark outlines on white, closed regions so the fill bucket works.
// All artwork is original. viewBox is 0 0 400 400.

const STROKE = '#3a3a3a';

// Wrap raw shapes in a coloring-book style group.
function page(shapes) {
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="400" height="400" fill="#ffffff"/>
        <g fill="#ffffff" stroke="${STROKE}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
        ${shapes}
        </g>
    </svg>`;
}

const coloringPictures = [
    // ---------------- ANIMALS ----------------
    {
        id: 'cat', name: 'Kitty Cat 🐱', category: 'Animals',
        svg: page(`
            <path d="M150 95 L132 32 L196 78 Z"/>
            <path d="M250 95 L268 32 L204 78 Z"/>
            <path d="M108 360 Q98 205 200 205 Q302 205 292 360 Z"/>
            <path d="M292 330 Q372 332 350 248 Q346 292 300 290 Z"/>
            <circle cx="200" cy="150" r="86"/>
            <path d="M158 86 L150 52 L186 80 Z"/>
            <path d="M242 86 L250 52 L214 80 Z"/>
            <circle cx="172" cy="148" r="10" fill="${STROKE}" stroke="none"/>
            <circle cx="228" cy="148" r="10" fill="${STROKE}" stroke="none"/>
            <path d="M191 168 L209 168 L200 179 Z" fill="${STROKE}" stroke="none"/>
            <path d="M200 179 Q200 194 183 194" fill="none"/>
            <path d="M200 179 Q200 194 217 194" fill="none"/>
            <path d="M118 152 L166 159" fill="none"/>
            <path d="M116 172 L166 172" fill="none"/>
            <path d="M282 152 L234 159" fill="none"/>
            <path d="M284 172 L234 172" fill="none"/>
        `)
    },
    {
        id: 'dog', name: 'Puppy Dog 🐶', category: 'Animals',
        svg: page(`
            <path d="M120 360 Q100 200 200 200 Q300 200 280 360 Z"/>
            <ellipse cx="200" cy="150" rx="92" ry="80"/>
            <path d="M118 110 Q80 120 92 190 Q110 220 140 195 Q120 150 140 120 Z"/>
            <path d="M282 110 Q320 120 308 190 Q290 220 260 195 Q280 150 260 120 Z"/>
            <circle cx="172" cy="140" r="9" fill="${STROKE}" stroke="none"/>
            <circle cx="228" cy="140" r="9" fill="${STROKE}" stroke="none"/>
            <ellipse cx="200" cy="178" rx="20" ry="15"/>
            <ellipse cx="200" cy="172" rx="11" ry="8" fill="${STROKE}" stroke="none"/>
            <path d="M200 188 L200 205" fill="none"/>
            <path d="M200 205 Q182 205 176 195" fill="none"/>
            <path d="M200 205 Q218 205 224 195" fill="none"/>
            <ellipse cx="160" cy="300" rx="26" ry="34"/>
            <ellipse cx="240" cy="300" rx="26" ry="34"/>
        `)
    },
    {
        id: 'fish', name: 'Happy Fish 🐟', category: 'Animals',
        svg: page(`
            <path d="M70 200 Q140 100 250 130 Q330 150 330 200 Q330 250 250 270 Q140 300 70 200 Z"/>
            <path d="M70 200 L20 150 L30 200 L20 250 Z"/>
            <path d="M170 135 Q200 175 240 150" fill="none"/>
            <path d="M200 262 Q220 230 250 250" fill="none"/>
            <circle cx="285" cy="185" r="16"/>
            <circle cx="289" cy="185" r="7" fill="${STROKE}" stroke="none"/>
            <path d="M250 215 Q275 235 300 215" fill="none"/>
            <circle cx="150" cy="200" r="14"/>
            <circle cx="195" cy="215" r="11"/>
            <circle cx="120" cy="170" r="9"/>
        `)
    },
    {
        id: 'butterfly', name: 'Butterfly 🦋', category: 'Animals',
        svg: page(`
            <ellipse cx="200" cy="210" rx="14" ry="80"/>
            <path d="M186 150 Q70 70 90 170 Q70 250 186 210 Z"/>
            <path d="M214 150 Q330 70 310 170 Q330 250 214 210 Z"/>
            <path d="M186 220 Q90 230 110 300 Q150 350 192 280 Z"/>
            <path d="M214 220 Q310 230 290 300 Q250 350 208 280 Z"/>
            <circle cx="135" cy="150" r="16" fill="none"/>
            <circle cx="265" cy="150" r="16" fill="none"/>
            <circle cx="140" cy="285" r="12" fill="none"/>
            <circle cx="260" cy="285" r="12" fill="none"/>
            <path d="M193 135 Q175 95 150 85" fill="none"/>
            <path d="M207 135 Q225 95 250 85" fill="none"/>
            <circle cx="150" cy="85" r="6" fill="${STROKE}" stroke="none"/>
            <circle cx="250" cy="85" r="6" fill="${STROKE}" stroke="none"/>
        `)
    },
    {
        id: 'bunny', name: 'Bunny 🐰', category: 'Animals',
        svg: page(`
            <ellipse cx="160" cy="90" rx="26" ry="78"/>
            <ellipse cx="240" cy="90" rx="26" ry="78"/>
            <ellipse cx="160" cy="95" rx="13" ry="55"/>
            <ellipse cx="240" cy="95" rx="13" ry="55"/>
            <circle cx="200" cy="220" r="92"/>
            <circle cx="176" cy="205" r="9" fill="${STROKE}" stroke="none"/>
            <circle cx="224" cy="205" r="9" fill="${STROKE}" stroke="none"/>
            <path d="M188 230 L212 230 L200 242 Z" fill="${STROKE}" stroke="none"/>
            <path d="M200 242 L200 252" fill="none"/>
            <path d="M200 252 Q186 252 182 244" fill="none"/>
            <path d="M200 252 Q214 252 218 244" fill="none"/>
            <ellipse cx="150" cy="320" rx="40" ry="26"/>
            <ellipse cx="250" cy="320" rx="40" ry="26"/>
        `)
    },
    {
        id: 'owl', name: 'Owl 🦉', category: 'Animals',
        svg: page(`
            <path d="M200 70 Q300 70 300 200 Q300 340 200 340 Q100 340 100 200 Q100 70 200 70 Z"/>
            <path d="M120 95 L150 150" fill="none"/>
            <path d="M280 95 L250 150" fill="none"/>
            <circle cx="160" cy="170" r="44"/>
            <circle cx="240" cy="170" r="44"/>
            <circle cx="160" cy="170" r="16" fill="${STROKE}" stroke="none"/>
            <circle cx="240" cy="170" r="16" fill="${STROKE}" stroke="none"/>
            <path d="M188 195 L212 195 L200 215 Z" fill="${STROKE}" stroke="none"/>
            <path d="M120 235 Q160 270 200 245 Q240 270 280 235" fill="none"/>
            <path d="M125 250 Q165 285 200 262 Q235 285 275 250" fill="none"/>
            <path d="M170 338 L170 360" fill="none"/>
            <path d="M230 338 L230 360" fill="none"/>
        `)
    },

    // ---------------- NATURE ----------------
    {
        id: 'flower', name: 'Flower 🌸', category: 'Nature',
        svg: page(`
            <path d="M200 360 L200 230" fill="none"/>
            <path d="M200 300 Q140 280 120 320 Q170 330 200 300 Z"/>
            <path d="M200 270 Q260 250 280 290 Q230 300 200 270 Z"/>
            <ellipse cx="200" cy="120" rx="34" ry="52"/>
            <ellipse cx="280" cy="160" rx="52" ry="34"/>
            <ellipse cx="248" cy="240" rx="34" ry="52"/>
            <ellipse cx="152" cy="240" rx="34" ry="52"/>
            <ellipse cx="120" cy="160" rx="52" ry="34"/>
            <circle cx="200" cy="185" r="42"/>
            <circle cx="186" cy="178" r="6" fill="${STROKE}" stroke="none"/>
            <circle cx="214" cy="178" r="6" fill="${STROKE}" stroke="none"/>
            <path d="M182 196 Q200 212 218 196" fill="none"/>
        `)
    },
    {
        id: 'sun', name: 'Sunny Sun ☀️', category: 'Nature',
        svg: page(`
            <path d="M200 30 L200 80" fill="none"/>
            <path d="M200 320 L200 370" fill="none"/>
            <path d="M30 200 L80 200" fill="none"/>
            <path d="M320 200 L370 200" fill="none"/>
            <path d="M80 80 L115 115" fill="none"/>
            <path d="M320 80 L285 115" fill="none"/>
            <path d="M80 320 L115 285" fill="none"/>
            <path d="M320 320 L285 285" fill="none"/>
            <circle cx="200" cy="200" r="110"/>
            <circle cx="170" cy="185" r="11" fill="${STROKE}" stroke="none"/>
            <circle cx="230" cy="185" r="11" fill="${STROKE}" stroke="none"/>
            <path d="M160 230 Q200 270 240 230" fill="none"/>
            <circle cx="150" cy="220" r="14" fill="none"/>
            <circle cx="250" cy="220" r="14" fill="none"/>
        `)
    },
    {
        id: 'tree', name: 'Big Tree 🌳', category: 'Nature',
        svg: page(`
            <path d="M180 360 L180 250 L220 250 L220 360 Z"/>
            <path d="M200 70 Q120 70 110 150 Q60 170 80 230 Q90 280 160 270 Q200 300 240 270 Q310 280 320 230 Q340 170 290 150 Q280 70 200 70 Z"/>
            <circle cx="170" cy="160" r="8" fill="none"/>
            <circle cx="240" cy="150" r="8" fill="none"/>
            <circle cx="210" cy="220" r="8" fill="none"/>
            <path d="M180 300 Q200 290 220 300" fill="none"/>
        `)
    },
    {
        id: 'rainbow', name: 'Rainbow 🌈', category: 'Nature',
        svg: page(`
            <path d="M60 320 Q60 110 200 110 Q340 110 340 320" fill="none"/>
            <path d="M100 320 Q100 150 200 150 Q300 150 300 320" fill="none"/>
            <path d="M140 320 Q140 190 200 190 Q260 190 260 320" fill="none"/>
            <path d="M70 320 Q70 270 120 270 Q150 270 150 250 Q160 290 110 295 Q70 300 70 320 Z"/>
            <path d="M330 320 Q330 270 280 270 Q250 270 250 250 Q240 290 290 295 Q330 300 330 320 Z"/>
        `)
    },

    // ---------------- THINGS ----------------
    {
        id: 'house', name: 'Cozy House 🏠', category: 'Things',
        svg: page(`
            <path d="M110 200 L110 350 L290 350 L290 200 Z"/>
            <path d="M80 200 L200 90 L320 200 Z"/>
            <path d="M250 130 L250 90 L280 90 L280 160 Z"/>
            <path d="M175 280 L175 350 L225 350 L225 280 Z"/>
            <circle cx="215" cy="315" r="5" fill="${STROKE}" stroke="none"/>
            <path d="M130 230 L165 230 L165 265 L130 265 Z"/>
            <path d="M147 230 L147 265 M130 247 L165 247" fill="none"/>
            <path d="M235 230 L270 230 L270 265 L235 265 Z"/>
            <path d="M252 230 L252 265 M235 247 L270 247" fill="none"/>
        `)
    },
    {
        id: 'car', name: 'Race Car 🚗', category: 'Things',
        svg: page(`
            <path d="M50 280 L70 220 L130 180 L270 180 L320 220 L350 230 L350 280 Z"/>
            <path d="M140 185 L150 140 L240 140 L260 185 Z"/>
            <path d="M200 140 L200 185" fill="none"/>
            <circle cx="120" cy="285" r="38"/>
            <circle cx="280" cy="285" r="38"/>
            <circle cx="120" cy="285" r="15"/>
            <circle cx="280" cy="285" r="15"/>
            <circle cx="335" cy="240" r="9" fill="none"/>
        `)
    },
    {
        id: 'rocket', name: 'Rocket 🚀', category: 'Things',
        svg: page(`
            <path d="M200 40 Q260 110 260 240 L140 240 Q140 110 200 40 Z"/>
            <circle cx="200" cy="140" r="30"/>
            <path d="M140 200 L90 270 L140 250 Z"/>
            <path d="M260 200 L310 270 L260 250 Z"/>
            <path d="M160 240 L160 290 L240 290 L240 240 Z"/>
            <path d="M170 290 Q175 350 200 370 Q225 350 230 290" fill="none"/>
            <path d="M185 290 Q188 330 200 345 Q212 330 215 290" fill="none"/>
        `)
    },
    {
        id: 'boat', name: 'Sailboat ⛵', category: 'Things',
        svg: page(`
            <path d="M90 280 L310 280 L280 340 L120 340 Z"/>
            <path d="M200 70 L200 270" fill="none"/>
            <path d="M200 90 L300 250 L200 250 Z"/>
            <path d="M190 90 L100 250 L190 250 Z"/>
            <path d="M40 300 Q60 285 80 300 T120 300" fill="none"/>
            <path d="M280 320 Q300 305 320 320 T360 320" fill="none"/>
        `)
    },

    // ---------------- YUMMY ----------------
    {
        id: 'icecream', name: 'Ice Cream 🍦', category: 'Yummy',
        svg: page(`
            <path d="M150 210 L200 360 L250 210 Z"/>
            <path d="M170 240 L185 270 M210 240 L225 270 M195 290 L208 318" fill="none"/>
            <circle cx="200" cy="170" r="55"/>
            <circle cx="160" cy="150" r="42"/>
            <circle cx="240" cy="150" r="42"/>
            <circle cx="200" cy="120" r="46"/>
            <circle cx="200" cy="80" r="10"/>
        `)
    },
    {
        id: 'cupcake', name: 'Cupcake 🧁', category: 'Yummy',
        svg: page(`
            <path d="M120 220 L140 350 L260 350 L280 220 Z"/>
            <path d="M150 220 L160 350 M200 220 L200 350 M250 220 L240 350" fill="none"/>
            <path d="M110 220 Q110 150 160 150 Q170 100 220 120 Q270 110 270 165 Q300 175 285 215 Q200 235 110 220 Z"/>
            <circle cx="200" cy="95" r="16"/>
            <path d="M200 111 L200 130" fill="none"/>
            <circle cx="160" cy="190" r="5" fill="${STROKE}" stroke="none"/>
            <circle cx="225" cy="180" r="5" fill="${STROKE}" stroke="none"/>
            <circle cx="195" cy="205" r="5" fill="${STROKE}" stroke="none"/>
        `)
    },

    // ---------------- FUN ----------------
    {
        id: 'star', name: 'Happy Star ⭐', category: 'Fun',
        svg: page(`
            <path d="M200 50 L243 160 L360 168 L270 240 L300 355 L200 290 L100 355 L130 240 L40 168 L157 160 Z"/>
            <circle cx="175" cy="195" r="9" fill="${STROKE}" stroke="none"/>
            <circle cx="225" cy="195" r="9" fill="${STROKE}" stroke="none"/>
            <path d="M172 225 Q200 250 228 225" fill="none"/>
            <circle cx="150" cy="215" r="10" fill="none"/>
            <circle cx="250" cy="215" r="10" fill="none"/>
        `)
    },
    {
        id: 'balloon', name: 'Balloon 🎈', category: 'Fun',
        svg: page(`
            <path d="M200 70 Q290 70 290 180 Q290 270 200 290 Q110 270 110 180 Q110 70 200 70 Z"/>
            <path d="M188 288 L200 305 L212 288 Z"/>
            <path d="M200 305 Q230 340 190 360 Q160 375 200 395" fill="none"/>
            <circle cx="170" cy="150" r="11" fill="${STROKE}" stroke="none"/>
            <circle cx="230" cy="150" r="11" fill="${STROKE}" stroke="none"/>
            <path d="M168 195 Q200 225 232 195" fill="none"/>
            <path d="M150 110 Q170 95 195 105" fill="none"/>
        `)
    }
];

// Color palette for coloring
const colorPalette = [
    '#FF3B30', // Red
    '#FF9500', // Orange
    '#FFCC00', // Yellow
    '#34C759', // Green
    '#007AFF', // Blue
    '#AF52DE', // Purple
    '#FF2D92', // Pink
    '#8B4513', // Brown
    '#00C7BE', // Teal
    '#5856D6', // Indigo
    '#FFD60A', // Gold
    '#A2845E', // Tan
    '#FF6B9D', // Rose
    '#000000', // Black
    '#8E8E93', // Gray
    '#FFFFFF'  // White
];
