// Education Hub JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeEducationHub();
});

function initializeEducationHub() {
    // Initialize all education hub components
    initializeSidebar();
    initializeNavigation();
    initializeEducationTabs();
    initializeCourseInteractions();
    initializeSearch();
    initializeAIWidget();
    initializeLearningProgress();
}

// Sidebar Navigation (similar to dashboard but for education page)
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Set active link for education page
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'education.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Navigation Features
function initializeNavigation() {
    // Notifications
    const notificationBtn = document.getElementById('notifications');
    const messagesBtn = document.getElementById('messages');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('You have new course recommendations', 'info');
        });
    }
    
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            showNotification('You have unread messages from instructors', 'info');
        });
    }
}

// Education Tabs System
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
                
                // Initialize tab-specific content
                initializeTabContent(targetTab);
            }
        });
    });
}

// Initialize content for specific tabs
function initializeTabContent(tabName) {
    switch(tabName) {
        case 'courses':
            initializeCourseProgress();
            break;
        case 'articles':
            initializeArticleReading();
            break;
        case 'videos':
            initializeVideoPlayers();
            break;
        case 'webinars':
            initializeWebinarRegistration();
            break;
    }
}

// Course Interactions
function initializeCourseInteractions() {
    const courseBtns = document.querySelectorAll('.course-btn');
    
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('completed')) {
                // View certificate
                showCertificateModal(this.closest('.course-card'));
            } else {
                // Start or continue course
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('h3').textContent;
                startCourse(courseTitle, courseCard);
            }
        });
    });
}

// Start or continue a course
function startCourse(courseTitle, courseCard) {
    showNotification(`Starting "${courseTitle}"...`, 'success');
    
    // Simulate course loading
    setTimeout(() => {
        // Update progress
        const progressBar = courseCard.querySelector('.progress');
        const progressText = courseCard.querySelector('.course-progress span');
        
        let currentProgress = parseInt(progressBar.style.width) || 0;
        let newProgress = Math.min(currentProgress + 25, 100);
        
        progressBar.style.width = newProgress + '%';
        progressText.textContent = newProgress + '% Complete';
        
        if (newProgress === 100) {
            progressText.textContent = 'Completed';
            const courseBtn = courseCard.querySelector('.course-btn');
            courseBtn.textContent = 'View Certificate';
            courseBtn.classList.add('completed');
            courseCard.classList.add('course-completed');
            
            showNotification(`Congratulations! You've completed "${courseTitle}"`, 'success');
            
            // Award badge
            awardBadge(courseTitle);
        }
    }, 1000);
}

// Award badge for course completion
function awardBadge(courseTitle) {
    const badges = {
        'Cybersecurity Fundamentals': 'Cyber Defender',
        'Investment Basics': 'Smart Investor',
        'Budgeting & Saving': 'Budget Master',
        'Fraud Prevention': 'Fraud Fighter',
        'Credit Management': 'Credit Expert',
        'Home Ownership': 'Home Guru'
    };
    
    const badgeName = badges[courseTitle] || 'Achiever';
    
    showNotification(`🎉 You earned the "${badgeName}" badge!`, 'success');
    
    // Update learning progress
    updateLearningProgress();
}

// Initialize course progress tracking
function initializeCourseProgress() {
    // This would typically load from user's profile/data
    console.log('Course progress tracking initialized');
}

// Article reading functionality
function initializeArticleReading() {
    const articleBtns = document.querySelectorAll('.course-btn');
    
    articleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const articleCard = this.closest('.course-card');
            const articleTitle = articleCard.querySelector('h3').textContent;
            
            showArticleModal(articleTitle);
        });
    });
}

// Show article in modal
function showArticleModal(articleTitle) {
    // In a real implementation, this would fetch and display the full article
    showNotification(`Opening "${articleTitle}"...`, 'info');
    
    // Simulate article loading
    setTimeout(() => {
        const modalContent = `
            <div class="article-modal">
                <h2>${articleTitle}</h2>
                <div class="article-meta">
                    <span><i class="fas fa-clock"></i> 8 min read</span>
                    <span><i class="fas fa-calendar"></i> Published: Oct 15, 2023</span>
                </div>
                <div class="article-content">
                    <p>This is a preview of the article content. In a real implementation, 
                    this would contain the full article text with proper formatting, 
                    images, and interactive elements.</p>
                    <p>The article would provide valuable financial education content 
                    tailored to the specific topic.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" id="close-article">Close</button>
                    <button class="btn-primary" id="save-article">
                        <i class="fas fa-bookmark"></i> Save for Later
                    </button>
                </div>
            </div>
        `;
        
        showModal(articleTitle, modalContent);
        
        // Add event listeners for modal buttons
        document.getElementById('close-article').addEventListener('click', closeModal);
        document.getElementById('save-article').addEventListener('click', function() {
            saveArticle(articleTitle);
            closeModal();
        });
    }, 500);
}

// Video player functionality
function initializeVideoPlayers() {
    const videoBtns = document.querySelectorAll('.course-btn');
    
    videoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoCard = this.closest('.course-card');
            const videoTitle = videoCard.querySelector('h3').textContent;
            
            playVideo(videoTitle);
        });
    });
}

// Play video
function playVideo(videoTitle) {
    showNotification(`Loading "${videoTitle}"...`, 'info');
    
    // In a real implementation, this would open a video player
    setTimeout(() => {
        const modalContent = `
            <div class="video-modal">
                <div class="video-player">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Video Player - "${videoTitle}"</p>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${videoTitle}</h3>
                    <p>This is a placeholder for the video player. In a real implementation, 
                    this would contain an actual video player with controls, playback 
                    tracking, and related videos.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" id="close-video">Close</button>
                </div>
            </div>
        `;
        
        showModal(videoTitle, modalContent);
        document.getElementById('close-video').addEventListener('click', closeModal);
    }, 500);
}

// Webinar registration functionality
function initializeWebinarRegistration() {
    const webinarBtns = document.querySelectorAll('.course-btn');
    
    webinarBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const webinarCard = this.closest('.course-card');
            const webinarTitle = webinarCard.querySelector('h3').textContent;
            
            registerForWebinar(webinarTitle);
        });
    });
}

// Register for webinar
function registerForWebinar(webinarTitle) {
    const modalContent = `
        <div class="webinar-modal">
            <h3>Register for "${webinarTitle}"</h3>
            <form id="webinar-registration-form">
                <div class="form-group">
                    <label for="attendee-name">Full Name</label>
                    <input type="text" id="attendee-name" required>
                </div>
                <div class="form-group">
                    <label for="attendee-email">Email</label>
                    <input type="email" id="attendee-email" required>
                </div>
                <div class="form-group">
                    <label for="attendee-questions">Questions for Speakers (Optional)</label>
                    <textarea id="attendee-questions" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" id="cancel-registration">Cancel</button>
                    <button type="submit" class="btn-primary">Register Now</button>
                </div>
            </form>
        </div>
    `;
    
    showModal(`Register for ${webinarTitle}`, modalContent);
    
    document.getElementById('webinar-registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        completeWebinarRegistration(webinarTitle);
    });
    
    document.getElementById('cancel-registration').addEventListener('click', closeModal);
}

// Complete webinar registration
function completeWebinarRegistration(webinarTitle) {
    const name = document.getElementById('attendee-name').value;
    const email = document.getElementById('attendee-email').value;
    
    // Simulate registration process
    showNotification(`Registering ${name} for "${webinarTitle}"...`, 'info');
    
    setTimeout(() => {
        closeModal();
        showNotification(`Successfully registered for "${webinarTitle}"! Confirmation sent to ${email}`, 'success');
        
        // Add to calendar or set reminder
        addToCalendar(webinarTitle);
    }, 1500);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 2) {
                performSearch(query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
}

// Perform search across educational content
function performSearch(query) {
    // In a real implementation, this would search through courses, articles, etc.
    console.log(`Searching for: ${query}`);
    
    // Simulate search results
    const results = [
        { type: 'course', title: 'Cybersecurity Fundamentals', match: 'cybersecurity' },
        { type: 'article', title: '5 Signs of Phishing Emails', match: 'phishing' },
        { type: 'video', title: 'Two-Factor Authentication Explained', match: 'authentication' }
    ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.match.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    // This would update the UI with search results
    if (results.length > 0) {
        showNotification(`Found ${results.length} results for "${query}"`, 'info');
    } else {
        showNotification(`No results found for "${query}"`, 'warning');
    }
}

// AI Widget functionality
function initializeAIWidget() {
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeBtn = document.getElementById('close-ai-widget');
    const sendBtn = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    
    if (aiFab && aiWidget) {
        aiFab.addEventListener('click', function() {
            aiWidget.classList.toggle('active');
            aiFab.style.opacity = '0';
        });
        
        closeBtn.addEventListener('click', function() {
            aiWidget.classList.remove('active');
            aiFab.style.opacity = '1';
        });
        
        // Send message functionality
        const sendMessage = () => {
            const message = aiInput.value.trim();
            if (message) {
                addUserMessage(message);
                aiInput.value = '';
                
                // Simulate AI response
                setTimeout(() => {
                    addAIMessage(getAIResponse(message));
                }, 1000);
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Add user message to AI chat
function addUserMessage(message) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message user-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add AI message to chat
function addAIMessage(message) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Get AI response based on user message
function getAIResponse(message) {
    const responses = {
        'hello': 'Hello! How can I help you with your financial education today?',
        'hi': 'Hi there! What would you like to learn about?',
        'cybersecurity': 'Cybersecurity is crucial for financial protection. I recommend starting with our "Cybersecurity Fundamentals" course to learn about password security, two-factor authentication, and recognizing phishing attempts.',
        'investing': 'Investing can help grow your wealth over time. Check out our "Investment Basics" course to understand different investment types, risk management, and building a diversified portfolio.',
        'budget': 'Budgeting is the foundation of financial health. Our "Budgeting & Saving" course covers creating a realistic budget, tracking expenses, and building an emergency fund.',
        'fraud': 'Fraud prevention is essential. Learn to identify common scams in our "Fraud Prevention" course, which covers everything from credit card fraud to identity theft protection.',
        'credit': 'Good credit management can save you money. Our "Credit Management" course explains credit scores, reports, and strategies for improving your credit health.',
        'default': 'I\'d be happy to help you learn about that topic! We have courses, articles, and videos on various financial education topics. Could you be more specific about what you\'d like to learn?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

// Learning progress tracking
function initializeLearningProgress() {
    // This would load the user's actual progress from their profile
    updateLearningProgress();
}

// Update learning progress display
function updateLearningProgress() {
    // In a real implementation, this would calculate based on user's actual progress
    const progressStats = {
        coursesCompleted: 1,
        totalCourses: 6,
        learningStreak: 5,
        totalLearningTime: '12h 30m'
    };
    
    // Update the UI with these stats
    console.log('Learning progress updated:', progressStats);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 1000;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification-info { background: #3b82f6; }
            .notification-success { background: #22c55e; }
            .notification-warning { background: #f59e0b; }
            .notification-error { background: #ef4444; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function showModal(title, content) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Add styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal {
                background: #1e293b;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .modal-content {
                padding: 1.5rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Close modal functionality
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }
}

function saveArticle(articleTitle) {
    // In a real implementation, this would save to user's profile
    showNotification(`"${articleTitle}" saved to your reading list`, 'success');
}

function addToCalendar(eventTitle) {
    // In a real implementation, this would integrate with calendar APIs
    showNotification(`"${eventTitle}" added to your calendar`, 'success');
}

function showCertificateModal(courseCard) {
    const courseTitle = courseCard.querySelector('h3').textContent;
    const modalContent = `
        <div class="certificate-modal">
            <div class="certificate-preview">
                <div class="certificate-design">
                    <h2>Certificate of Completion</h2>
                    <p>This certifies that</p>
                    <h3>John Doe</h3>
                    <p>has successfully completed the course</p>
                    <h4>"${courseTitle}"</h4>
                    <div class="certificate-date">Completed on: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="close-certificate">Close</button>
                <button class="btn-primary" id="download-certificate">
                    <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn-primary" id="share-certificate">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    showModal('Certificate of Completion', modalContent);
    
    document.getElementById('close-certificate').addEventListener('click', closeModal);
    document.getElementById('download-certificate').addEventListener('click', function() {
        downloadCertificate(courseTitle);
    });
    document.getElementById('share-certificate').addEventListener('click', function() {
        shareCertificate(courseTitle);
    });
}

function downloadCertificate(courseTitle) {
    showNotification(`Downloading certificate for "${courseTitle}"...`, 'info');
    // In a real implementation, this would generate and download a PDF
}

function shareCertificate(courseTitle) {
    showNotification(`Sharing certificate for "${courseTitle}"...`, 'info');
    // In a real implementation, this would use the Web Share API
}