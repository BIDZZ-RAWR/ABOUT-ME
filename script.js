// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loader = document.querySelector('.loader');
    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const backToTop = document.getElementById('backToTop');
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    const typingElement = document.querySelector('.typing');

    // Typing Animation Configuration
    const words = [
        "Kang Turu",
        "Reverse Engineer",
        "Ethical Hacker",
        "Web Designer",
        "Software Developer"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    // Initialize Audio
    function initializeAudio() {
        bgMusic.volume = 0.5;
        try {
            bgMusic.play().then(() => {
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }).catch((error) => {
                console.log("Autoplay prevented:", error);
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            });
        } catch (error) {
            console.log("Audio initialization error:", error);
        }
    }

    // Audio Control
    let isMusicPlaying = true;
    soundToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play();
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // Initialize audio on first user interaction
    document.addEventListener('click', function initClickHandler() {
        initializeAudio();
        document.removeEventListener('click', initClickHandler);
    }, { once: true });

    // Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Typing Animation Function
    function typeAnimation() {
        const currentWord = words[wordIndex];
        const shouldDelete = isDeleting;
        
        // Set typing speed
        let typeSpeed = isDeleting ? 50 : 100;

        if (shouldDelete) {
            // Remove characters
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add characters
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Word complete
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at end of word
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            // Pause before starting new word
            typeSpeed = 500;
        }

        // Add random variation to typing speed
        typeSpeed += Math.random() * 50 - 25;

        // Schedule next animation frame
        setTimeout(typeAnimation, typeSpeed);
    }

    // Initialize typing animation
    setTimeout(typeAnimation, 1000);

    // Scroll Functions
    function handleScroll() {
        // Header shadow
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Update active nav link
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            handleScroll();
        });
    });

    // Navigation Toggle
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close navigation when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Back to Top
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile nav
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Particles.js Configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#3498db'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#3498db',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isMusicPlaying) bgMusic.pause();
        } else {
            if (isMusicPlaying) bgMusic.play();
        }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
        }
    });

    // Error handling
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
        return false;
    };

    // Performance optimization
    window.requestAnimationFrame = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed', err);
            });
    });
}