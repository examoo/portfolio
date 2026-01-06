// ==================== PORTFOLIO SCRIPTS ====================

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollObserver();
    initActiveNav();
    initParticles();
});

// ==================== HEADER SCROLL EFFECT ====================
function initHeader() {
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

// ==================== MOBILE NAVIGATION ====================
function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = nav.querySelectorAll('.nav-link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// ==================== SCROLL REVEAL ANIMATION ====================
function initScrollObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// ==================== ACTIVE NAV HIGHLIGHTING ====================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ==================== 3D CODE PARTICLE ANIMATION ====================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    // Code symbols for particles
    const codeSymbols = [
        '{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']',
        '&&', '||', '=>', '++', '--', '!=', '==', '<?', '?>',
        '#', '$', '@', '*', '::', '->', '...',
        'if', 'fn', 'def', 'let', 'var', 'int', 'API', 'AI'
    ];

    // Particle configuration
    const config = {
        particleCount: 50,
        connectionDistance: 120,
        mouseRadius: 120,
        baseSpeed: 0.4,
        colors: [
            'rgba(99, 102, 241, 0.7)',   // Indigo
            'rgba(139, 92, 246, 0.7)',   // Purple
            'rgba(59, 130, 246, 0.6)',   // Blue
            'rgba(6, 182, 212, 0.6)',    // Cyan
            'rgba(168, 85, 247, 0.6)',   // Violet
        ]
    };

    // Resize canvas
    function resizeCanvas() {
        const hero = document.querySelector('.hero');
        if (hero) {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
    }

    // Code Particle class
    class CodeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 800;
            this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
            this.fontSize = 12 + Math.random() * 14;
            this.baseFontSize = this.fontSize;
            this.speedX = (Math.random() - 0.5) * config.baseSpeed;
            this.speedY = (Math.random() - 0.5) * config.baseSpeed;
            this.speedZ = (Math.random() - 0.5) * 0.3;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.opacity = 0.2 + Math.random() * 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;
            this.rotation += this.rotationSpeed;

            // 3D depth effect
            const perspective = 800;
            const scale = perspective / (perspective + this.z);
            this.fontSize = this.baseFontSize * scale;

            // Wrap around edges
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
            if (this.z < -400) this.z = 400;
            if (this.z > 400) this.z = -400;

            // Mouse interaction - gentle attraction/repulsion
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseRadius) {
                const force = (config.mouseRadius - distance) / config.mouseRadius;
                this.x -= dx * force * 0.03;
                this.y -= dy * force * 0.03;
            }
        }

        draw() {
            const perspective = 800;
            const scale = perspective / (perspective + this.z);
            const adjustedOpacity = this.opacity * scale;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color.replace(/[\d.]+\)$/, '0.8)');

            // Draw symbol
            ctx.font = `${Math.round(this.fontSize)}px 'SF Mono', 'Fira Code', 'Consolas', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${adjustedOpacity})`);
            ctx.fillText(this.symbol, 0, 0);

            ctx.restore();
        }
    }

    // Create particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new CodeParticle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    const opacity = (1 - distance / config.connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reset shadow for connections
        ctx.shadowBlur = 0;
        drawConnections();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Mouse move handler
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0 });

    observer.observe(canvas.parentElement);
}

// ==================== UTILITY FUNCTIONS ====================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
