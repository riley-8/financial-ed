// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');

        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Chat Manager
class ChatManager {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-message');
        this.voiceButton = document.getElementById('voice-record');
        this.voiceStatus = document.getElementById('voice-status');
        this.stopRecordingButton = document.getElementById('stop-recording');
        this.recognition = null;
        this.isRecording = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initSpeechRecognition();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.voiceButton.addEventListener('click', () => this.toggleVoiceRecording());
        this.stopRecordingButton.addEventListener('click', () => this.stopVoiceRecording());

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.addUserMessage(message);
                this.generateAIResponse(message);
            });
        });

        // Audio play buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.audio-play-btn')) {
                this.handleAudioPlay(e.target.closest('.audio-play-btn'));
            }
        });
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.chatInput.value = transcript;
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showNotification('Speech recognition error: ' + event.error, 'error');
                this.stopVoiceRecording();
            };

            this.recognition.onend = () => {
                if (this.isRecording) {
                    this.stopVoiceRecording();
                }
            };
        } else {
            this.voiceButton.style.display = 'none';
            console.warn('Speech recognition not supported in this browser');
        }
    }

    toggleVoiceRecording() {
        if (this.isRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        if (this.recognition) {
            this.recognition.start();
            this.isRecording = true;
            this.voiceButton.classList.add('recording');
            this.voiceStatus.classList.add('active');
            this.showNotification('Listening... Speak now', 'info');
        }
    }

    stopVoiceRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            this.isRecording = false;
            this.voiceButton.classList.remove('recording');
            this.voiceStatus.classList.remove('active');
        }
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addUserMessage(message);
            this.generateAIResponse(message);
            this.chatInput.value = '';
        }
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const messageElement = this.createMessageElement(message, 'ai');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        return messageElement;
    }

    createMessageElement(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Convert line breaks and format the message
        const formattedMessage = this.formatMessage(message);
        contentDiv.innerHTML = formattedMessage;

        // Add audio controls for AI messages
        if (type === 'ai') {
            const audioControls = document.createElement('div');
            audioControls.className = 'message-audio-controls';
            audioControls.innerHTML = `
                <button class="audio-play-btn" data-text="${message.replace(/"/g, '&quot;')}">
                    <i class="fas fa-play"></i>
                    <span>Play Audio</span>
                </button>
                <audio class="message-audio" preload="none"></audio>
            `;
            contentDiv.appendChild(audioControls);
        }

        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timestampDiv);

        return messageDiv;
    }

    formatMessage(message) {
        // Convert line breaks to <br> tags
        let formatted = message.replace(/\n/g, '<br>');
        
        // Convert URLs to clickable links
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: var(--accent-color);">$1</a>');
        
        // Convert *bold* text to <strong>
        formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
        
        return `<p>${formatted}</p>`;
    }

    generateAIResponse(userMessage) {
        // Simulate AI thinking delay
        setTimeout(() => {
            const responses = this.getAIResponses(userMessage);
            const response = responses[Math.floor(Math.random() * responses.length)];
            const messageElement = this.addAIMessage(response);
            
            // Auto-play audio for AI responses
            const audioBtn = messageElement.querySelector('.audio-play-btn');
            if (audioBtn) {
                setTimeout(() => this.handleAudioPlay(audioBtn), 500);
            }
        }, 1000 + Math.random() * 2000);
    }

    getAIResponses(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio')) {
            return [
                `Based on your current financial situation, I recommend a diversified portfolio with 60% in low-cost index funds, 30% in bonds, and 10% in emerging markets. This balances growth potential with risk management.`,
                `For medium-term growth with R10,000, consider a mix of 50% equity ETFs, 30% government bonds, and 20% in high-quality dividend stocks. Remember to review your portfolio quarterly.`,
                `Investment strategy should align with your risk tolerance. If you're conservative, focus on 70% fixed income and 30% blue-chip stocks. For aggressive growth, consider 80% equities with international exposure.`
            ];
        } else if (lowerMessage.includes('budget') || lowerMessage.includes('saving')) {
            return [
                `A good budgeting rule is the 50/30/20 method: 50% for needs, 30% for wants, and 20% for savings/debt repayment. I can help you create a personalized budget based on your income.`,
                `To improve your savings, track your expenses for 30 days, identify unnecessary spending, and automate your savings transfers. Even small amounts add up through compound interest.`,
                `Budget planning starts with understanding your cash flow. List all income sources and categorize expenses. Aim to save at least 15-20% of your income for long-term financial security.`
            ];
        } else if (lowerMessage.includes('fraud') || lowerMessage.includes('security')) {
            return [
                `Recent phishing scams involve fake bank alerts and COVID-19 relief offers. Always verify sender addresses and never click suspicious links. Enable two-factor authentication on all accounts.`,
                `To protect against fraud: monitor accounts weekly, use unique passwords, enable transaction alerts, and freeze your credit when not applying for loans. Report suspicious activity immediately.`,
                `Security best practices include using a password manager, avoiding public Wi-Fi for financial transactions, and regularly checking your credit report for unauthorized accounts.`
            ];
        } else if (lowerMessage.includes('interest') || lowerMessage.includes('loan')) {
            return [
                `Compound interest is interest calculated on the initial principal and also on the accumulated interest. It's powerful for savings but dangerous for debt. The formula is A = P(1 + r/n)^(nt).`,
                `When comparing loans, look beyond the interest rate to the APR (Annual Percentage Rate), which includes fees. For savings, compound interest works best with regular contributions and time.`,
                `Understanding interest rates is crucial. Fixed rates stay the same; variable rates change. For borrowing, fixed rates provide predictability. For saving, higher compounding frequency yields better returns.`
            ];
        } else {
            return [
                `I understand you're asking about "${userMessage}". As your financial advisor, I recommend consulting with a certified professional for personalized advice on complex matters.`,
                `That's an interesting question about ${userMessage.split(' ').slice(0, 3).join(' ')}. For detailed guidance, I suggest reviewing your financial goals and current situation together.`,
                `Thank you for your question. To provide the most accurate advice, I'd need more context about your financial objectives and risk tolerance. Would you like to discuss this further?`,
                `I'm here to help with financial guidance. For specific questions like this, it's best to consider your overall financial plan. Would you like me to explain any particular concept in more detail?`
            ];
        }
    }

    async handleAudioPlay(button) {
        const text = button.getAttribute('data-text');
        const audioElement = button.nextElementSibling;
        const icon = button.querySelector('i');

        if (audioElement.src && !audioElement.ended) {
            // Audio is playing, pause it
            audioElement.pause();
            audioElement.currentTime = 0;
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            button.classList.remove('playing');
            return;
        }

        try {
            button.classList.add('playing');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-spinner', 'fa-spin');

            // Use the Web Speech API for text-to-speech
            if ('speechSynthesis' in window) {
                // Stop any ongoing speech
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;

                utterance.onstart = () => {
                    icon.classList.remove('fa-spinner', 'fa-spin');
                    icon.classList.add('fa-pause');
                };

                utterance.onend = () => {
                    button.classList.remove('playing');
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                };

                utterance.onerror = () => {
                    button.classList.remove('playing');
                    icon.classList.remove('fa-spinner', 'fa-spin');
                    icon.classList.add('fa-play');
                    this.showNotification('Audio playback failed', 'error');
                };

                window.speechSynthesis.speak(utterance);
            } else {
                throw new Error('Text-to-speech not supported');
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            button.classList.remove('playing');
            icon.classList.remove('fa-spinner', 'fa-spin');
            icon.classList.add('fa-play');
            this.showNotification('Audio playback not available', 'error');
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// AI Widget Manager
class AIWidgetManager {
    constructor() {
        this.widget = document.getElementById('ai-widget');
        this.fab = document.getElementById('ai-fab');
        this.closeButton = document.getElementById('close-ai-widget');
        this.aiInput = document.getElementById('ai-input');
        this.sendButton = document.getElementById('send-ai-message');
        this.voiceButton = document.getElementById('widget-voice-record');
        this.aiMessages = document.getElementById('ai-messages');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.fab.addEventListener('click', () => this.toggleWidget());
        this.closeButton.addEventListener('click', () => this.hideWidget());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.voiceButton.addEventListener('click', () => this.toggleVoiceRecording());
    }

    toggleWidget() {
        if (this.widget.classList.contains('active')) {
            this.hideWidget();
        } else {
            this.showWidget();
        }
    }

    showWidget() {
        this.widget.classList.add('active');
        this.fab.style.opacity = '0';
        setTimeout(() => {
            this.aiInput.focus();
        }, 300);
    }

    hideWidget() {
        this.widget.classList.remove('active');
        this.fab.style.opacity = '1';
    }

    sendMessage() {
        const message = this.aiInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.generateResponse(message);
            this.aiInput.value = '';
        }
    }

    addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message-widget' : 'ai-message';
        messageDiv.textContent = message;
        this.aiMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    generateResponse(userMessage) {
        setTimeout(() => {
            const responses = [
                "I can help with that! For detailed analysis, please use the main chat interface.",
                "That's a great question! The full advisor can provide more comprehensive guidance.",
                "I recommend discussing this in the main chat for personalized advice.",
                "For security and detailed financial advice, please use the complete advisor feature."
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(response, 'ai');
        }, 1000);
    }

    toggleVoiceRecording() {
        // Simplified voice recording for widget
        this.showNotification('Voice feature available in main chat', 'info');
    }

    scrollToBottom() {
        this.aiMessages.scrollTop = this.aiMessages.scrollHeight;
    }

    showNotification(message, type) {
        // Reuse the notification system from ChatManager
        const chatManager = window.chatManager;
        if (chatManager && chatManager.showNotification) {
            chatManager.showNotification(message, type);
        }
    }
}

// Sidebar Manager
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleButton = document.getElementById('sidebar-toggle');
        this.init();
    }

    init() {
        this.toggleButton.addEventListener('click', () => this.toggleSidebar());
        
        // Close sidebar when clicking on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !this.sidebar.contains(e.target) && 
                !e.target.closest('.sidebar-toggle')) {
                this.sidebar.classList.add('collapsed');
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
    }
}

// Global Audio Player Manager
class AudioPlayerManager {
    constructor() {
        this.player = document.getElementById('global-audio-player');
        this.audioElement = document.getElementById('global-audio');
        this.closeButton = document.getElementById('close-audio-player');
        this.playPauseButton = document.getElementById('play-pause-audio');
        this.stopButton = document.getElementById('stop-audio');
        this.downloadButton = document.getElementById('download-audio');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeButton.addEventListener('click', () => this.hide());
        this.playPauseButton.addEventListener('click', () => this.togglePlayPause());
        this.stopButton.addEventListener('click', () => this.stop());
        this.downloadButton.addEventListener('click', () => this.download());

        this.audioElement.addEventListener('play', () => this.updatePlayPauseButton(true));
        this.audioElement.addEventListener('pause', () => this.updatePlayPauseButton(false));
        this.audioElement.addEventListener('ended', () => this.updatePlayPauseButton(false));
    }

    playAudio(audioUrl, title = 'AI Response') {
        this.audioElement.src = audioUrl;
        this.audioElement.play();
        this.player.classList.add('active');
        this.updateAudioInfo(title);
    }

    togglePlayPause() {
        if (this.audioElement.paused) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    }

    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.updatePlayPauseButton(false);
    }

    download() {
        if (this.audioElement.src) {
            const a = document.createElement('a');
            a.href = this.audioElement.src;
            a.download = 'ai-response.mp3';
            a.click();
        }
    }

    hide() {
        this.player.classList.remove('active');
        this.stop();
    }

    updatePlayPauseButton(playing) {
        const icon = this.playPauseButton.querySelector('i');
        icon.classList.toggle('fa-play', !playing);
        icon.classList.toggle('fa-pause', playing);
    }

    updateAudioInfo(title) {
        const audioInfo = this.player.querySelector('.audio-info span');
        audioInfo.textContent = title;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    window.themeManager = new ThemeManager();
    window.chatManager = new ChatManager();
    window.aiWidgetManager = new AIWidgetManager();
    window.sidebarManager = new SidebarManager();
    window.audioPlayerManager = new AudioPlayerManager();

    // Make logo clickable to redirect to landing page
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', function() {
            window.location.href = 'landing.html';
        });
    }

    console.log('Personal Advisor page initialized successfully!');
});

// Handle page visibility change for audio
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause all audio when page is hidden
        window.speechSynthesis.cancel();
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => audio.pause());
    }
});