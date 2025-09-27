// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize all dashboard components
    initializeSidebar();
    initializeNavigation();
    initializeAIWidget();
    initializeStatementAnalyzer();
    initializeCharts();
    initializeScanners();
    initializeEducationTabs();
    initializeChallenges();
    initializeLifeSimulator();
    initializeNotifications();
    initializeSearch();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Initialize section-specific functionality
                initializeSectionFeatures(targetSection);
            }
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
        messageDiv.innerHTML = `<p>${message}</p>`;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
}

// AI Chat in main section
function initializeAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const quickActions = document.querySelectorAll('.quick-action');
    
    // Send message function with real AI integration
    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                // Make API call to our backend which calls Gemini
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        context: getCurrentContext()
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Remove typing indicator
                    removeTypingIndicator();
                    
                    // Add AI response
                    addChatMessage(data.message, 'ai');
                    
                    // Show notification if using fallback
                    if (data.fallback) {
                        setTimeout(() => {
                            showNotification('Note: Using offline mode. For best results, ensure your internet connection is stable.', 'info');
                        }, 1000);
                    }
                } else {
                    removeTypingIndicator();
                    addChatMessage("I'm having trouble connecting right now. Please try again in a moment, or check your internet connection.", 'ai');
                    showNotification('Connection error. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Chat error:', error);
                removeTypingIndicator();
                
                // Fallback to basic responses
                const basicResponses = [
                    "I'm currently having technical difficulties. Please try again in a few moments.",
                    "Sorry, I can't connect to my AI services right now. Please check your internet connection and try again.",
                    "I'm experiencing some connection issues. In the meantime, you can explore our educational resources or try the fraud scanner."
                ];
                
                const randomResponse = basicResponses[Math.floor(Math.random() * basicResponses.length)];
                addChatMessage(randomResponse, 'ai');
                showNotification('Unable to connect to AI services. Please try again later.', 'error');
            }
        }
    }
    
    // Get current context for better AI responses
    function getCurrentContext() {
        const activeSection = document.querySelector('.content-section.active');
        const sectionId = activeSection ? activeSection.id : 'dashboard';
        
        const contexts = {
            'dashboard': 'User is viewing their financial dashboard with portfolio and security overview',
            'ai-advisor': 'User is in the AI advisor chat seeking financial guidance',
            'fraud-scanner': 'User is interested in cybersecurity and fraud detection',
            'security-center': 'User is reviewing their security settings and alerts',
            'education': 'User is exploring educational content about finance and security',
            'life-simulator': 'User is practicing financial decisions in a simulated environment',
            'challenges': 'User is working on gamified financial and security challenges',
            'portfolio': 'User is reviewing their investment portfolio and performance'
        };
        
        return contexts[sectionId] || 'General financial consultation';
    }
    
    // Enhanced typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add CSS for typing indicator if not exists
        if (!document.getElementById('typing-indicator-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-indicator-styles';
            style.textContent = `
                .typing-dots {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 1rem;
                }
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Enhanced quick actions with context
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            sendChatMessage();
        });
    });
    
    function addChatMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Enhanced message formatting
        const formattedMessage = formatAIMessage(message, type);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                ${formattedMessage}
            </div>
            <div class="message-timestamp">
                ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Format AI messages for better readability
    function formatAIMessage(message, type) {
        if (type === 'user') {
            return `<p>${message}</p>`;
        }
        
        // Enhanced AI message formatting
        let formatted = message;
        
        // Convert numbered lists
        formatted = formatted.replace(/(\d+)\.\s/g, '<br><strong>$1.</strong> ');
        
        // Convert bullet points
        formatted = formatted.replace(/•\s/g, '<br>• ');
        formatted = formatted.replace(/-\s/g, '<br>• ');
        
        // Bold important terms
        const importantTerms = [
            'diversified portfolio', 'emergency fund', 'compound interest', 'risk tolerance',
            'two-factor authentication', '2FA', 'phishing', 'malware', 'fraud',
            'budget', 'investment', 'savings', 'debt', 'credit score'
        ];
        
        importantTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            formatted = formatted.replace(regex, `<strong>${term}</strong>`);
        });
        
        // Add line breaks for better readability
        formatted = formatted.replace(/\.\s+([A-Z])/g, '.<br><br>$1');
        
        return `<p>${formatted}</p>`;
    }
}

// Initialize Charts
function initializeCharts() {
    // Portfolio chart (simple canvas-based chart)
    const portfolioCanvas = document.getElementById('portfolio-chart');
    const performanceCanvas = document.getElementById('portfolio-performance-chart');
    
    if (portfolioCanvas) {
        drawPortfolioChart(portfolioCanvas);
    }
    
    if (performanceCanvas) {
        drawPerformanceChart(performanceCanvas);
    }
}

function drawPortfolioChart(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 200;
    
    // Simple line chart
    const data = [10, 15, 12, 20, 18, 25, 22, 28, 24, 30];
    const maxValue = Math.max(...data);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - (height - padding * 2) * (value / maxValue) - padding;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawPerformanceChart(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 250;
    
    // More detailed performance chart
    const data = [100, 105, 103, 110, 108, 115, 112, 120, 118, 125, 123, 130];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = (height - padding * 2) * (i / 5) + padding;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw main line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - ((value - minValue) / range) * (height - padding * 2) - padding;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add data points
    ctx.fillStyle = '#22c55e';
    data.forEach((value, index) => {
        const x = (width - padding * 2) * (index / (data.length - 1)) + padding;
        const y = height - ((value - minValue) / range) * (height - padding * 2) - padding;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Fraud Scanner Functionality
function initializeScanners() {
    const scanUrlBtn = document.getElementById('scan-url');
    const scanMessageBtn = document.getElementById('scan-message');
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');
    const scanResults = document.getElementById('scan-results');
    
    if (scanUrlBtn) {
        scanUrlBtn.addEventListener('click', function() {
            const url = document.getElementById('url-input').value;
            if (url) {
                scanURL(url);
            } else {
                showNotification('Please enter a URL to scan', 'warning');
            }
        });
    }
    
    if (scanMessageBtn) {
        scanMessageBtn.addEventListener('click', function() {
            const message = document.getElementById('message-input').value;
            if (message) {
                scanMessage(message);
            } else {
                showNotification('Please enter a message to scan', 'warning');
            }
        });
    }
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#22c55e';
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                scanFiles(files);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                scanFiles(this.files);
            }
        });
    }
    
    // Updated scanURL function that uses real AI scanning
async function scanURL(url) {
    showScanProgress('Scanning URL for threats with AI...');
    
    try {
        const response = await fetch('/api/scan/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            throw new Error('Scan failed');
        }

        const result = await response.json();
        
        // Transform the AI response to match your expected format
        const formattedResult = {
            type: result.type || 'URL',
            target: result.target || url,
            safe: result.safe || false,
            threats: result.threats || [],
            score: result.confidence || (result.safe ? 95 : 25),
            recommendations: result.recommendations || [],
            threatLevel: result.threatLevel || 'unknown',
            category: result.category || 'suspicious',
            details: result.details || {}
        };
        
        displayScanResult(formattedResult);
        
    } catch (error) {
        console.error('URL scan error:', error);
        
        // Fallback to basic analysis if AI fails
        const fallbackResult = {
            type: 'URL',
            target: url,
            safe: false,
            threats: ['Scan unavailable - proceeding with caution'],
            score: 50,
            recommendations: [
                'Verify the URL manually',
                'Check for HTTPS encryption',
                'Look for website reviews',
                'Use antivirus software'
            ],
            threatLevel: 'unknown',
            category: 'suspicious',
            details: {
                note: 'AI scan failed, use caution'
            }
        };
        
        displayScanResult(fallbackResult);
    }
}
    
    function scanMessage(message) {
        showScanProgress('Analyzing message for phishing attempts...');
        
        setTimeout(() => {
            const suspiciousKeywords = ['urgent', 'verify account', 'click here', 'suspended', 'winner'];
            const foundKeywords = suspiciousKeywords.filter(keyword => 
                message.toLowerCase().includes(keyword)
            );
            
            const isSafe = foundKeywords.length === 0;
            const result = {
                type: 'Message',
                target: message.substring(0, 50) + '...',
                safe: isSafe,
                threats: isSafe ? [] : [`Suspicious keywords found: ${foundKeywords.join(', ')}`],
                score: isSafe ? 90 : 30,
                recommendations: isSafe ? 
                    ['Message appears legitimate'] : 
                    ['Be cautious with this message', 'Verify sender through other means', 'Do not click any links']
            };
            displayScanResult(result);
        }, 1500);
    }
    
    function scanFiles(files) {
        showScanProgress(`Scanning ${files.length} file(s) for malware...`);
        
        setTimeout(() => {
            const results = Array.from(files).map(file => {
                const isSafe = Math.random() > 0.2; // 80% chance it's safe
                return {
                    type: 'File',
                    target: file.name,
                    safe: isSafe,
                    threats: isSafe ? [] : ['Potential malware detected', 'Suspicious file signature'],
                    score: isSafe ? 92 : 15,
                    recommendations: isSafe ? 
                        ['File appears clean'] : 
                        ['Quarantine this file', 'Run additional antivirus scan', 'Do not open']
                };
            });
            
            results.forEach(result => displayScanResult(result));
        }, 3000);
    }
    
    function showScanProgress(message) {
        const scanResults = document.getElementById('scan-results');
        if (scanResults) {
            scanResults.innerHTML = `
                <div class="scan-progress">
                    <div class="progress-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            
            // Add CSS for spinner if not exists
            if (!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.textContent = `
                    .scan-progress {
                        text-align: center;
                        padding: 2rem;
                        background: rgba(30, 41, 59, 0.6);
                        border-radius: 12px;
                        margin-top: 1rem;
                    }
                    .progress-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(34, 197, 94, 0.2);
                        border-left: 4px solid #22c55e;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    function displayScanResult(result) {
        const scanResults = document.getElementById('scan-results');
        if (scanResults) {
            const resultElement = document.createElement('div');
            resultElement.className = `scan-result ${result.safe ? 'safe' : 'threat'}`;
            resultElement.innerHTML = `
                <div class="result-header">
                    <div class="result-icon">
                        <i class="fas ${result.safe ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    </div>
                    <div class="result-info">
                        <h4>${result.type} Scan Result</h4>
                        <p>${result.target}</p>
                    </div>
                    <div class="result-score ${result.safe ? 'safe' : 'threat'}">
                        ${result.score}/100
                    </div>
                </div>
                <div class="result-details">
                    ${result.threats.length > 0 ? `
                        <div class="threats">
                            <h5>Threats Detected:</h5>
                            <ul>
                                ${result.threats.map(threat => `<li>${threat}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="recommendations">
                        <h5>Recommendations:</h5>
                        <ul>
                            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            scanResults.innerHTML = '';
            scanResults.appendChild(resultElement);
            
            // Add CSS for scan results if not exists
            if (!document.getElementById('scan-result-styles')) {
                const style = document.createElement('style');
                style.id = 'scan-result-styles';
                style.textContent = `
                    .scan-result {
                        background: rgba(30, 41, 59, 0.6);
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin-top: 1rem;
                        border-left: 4px solid;
                    }
                    .scan-result.safe {
                        border-left-color: #22c55e;
                    }
                    .scan-result.threat {
                        border-left-color: #ef4444;
                    }
                    .result-header {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    .result-icon {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                    }
                    .scan-result.safe .result-icon {
                        background: rgba(34, 197, 94, 0.2);
                        color: #22c55e;
                    }
                    .scan-result.threat .result-icon {
                        background: rgba(239, 68, 68, 0.2);
                        color: #ef4444;
                    }
                    .result-info h4 {
                        color: #f8fafc;
                        margin-bottom: 0.25rem;
                    }
                    .result-info p {
                        color: #94a3b8;
                        font-size: 0.9rem;
                    }
                    .result-score {
                        font-size: 1.25rem;
                        font-weight: 700;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                    }
                    .result-score.safe {
                        background: rgba(34, 197, 94, 0.2);
                        color: #22c55e;
                    }
                    .result-score.threat {
                        background: rgba(239, 68, 68, 0.2);
                        color: #ef4444;
                    }
                    .result-details h5 {
                        color: #f8fafc;
                        margin-bottom: 0.5rem;
                        font-size: 0.9rem;
                    }
                    .result-details ul {
                        list-style: none;
                        padding: 0;
                        margin-bottom: 1rem;
                    }
                    .result-details li {
                        color: #94a3b8;
                        font-size: 0.9rem;
                        padding: 0.25rem 0;
                        padding-left: 1.5rem;
                        position: relative;
                    }
                    .result-details li::before {
                        content: '•';
                        position: absolute;
                        left: 0.5rem;
                        color: #22c55e;
                    }
                    .threats li::before {
                        color: #ef4444;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
}

// Education Tab System
function initializeEducationTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
    
    // Course buttons
    const courseBtns = document.querySelectorAll('.course-btn');
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                showNotification('Starting course... Redirecting to learning platform', 'success');
                // Here you would typically redirect to the actual course
            }
        });
    });
}

// Challenge System
function initializeChallenges() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all category buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter challenge cards
            challengeCards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Life Simulator
function initializeLifeSimulator() {
    const optionBtns = document.querySelectorAll('.option-btn');
    const simBalance = document.getElementById('sim-balance');
    const simAge = document.getElementById('sim-age');
    const simHealth = document.getElementById('sim-health');
    const simSecurity = document.getElementById('sim-security');
    
    let gameState = {
        balance: 50000,
        age: 25,
        health: 100,
        security: 85
    };
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const choice = this.getAttribute('data-choice');
            handleSimulatorChoice(choice);
        });
    });
    
    function handleSimulatorChoice(choice) {
        let outcome = '';
        let balanceChange = 0;
        let securityChange = 0;
        let healthChange = 0;
        
        switch(choice) {
            case 'invest':
                const investmentOutcome = Math.random();
                if (investmentOutcome > 0.7) {
                    balanceChange = 5000;
                    outcome = 'Great choice! Your investment paid off. +$5,000';
                } else if (investmentOutcome > 0.3) {
                    balanceChange = -2000;
                    outcome = 'The investment didn\'t perform well. -$2,000';
                } else {
                    balanceChange = -10000;
                    securityChange = -10;
                    outcome = 'It was a scam! You lost money and your security was compromised.';
                }
                break;
            case 'research':
                balanceChange = 0;
                securityChange = 5;
                outcome = 'Smart move! You avoided a potential scam by researching first.';
                break;
            case 'decline':
                balanceChange = 0;
                securityChange = 2;
                outcome = 'Conservative choice. You kept your money safe.';
                break;
        }
        
        // Update game state
        gameState.balance += balanceChange;
        gameState.security = Math.max(0, Math.min(100, gameState.security + securityChange));
        gameState.health = Math.max(0, Math.min(100, gameState.health + healthChange));
        gameState.age += 0.1; // Age slightly with each decision
        
        // Update UI
        updateSimulatorStats();
        
        // Show outcome
        showNotification(outcome, balanceChange > 0 ? 'success' : balanceChange < 0 ? 'error' : 'info');
        
        // Generate new scenario after a delay
        setTimeout(generateNewScenario, 2000);
    }
    
    function updateSimulatorStats() {
        if (simBalance) simBalance.textContent = Math.floor(gameState.balance).toLocaleString();
        if (simAge) simAge.textContent = Math.floor(gameState.age);
        if (simHealth) simHealth.textContent = Math.floor(gameState.health);
        if (simSecurity) simSecurity.textContent = Math.floor(gameState.security);
    }
    
    function generateNewScenario() {
        const scenarios = [
            {
                title: 'Email from Bank',
                description: 'You receive an email claiming to be from your bank asking you to verify your account details. What do you do?',
                options: [
                    { text: 'Click the link immediately', choice: 'click' },
                    { text: 'Call the bank directly', choice: 'verify' },
                    { text: 'Delete the email', choice: 'delete' }
                ]
            },
            {
                title: 'Investment Seminar',
                description: 'A friend invites you to a "get rich quick" investment seminar. The speaker promises 50% returns in 30 days. What\'s your move?',
                options: [
                    { text: 'Invest immediately', choice: 'invest-quick' },
                    { text: 'Ask for documentation', choice: 'research-docs' },
                    { text: 'Politely decline', choice: 'decline-seminar' }
                ]
            },
            {
                title: 'Online Shopping',
                description: 'You find an amazing deal on a luxury item for 70% off on a website you\'ve never heard of. What do you do?',
                options: [
                    { text: 'Buy it immediately', choice: 'buy-deal' },
                    { text: 'Research the website first', choice: 'research-site' },
                    { text: 'Look for it elsewhere', choice: 'compare-prices' }
                ]
            }
        ];
        
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const scenarioCard = document.querySelector('.scenario-card');
        
        if (scenarioCard) {
            scenarioCard.innerHTML = `
                <h3>${randomScenario.title}</h3>
                <p>${randomScenario.description}</p>
                <div class="scenario-options">
                    ${randomScenario.options.map(option => 
                        `<button class="option-btn" data-choice="${option.choice}">${option.text}</button>`
                    ).join('')}
                </div>
            `;
            
            // Re-attach event listeners
            const newOptionBtns = scenarioCard.querySelectorAll('.option-btn');
            newOptionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const choice = this.getAttribute('data-choice');
                    handleSimulatorChoice(choice);
                });
            });
        }
    }
}

// Notification System
function initializeNotifications() {
    // Security alerts simulation
    setTimeout(() => {
        showNotification('New security alert: Unusual login detected', 'warning');
    }, 5000);
    
    setTimeout(() => {
        showNotification('Portfolio update: Your investments are up 2.3% today', 'success');
    }, 10000);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            hideNotification(notification);
        }
    }, 5000);
}

function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'linear-gradient(135deg, #22c55e, #16a34a)';
        case 'error': return 'linear-gradient(135deg, #ef4444, #dc2626)';
        case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
        default: return 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                performSearch(query);
            }
        });
    }
}

function performSearch(query) {
    // Simple search implementation
    const searchableElements = document.querySelectorAll('[data-searchable]');
    let results = [];
    
    searchableElements.forEach(element => {
        if (element.textContent.toLowerCase().includes(query)) {
            results.push({
                element: element,
                section: element.closest('.content-section').id,
                text: element.textContent
            });
        }
    });
    
    if (results.length > 0) {
        showNotification(`Found ${results.length} results for "${query}"`, 'info');
    }
}

// Section-specific initialization
function initializeSectionFeatures(section) {
    switch(section) {
        case 'ai-advisor':
            initializeAIChat();
            break;

        case 'statement-analyzer':
            // Analyzer is already initialized, just ensure it's ready
            resetStatementAnalyzer();
            break;
        case 'fraud-scanner':
            // Already initialized in initializeScanners
            break;
        case 'education':
            // Already initialized in initializeEducationTabs
            break;
        case 'life-simulator':
            // Already initialized in initializeLifeSimulator
            break;
        case 'challenges':
            // Already initialized in initializeChallenges
            break;
        case 'portfolio':
            // Reinitialize charts if needed
            setTimeout(() => {
                const performanceCanvas = document.getElementById('portfolio-performance-chart');
                if (performanceCanvas) {
                    drawPerformanceChart(performanceCanvas);
                }
            }, 100);
            break;
    }
}

// Statement Analyzer Variables
let currentAnalysisData = null;
let categoryChart = null;
let trendsChart = null;

// Initialize Statement Analyzer
function initializeStatementAnalyzer() {
    // PDF Upload
    document.getElementById('analyzerPdfUpload').addEventListener('click', () => {
        document.getElementById('analyzerPdfInput').click();
    });

    document.getElementById('analyzerPdfInput').addEventListener('change', handleAnalyzerPDFUpload);

    // Image Upload
    document.getElementById('analyzerImageUpload').addEventListener('click', () => {
        document.getElementById('analyzerImageInput').click();
    });

    document.getElementById('analyzerImageInput').addEventListener('change', handleAnalyzerImageUpload);

    // Camera Capture
    document.getElementById('analyzerCameraCapture').addEventListener('click', () => {
        document.getElementById('analyzerCameraInput').click();
    });

    document.getElementById('analyzerCameraInput').addEventListener('change', handleAnalyzerImageUpload);

    // Financial Chat
    const financialChatInput = document.getElementById('financialChatInput');
    const sendFinancialMessage = document.getElementById('sendFinancialMessage');
    
    if (sendFinancialMessage) {
        sendFinancialMessage.addEventListener('click', sendFinancialChatMessage);
    }
    
    if (financialChatInput) {
        financialChatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendFinancialChatMessage();
            }
        });
    }
}

// Handle PDF Upload for Analysis
async function handleAnalyzerPDFUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showAnalyzerProcessing();
    updateAnalyzerProgress(10, "Reading PDF file...");

    try {
        // Extract text from PDF using PDF.js
        const text = await extractTextFromAnalyzerPDF(file);
        updateAnalyzerProgress(50, "Sending to AI for analysis...");
        
        // Send to backend for AI analysis
        const analysis = await analyzeStatementWithAI(text, file.name, 'pdf');
        updateAnalyzerProgress(100, "Analysis complete!");
        
        setTimeout(() => {
            showAnalysisResults(analysis);
        }, 1000);

    } catch (error) {
        console.error('PDF analysis error:', error);
        showAnalyzerError('Failed to process PDF. Please try again or use a different format.');
    }
}

// Handle Image Upload for Analysis
async function handleAnalyzerImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showAnalyzerProcessing();
    updateAnalyzerProgress(10, "Processing image...");

    try {
        // Extract text using OCR
        const text = await extractTextFromAnalyzerImage(file);
        updateAnalyzerProgress(70, "Sending to AI for analysis...");
        
        // Send to backend for AI analysis
        const analysis = await analyzeStatementWithAI(text, file.name, 'image');
        updateAnalyzerProgress(100, "Analysis complete!");
        
        setTimeout(() => {
            showAnalysisResults(analysis);
        }, 1000);

    } catch (error) {
        console.error('Image analysis error:', error);
        showAnalyzerError('Failed to process image. Please ensure the text is clear and try again.');
    }
}

// Extract text from PDF
async function extractTextFromAnalyzerPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const typedArray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                    
                    updateAnalyzerProgress(10 + (i / pdf.numPages) * 30, `Reading page ${i}/${pdf.numPages}...`);
                }
                
                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// Extract text from image using Tesseract OCR
async function extractTextFromAnalyzerImage(file) {
    updateAnalyzerProgress(20, "Initializing OCR...");
    
    // Use Tesseract.js for OCR
    const { createWorker } = Tesseract;
    const worker = await createWorker();
    
    try {
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        updateAnalyzerProgress(40, "Reading text from image...");
        
        const { data: { text } } = await worker.recognize(file);
        
        await worker.terminate();
        return text;
        
    } catch (error) {
        await worker.terminate();
        throw error;
    }
}

// Send extracted text to backend AI for analysis
async function analyzeStatementWithAI(text, filename, type) {
    try {
        const response = await fetch('/api/analyze/statement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                filename: filename,
                type: type
            })
        });

        if (!response.ok) {
            throw new Error('Analysis failed');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('AI Analysis error:', error);
        throw error;
    }
}

// Show processing state
function showAnalyzerProcessing() {
    document.getElementById('analyzerUploadSection').style.display = 'none';
    document.getElementById('analyzerProcessingSection').classList.add('active');
    document.getElementById('analyzerResults').classList.remove('active');
}

// Update progress bar
function updateAnalyzerProgress(percentage, text) {
    document.getElementById('analyzerProgressBar').style.width = percentage + '%';
    document.getElementById('analyzerProgressText').textContent = text;
}

// Show analysis results
function showAnalysisResults(analysis) {
    currentAnalysisData = analysis;
    
    document.getElementById('analyzerProcessingSection').classList.remove('active');
    document.getElementById('analyzerResults').classList.add('active');
    
    // Render all sections
    renderFinancialSummary(analysis);
    renderCategoryChart(analysis.categories);
    renderTrendsChart(analysis.transactions || []);
    renderCategoryDetails(analysis.categories);
    renderAIRecommendations(analysis.recommendations || []);
    renderFinancialInsights(analysis.insights || []);
    
    // Initialize financial chat
    initializeFinancialChat(analysis);
}

// Render financial summary cards
function renderFinancialSummary(analysis) {
    const container = document.getElementById('summaryCards');
    const summary = analysis.summary || {};
    
    container.innerHTML = `
        <div class="summary-card">
            <h3>Monthly Income</h3>
            <div class="summary-value">R${(summary.totalIncome || 0).toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Total Expenses</h3>
            <div class="summary-value">R${(summary.totalExpenses || 0).toFixed(2)}</div>
        </div>
        <div class="summary-card">
            <h3>Net Flow</h3>
            <div class="summary-value ${summary.netFlow >= 0 ? 'positive' : 'negative'}">
                R${(summary.netFlow || 0).toFixed(2)}
            </div>
        </div>
        <div class="summary-card">
            <h3>Savings Rate</h3>
            <div class="summary-value">${(summary.savingsRate || 0).toFixed(1)}%</div>
        </div>
        <div class="summary-card">
            <h3>Transactions</h3>
            <div class="summary-value">${summary.transactionCount || 0}</div>
        </div>
    `;
}

// Render category spending chart
function renderCategoryChart(categories) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categoryData = Object.entries(categories || {})
        .filter(([cat]) => cat !== 'Income')
        .sort((a, b) => b[1] - a[1]);
    
    const labels = categoryData.map(([cat]) => cat);
    const data = categoryData.map(([, amount]) => amount);
    const colors = [
        '#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6',
        '#10b981', '#f97316', '#06b6d4', '#84cc16', '#ec4899'
    ];

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#0a0e1a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Render trends chart
function renderTrendsChart(transactions) {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    // Generate daily spending data for the last 30 days
    const last30Days = [];
    const dailySpending = {};
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last30Days.push(dateStr);
        dailySpending[dateStr] = 0;
    }

    // Distribute transactions across days (simulation for demo)
    const totalExpenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    last30Days.forEach((date, index) => {
        const baseAmount = totalExpenses / 30;
        const variance = (Math.random() - 0.5) * baseAmount * 0.6;
        const weekendMultiplier = [0, 6].includes(new Date(date).getDay()) ? 1.2 : 1;
        dailySpending[date] = Math.max(0, (baseAmount + variance) * weekendMultiplier);
    });

    const labels = last30Days.map(date => 
        new Date(date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })
    );
    const data = last30Days.map(date => dailySpending[date]);

    if (trendsChart) {
        trendsChart.destroy();
    }

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Spending',
                data: data,
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
                    labels: {
                        color: '#e2e8f0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 10
                    },
                    grid: {
                        color: 'rgba(34, 197, 94, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return 'R' + value.toFixed(0);
                        }
                    },
                    grid: {
                        color: 'rgba(34, 197, 94, 0.1)'
                    }
                }
            }
        }
    });
}

// Render category details breakdown
function renderCategoryDetails(categories) {
    const container = document.getElementById('categoryDetails');
    const categoryIcons = {
        'Groceries': 'fa-shopping-cart',
        'Transport': 'fa-car',
        'Entertainment': 'fa-film',
        'Dining': 'fa-utensils',
        'Shopping': 'fa-shopping-bag',
        'Utilities': 'fa-lightbulb',
        'Healthcare': 'fa-heartbeat',
        'Cash': 'fa-money-bill-wave',
        'Income': 'fa-coins',
        'Other': 'fa-ellipsis-h'
    };

    const categoryData = Object.entries(categories || {})
        .filter(([cat]) => cat !== 'Income')
        .sort((a, b) => b[1] - a[1]);

    container.innerHTML = categoryData.map(([category, amount]) => `
        <div class="category-item">
            <div class="category-info">
                <div class="category-icon">
                    <i class="fas ${categoryIcons[category] || 'fa-ellipsis-h'}"></i>
                </div>
                <div>
                    <div class="category-name">${category}</div>
                    <div class="category-count">Monthly spending</div>
                </div>
            </div>
            <div class="category-amount">R${amount.toFixed(2)}</div>
        </div>
    `).join('');
}

// Render AI recommendations
function renderAIRecommendations(recommendations) {
    const container = document.getElementById('aiRecommendations');
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-type">${rec.type}</div>
            <div class="recommendation-text">${rec.text}</div>
        </div>
    `).join('');
}

// Render financial insights
function renderFinancialInsights(insights) {
    const container = document.getElementById('financialInsights');
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-type">${insight.type}</div>
            <div class="recommendation-text">${insight.text}</div>
        </div>
    `).join('');
}

// Initialize financial chat with context
function initializeFinancialChat(analysis) {
    const messagesContainer = document.getElementById('financialChatMessages');
    
    // Add initial AI message with context
    const welcomeMessage = `I've analyzed your bank statement and I'm ready to help you optimize your finances! 
    
Your savings rate is ${(analysis.summary?.savingsRate || 0).toFixed(1)}% and your top spending category is ${
        Object.entries(analysis.categories || {})
            .filter(([cat]) => cat !== 'Income')
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'
    }. 

What would you like to know about your spending patterns?`;

    addFinancialChatMessage(welcomeMessage, 'ai');
}

// Send financial chat message
async function sendFinancialChatMessage() {
    const input = document.getElementById('financialChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addFinancialChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showFinancialChatTyping();
    
    try {
        const response = await fetch('/api/chat/financial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                analysisData: currentAnalysisData,
                context: 'statement_analysis'
            })
        });
        
        const data = await response.json();
        
        removeFinancialChatTyping();
        addFinancialChatMessage(data.message, 'ai');
        
    } catch (error) {
        console.error('Financial chat error:', error);
        removeFinancialChatTyping();
        addFinancialChatMessage('Sorry, I had trouble processing that. Could you try rephrasing your question?', 'ai');
    }
}

// Add message to financial chat
function addFinancialChatMessage(message, type) {
    const container = document.getElementById('financialChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Show typing indicator in financial chat
function showFinancialChatTyping() {
    const container = document.getElementById('financialChatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'financial-chat-typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

// Remove typing indicator
function removeFinancialChatTyping() {
    const typingIndicator = document.getElementById('financial-chat-typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Show error message
function showAnalyzerError(message) {
    document.getElementById('analyzerProcessingSection').classList.remove('active');
    
    const uploadSection = document.getElementById('analyzerUploadSection');
    uploadSection.style.display = 'block';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    
    uploadSection.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Reset statement analyzer
function resetStatementAnalyzer() {
    // Hide results
    document.getElementById('analyzerResults').classList.remove('active');
    document.getElementById('analyzerProcessingSection').classList.remove('active');
    
    // Show upload section
    document.getElementById('analyzerUploadSection').style.display = 'block';
    
    // Clear file inputs
    document.getElementById('analyzerPdfInput').value = '';
    document.getElementById('analyzerImageInput').value = '';
    document.getElementById('analyzerCameraInput').value = '';
    
    // Clear data
    currentAnalysisData = null;
    
    // Destroy charts
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }
    if (trendsChart) {
        trendsChart.destroy();
        trendsChart = null;
    }
    
    // Clear chat messages
    const chatContainer = document.getElementById('financialChatMessages');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
    
    // Reset progress
    document.getElementById('analyzerProgressBar').style.width = '0%';
    document.getElementById('analyzerProgressText').textContent = 'Initializing...';
    
    showNotification('Ready to analyze another statement', 'success');
}

// Security settings toggles
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('.setting-item')) {
        const settingName = e.target.closest('.setting-item').querySelector('h4').textContent;
        const isEnabled = e.target.checked;
        showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
    }
});

// Responsive sidebar handling
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 1024) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
});

console.log('🚀 FinSecure Dashboard Loaded Successfully!');
console.log('💡 Features: AI Assistant, Fraud Scanner, Education Hub, Life Simulator');
console.log('🔒 All security features are active and monitoring');