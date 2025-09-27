// Personal Advisor JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePersonalAdvisor();
});

function initializePersonalAdvisor() {
    initializeSidebar();
    initializeNavigation();
    initializeAIWidget();
    initializeAIChat();
    initializeSearch();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
            }
            // External links will navigate normally
        });
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
    
    // Send AI message
    async function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Show typing indicator for floating widget
            showAIWidgetTyping();
            
            try {
                // Call the actual Gemini API
                const response = await callGeminiAPI(message, 'AI Widget consultation');
                removeAIWidgetTyping();
                addAIMessage(response, 'ai');
            } catch (error) {
                console.error('AI Widget Error:', error);
                removeAIWidgetTyping();
                addAIMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 'ai');
            }
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
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-6px);
                        opacity: 1;
                    }
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
    
    sendAiMessage.addEventListener('click', sendMessage);
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addAIMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message-widget' : 'ai-message';
        messageDiv.textContent = message;
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
}

// Main AI Chat Functionality
function initializeAIChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const quickActions = document.querySelectorAll('.quick-action');
    
    // Quick action buttons
    quickActions.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            sendMessage();
        });
    });
    
    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                // Call the actual Gemini API
                const response = await callGeminiAPI(message, 'Personal Financial Advisor consultation');
                removeTypingIndicator();
                addChatMessage(response, 'ai');
            } catch (error) {
                console.error('Chat Error:', error);
                removeTypingIndicator();
                addChatMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 'ai');
            }
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add message to chat
    function addChatMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Process message for formatting
        const processedMessage = processMessage(message, type);
        content.innerHTML = processedMessage;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = getCurrentTime();
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Process message for special formatting
    function processMessage(message, type) {
        if (type === 'ai') {
            // Convert line breaks to paragraphs and handle bullet points
            message = message.replace(/\n/g, '<br>');
            // Convert bullet points to proper HTML
            message = message.replace(/•/g, '&bull;');
            // Convert **bold** text to HTML
            message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return message;
        }
        return `<p>${message}</p>`;
    }
    
    // Get current time for timestamps
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
}

// API call function to connect to Gemini
async function callGeminiAPI(message, context) {
    try {
        console.log('Sending message to Gemini API:', message);
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: context
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response from Gemini API:', data);

        return data.message || 'I apologize, but I couldn\'t process your request right now.';
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        // Return fallback response based on message content
        return getFallbackResponse(message);
    }
}

// Fallback response function for when API fails
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
        return "I'd recommend starting with a diversified portfolio. Consider low-cost index funds for beginners - they offer broad market exposure with lower risk. What's your investment timeline and risk tolerance?";
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('expense') || lowerMessage.includes('save')) {
        return "Let's create a budget using the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. What's your monthly after-tax income?";
    } else if (lowerMessage.includes('security') || lowerMessage.includes('password') || lowerMessage.includes('hack')) {
        return "For better security, enable two-factor authentication on all financial accounts, use unique strong passwords, and be cautious of phishing emails. What specific security concern do you have?";
    } else if (lowerMessage.includes('scan') || lowerMessage.includes('link') || lowerMessage.includes('url')) {
        return "I can help analyze links and messages for threats. Please share the URL or message content you'd like me to review for potential scams or phishing attempts.";
    } else {
        return "I'm here to help with your financial and security questions. Could you provide more details about what specific advice you're looking for?";
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 2) {
            // Simulate search results
            showSearchResults(query);
        } else {
            hideSearchResults();
        }
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.length > 2) {
            showSearchResults(this.value.toLowerCase().trim());
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

function showSearchResults(query) {
    let searchResults = document.getElementById('search-results');
    
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'search-results';
        document.querySelector('.search-container').appendChild(searchResults);
        
        // Add search results styles
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
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    border-radius: 12px;
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                    z-index: 1001;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .search-result-item {
                    padding: 0.75rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #e2e8f0;
                }
                .search-result-item:hover {
                    background: rgba(34, 197, 94, 0.1);
                }
                .search-result-item i {
                    margin-right: 0.5rem;
                    color: #22c55e;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Simulate search results based on query
    const results = generateSearchResults(query);
    
    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="handleSearchResult('${result.action}')">
            <i class="${result.icon}"></i>
            ${result.text}
        </div>
    `).join('');
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.remove();
    }
}

function generateSearchResults(query) {
    const allResults = [
        { text: 'Investment Portfolio Analysis', icon: 'fas fa-chart-pie', action: 'portfolio' },
        { text: 'Budget Planning Tools', icon: 'fas fa-calculator', action: 'budget' },
        { text: 'Security Settings', icon: 'fas fa-shield-alt', action: 'security' },
        { text: 'Fraud Detection Reports', icon: 'fas fa-search-dollar', action: 'fraud' },
        { text: 'Financial Education Resources', icon: 'fas fa-graduation-cap', action: 'education' },
        { text: 'AI Advisor Chat', icon: 'fas fa-robot', action: 'ai-chat' }
    ];
    
    return allResults.filter(result => 
        result.text.toLowerCase().includes(query)
    ).slice(0, 5);
}

function handleSearchResult(action) {
    hideSearchResults();
    
    switch(action) {
        case 'ai-chat':
            document.getElementById('chat-input').focus();
            break;
        case 'portfolio':
            window.location.href = '../portfolio/portfolio.html';
            break;
        case 'budget':
            // Focus on budget planning in chat
            document.getElementById('chat-input').value = 'Help me create a monthly budget';
            document.getElementById('send-message').click();
            break;
        default:
            showNotification(`Navigating to ${action} features`, 'info');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already present
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
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: #e2e8f0;
                z-index: 2000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification i {
                color: #22c55e;
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 300);
}

// Export functions for global access
window.handleSearchResult = handleSearchResult;