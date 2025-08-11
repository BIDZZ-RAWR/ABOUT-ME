class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.zIndex = "-1";
        this.canvas.style.pointerEvents = "none";
        document.body.appendChild(this.canvas);
        this.mouse = { x: undefined, y: undefined, radius: 150 };
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        window.addEventListener("resize", () => this.resizeCanvas());
        document.addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(150, (this.canvas.width * this.canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 2 + 1;
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: radius,
                baseRadius: radius,
                speedX: (Math.random() - 0.5) * 0.7,
                speedY: (Math.random() - 0.5) * 0.7,
                opacity: Math.random() * 0.5 + 0.5,
                baseOpacity: Math.random() * 0.5 + 0.5,
                color: `rgba(74, 144, 226, ${Math.random() * 0.5 + 0.5})`,
                glowIntensity: Math.random(),
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x -= Math.cos(angle) * force * 2;
                    particle.y -= Math.sin(angle) * force * 2;
                }
            }

            const glow = 0.5 * Math.sin(Date.now() * 0.003 + particle.glowIntensity * 10) + 0.5;
            particle.radius = particle.baseRadius * (1 + 0.3 * glow);
            particle.opacity = particle.baseOpacity * (0.8 + 0.2 * glow);

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            const gradient = this.ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.radius * 2
            );
            gradient.addColorStop(0, `rgba(74, 144, 226, ${particle.opacity})`);
            gradient.addColorStop(1, "rgba(74, 144, 226, 0)");
            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = "rgba(74, 144, 226, 0.5)";
            this.ctx.fill();
            this.ctx.restore();
        });
        this.drawConnections();
    }

    drawConnections() {
        this.particles.forEach((particleA, index) => {
            this.particles.slice(index + 1).forEach((particleB) => {
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(74, 144, 226, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particleA.x, particleA.y);
                    this.ctx.lineTo(particleB.x, particleB.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

function copyToClipboard(text) {
    const cleanText = text.replace(/-/g, "");
    navigator.clipboard.writeText(cleanText).then(() => {
        showToast("Number copied successfully!", "success");
    }).catch((err) => {
        showToast("Failed to copy number", "error");
        console.error("Failed to copy:", err);
    });
}

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = toast.querySelector("i");
    const span = toast.querySelector("span");
    span.textContent = message;
    toast.className = `toast ${type}`;
    icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-times-circle";
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    new ParticleSystem();

    // Theme toggle
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");

    // Load saved theme from localStorage, default to dark if none exists
    const savedTheme = localStorage.getItem("theme") || "dark";
    html.setAttribute("data-theme", savedTheme);
    themeToggle.innerHTML = `<i class="fas fa-${savedTheme === "light" ? "moon" : "sun"}"></i>`;

    themeToggle.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.innerHTML = `<i class="fas fa-${newTheme === "light" ? "moon" : "sun"}"></i>`;
        showToast(`Switched to ${newTheme} theme`, "success");
    });

    // Music control
    const audio = document.getElementById("background-music");
    const toggleButton = document.getElementById("music-toggle");

    audio.play().catch((error) => {
        console.log("Autoplay prevented:", error);
        showToast("Click 'Toggle Music' to play audio", "error");
    });

    toggleButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggleButton.innerHTML = '<i class="fas fa-volume-up"></i> Pause Music';
                showToast("Music playing", "success");
            }).catch((error) => {
                showToast("Failed to play audio", "error");
                console.error("Audio play error:", error);
            });
        } else {
            audio.pause();
            toggleButton.innerHTML = '<i class="fas fa-volume-mute"></i> Play Music';
            showToast("Music paused", "success");
        }
    });

    // Copy button functionality
    document.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const number = this.getAttribute("data-number");
            copyToClipboard(number);
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 200);
        });
    });

    // Payment method hover effects
    document.querySelectorAll(".payment-method").forEach((method) => {
        method.addEventListener("mouseenter", () => {
            method.style.transform = "translateY(-5px)";
        });
        method.addEventListener("mouseleave", () => {
            method.style.transform = "translateY(0)";
        });
    });
});

window.onerror = function (msg, url, line, col, error) {
    console.error(`Error: ${msg}\nURL: ${url}\nLine: ${line}\nColumn: ${col}\nError object: ${JSON.stringify(error)}`);
    return false;
};

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        return setTimeout(callback, 1000 / 60);
    };