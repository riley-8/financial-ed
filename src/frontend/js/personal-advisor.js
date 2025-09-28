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
    initializeVoiceRecording();
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
        showNotification('Notifications feature coming soon!');
    });
    
    messagesBtn.addEventListener('click', function() {
        showNotification('Messages feature coming soon!');
    });
}

// AI Widget Functionality
function initializeAIWidget() {
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeWidget = document.getElementById('close-ai-widget');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    const widgetVoiceRecord = document.getElementById('widget-voice-record');

    aiFab.addEventListener('click', function() {
        aiWidget.classList.add('active');
        aiFab.style.display = 'none';
    });

    closeWidget.addEventListener('click', function() {
        aiWidget.classList.remove('active');
        aiFab.style.display = 'flex';
    });

    sendAiMessage.addEventListener('click', sendWidgetMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendWidgetMessage();
        }
    });

    widgetVoiceRecord.addEventListener('click', function() {
        toggleVoiceRecording('widget');
    });
}

function sendWidgetMessage() {
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');
    const message = aiInput.value.trim();

    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message-widget';
        userMessage.textContent = message;
        aiMessages.appendChild(userMessage);

        // Clear input
        aiInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span>AI is thinking...</span>
        `;
        aiMessages.appendChild(typingIndicator);

        // Scroll to bottom
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // Process AI response - ONLY CALL THIS ONCE
        processWidgetAIMessage(message, typingIndicator);
    }
}

// AI Chat Functionality
function initializeAIChat() {
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const quickActions = document.querySelectorAll('.quick-action');

    sendButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            sendChatMessage();
        });
    });
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (message) {
        // Add user message
        addMessageToChat('user', message);
        
        // Clear input
        chatInput.value = '';

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        // Process AI message - ONLY CALL THIS ONCE
        processAIMessage(message, typingIndicator);
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Handle both text and HTML content
    if (typeof message === 'string' && message.includes('<')) {
        content.innerHTML = message;
    } else {
        const messageParagraphs = message.split('\n').filter(p => p.trim());
        messageParagraphs.forEach((paragraph, index) => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            content.appendChild(p);
        });
    }

    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messageDiv.appendChild(timestamp);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingIndicator;
}

// Voice Recording Functionality with Real-time Speech Recognition
function initializeVoiceRecording() {
    const voiceRecordBtn = document.getElementById('voice-record');
    const widgetVoiceRecord = document.getElementById('widget-voice-record');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const voiceStatus = document.getElementById('voice-status');
    const voiceStatusText = voiceStatus.querySelector('span');

    let recognition = null;
    let isRecording = false;
    let finalTranscript = '';
    let currentContext = '';

    // Check if speech recognition is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        voiceRecordBtn.style.display = 'none';
        widgetVoiceRecord.style.display = 'none';
        console.warn('Speech recognition not supported in this browser');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    voiceRecordBtn.addEventListener('click', function() {
        toggleVoiceRecording('main');
    });

    widgetVoiceRecord.addEventListener('click', function() {
        toggleVoiceRecording('widget');
    });

    stopRecordingBtn.addEventListener('click', stopRecording);

    function initializeRecognition() {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Speech recognition started');
            isRecording = true;
            finalTranscript = '';
            updateUIForRecording(true);
        };

        recognition.onresult = function(event) {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update the input field in real-time with interim results
            updateInputWithTranscript(finalTranscript + interimTranscript);
            
            // Update status text with current transcription
            if (interimTranscript) {
                voiceStatusText.textContent = `Listening... "${interimTranscript}"`;
            } else if (finalTranscript) {
                voiceStatusText.textContent = `Listening... Ready for more`;
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                showNotification('Microphone access denied. Please allow microphone permissions in your browser settings.', 'error');
            } else if (event.error === 'no-speech') {
                showNotification('No speech detected. Please try speaking again.', 'warning');
            } else {
                showNotification('Speech recognition error: ' + event.error, 'error');
            }
            stopRecording();
        };

        recognition.onend = function() {
            console.log('Speech recognition ended');
            if (isRecording) {
                // Automatically restart recognition if we're still supposed to be recording
                recognition.start();
            } else {
                processFinalTranscript();
            }
        };
    }

    function toggleVoiceRecording(context) {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording(context);
        }
    }

    function startRecording(context) {
        currentContext = context;
        
        if (!recognition) {
            initializeRecognition();
        }

        try {
            recognition.start();
            showNotification('Speech recognition started. Speak now!', 'info');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            showNotification('Error starting speech recognition. Please try again.', 'error');
        }
    }

    function stopRecording() {
        if (recognition && isRecording) {
            isRecording = false;
            recognition.stop();
            updateUIForRecording(false);
            showNotification('Speech recognition stopped.', 'info');
        }
    }

    function updateUIForRecording(recording) {
        if (currentContext === 'main') {
            voiceRecordBtn.classList.toggle('recording', recording);
            voiceStatus.classList.toggle('active', recording);
            if (!recording) {
                voiceStatusText.textContent = 'Listening... Speak now';
            }
        } else {
            widgetVoiceRecord.classList.toggle('recording', recording);
        }
    }

    function updateInputWithTranscript(transcript) {
        const trimmedTranscript = transcript.trim();
        if (currentContext === 'main') {
            document.getElementById('chat-input').value = trimmedTranscript;
        } else {
            document.getElementById('ai-input').value = trimmedTranscript;
        }
    }

    function processFinalTranscript() {
        if (finalTranscript.trim()) {
            // Auto-send the message if we have substantial content
            if (finalTranscript.split(' ').length >= 2) {
                if (currentContext === 'main') {
                    setTimeout(() => {
                        sendChatMessage();
                    }, 500);
                } else {
                    setTimeout(() => {
                        sendWidgetMessage();
                    }, 500);
                }
            }
        }
        finalTranscript = '';
    }

    // Add keyboard shortcut for voice recording (Ctrl+Space)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            toggleVoiceRecording('main');
        }
    });
}

// Enhanced AI Message Processing with API Integration - MAIN CHAT
async function processAIMessage(message, typingIndicator) {
    try {
        // Try to use the Gemini API
        const response = await callGeminiAPI(message, 'Personal Financial Advisor consultation');
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        // Add AI response - ONLY ONCE
        addMessageToChat('ai', response);

    } catch (error) {
        console.error('AI processing error:', error);
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        // Show fallback response - ONLY ONCE
        addMessageToChat('ai', getAIResponse(message));
    }
}

// Widget AI Message Processing
async function processWidgetAIMessage(message, typingIndicator) {
    try {
        // Try to use the Gemini API
        const response = await callGeminiAPI(message, 'AI Widget consultation');
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        // Add AI response to widget
        const aiMessages = document.getElementById('ai-messages');
        const aiResponse = document.createElement('div');
        aiResponse.className = 'ai-message';
        aiResponse.textContent = response;
        aiMessages.appendChild(aiResponse);
        aiMessages.scrollTop = aiMessages.scrollHeight;

    } catch (error) {
        console.error('Widget AI processing error:', error);
        
        // Remove typing indicator
        if (typingIndicator && typingIndicator.parentNode) {
            typingIndicator.remove();
        }
        
        // Show fallback response in widget
        const aiMessages = document.getElementById('ai-messages');
        const aiResponse = document.createElement('div');
        aiResponse.className = 'ai-message';
        aiResponse.textContent = getAIResponse(message);
        aiMessages.appendChild(aiResponse);
        aiMessages.scrollTop = aiMessages.scrollHeight;
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
        throw error; // Re-throw to be handled by the caller
    }
}

// AI Response Generator (Fallback)
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio') || lowerMessage.includes('stock')) {
        return `Based on your question about investments, I recommend considering a diversified portfolio. For medium-term growth (3-5 years), a balanced approach with 60% equities, 30% bonds, and 10% alternative investments could be suitable. Remember to consider your risk tolerance and investment timeline.\n\nKey principles:\n• Diversify across asset classes\n• Consider low-cost index funds\n• Regular contributions (dollar-cost averaging)\n• Long-term perspective`;
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('saving') || lowerMessage.includes('expense')) {
        return `For effective budgeting, I suggest the 50/30/20 rule:\n\n50% for Needs:\n• Housing, utilities, groceries\n• Transportation, insurance\n• Minimum debt payments\n\n30% for Wants:\n• Dining out, entertainment\n• Travel, hobbies\n• Non-essential purchases\n\n20% for Savings & Debt:\n• Emergency fund\n• Retirement accounts\n• Extra debt payments\n\nStart by tracking your expenses for a month to understand your spending patterns.`;
    } else if (lowerMessage.includes('fraud') || lowerMessage.includes('scam') || lowerMessage.includes('security') || lowerMessage.includes('phishing')) {
        return `To protect yourself from financial fraud:\n\n🔒 Security Best Practices:\n• Use strong, unique passwords for each account\n• Enable two-factor authentication everywhere\n• Monitor accounts regularly for suspicious activity\n• Be cautious of phishing emails and suspicious links\n• Keep software and antivirus updated\n\n⚠️ Red Flags to Watch For:\n• Unexpected requests for personal information\n• Urgent or threatening language\n• Offers that seem too good to be true\n• Spelling and grammar errors in communications`;
    } else if (lowerMessage.includes('interest') || lowerMessage.includes('compound')) {
        return `Compound interest is often called the "eighth wonder of the world." Here's how it works:\n\n📈 Compound Interest Explained:\n• Interest calculated on initial principal + accumulated interest\n• Earnings generate their own earnings over time\n• Powerful long-term growth effect\n\n💡 Example: Investing R1,000 at 8% annual return:\nYear 1: R1,080\nYear 5: R1,469\nYear 10: R2,159\nYear 20: R4,661\n\nThe key is starting early and staying consistent!`;
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
        return `Emergency funds are crucial for financial security:\n\n💰 Recommended Guidelines:\n• 3-6 months of essential living expenses\n• Keep in easily accessible account (savings account)\n• Only use for genuine emergencies\n• Replenish after use\n\n🎯 Essential Expenses to Cover:\n• Housing (rent/mortgage)\n• Utilities and insurance\n• Groceries and essential medications\n• Minimum debt payments\n\nStart small and build gradually - even R1,000 can cover minor emergencies!`;
    } else {
        return `Thank you for your question! I'm here to help with your financial needs.\n\nBased on your message about "${message}", here are some areas I can assist with:\n\n• Investment planning and portfolio management\n• Budget creation and expense tracking\n• Debt management strategies\n• Retirement planning\n• Financial security and fraud prevention\n• General financial education\n\nCould you provide more specific details about what you'd like to achieve? This will help me give you the most relevant advice.`;
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    showNotification(`Searching for: ${query}`);
    // Implement search functionality
    console.log('Search query:', query);
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 1rem 1.5rem;
                color: #e2e8f0;
                z-index: 1100;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification i {
                color: #22c55e;
            }
            .notification-warning i {
                color: #f59e0b;
            }
            .notification-error i {
                color: #ef4444;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-in reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Export functions for global access
window.toggleVoiceRecording = function(context) {
    const event = new Event('click');
    if (context === 'main') {
        document.getElementById('voice-record').dispatchEvent(event);
    } else {
        document.getElementById('widget-voice-record').dispatchEvent(event);
    }
};