
// Wait for DOM Content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.header');
    const navLinks = document.querySelector('.nav-links');
    const musicToggle = document.querySelector('.music-toggle');
    const bgMusic = document.getElementById('bgMusic');
    const themeToggle = document.querySelector('.theme-toggle');
    let isPlaying = false;

    // Initialize Typed.js
    const typed = new Typed('.typed', {
        strings: [
            'Game Hacker',
            'Software Developer',
            'Cheat Creator',
            'Reverse Engineer',
            'Book Reader'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 1500,
        startDelay: 1000
    });

    // Initialize Particles.js
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
                value: '#ff0000'
            },
            shape: {
                type: 'triangle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ff0000',
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
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
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
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
        // Header Background
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Reveal Elements on Scroll
        document.querySelectorAll('.reveal').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile navigation if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Background Music Control
    musicToggle.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            isPlaying = true;
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            isPlaying = false;
        }
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Glitch Effect
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        setInterval(() => {
            text.classList.add('active');
            setTimeout(() => {
                text.classList.remove('active');
            }, 200);
        }, 3000);
    });

    // Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }

    // Image Lazy Loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Prevent FOUC (Flash of Unstyled Content)
    document.documentElement.classList.remove('no-js');

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            bgMusic.pause();
        } else if (!document.hidden && isPlaying) {
            bgMusic.play();
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