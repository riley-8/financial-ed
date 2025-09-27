// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize all dashboard components
    initializeSidebar();
    initializeNavigation();
    initializeAIWidget();
    initializeCharts();
    initializeNotifications();
    initializeSearch();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Navigation Features
function initializeNavigation() {
    // Profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    // Notifications
    const notificationBtn = document.getElementById('notifications');
    const messagesBtn = document.getElementById('messages');
    
    notificationBtn.addEventListener('click', function() {
        showNotification('You have 3 new security alerts', 'info');
    });
    
    messagesBtn.addEventListener('click', function() {
        showNotification('You have 2 unread messages', 'info');
    });
}

// AI Widget Functionality
function initializeAIWidget() {
    const aiWidget = document.getElementById('ai-widget');
    const aiFab = document.getElementById('ai-fab');
    const closeWidget = document.getElementById('close-ai-widget');
    const aiInput = document.getElementById('ai-input');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiMessages = document.getElementById('ai-messages');
    
    // Toggle AI widget
    aiFab.addEventListener('click', function() {
        aiWidget.classList.add('active');
        aiFab.style.display = 'none';
    });
    
    closeWidget.addEventListener('click', function() {
        aiWidget.classList.remove('active');
        aiFab.style.display = 'flex';
    });
    
    // Send AI message with real API integration
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Show typing indicator for floating widget
            showAIWidgetTyping();
            
            // Make API call to Gemini
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    context: 'Quick AI assistant consultation'
                })
            })
            .then(response => response.json())
            .then(data => {
                removeAIWidgetTyping();
                if (data.message) {
                    addAIMessage(data.message, 'ai');
                } else {
                    addAIMessage("I'm having trouble processing that right now. Please try again.", 'ai');
                }
            })
            .catch(error => {
                console.error('AI Widget error:', error);
                removeAIWidgetTyping();
                
                // Fallback responses for floating widget
                const quickResponses = [
                    "I'm here to help with your financial questions! What would you like to know?",
                    "I can assist with budgeting, investing, or security concerns. What's on your mind?",
                    "Having connection issues. Please try again or use the main AI advisor section for detailed help."
                ];
                
                const randomResponse = quickResponses[Math.floor(Math.random() * quickResponses.length)];
                addAIMessage(randomResponse, 'ai');
            });
        }
    }
    
    function showAIWidgetTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-widget';
        typingDiv.id = 'ai-widget-typing';
        typingDiv.innerHTML = `
            <div class="typing-dots-widget">
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
            </div>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Add CSS for widget typing indicator
        if (!document.getElementById('widget-typing-styles')) {
            const style = document.createElement('style');
            style.id = 'widget-typing-styles';
            style.textContent = `
                .typing-dots-widget {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    padding: 0.5rem;
                }
                .typing-dot-widget {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: typing-widget 1.4s infinite ease-in-out;
                }
                .typing-dot-widget:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dot-widget:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typing-widget {
                    0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
                    30% { transform: scale(1.2); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeAIWidgetTyping() {
        const typingIndicator = document.getElementById('ai-widget-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function addAIMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message-widget' : 'ai-message';
        
        messageDiv.innerHTML = `
            <p>${message}</p>
        `;
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    sendAiMessage.addEventListener('click', sendMessage);
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Charts and Data Visualization
function initializeCharts() {
    // Portfolio Performance Chart
    const portfolioCtx = document.getElementById('portfolio-chart');
    if (portfolioCtx) {
        const portfolioChart = new Chart(portfolioCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [20000, 21500, 23000, 22500, 24000, 24750],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }
}

// Notifications System
function initializeNotifications() {
    // Check for security alerts
    checkSecurityAlerts();
    
    // Simulate real-time notifications
    setInterval(() => {
        // Random security notifications
        if (Math.random() > 0.8) {
            const alerts = [
                'Suspicious login attempt detected',
                'New security update available',
                'Portfolio rebalancing opportunity',
                'Market volatility alert'
            ];
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            showNotification(randomAlert, 'warning');
        }
    }, 30000); // Check every 30 seconds
}

function checkSecurityAlerts() {
    // Simulate security check
    const alerts = [
        'Unusual spending pattern detected',
        'Enable 2FA for better security'
    ];
    
    alerts.forEach((alert, index) => {
        setTimeout(() => {
            showNotification(alert, 'warning');
        }, index * 2000);
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 0.5rem;
                z-index: 1100;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            }
            .notification-warning {
                border-color: rgba(245, 158, 11, 0.3);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #e2e8f0;
            }
            .notification-close {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 1.2rem;
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        warning: 'exclamation-triangle',
        success: 'check-circle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        
        if (query.length > 2) {
            // Simulate search results
            const results = searchDashboard(query);
            showSearchResults(results, query);
        } else {
            hideSearchResults();
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

function searchDashboard(query) {
    // Mock search results
    const sections = [
        { title: 'Portfolio Performance', page: 'dashboard.html', icon: 'chart-line' },
        { title: 'Security Status', page: 'dashboard.html', icon: 'shield-check' },
        { title: 'AI Advisor', page: 'ai-advisor.html', icon: 'robot' },
        { title: 'Statement Analyzer', page: 'statement-analyzer.html', icon: 'file-invoice-dollar' },
        { title: 'Fraud Scanner', page: 'fraud-scanner.html', icon: 'shield-virus' }
    ];
    
    return sections.filter(section => 
        section.title.toLowerCase().includes(query)
    );
}

function showSearchResults(results, query) {
    hideSearchResults(); // Clear previous results
    
    const searchContainer = document.querySelector('.search-container');
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'search-results';
    resultsDiv.innerHTML = `
        <div class="search-results-header">
            <span>Search Results for "${query}"</span>
        </div>
        <div class="search-results-list">
            ${results.map(result => `
                <a href="${result.page}" class="search-result-item">
                    <i class="fas fa-${result.icon}"></i>
                    <span>${result.title}</span>
                </a>
            `).join('')}
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('search-results-styles')) {
        const style = document.createElement('style');
        style.id = 'search-results-styles';
        style.textContent = `
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                margin-top: 0.5rem;
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
            }
            .search-results-header {
                padding: 1rem;
                border-bottom: 1px solid rgba(34, 197, 94, 0.1);
                color: #94a3b8;
                font-size: 0.875rem;
            }
            .search-result-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: #e2e8f0;
                text-decoration: none;
                transition: background 0.2s ease;
            }
            .search-result-item:hover {
                background: rgba(34, 197, 94, 0.1);
            }
            .search-result-item i {
                color: #22c55e;
            }
        `;
        document.head.appendChild(style);
    }
    
    searchContainer.appendChild(resultsDiv);
}

function hideSearchResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount);
}

function formatPercentage(value) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Export functions for use in other modules
window.dashboard = {
    initializeDashboard,
    showNotification,
    formatCurrency,
    formatPercentage
};