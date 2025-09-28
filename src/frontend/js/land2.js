// frontend/js/landing.js
class LandingPage {
    constructor() {
        this.currentTheme = 'dark-mode';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
        this.loadThemePreference();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Navigation links smooth scroll
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Start Learning button - LINK TO DASHBOARD
        const startLearningBtn = document.getElementById('start-learning');
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        // Learn More button - Watch Demo
        const learnMoreBtn = document.getElementById('learn-more');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.showDemoModal();
            });
        }

        // Join Now button - LINK TO DASHBOARD
        const joinNowBtn = document.getElementById('join-now');
        if (joinNowBtn) {
            joinNowBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        // CTA button in navigation - LINK TO DASHBOARD
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (body.classList.contains('dark-mode')) {
            // Switch to light mode
            body.classList.replace('dark-mode', 'light-mode');
            this.currentTheme = 'light-mode';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            this.updateNavbarForTheme('light-mode');
        } else {
            // Switch to dark mode
            body.classList.replace('light-mode', 'dark-mode');
            this.currentTheme = 'dark-mode';
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            this.updateNavbarForTheme('dark-mode');
        }
        
        // Save preference to localStorage
        localStorage.setItem('finsecure-theme', this.currentTheme);
    }

    updateNavbarForTheme(theme) {
        const navbar = document.querySelector('.navbar');
        if (theme === 'light-mode') {
            navbar.style.background = window.scrollY > 100 ? 'rgba(248, 250, 252, 0.98)' : 'rgba(248, 250, 252, 0.95)';
            navbar.style.boxShadow = window.scrollY > 100 ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none';
        } else {
            navbar.style.background = window.scrollY > 100 ? 'rgba(15, 20, 25, 0.98)' : 'rgba(15, 20, 25, 0.95)';
            navbar.style.boxShadow = window.scrollY > 100 ? '0 2px 20px rgba(0, 0, 0, 0.3)' : 'none';
        }
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('finsecure-theme') || 'dark-mode';
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (savedTheme === 'light-mode') {
            body.classList.replace('dark-mode', 'light-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        
        this.currentTheme = savedTheme;
        this.updateNavbarForTheme(savedTheme);
    }

    setupScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (this.currentTheme === 'light-mode') {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(248, 250, 252, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(248, 250, 252, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            } else {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(15, 20, 25, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.background = 'rgba(15, 20, 25, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            }

            // Scroll indicator animation
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                if (window.scrollY > 50) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .security-item, .floating-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupAnimations() {
        // Floating cards animation
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.3}s`;
        });

        // Security rings animation
        const rings = document.querySelectorAll('.ring');
        rings.forEach((ring, index) => {
            ring.style.animationDelay = `${index * 0.5}s`;
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    showDemoModal() {
        // Simple demo modal for video playback
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%; position: relative;">
                    <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                    <h3 style="margin-bottom: 1rem;">FinSecure Demo</h3>
                    <div style="background: #f5f5f5; padding: 2rem; text-align: center; border-radius: 5px;">
                        <i class="fas fa-play-circle" style="font-size: 3rem; color: #2563eb; margin-bottom: 1rem;"></i>
                        <p>Demo video coming soon!</p>
                        <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">Experience the full features by visiting the dashboard.</p>
                    </div>
                    <button onclick="window.location.href='dashboard.html'" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; margin-top: 1rem; width: 100%;">
                        Try Dashboard Now
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize the landing page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.landing = new LandingPage();
});

// Add basic mobile menu styles via JavaScript
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: var(--bg-primary);
            flex-direction: column;
            padding: 2rem;
            transition: left 0.3s ease;
            border-top: 1px solid var(--border-color);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .hamburger span {
            display: block;
            width: 25px;
            height: 3px;
            background: var(--accent-color);
            margin: 5px 0;
            transition: 0.3s;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }

        .theme-toggle {
            margin: 1rem 0;
            align-self: center;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);