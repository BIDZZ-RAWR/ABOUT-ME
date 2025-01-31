// Preload images
const imageSources = [
    'bidzz.png',
    'ml.png',
    'pb.png',
    'codm.png',
    'pbs.png'
];

let loadedImages = 0;
const totalImages = imageSources.length;

function preloadImages(callback) {
    if (totalImages === 0) {
        callback();
        return;
    }

    imageSources.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages++;
            updateLoadingProgress();
            if (loadedImages === totalImages) {
                callback();
            }
        };
        img.onerror = () => {
            loadedImages++;
            updateLoadingProgress();
            if (loadedImages === totalImages) {
                callback();
            }
        };
    });
}

function updateLoadingProgress() {
    const progress = (loadedImages / totalImages) * 100;
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Loading... ${Math.floor(progress)}%`;
}

// Initialize website after loading
document.addEventListener('DOMContentLoaded', () => {
    preloadImages(() => {
        setTimeout(() => {
            document.querySelector('.preloader').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.preloader').style.display = 'none';
                document.body.classList.add('loaded');
                initializeWebsite();
            }, 500);
        }, 1000);
    });
});

// Initialize all website components
function initializeWebsite() {
    initParticles();
    initCursor();
    initSkillsAnimation();
    initAudio();
    initGlitchEffect();
}

// Initialize particles background
function initParticles() {
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
                value: '#64ffda'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#64ffda',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce'
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
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
}

// Custom cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const tick = () => {
        posX += (mouseX - posX) * 0.1;
        posY += (mouseY - posY) * 0.1;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        follower.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

        requestAnimationFrame(tick);
    };
    tick();
}

// Skills animation
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-progress');
                progressBar.style.width = targetWidth;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Audio control
function initAudio() {
    const music = document.getElementById('bgMusic');
    const toggleButton = document.getElementById('toggleMusic');
    let isPlaying = false;

    toggleButton.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            music.play();
            toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Glitch effect for title
function initGlitchEffect() {
    const title = document.querySelector('.cyber-glitch');
    let glitchInterval;

    const startGlitch = () => {
        let iteration = 0;
        clearInterval(glitchInterval);

        glitchInterval = setInterval(() => {
            title.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        }, 50);
    };

    const stopGlitch = () => {
        clearInterval(glitchInterval);
        title.style.transform = 'none';
    };

    title.addEventListener('mouseenter', startGlitch);
    title.addEventListener('mouseleave', stopGlitch);
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'Come Back to Bidzz Official';
    } else {
        document.title = 'Bidzz Official - Personal Website';
    }
});