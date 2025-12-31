/**
 * ========================================
 *   PHYSICS ENGINE - Kids Game Portal
 *   Shared physics utilities for all games
 *   Target: iPad Safari, 60fps
 * ========================================
 */

/**
 * EASING FUNCTIONS
 * Reusable easing functions for natural animations
 */
const Easing = {
    linear: t => t,

    easeOutQuad: t => t * (2 - t),

    easeOutCubic: t => (--t) * t * t + 1,

    easeOutQuart: t => 1 - (--t) * t * t * t,

    easeOutBounce: x => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },

    spring: (t, stiffness = 0.3, damping = 0.7) => {
        const decay = Math.exp(-damping * t);
        const oscillation = Math.cos(stiffness * t * Math.PI * 2);
        return 1 - decay * oscillation;
    }
};

/**
 * PHYSICS OBJECT CLASS
 * For objects with position, velocity, and physics simulation
 */
class PhysicsObject {
    constructor(x, y, mass = 1) {
        this.x = x;
        this.y = y;
        this.vx = 0; // Velocity X
        this.vy = 0; // Velocity Y
        this.mass = mass;
        this.rotation = 0;
        this.angularVelocity = 0;
        this.scale = 1;
    }

    applyForce(fx, fy) {
        this.vx += fx / this.mass;
        this.vy += fy / this.mass;
    }

    update(gravity = 0, friction = 0.99) {
        // Apply gravity
        this.vy += gravity;

        // Apply friction
        this.vx *= friction;
        this.vy *= friction;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Update rotation
        this.rotation += this.angularVelocity;
        this.angularVelocity *= 0.98; // Angular friction
    }

    isMoving() {
        return Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1;
    }
}

/**
 * PARTICLE SYSTEM CLASS
 * For creating and managing particle effects
 */
class ParticleSystem {
    constructor(container, maxParticles = 100) {
        this.container = container;
        this.particles = [];
        this.maxParticles = maxParticles;
        this.isRunning = false;
    }

    createParticle(x, y, options = {}) {
        if (this.particles.length >= this.maxParticles) {
            return; // Don't exceed max particles
        }

        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            will-change: transform, opacity;
        `;

        // Particle properties
        const config = {
            emoji: options.emoji || '✨',
            size: options.size || 30,
            vx: (Math.random() - 0.5) * (options.velocity || 10),
            vy: (Math.random() - 0.5) * (options.velocity || 10),
            gravity: options.gravity || 0.2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 20,
            lifetime: options.lifetime || 1500,
            scale: options.scale || 1,
            element: particle
        };

        // Set emoji and size
        particle.textContent = config.emoji;
        particle.style.fontSize = `${config.size}px`;
        particle.style.transform = `scale(${config.scale})`;

        this.container.appendChild(particle);
        this.particles.push(config);

        return config;
    }

    createExplosion(x, y, count = 12, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = options.speed || 8;

            this.createParticle(x, y, {
                ...options,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            });
        }

        if (!this.isRunning) {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    animate() {
        if (!this.isRunning) return;

        const now = Date.now();

        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Apply physics
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            // Update element
            const opacity = 1 - ((now - p.createdAt) / p.lifetime);
            if (opacity <= 0) {
                // Remove dead particle
                p.element.remove();
                this.particles.splice(i, 1);
                continue;
            }

            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;
            p.element.style.transform = `rotate(${p.rotation}deg) scale(${p.scale * opacity})`;
            p.element.style.opacity = opacity;
        }

        // Stop if no particles
        if (this.particles.length === 0) {
            this.isRunning = false;
            return;
        }

        requestAnimationFrame(() => this.animate());
    }

    clear() {
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
    }
}

/**
 * SPRING ANIMATION
 * For smooth spring animations (buttons, keys, etc.)
 */
function springAnimation(element, options = {}) {
    const config = {
        stiffness: options.stiffness || 0.1,
        damping: options.damping || 0.8,
        mass: options.mass || 1,
        targetValue: options.target || 1,
        currentValue: options.initial || 0,
        property: options.property || 'transform',
        duration: options.duration || 300,
        onUpdate: options.onUpdate || null
    };

    let position = config.currentValue;
    let velocity = 0;
    const target = config.targetValue;
    const stiffness = config.stiffness;
    const damping = config.damping;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;

        if (elapsed >= config.duration) {
            position = target;
            if (config.onUpdate) {
                config.onUpdate(position);
            }
            return;
        }

        // Spring physics
        const force = (target - position) * stiffness;
        const acceleration = force / config.mass;
        velocity += acceleration;
        velocity *= damping;
        position += velocity;

        if (config.onUpdate) {
            config.onUpdate(position);
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * VELOCITY SMOOTHER
 * For smooth input values (brush velocity, etc.)
 */
class VelocitySmoother {
    constructor(smoothing = 0.7) {
        this.smoothing = smoothing;
        this.lastValue = 0;
        this.lastTime = Date.now();
        this.velocity = 0;
    }

    update(value) {
        const now = Date.now();
        const deltaTime = Math.max(now - this.lastTime, 1); // Prevent division by zero

        const deltaValue = value - this.lastValue;
        const instantVelocity = deltaValue / deltaTime;

        // Exponential smoothing
        this.velocity = this.velocity * this.smoothing + instantVelocity * (1 - this.smoothing);

        this.lastValue = value;
        this.lastTime = now;

        return this.velocity;
    }

    getVelocity() {
        return this.velocity;
    }
}

/**
 * UTILITIES
 */
const Physics = {
    Easing,
    PhysicsObject,
    ParticleSystem,
    springAnimation,
    VelocitySmoother,

    // Lerp (linear interpolation)
    lerp: (start, end, t) => start + (end - start) * t,

    // Clamp value
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),

    // Random range
    randomRange: (min, max) => Math.random() * (max - min) + min,

    // Distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
};

// Export for use in games
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}
