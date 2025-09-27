// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const aiWidget = document.getElementById('ai-widget');
const aiFab = document.getElementById('ai-fab');
const closeAiWidget = document.getElementById('close-ai-widget');
const categoryBtns = document.querySelectorAll('.category-btn');
const challengeCards = document.querySelectorAll('.challenge-card');
const challengeActionBtns = document.querySelectorAll('.challenge-action-btn');
const searchInput = document.getElementById('global-search');
const aiInput = document.getElementById('ai-input');
const sendAiMessage = document.getElementById('send-ai-message');
const aiMessages = document.getElementById('ai-messages');

// Initialize the challenges page
document.addEventListener('DOMContentLoaded', function() {
    initializeChallenges();
    setupEventListeners();
    loadUserProgress();
});

// Initialize challenges functionality
function initializeChallenges() {
    // Set active category based on URL parameter or default to 'all'
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    
    // Set active category button
    categoryBtns.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter challenges based on category
    filterChallenges(category);
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Category filter buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    // Challenge action buttons
    challengeActionBtns.forEach(btn => {
        btn.addEventListener('click', handleChallengeAction);
    });
    
    // Global search
    searchInput.addEventListener('input', handleSearch);
    
    // AI Widget
    aiFab.addEventListener('click', toggleAiWidget);
    closeAiWidget.addEventListener('click', toggleAiWidget);
    
    // AI Message sending
    sendAiMessage.addEventListener('click', sendAiMessageHandler);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAiMessageHandler();
        }
    });
    
    // Close AI widget when clicking outside
    document.addEventListener('click', function(e) {
        if (!aiWidget.contains(e.target) && !aiFab.contains(e.target) && aiWidget.classList.contains('active')) {
            toggleAiWidget();
        }
    });
}

// Toggle sidebar collapse
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    
    // Update localStorage preference
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Handle category filtering
function handleCategoryFilter(e) {
    const category = e.target.dataset.category;
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter challenges
    filterChallenges(category);
    
    // Update URL parameter
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.replaceState({}, '', url);
}

// Filter challenges by category
function filterChallenges(category) {
    challengeCards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Handle challenge actions (start/continue)
function handleChallengeAction(e) {
    const button = e.target;
    const action = button.dataset.action;
    const challengeId = button.closest('.challenge-card').dataset.challengeId;
    
    // Show loading state
    const originalText = button.textContent;
    button.textContent = action === 'start' ? 'Starting...' : 'Continuing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (action === 'start') {
            startChallenge(challengeId);
            button.textContent = 'Continue Challenge';
            button.dataset.action = 'continue';
        } else {
            continueChallenge(challengeId);
        }
        button.disabled = false;
        
        // Show success notification
        showNotification(`Challenge "${getChallengeName(challengeId)}" ${action}ed successfully!`, 'success');
    }, 1000);
}

// Start a new challenge
function startChallenge(challengeId) {
    const progress = getChallengeProgress(challengeId);
    if (progress === 0) {
        // Update progress in localStorage
        const challenges = getChallengesProgress();
        challenges[challengeId] = { started: true, progress: 0.1 }; // 10% initial progress
        localStorage.setItem('challengesProgress', JSON.stringify(challenges));
        
        // Update UI
        updateChallengeProgressUI(challengeId, 0.1);
    }
}

// Continue an existing challenge
function continueChallenge(challengeId) {
    const progress = getChallengeProgress(challengeId);
    if (progress < 1) {
        // Simulate progress increase
        const newProgress = Math.min(progress + 0.25, 1); // 25% progress increase
        
        // Update progress in localStorage
        const challenges = getChallengesProgress();
        challenges[challengeId].progress = newProgress;
        localStorage.setItem('challengesProgress', JSON.stringify(challenges));
        
        // Update UI
        updateChallengeProgressUI(challengeId, newProgress);
        
        // Check if challenge is completed
        if (newProgress === 1) {
            completeChallenge(challengeId);
        }
    }
}

// Complete a challenge
function completeChallenge(challengeId) {
    const challenges = getChallengesProgress();
    challenges[challengeId].completed = true;
    challenges[challengeId].completedAt = new Date().toISOString();
    localStorage.setItem('challengesProgress', JSON.stringify(challenges));
    
    // Award XP and badges
    awardChallengeRewards(challengeId);
    
    // Show completion modal
    showChallengeCompletionModal(challengeId);
}

// Update challenge progress UI
function updateChallengeProgressUI(challengeId, progress) {
    const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
    if (challengeCard) {
        const progressBar = challengeCard.querySelector('.progress');
        const progressText = challengeCard.querySelector('.challenge-progress span');
        
        if (progressBar && progressText) {
            const percentage = Math.round(progress * 100);
            progressBar.style.width = `${percentage}%`;
            
            // Update progress text based on challenge type
            const challengeData = getChallengeData(challengeId);
            if (challengeData) {
                const currentValue = Math.round(challengeData.total * progress);
                progressText.textContent = `${currentValue}/${challengeData.total} ${challengeData.unit}`;
            }
        }
    }
}

// Award XP and badges for completed challenge
function awardChallengeRewards(challengeId) {
    const challengeData = getChallengeData(challengeId);
    if (challengeData) {
        // Update user XP
        const userStats = getUserStats();
        userStats.xp += challengeData.reward.xp;
        userStats.completedChallenges += 1;
        localStorage.setItem('userStats', JSON.stringify(userStats));
        
        // Award badge if applicable
        if (challengeData.reward.badge) {
            awardBadge(challengeData.reward.badge);
        }
        
        // Update UI
        updateUserStatsUI();
    }
}

// Award a badge to the user
function awardBadge(badgeId) {
    const badges = getUserBadges();
    if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        localStorage.setItem('userBadges', JSON.stringify(badges));
        
        // Update badges UI
        updateBadgesUI();
        
        // Show badge unlocked notification
        showNotification(`New badge unlocked: ${getBadgeName(badgeId)}!`, 'success');
    }
}

// Handle global search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Show all challenges in current category
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        filterChallenges(activeCategory);
        return;
    }
    
    // Filter challenges based on search term
    challengeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toggle AI widget visibility
function toggleAiWidget() {
    aiWidget.classList.toggle('active');
    aiFab.style.display = aiWidget.classList.contains('active') ? 'none' : 'block';
    
    if (aiWidget.classList.contains('active')) {
        aiInput.focus();
    }
}

// Handle AI message sending
function sendAiMessageHandler() {
    const message = aiInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addAiMessage(message, 'user');
    aiInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAiResponse(message);
        addAiMessage(aiResponse, 'ai');
    }, 1000);
}

// Add message to AI chat
function addAiMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// Generate AI response based on user message
function generateAiResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('budget') || message.includes('save')) {
        return "For budget challenges, I recommend starting with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Would you like me to help you create a personalized budget plan?";
    } else if (message.includes('security') || message.includes('phishing')) {
        return "Security challenges are crucial! Always check sender addresses, look for spelling errors, and never click suspicious links. Want to practice with some simulated phishing exercises?";
    } else if (message.includes('investment') || message.includes('stock')) {
        return "Investment challenges teach valuable skills. Start with diversified portfolios and understand risk tolerance. I can help you analyze different investment strategies!";
    } else if (message.includes('help') || message.includes('how')) {
        return "I can help you with: budgeting strategies, security best practices, investment guidance, and challenge explanations. What specific area would you like assistance with?";
    } else if (message.includes('xp') || message.includes('points')) {
        return "You earn XP by completing challenges, maintaining streaks, and achieving milestones. Current XP: 1,250. You're 250 XP away from leveling up!";
    } else if (message.includes('badge') || message.includes('achievement')) {
        return "You have 8 badges unlocked! Badges represent mastery in different financial areas. Complete related challenges to unlock more badges and showcase your expertise.";
    } else {
        return "I'm here to help you with financial challenges! You can ask me about budgeting, security, investments, XP, badges, or specific challenges. What would you like to know?";
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                background: rgba(30, 41, 59, 0.95);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 1rem;
                color: white;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            .notification.success {
                border-color: #22c55e;
            }
            .notification.error {
                border-color: #ef4444;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show challenge completion modal
function showChallengeCompletionModal(challengeId) {
    const challengeData = getChallengeData(challengeId);
    if (!challengeData) return;
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-trophy"></i>
                    <h2>Challenge Completed!</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>${challengeData.name}</h3>
                    <p>Congratulations! You've successfully completed this challenge.</p>
                    <div class="rewards-earned">
                        <div class="reward-item">
                            <i class="fas fa-star"></i>
                            <span>+${challengeData.reward.xp} XP</span>
                        </div>
                        ${challengeData.reward.badge ? `
                        <div class="reward-item">
                            <i class="fas fa-medal"></i>
                            <span>${getBadgeName(challengeData.reward.badge)} Badge</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" id="continue-challenges">Continue Challenges</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    if (!document.querySelector('.modal-styles')) {
        const styles = document.createElement('style');
        styles.className = 'modal-styles';
        styles.textContent = `
            .completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            .modal-overlay {
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: rgba(30, 41, 59, 0.95);
                border: 2px solid #22c55e;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
            }
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                position: relative;
            }
            .modal-header i {
                font-size: 2rem;
                color: #f59e0b;
            }
            .modal-header h2 {
                color: #22c55e;
                margin: 0;
            }
            .modal-close {
                position: absolute;
                top: 0;
                right: 0;
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .rewards-earned {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin: 1.5rem 0;
            }
            .reward-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #f59e0b;
                font-weight: 600;
            }
            .btn-primary {
                background: #22c55e;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Handle modal close
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#continue-challenges').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Data helper functions
function getChallengesProgress() {
    return JSON.parse(localStorage.getItem('challengesProgress')) || {};
}

function getChallengeProgress(challengeId) {
    const challenges = getChallengesProgress();
    return challenges[challengeId]?.progress || 0;
}

function getUserStats() {
    return JSON.parse(localStorage.getItem('userStats')) || { xp: 1250, completedChallenges: 15 };
}

function getUserBadges() {
    return JSON.parse(localStorage.getItem('userBadges')) || ['quick-learner', 'security-novice', 'investment-beginner'];
}

function getChallengeData(challengeId) {
    const challenges = {
        'budget-master': {
            name: 'Budget Master',
            total: 3,
            unit: 'months',
            reward: { xp: 500, badge: 'budget-master' }
        },
        'security-sentinel': {
            name: 'Security Sentinel',
            total: 5,
            unit: 'exercises',
            reward: { xp: 750, badge: 'security-expert' }
        },
        'daily-knowledge': {
            name: 'Daily Knowledge',
            total: 7,
            unit: 'days',
            reward: { xp: 200, badge: 'consistency' }
        },
        'investment-guru': {
            name: 'Investment Guru',
            total: 3,
            unit: 'decisions',
            reward: { xp: 1000, badge: 'investment-guru' }
        },
        'phishing-pro': {
            name: 'Phishing Pro',
            total: 10,
            unit: 'attempts',
            reward: { xp: 600, badge: 'phishing-pro' }
        },
        'weekly-savings': {
            name: 'Weekly Savings',
            total: 4,
            unit: 'weeks',
            reward: { xp: 400, badge: 'savings-champion' }
        }
    };
    return challenges[challengeId];
}

function getChallengeName(challengeId) {
    const data = getChallengeData(challengeId);
    return data ? data.name : challengeId;
}

function getBadgeName(badgeId) {
    const badges = {
        'budget-master': 'Budget Master',
        'security-expert': 'Security Expert',
        'consistency': 'Consistency',
        'investment-guru': 'Investment Guru',
        'phishing-pro': 'Phishing Pro',
        'savings-champion': 'Savings Champion'
    };
    return badges[badgeId] || badgeId;
}

function updateUserStatsUI() {
    const stats = getUserStats();
    document.querySelector('.user-stats-overview').innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.xp.toLocaleString()}</h3>
                <p>Total XP</p>
                <span class="stat-change positive">+150 this week</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-medal"></i>
            </div>
            <div class="stat-info">
                <h3>${getUserBadges().length}</h3>
                <p>Badges Earned</p>
                <span class="stat-change positive">+2 this month</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.completedChallenges}</h3>
                <p>Challenges Completed</p>
                <span class="stat-change positive">67% success rate</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-fire"></i>
            </div>
            <div class="stat-info">
                <h3>7</h3>
                <p>Day Streak</p>
                <span class="stat-change positive">Keep going!</span>
            </div>
        </div>
    `;
}

function updateBadgesUI() {
    const badges = getUserBadges();
    // This would update the badges grid based on unlocked badges
}

function loadUserProgress() {
    // Load any saved progress and update UI accordingly
    challengeCards.forEach(card => {
        const challengeId = card.dataset.challengeId;
        const progress = getChallengeProgress(challengeId);
        if (progress > 0) {
            updateChallengeProgressUI(challengeId, progress);
            
            // Update button text if challenge is started
            const button = card.querySelector('.challenge-action-btn');
            if (button && progress < 1) {
                button.textContent = 'Continue Challenge';
                button.dataset.action = 'continue';
            }
        }
    });
}

// Export functions for use in other modules if needed
window.ChallengesModule = {
    initializeChallenges,
    startChallenge,
    continueChallenge,
    completeChallenge,
    awardBadge
};