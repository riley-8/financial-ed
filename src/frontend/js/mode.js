// mode.js - Light/Dark Mode Functionality for All Pages

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark-mode';
        this.init();
    }

    init() {
        this.loadThemePreference();
        this.setupEventListeners();
        this.applyThemeToElements();
    }

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for theme changes from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'finsecure-theme') {
                this.applyTheme(e.newValue);
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (body.classList.contains('dark-mode')) {
            this.applyTheme('light-mode');
        } else {
            this.applyTheme('dark-mode');
        }
    }

    applyTheme(theme) {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (theme === 'light-mode') {
            body.classList.replace('dark-mode', 'light-mode');
            this.currentTheme = 'light-mode';
            if (themeIcon) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            this.currentTheme = 'dark-mode';
            if (themeIcon) {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
        
        // Save preference to localStorage
        localStorage.setItem('finsecure-theme', this.currentTheme);
        
        // Update navbar and other dynamic elements
        this.updateDynamicElements();
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('finsecure-theme') || 'dark-mode';
        this.applyTheme(savedTheme);
    }

    updateDynamicElements() {
        // Update navbar background based on scroll position
        this.updateNavbarForTheme();
        
        // Add scroll listener if not already added
        if (!this.scrollListenerAdded) {
            window.addEventListener('scroll', () => {
                this.updateNavbarForTheme();
            });
            this.scrollListenerAdded = true;
        }
    }

    updateNavbarForTheme() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        if (this.currentTheme === 'light-mode') {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(248, 250, 252, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'var(--navbar-bg)';
                navbar.style.boxShadow = 'none';
            }
        } else {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 20, 25, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'var(--navbar-bg)';
                navbar.style.boxShadow = 'none';
            }
        }
    }

    applyThemeToElements() {
        // This method can be extended to apply theme to specific elements
        // that might not be covered by CSS variables
    }

    // Utility method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Utility method to set theme programmatically
    setTheme(theme) {
        this.applyTheme(theme);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}