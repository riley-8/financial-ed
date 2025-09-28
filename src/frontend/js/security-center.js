// Enhanced Security Center JavaScript with Interactive Security Status

// Security Assessment Data
const securityCategories = {
    passwords: {
        name: 'Password Security',
        weight: 20,
        icon: 'fas fa-key',
        questions: [
            {
                id: 'unique_passwords',
                question: 'Do you use unique passwords for each financial account?',
                options: [
                    { text: 'Yes, all accounts have unique passwords', score: 100 },
                    { text: 'Most accounts have unique passwords', score: 75 },
                    { text: 'Some accounts share passwords', score: 40 },
                    { text: 'I reuse passwords across accounts', score: 10 }
                ]
            },
            {
                id: 'password_strength',
                question: 'How complex are your passwords?',
                options: [
                    { text: '12+ characters with letters, numbers, symbols', score: 100 },
                    { text: '8+ characters with letters and numbers', score: 70 },
                    { text: 'Basic passwords with letters only', score: 30 },
                    { text: 'Simple passwords or common words', score: 10 }
                ]
            }
        ]
    },
    twoFactor: {
        name: 'Two-Factor Authentication',
        weight: 25,
        icon: 'fas fa-shield-alt',
        questions: [
            {
                id: 'twofa_coverage',
                question: 'How many financial accounts have 2FA enabled?',
                options: [
                    { text: 'All accounts (100%)', score: 100 },
                    { text: 'Most accounts (75%+)', score: 80 },
                    { text: 'Some accounts (25-75%)', score: 50 },
                    { text: 'Few or no accounts', score: 10 }
                ]
            },
            {
                id: 'twofa_type',
                question: 'What type of 2FA do you primarily use?',
                options: [
                    { text: 'Authenticator app or hardware token', score: 100 },
                    { text: 'SMS text messages', score: 60 },
                    { text: 'Email verification', score: 40 },
                    { text: 'No 2FA currently used', score: 0 }
                ]
            }
        ]
    },
    monitoring: {
        name: 'Account Monitoring',
        weight: 20,
        icon: 'fas fa-eye',
        questions: [
            {
                id: 'statement_review',
                question: 'How often do you review your bank statements?',
                options: [
                    { text: 'Weekly or more frequently', score: 100 },
                    { text: 'Monthly when they arrive', score: 80 },
                    { text: 'Quarterly or occasionally', score: 40 },
                    { text: 'Rarely or never', score: 10 }
                ]
            },
            {
                id: 'alerts_enabled',
                question: 'Do you have transaction alerts set up?',
                options: [
                    { text: 'Yes, for all transactions', score: 100 },
                    { text: 'Yes, for large transactions only', score: 70 },
                    { text: 'Some alerts enabled', score: 40 },
                    { text: 'No alerts enabled', score: 10 }
                ]
            }
        ]
    },
    deviceSecurity: {
        name: 'Device Security',
        weight: 15,
        icon: 'fas fa-laptop-medical',
        questions: [
            {
                id: 'antivirus_software',
                question: 'Do you use updated antivirus/security software?',
                options: [
                    { text: 'Yes, premium security suite', score: 100 },
                    { text: 'Yes, basic antivirus software', score: 70 },
                    { text: 'Built-in security only', score: 50 },
                    { text: 'No security software', score: 10 }
                ]
            },
            {
                id: 'software_updates',
                question: 'How do you handle software updates?',
                options: [
                    { text: 'Automatic updates enabled', score: 100 },
                    { text: 'Regular manual updates', score: 80 },
                    { text: 'Occasional updates', score: 40 },
                    { text: 'Rarely update software', score: 10 }
                ]
            }
        ]
    },
    safePractices: {
        name: 'Safe Banking Practices',
        weight: 20,
        icon: 'fas fa-user-shield',
        questions: [
            {
                id: 'public_wifi',
                question: 'Do you use public WiFi for banking?',
                options: [
                    { text: 'Never use public WiFi for banking', score: 100 },
                    { text: 'Only with VPN protection', score: 80 },
                    { text: 'Occasionally for urgent needs', score: 30 },
                    { text: 'Regularly use public WiFi', score: 10 }
                ]
            },
            {
                id: 'suspicious_handling',
                question: 'How do you handle suspicious emails/calls?',
                options: [
                    { text: 'Always verify independently', score: 100 },
                    { text: 'Usually check before responding', score: 80 },
                    { text: 'Sometimes fall for convincing scams', score: 30 },
                    { text: 'Often respond without verification', score: 10 }
                ]
            }
        ]
    }
};

// Security Status Management
class SecurityStatusManager {
    constructor() {
        this.userScores = this.loadUserScores();
        this.assessmentComplete = localStorage.getItem('securityAssessmentComplete') === 'true';
        this.lastAssessment = localStorage.getItem('lastSecurityAssessment');
    }

    loadUserScores() {
        const saved = localStorage.getItem('userSecurityScores');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserScores() {
        localStorage.setItem('userSecurityScores', JSON.stringify(this.userScores));
        localStorage.setItem('securityAssessmentComplete', 'true');
        localStorage.setItem('lastSecurityAssessment', new Date().toISOString());
    }

    calculateOverallScore() {
        if (Object.keys(this.userScores).length === 0) return 0;

        let weightedScore = 0;
        let totalWeight = 0;

        Object.keys(securityCategories).forEach(categoryId => {
            const category = securityCategories[categoryId];
            const categoryScore = this.calculateCategoryScore(categoryId);
            
            if (categoryScore !== null) {
                weightedScore += categoryScore * category.weight;
                totalWeight += category.weight;
            }
        });

        return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
    }

    calculateCategoryScore(categoryId) {
        const userAnswers = this.userScores[categoryId];
        if (!userAnswers) return null;

        const category = securityCategories[categoryId];
        let totalScore = 0;
        let questionCount = 0;

        category.questions.forEach(question => {
            const userAnswer = userAnswers[question.id];
            if (userAnswer !== undefined) {
                totalScore += userAnswer;
                questionCount++;
            }
        });

        return questionCount > 0 ? totalScore / questionCount : null;
    }

    getSecurityLevel(score) {
        if (score >= 90) return { level: 'Excellent', color: '#22c55e', description: 'Outstanding security practices' };
        if (score >= 75) return { level: 'Good', color: '#22c55e', description: 'Above average security practices' };
        if (score >= 60) return { level: 'Fair', color: '#f59e0b', description: 'Room for improvement' };
        if (score >= 40) return { level: 'Poor', color: '#ef4444', description: 'Significant security risks' };
        return { level: 'Critical', color: '#dc2626', description: 'Immediate attention needed' };
    }

    getRecommendations() {
        const recommendations = [];
        
        Object.keys(securityCategories).forEach(categoryId => {
            const score = this.calculateCategoryScore(categoryId);
            const category = securityCategories[categoryId];
            
            if (score !== null && score < 75) {
                recommendations.push({
                    category: category.name,
                    icon: category.icon,
                    priority: score < 50 ? 'high' : 'medium',
                    action: this.getCategoryRecommendation(categoryId, score)
                });
            }
        });

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    getCategoryRecommendation(categoryId, score) {
        const recommendations = {
            passwords: score < 50 ? 'Use a password manager and create unique, strong passwords' : 'Strengthen remaining weak passwords',
            twoFactor: score < 50 ? 'Enable 2FA on all financial accounts immediately' : 'Switch from SMS to app-based 2FA',
            monitoring: score < 50 ? 'Set up account alerts and review statements weekly' : 'Increase monitoring frequency',
            deviceSecurity: score < 50 ? 'Install security software and enable automatic updates' : 'Upgrade to comprehensive security suite',
            safePractices: score < 50 ? 'Never use public WiFi for banking and verify all suspicious communications' : 'Use VPN when necessary and stay vigilant'
        };
        return recommendations[categoryId] || 'Improve security practices in this area';
    }
}

// DOM Elements
const securityCenter = document.getElementById('security-center');
const latestScamPage = document.getElementById('latest-scam-page');
const protectYourselfPage = document.getElementById('protect-yourself-page');
const digitalFraudPage = document.getElementById('digital-fraud-page');
const otherFraudPage = document.getElementById('other-fraud-page');

// Buttons
const reportFraudBtn = document.getElementById('report-fraud-btn');
const latestScamBtn = document.getElementById('latest-scam-btn');
const protectYourselfBtn = document.getElementById('protect-yourself-btn');
const digitalFraudBtn = document.getElementById('digital-fraud-btn');
const otherFraudBtn = document.getElementById('other-fraud-btn');

// Back Buttons
const backFromScam = document.getElementById('back-from-scam');
const backFromProtect = document.getElementById('back-from-protect');
const backFromDigital = document.getElementById('back-from-digital');
const backFromOther = document.getElementById('back-from-other');

// Security Status Elements
const securityStatusCard = document.querySelector('.status-card');
const statusValue = document.querySelector('.status-value');
const statusText = document.querySelector('.status-text');
const improveSecurityBtn = document.querySelector('.card-btn.secondary');

// Initialize Security Status Manager
const securityManager = new SecurityStatusManager();

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    showPage(securityCenter);
    setupEventListeners();
    initAnimations();
    createDynamicModals();
    updateSecurityStatus();
    
    // Show assessment if not completed
    if (!securityManager.assessmentComplete) {
        setTimeout(() => showSecurityAssessment(), 2000);
    }
});

// Update security status display
function updateSecurityStatus() {
    const score = securityManager.calculateOverallScore();
    const securityLevel = securityManager.getSecurityLevel(score);
    
    // Update the circular progress
    const circle = document.querySelector('.circle');
    if (circle) {
        const circumference = 2 * Math.PI * 15.9155;
        const strokeDasharray = `${(score / 100) * circumference}, ${circumference}`;
        circle.style.strokeDasharray = strokeDasharray;
        circle.style.stroke = securityLevel.color;
    }
    
    // Update status text and value
    if (statusValue) statusValue.textContent = `${score}%`;
    if (statusText) statusText.textContent = `${securityLevel.level} - ${securityLevel.description}`;
    
    // Update status value color
    if (statusValue) statusValue.style.color = securityLevel.color;
}

// Show security assessment modal
function showSecurityAssessment() {
    const assessmentModal = createSecurityAssessmentModal();
    document.body.appendChild(assessmentModal);
    toggleModal(assessmentModal);
}

// Create security assessment modal
function createSecurityAssessmentModal() {
    const modal = document.createElement('dialog');
    modal.className = 'modal';
    modal.id = 'security-assessment-modal';
    
    modal.innerHTML = `
        <article class="modal-content" style="max-width: 700px; max-height: 90vh;">
            <header class="modal-header">
                <h2>Security Assessment</h2>
                <button class="modal-close" id="close-assessment-modal">
                    <i class="fas fa-times"></i>
                </button>
            </header>
            <section class="modal-body" style="overflow-y: auto;">
                <p style="color: #94a3b8; margin-bottom: 1.5rem;">
                    Help us evaluate your current security practices to provide personalized recommendations.
                </p>
                <div id="assessment-content">
                    ${createAssessmentContent()}
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end;">
                    <button class="card-btn secondary" id="skip-assessment">Skip for Now</button>
                    <button class="card-btn" id="submit-assessment">
                        <i class="fas fa-check"></i>
                        Complete Assessment
                    </button>
                </div>
            </section>
        </article>
    `;
    
    // Add event listeners
    modal.querySelector('#close-assessment-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#skip-assessment').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#submit-assessment').addEventListener('click', () => {
        submitSecurityAssessment(modal);
    });
    
    return modal;
}

// Create assessment content
function createAssessmentContent() {
    let content = '';
    
    Object.keys(securityCategories).forEach(categoryId => {
        const category = securityCategories[categoryId];
        content += `
            <div class="assessment-category" style="margin-bottom: 2rem; background: rgba(30, 41, 59, 0.6); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.1);">
                <h3 style="color: #f8fafc; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="${category.icon}" style="color: #22c55e;"></i>
                    ${category.name}
                </h3>
                ${category.questions.map(question => `
                    <div class="question-block" style="margin-bottom: 1.5rem;">
                        <p style="color: #e2e8f0; margin-bottom: 0.75rem; font-weight: 500;">${question.question}</p>
                        <div class="question-options">
                            ${question.options.map((option, index) => `
                                <label class="option-label" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.3s ease;">
                                    <input type="radio" name="${question.id}" value="${option.score}" style="margin-right: 0.5rem;">
                                    <span style="color: #94a3b8;">${option.text}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    return content;
}

// Submit security assessment
function submitSecurityAssessment(modal) {
    const formData = new FormData();
    const inputs = modal.querySelectorAll('input[type="radio"]:checked');
    
    // Reset scores
    securityManager.userScores = {};
    
    // Process answers by category
    Object.keys(securityCategories).forEach(categoryId => {
        securityManager.userScores[categoryId] = {};
        
        securityCategories[categoryId].questions.forEach(question => {
            const input = modal.querySelector(`input[name="${question.id}"]:checked`);
            if (input) {
                securityManager.userScores[categoryId][question.id] = parseInt(input.value);
            }
        });
    });
    
    // Save and update
    securityManager.saveUserScores();
    securityManager.assessmentComplete = true;
    
    // Update display
    updateSecurityStatus();
    
    // Show completion message
    showAssessmentComplete();
    
    // Close modal
    document.body.removeChild(modal);
}

// Show assessment completion
function showAssessmentComplete() {
    const score = securityManager.calculateOverallScore();
    const level = securityManager.getSecurityLevel(score);
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        color: #f8fafc;
        z-index: 1000;
        max-width: 350px;
        animation: slideInRight 0.5s ease;
    `;
    
    notification.innerHTML = `
        <h3 style="color: #22c55e; margin-bottom: 0.5rem;">Assessment Complete!</h3>
        <p style="margin-bottom: 0.5rem;">Your security score: <strong style="color: ${level.color};">${score}%</strong></p>
        <p style="font-size: 0.9rem; color: #94a3b8;">${level.description}</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

// Create improved security breakdown modal
function createSecurityBreakdownModal() {
    const modal = document.createElement('dialog');
    modal.className = 'modal';
    modal.id = 'security-breakdown-modal';
    
    const overallScore = securityManager.calculateOverallScore();
    const recommendations = securityManager.getRecommendations();
    
    modal.innerHTML = `
        <article class="modal-content" style="max-width: 800px; max-height: 90vh;">
            <header class="modal-header">
                <h2>Security Breakdown & Recommendations</h2>
                <button class="modal-close" id="close-breakdown-modal">
                    <i class="fas fa-times"></i>
                </button>
            </header>
            <section class="modal-body" style="overflow-y: auto;">
                ${createSecurityBreakdownContent()}
                ${createRecommendationsContent(recommendations)}
                <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center;">
                    <button class="card-btn" id="retake-assessment">
                        <i class="fas fa-redo"></i>
                        Retake Assessment
                    </button>
                    <button class="card-btn secondary" id="view-education">
                        <i class="fas fa-graduation-cap"></i>
                        View Education Hub
                    </button>
                </div>
            </section>
        </article>
    `;
    
    // Add event listeners
    modal.querySelector('#close-breakdown-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#retake-assessment').addEventListener('click', () => {
        document.body.removeChild(modal);
        showSecurityAssessment();
    });
    
    modal.querySelector('#view-education').addEventListener('click', () => {
        document.body.removeChild(modal);
        // Navigate to education hub
        window.location.href = 'education.html';
    });
    
    return modal;
}

// Create security breakdown content
function createSecurityBreakdownContent() {
    let content = '<h3 style="color: #f8fafc; margin-bottom: 1rem;">Category Breakdown</h3>';
    content += '<div class="category-breakdown" style="display: grid; gap: 1rem; margin-bottom: 2rem;">';
    
    Object.keys(securityCategories).forEach(categoryId => {
        const category = securityCategories[categoryId];
        const score = securityManager.calculateCategoryScore(categoryId) || 0;
        const level = securityManager.getSecurityLevel(score);
        
        content += `
            <div class="category-item" style="background: rgba(15, 23, 42, 0.8); padding: 1rem; border-radius: 8px; border-left: 4px solid ${level.color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h4 style="color: #f8fafc; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="${category.icon}" style="color: #22c55e;"></i>
                        ${category.name}
                    </h4>
                    <span style="color: ${level.color}; font-weight: 600;">${Math.round(score)}%</span>
                </div>
                <div class="progress-bar" style="width: 100%; height: 6px; background: rgba(100, 116, 139, 0.3); border-radius: 3px; overflow: hidden;">
                    <div class="progress" style="width: ${score}%; height: 100%; background: linear-gradient(90deg, ${level.color}, ${level.color}); transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    return content;
}

// Create recommendations content
function createRecommendationsContent(recommendations) {
    if (recommendations.length === 0) {
        return `
            <div style="text-align: center; padding: 2rem; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
                <i class="fas fa-trophy" style="font-size: 3rem; color: #22c55e; margin-bottom: 1rem;"></i>
                <h3 style="color: #22c55e; margin-bottom: 0.5rem;">Excellent Security!</h3>
                <p style="color: #94a3b8;">Your security practices are outstanding. Keep up the great work!</p>
            </div>
        `;
    }
    
    let content = '<h3 style="color: #f8fafc; margin-bottom: 1rem;">Recommended Improvements</h3>';
    content += '<div class="recommendations-list" style="display: flex; flex-direction: column; gap: 1rem;">';
    
    recommendations.forEach((rec, index) => {
        const priorityColor = rec.priority === 'high' ? '#ef4444' : '#f59e0b';
        const priorityText = rec.priority === 'high' ? 'High Priority' : 'Medium Priority';
        
        content += `
            <div class="recommendation-item" style="background: rgba(30, 41, 59, 0.6); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${priorityColor};">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <i class="${rec.icon}" style="font-size: 1.5rem; color: #22c55e; margin-top: 0.25rem;"></i>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                            <h4 style="color: #f8fafc; margin-bottom: 0.25rem;">${rec.category}</h4>
                            <span style="background: rgba(239, 68, 68, 0.2); color: ${priorityColor}; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-left: auto;">${priorityText}</span>
                        </div>
                        <p style="color: #94a3b8; line-height: 1.5;">${rec.action}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    return content;
}

// Enhanced event listeners setup
function setupEventListeners() {
    // Navigation buttons
    reportFraudBtn?.addEventListener('click', () => toggleModal(document.getElementById('report-fraud-modal')));
    latestScamBtn?.addEventListener('click', () => showPage(latestScamPage));
    protectYourselfBtn?.addEventListener('click', () => showPage(protectYourselfPage));
    digitalFraudBtn?.addEventListener('click', () => showPage(digitalFraudPage));
    otherFraudBtn?.addEventListener('click', () => showPage(otherFraudPage));
    
    // Back buttons
    backFromScam?.addEventListener('click', () => showPage(securityCenter));
    backFromProtect?.addEventListener('click', () => showPage(securityCenter));
    backFromDigital?.addEventListener('click', () => showPage(securityCenter));
    backFromOther?.addEventListener('click', () => showPage(securityCenter));
    
    // Enhanced Improve Security button
    improveSecurityBtn?.addEventListener('click', () => {
        const modal = createSecurityBreakdownModal();
        document.body.appendChild(modal);
        toggleModal(modal);
    });
    
    // Rest of the existing event listeners...
    setupExistingEventListeners();
}

// Keep existing event listeners
function setupExistingEventListeners() {
    // Modal controls
    const closeReportModal = document.getElementById('close-report-modal');
    const closeScamModal = document.getElementById('close-scam-modal');
    const howItWorksBtn = document.getElementById('how-it-works-btn');
    const reportFromModal = document.getElementById('report-from-modal');
    
    closeReportModal?.addEventListener('click', () => toggleModal(document.getElementById('report-fraud-modal')));
    closeScamModal?.addEventListener('click', () => toggleModal(document.getElementById('scam-details-modal')));
    howItWorksBtn?.addEventListener('click', () => toggleModal(document.getElementById('scam-details-modal')));
    reportFromModal?.addEventListener('click', () => {
        toggleModal(document.getElementById('scam-details-modal'));
        toggleModal(document.getElementById('report-fraud-modal'));
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            toggleModal(e.target);
        }
    });
    
    // Digital Fraud Safety Tips Buttons
    document.getElementById('identity-safety-tips')?.addEventListener('click', () => showSafetyTipsModal('identity-theft'));
    document.getElementById('phishing-safety-tips')?.addEventListener('click', () => showSafetyTipsModal('phishing'));
    document.getElementById('vishing-safety-tips')?.addEventListener('click', () => showSafetyTipsModal('vishing'));
    document.getElementById('smishing-safety-tips')?.addEventListener('click', () => showSafetyTipsModal('smishing'));
    document.getElementById('simswap-safety-tips')?.addEventListener('click', () => showSafetyTipsModal('simswap'));
    
    // Protection tabs
    const protectionTabs = document.querySelectorAll('.protection-tab');
    protectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchProtectionTab(tabId);
        });
    });
    
    // Digital fraud tabs
    const digitalTabs = document.querySelectorAll('.digital-tab');
    digitalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchDigitalTab(tabId);
        });
    });
    
    // Other fraud tabs
    const otherTabs = document.querySelectorAll('.other-tab');
    otherTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchOtherTab(tabId);
        });
    });
    
    // Card Fraud Type Buttons
    const fraudTypeBtns = document.querySelectorAll('.fraud-type-btn');
    fraudTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fraudType = this.getAttribute('data-type');
            showCardFraudModal(fraudType);
        });
    });
    
    // ATM Do's and Don'ts
    const atmDosDontsBtn = document.getElementById('atm-dos-donts');
    atmDosDontsBtn?.addEventListener('click', showAtmDosDontsModal);
    
    // AI Widget
    const aiFab = document.getElementById('ai-fab');
    const closeAiWidget = document.getElementById('close-ai-widget');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    
    aiFab?.addEventListener('click', toggleAiWidget);
    closeAiWidget?.addEventListener('click', toggleAiWidget);
    sendAiMessage?.addEventListener('click', sendAiMessageHandler);
    aiInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAiMessageHandler();
        }
    });
}

// Create dynamic modals for safety tips and fraud types
function createDynamicModals() {
    const modalContainer = document.body;
    
    // Safety Tips Modal HTML
    const safetyTipsModalHTML = `
        <dialog class="modal" id="safety-tips-modal">
            <article class="modal-content">
                <header class="modal-header">
                    <h2 id="safety-tips-title">Safety Tips</h2>
                    <button class="modal-close" id="close-safety-tips-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body" id="safety-tips-content">
                    <!-- Dynamic content will be inserted here -->
                </section>
            </article>
        </dialog>
    `;
    
    // Card Fraud Modal HTML
    const cardFraudModalHTML = `
        <dialog class="modal" id="card-fraud-modal">
            <article class="modal-content">
                <header class="modal-header">
                    <h2 id="card-fraud-title">Card Fraud Type</h2>
                    <button class="modal-close" id="close-card-fraud-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body" id="card-fraud-content">
                    <!-- Dynamic content will be inserted here -->
                </section>
            </article>
        </dialog>
    `;
    
    // ATM Do's and Don'ts Modal HTML
    const atmModalHTML = `
        <dialog class="modal" id="atm-modal">
            <article class="modal-content">
                <header class="modal-header">
                    <h2>ATM Safety - Do's and Don'ts</h2>
                    <button class="modal-close" id="close-atm-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body">
                    <section class="dos-section">
                        <h3><i class="fas fa-check" style="color: #22c55e;"></i> Do:</h3>
                        <ul>
                            <li>Cover your PIN when entering it</li>
                            <li>Check for any unusual devices attached to the ATM</li>
                            <li>Use ATMs in well-lit, populated areas</li>
                            <li>Take your receipt and keep it secure</li>
                            <li>Be aware of your surroundings</li>
                            <li>Report suspicious activity immediately</li>
                            <li>Use ATMs inside banks when possible</li>
                        </ul>
                    </section>
                    
                    <section class="donts-section" style="margin-top: 1.5rem;">
                        <h3><i class="fas fa-times" style="color: #ef4444;"></i> Don't:</h3>
                        <ul>
                            <li>Use an ATM that looks tampered with</li>
                            <li>Let anyone see your PIN</li>
                            <li>Count cash at the ATM</li>
                            <li>Leave your transaction receipt behind</li>
                            <li>Use damaged or malfunctioning ATMs</li>
                            <li>Ignore your surroundings</li>
                            <li>Write down your PIN</li>
                        </ul>
                    </section>
                </section>
            </article>
        </dialog>
    `;
    
    // Report Fraud Modal HTML
    const reportFraudModalHTML = `
        <dialog class="modal" id="report-fraud-modal">
            <article class="modal-content">
                <header class="modal-header">
                    <h2>Report Fraud - National Hotlines</h2>
                    <button class="modal-close" id="close-report-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body">
                    <p>If you suspect fraudulent activity, contact these national hotlines immediately:</p>
                    
                    <section class="hotline-list">
                        <article class="hotline-item">
                            <h3>National Fraud Hotline</h3>
                            <p><i class="fas fa-phone"></i> 1-800-123-4567</p>
                            <p>Available 24/7 for reporting financial fraud</p>
                        </article>
                        
                        <article class="hotline-item">
                            <h3>Identity Theft Hotline</h3>
                            <p><i class="fas fa-phone"></i> 1-888-987-6543</p>
                            <p>Specialized assistance for identity theft cases</p>
                        </article>
                        
                        <article class="hotline-item">
                            <h3>Cyber Crime Unit</h3>
                            <p><i class="fas fa-phone"></i> 1-877-555-7890</p>
                            <p>Report online scams and digital fraud</p>
                        </article>
                    </section>
                    
                    <section class="emergency-tips">
                        <h3>What to Do Immediately:</h3>
                        <ul>
                            <li>Contact your bank to freeze affected accounts</li>
                            <li>Change all online passwords</li>
                            <li>Monitor your credit reports</li>
                            <li>File a police report if significant funds are involved</li>
                        </ul>
                    </section>
                </section>
            </article>
        </dialog>
    `;
    
    // Scam Details Modal HTML
    const scamDetailsModalHTML = `
        <dialog class="modal" id="scam-details-modal">
            <article class="modal-content">
                <header class="modal-header">
                    <h2>How the Scam Works</h2>
                    <button class="modal-close" id="close-scam-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body">
                    <section class="scam-steps">
                        <h3>Step-by-Step Breakdown:</h3>
                        <ol>
                            <li>Scammers send emails that appear to be from legitimate banks</li>
                            <li>Emails create urgency by claiming suspicious account activity</li>
                            <li>Recipients are directed to click a link to "verify" their account</li>
                            <li>The link goes to a fake website that mimics the real bank's login page</li>
                            <li>Victims enter their credentials, which are captured by scammers</li>
                            <li>Scammers use these credentials to access real bank accounts</li>
                        </ol>
                    </section>
                    
                    <section class="protect-yourself">
                        <h3>Protect Yourself:</h3>
                        <ul>
                            <li>Never click links in unsolicited emails</li>
                            <li>Always navigate to your bank's website directly</li>
                            <li>Check for HTTPS and security certificates</li>
                            <li>Enable two-factor authentication on all accounts</li>
                            <li>Regularly monitor your account statements</li>
                        </ul>
                    </section>
                    
                    <section class="report-reminder">
                        <h3>Report This Scam:</h3>
                        <p>If you encounter this scam, report it immediately using the numbers in our <strong>Report Fraud</strong> section.</p>
                        <button class="card-btn" id="report-from-modal">
                            <i class="fas fa-phone-alt"></i>
                            Report Now
                        </button>
                    </section>
                </section>
            </article>
        </dialog>
    `;
    
    // Add modals to the page if they don't exist
    if (!document.getElementById('safety-tips-modal')) {
        modalContainer.insertAdjacentHTML('beforeend', safetyTipsModalHTML);
    }
    if (!document.getElementById('card-fraud-modal')) {
        modalContainer.insertAdjacentHTML('beforeend', cardFraudModalHTML);
    }
    if (!document.getElementById('atm-modal')) {
        modalContainer.insertAdjacentHTML('beforeend', atmModalHTML);
    }
    if (!document.getElementById('report-fraud-modal')) {
        modalContainer.insertAdjacentHTML('beforeend', reportFraudModalHTML);
    }
    if (!document.getElementById('scam-details-modal')) {
        modalContainer.insertAdjacentHTML('beforeend', scamDetailsModalHTML);
    }
    
    // Add event listeners for new modals
    document.getElementById('close-safety-tips-modal')?.addEventListener('click', () => {
        toggleModal(document.getElementById('safety-tips-modal'));
    });
    
    document.getElementById('close-card-fraud-modal')?.addEventListener('click', () => {
        toggleModal(document.getElementById('card-fraud-modal'));
    });
    
    document.getElementById('close-atm-modal')?.addEventListener('click', () => {
        toggleModal(document.getElementById('atm-modal'));
    });
}

// Show safety tips modal with specific content
function showSafetyTipsModal(type) {
    const modal = document.getElementById('safety-tips-modal');
    const title = document.getElementById('safety-tips-title');
    const content = document.getElementById('safety-tips-content');
    
    if (!modal || !title || !content) return;
    
    const safetyTipsData = {
        'identity-theft': {
            title: 'Identity Theft Safety Tips',
            content: `
                <section class="safety-tips">
                    <h3>Prevention:</h3>
                    <ul>
                        <li>Shred documents containing personal information before disposal</li>
                        <li>Use strong, unique passwords for all online accounts</li>
                        <li>Monitor your credit reports regularly</li>
                        <li>Be cautious about sharing personal information online</li>
                        <li>Freeze your credit if you suspect your information is compromised</li>
                        <li>Use secure networks for financial transactions</li>
                    </ul>
                    
                    <h3>If You're a Victim:</h3>
                    <ul>
                        <li>Contact the fraud departments of the three major credit bureaus</li>
                        <li>Place a fraud alert on your credit reports</li>
                        <li>File a report with the Federal Trade Commission</li>
                        <li>Contact your financial institutions to secure accounts</li>
                        <li>File a police report</li>
                        <li>Keep detailed records of all communications</li>
                    </ul>
                </section>
            `
        },
        'phishing': {
            title: 'Phishing Safety Tips',
            content: `
                <section class="safety-tips">
                    <h3>How to Identify Phishing:</h3>
                    <ul>
                        <li>Check sender's email address carefully</li>
                        <li>Look for spelling and grammar errors</li>
                        <li>Be suspicious of urgent requests</li>
                        <li>Verify links by hovering over them</li>
                        <li>Check for generic greetings</li>
                    </ul>
                    
                    <h3>Protection Measures:</h3>
                    <ul>
                        <li>Never click links in suspicious emails</li>
                        <li>Type website URLs directly into your browser</li>
                        <li>Use email filters and security software</li>
                        <li>Report phishing attempts to authorities</li>
                        <li>Keep software and browsers updated</li>
                        <li>Enable two-factor authentication</li>
                    </ul>
                </section>
            `
        },
        'vishing': {
            title: 'Vishing Safety Tips',
            content: `
                <section class="safety-tips">
                    <h3>Red Flags:</h3>
                    <ul>
                        <li>Unsolicited calls requesting personal information</li>
                        <li>Callers claiming to be from your bank or government</li>
                        <li>Urgent threats or time-sensitive offers</li>
                        <li>Requests for passwords or PINs over the phone</li>
                        <li>Poor call quality or background noise</li>
                    </ul>
                    
                    <h3>Protect Yourself:</h3>
                    <ul>
                        <li>Never provide personal information over the phone</li>
                        <li>Hang up and call the organization directly</li>
                        <li>Don't press numbers when prompted by robocalls</li>
                        <li>Register with the Do Not Call Registry</li>
                        <li>Use call blocking features</li>
                        <li>Verify caller identity through official channels</li>
                    </ul>
                </section>
            `
        },
        'smishing': {
            title: 'Smishing Safety Tips',
            content: `
                <section class="safety-tips">
                    <h3>Common Smishing Signs:</h3>
                    <ul>
                        <li>Unexpected prize or lottery winnings</li>
                        <li>Fake account alerts or security warnings</li>
                        <li>Links from unknown numbers</li>
                        <li>Requests for immediate action</li>
                        <li>Poor grammar or spelling in messages</li>
                    </ul>
                    
                    <h3>Stay Safe:</h3>
                    <ul>
                        <li>Don't click links in suspicious text messages</li>
                        <li>Verify messages through official channels</li>
                        <li>Delete suspicious messages immediately</li>
                        <li>Report smishing attempts to your carrier</li>
                        <li>Keep your phone's security software updated</li>
                        <li>Be cautious with shortened URLs</li>
                    </ul>
                </section>
            `
        },
        'simswap': {
            title: 'SIM Swap & Porting Safety Tips',
            content: `
                <section class="safety-tips">
                    <h3>Warning Signs:</h3>
                    <ul>
                        <li>Your phone suddenly has no service</li>
                        <li>You receive unexpected verification codes</li>
                        <li>You can't access your accounts</li>
                        <li>Friends receive strange messages from your number</li>
                        <li>Your carrier shows unusual activity</li>
                    </ul>
                    
                    <h3>Protection Measures:</h3>
                    <ul>
                        <li>Add a PIN or passcode to your mobile account</li>
                        <li>Use app-based 2FA instead of SMS when possible</li>
                        <li>Monitor your accounts regularly</li>
                        <li>Contact your carrier immediately if service stops</li>
                        <li>Keep personal information private on social media</li>
                        <li>Consider using a dedicated phone number for important accounts</li>
                    </ul>
                    
                    <h3>If You're a Victim:</h3>
                    <ul>
                        <li>Contact your mobile carrier immediately</li>
                        <li>Change passwords for all important accounts</li>
                        <li>Enable additional security measures</li>
                        <li>Monitor financial accounts closely</li>
                        <li>File a police report</li>
                        <li>Report to the FTC and FCC</li>
                    </ul>
                </section>
            `
        }
    };
    
    const data = safetyTipsData[type];
    if (data) {
        title.textContent = data.title;
        content.innerHTML = data.content;
        toggleModal(modal);
    }
}

// Show card fraud modal with specific content
function showCardFraudModal(type) {
    const modal = document.getElementById('card-fraud-modal');
    const title = document.getElementById('card-fraud-title');
    const content = document.getElementById('card-fraud-content');
    
    if (!modal || !title || !content) return;
    
    const cardFraudData = {
        'counterfeit': {
            title: 'Counterfeit Card Fraud',
            content: `
                <section class="fraud-info">
                    <h3>What is Counterfeit Card Fraud?</h3>
                    <p>Counterfeit card fraud occurs when criminals create fake cards using stolen card information, often obtained through skimming devices or data breaches.</p>
                    
                    <h3>Examples:</h3>
                    <ul>
                        <li>Cards created with stolen magnetic stripe data</li>
                        <li>Fake cards used at ATMs or point-of-sale terminals</li>
                        <li>Cloned cards used for cash advances</li>
                        <li>Reproduced cards with altered account numbers</li>
                    </ul>
                    
                    <h3>What to Do:</h3>
                    <ul>
                        <li>Report unauthorized transactions immediately</li>
                        <li>Request a new card with updated security features</li>
                        <li>Monitor your statements regularly</li>
                        <li>Use chip-enabled cards whenever possible</li>
                        <li>Cover your PIN when entering it</li>
                        <li>Check for skimming devices before using card readers</li>
                    </ul>
                </section>
            `
        },
        'lost-stolen': {
            title: 'Lost or Stolen Card Fraud',
            content: `
                <section class="fraud-info">
                    <h3>What is Lost or Stolen Card Fraud?</h3>
                    <p>This type of fraud occurs when someone uses your physical card after it has been lost or stolen to make unauthorized purchases.</p>
                    
                    <h3>Examples:</h3>
                    <ul>
                        <li>Unauthorized purchases made with your lost card</li>
                        <li>Cash withdrawals from stolen debit cards</li>
                        <li>Online purchases using card information</li>
                        <li>Fraudulent transactions before you notice the card is missing</li>
                    </ul>
                    
                    <h3>What to Do:</h3>
                    <ul>
                        <li>Report lost or stolen cards immediately to your bank</li>
                        <li>Cancel the card and request a replacement</li>
                        <li>Monitor your accounts for unauthorized activity</li>
                        <li>File a police report if theft occurred</li>
                        <li>Change your PIN if compromised</li>
                        <li>Review recent transactions carefully</li>
                    </ul>
                </section>
            `
        },
        'card-not-present': {
            title: 'Card-Not-Present Fraud',
            content: `
                <section class="fraud-info">
                    <h3>What is Card-Not-Present Fraud?</h3>
                    <p>Card-not-present fraud occurs when someone uses your card information for online, phone, or mail-order transactions without having the physical card.</p>
                    
                    <h3>Examples:</h3>
                    <ul>
                        <li>Unauthorized online purchases</li>
                        <li>Phone orders made with stolen card details</li>
                        <li>Subscription services charged to your card</li>
                        <li>Digital wallet fraud using compromised information</li>
                    </ul>
                    
                    <h3>What to Do:</h3>
                    <ul>
                        <li>Dispute unauthorized charges with your bank</li>
                        <li>Request a new card with different numbers</li>
                        <li>Review online accounts and saved payment methods</li>
                        <li>Use secure payment methods for online shopping</li>
                        <li>Enable transaction alerts</li>
                        <li>Monitor credit reports for new accounts</li>
                    </ul>
                </section>
            `
        },
        'skimming': {
            title: 'Card Skimming Fraud',
            content: `
                <section class="fraud-info">
                    <h3>What is Card Skimming?</h3>
                    <p>Skimming involves the use of illegal devices to steal card information when you swipe or insert your card at ATMs, gas pumps, or point-of-sale terminals.</p>
                    
                    <h3>Examples:</h3>
                    <ul>
                        <li>Devices attached to ATM card slots</li>
                        <li>Modified point-of-sale terminals</li>
                        <li>Fake card readers at gas stations</li>
                        <li>Hidden cameras recording PIN entries</li>
                    </ul>
                    
                    <h3>What to Do:</h3>
                    <ul>
                        <li>Inspect card readers before use</li>
                        <li>Cover your PIN when entering it</li>
                        <li>Use contactless payment when available</li>
                        <li>Report suspicious devices to authorities</li>
                        <li>Monitor account statements regularly</li>
                        <li>Use ATMs inside banks when possible</li>
                    </ul>
                </section>
            `
        }
    };
    
    const data = cardFraudData[type];
    if (data) {
        title.textContent = data.title;
        content.innerHTML = data.content;
        toggleModal(modal);
    }
}

// Show ATM Do's and Don'ts modal
function showAtmDosDontsModal() {
    const modal = document.getElementById('atm-modal');
    if (modal) {
        toggleModal(modal);
    }
}

// Show a specific page and hide others
function showPage(page) {
    if (!page) return;
    
    // Hide all pages
    const pages = document.querySelectorAll('.content-section');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show the requested page
    page.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Toggle modal visibility
function toggleModal(modal) {
    if (!modal) return;
    
    if (modal.style.display === 'flex' || modal.classList.contains('active')) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    } else {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

// Switch protection tabs
function switchProtectionTab(tabId) {
    const protectionTabs = document.querySelectorAll('.protection-tab');
    const protectionSections = document.querySelectorAll('.protection-section');
    
    // Remove active class from all tabs and sections
    protectionTabs.forEach(tab => tab.classList.remove('active'));
    protectionSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    const selectedTab = document.querySelector(`.protection-tab[data-tab="${tabId}"]`);
    const selectedSection = document.getElementById(tabId);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedSection) selectedSection.classList.add('active');
}

// Switch digital fraud tabs
function switchDigitalTab(tabId) {
    const digitalTabs = document.querySelectorAll('.digital-tab');
    const digitalSections = document.querySelectorAll('.digital-section');
    
    // Remove active class from all tabs and sections
    digitalTabs.forEach(tab => tab.classList.remove('active'));
    digitalSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    const selectedTab = document.querySelector(`.digital-tab[data-tab="${tabId}"]`);
    const selectedSection = document.getElementById(tabId);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedSection) selectedSection.classList.add('active');
}

// Switch other fraud tabs
function switchOtherTab(tabId) {
    const otherTabs = document.querySelectorAll('.other-tab');
    const otherSections = document.querySelectorAll('.other-section');
    
    // Remove active class from all tabs and sections
    otherTabs.forEach(tab => tab.classList.remove('active'));
    otherSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    const selectedTab = document.querySelector(`.other-tab[data-tab="${tabId}"]`);
    const selectedSection = document.getElementById(tabId);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedSection) selectedSection.classList.add('active');
}

// Toggle AI Widget
function toggleAiWidget() {
    const aiWidget = document.getElementById('ai-widget');
    if (aiWidget) {
        aiWidget.classList.toggle('active');
    }
}

// Handle AI message sending
function sendAiMessageHandler(e) {
    if (e) e.preventDefault();
    
    const aiInput = document.getElementById('ai-input');
    if (!aiInput) return;
    
    const message = aiInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addAiMessage(message, 'user');
    
    // Clear input
    aiInput.value = '';
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
        const response = getAiResponse(message);
        addAiMessage(response, 'ai');
    }, 1000);
}

// Add message to AI chat
function addAiMessage(message, sender) {
    const aiMessages = document.getElementById('ai-messages');
    if (!aiMessages) return;
    
    const messageDiv = document.createElement('article');
    messageDiv.className = `ai-message ${sender}-message-widget`;
    
    const messageP = document.createElement('p');
    messageP.textContent = message;
    
    messageDiv.appendChild(messageP);
    aiMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// Get AI response (simulated)
function getAiResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('security score') || lowerMessage.includes('assessment')) {
        return `Your current security score is ${securityManager.calculateOverallScore()}%. Would you like me to show you specific areas for improvement?`;
    } else if (lowerMessage.includes('fraud') || lowerMessage.includes('scam')) {
        return "If you suspect fraud, immediately contact your bank and report it using our fraud hotlines. Would you like me to show you the reporting numbers?";
    } else if (lowerMessage.includes('password') || lowerMessage.includes('security')) {
        return "Strong passwords should be at least 12 characters with a mix of letters, numbers, and symbols. Enable two-factor authentication for added security.";
    } else if (lowerMessage.includes('phishing') || lowerMessage.includes('email')) {
        return "Phishing emails often create urgency and contain suspicious links. Never click links in unsolicited emails. Always navigate to websites directly.";
    } else if (lowerMessage.includes('identity') || lowerMessage.includes('theft')) {
        return "If you're a victim of identity theft, freeze your credit reports and file a report with the FTC. Monitor your accounts regularly for suspicious activity.";
    } else if (lowerMessage.includes('atm')) {
        return "When using ATMs, always cover your PIN, check for suspicious devices, and use machines in well-lit areas. Report any unusual activity immediately.";
    } else if (lowerMessage.includes('card') || lowerMessage.includes('credit') || lowerMessage.includes('debit')) {
        return "Protect your cards by monitoring statements regularly, using chip readers when available, and reporting lost or stolen cards immediately.";
    } else if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
        return "I can help you improve your security! Try taking our security assessment to get personalized recommendations, or explore our education resources.";
    } else {
        return "I'm here to help with security questions. You can ask me about fraud prevention, password security, phishing, identity theft protection, ATM safety, card security, or your security score.";
    }
}

// Initialize animations
function initAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.security-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add glow effect to buttons on hover
    const buttons = document.querySelectorAll('.card-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 15px rgba(34, 197, 94, 0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Utility function for smooth scrolling
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export functions for use in other modules if needed
window.SecurityCenter = {
    showPage,
    toggleModal,
    switchProtectionTab,
    switchDigitalTab,
    switchOtherTab,
    showSafetyTipsModal,
    showCardFraudModal,
    showAtmDosDontsModal,
    securityManager
};


// AI-Powered Scam Detection System

// Configuration
const AI_CONFIG = {
    // Use OpenAI API (you'll need to get an API key)
    provider: 'openai',
    apiKey: 'your-openai-api-key-here', // Store securely in environment variables
    model: 'gpt-4',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    
    // Alternative: Use Claude API
    // provider: 'anthropic',
    // apiKey: 'your-anthropic-api-key-here',
    // model: 'claude-3-sonnet-20240229',
    // baseUrl: 'https://api.anthropic.com/v1/messages',
    
    // For security, consider using a backend proxy
    useProxy: true,
    proxyUrl: '/api/ai-proxy' // Your backend endpoint
};

// AI Scam Detection Service
class AIScamDetectionService {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.cacheExpiry = 2 * 60 * 60 * 1000; // 2 hours
    }

    async detectLatestScam() {
        try {
            // Check cache first
            const cached = this.getCachedScam();
            if (cached) {
                return cached;
            }

            // Show loading state
            this.showLoadingState();

            // Fetch latest scam data
            const scamData = await this.queryAIForLatestScam();
            
            // Cache the result
            this.cacheScamData(scamData);
            
            return scamData;
        } catch (error) {
            console.error('Error detecting latest scam:', error);
            return this.getFallbackScam();
        }
    }

    async queryAIForLatestScam() {
        const prompt = this.buildScamDetectionPrompt();
        
        if (this.config.useProxy) {
            return await this.queryThroughProxy(prompt);
        } else {
            return await this.queryDirectly(prompt);
        }
    }

    buildScamDetectionPrompt() {
        const currentDate = new Date().toLocaleDateString();
        
        return `You are a financial security expert. Based on current trends and recent reports as of ${currentDate}, identify the most prevalent and dangerous financial scam currently targeting consumers.

Please provide a JSON response with the following structure:
{
  "title": "Brief descriptive title of the scam",
  "alertDate": "${currentDate}",
  "severity": "high|medium|low",
  "description": "2-3 sentence description of what this scam involves",
  "targetAudience": "Who this scam primarily targets",
  "keyIndicators": [
    "List of 4-6 warning signs or red flags",
    "That people should watch out for"
  ],
  "howItWorks": [
    "Step-by-step breakdown of how the scam operates",
    "Each step should be clear and concise",
    "Include 4-6 steps typically"
  ],
  "examples": [
    "Real-world example scenarios",
    "2-3 specific examples of how this manifests"
  ],
  "protectionMeasures": [
    "Specific actionable steps to protect against this scam",
    "Include 5-7 practical prevention tips"
  ],
  "victimSteps": [
    "What to do if someone falls victim to this scam",
    "Include immediate and follow-up actions"
  ],
  "reportingInfo": {
    "description": "How and where to report this scam",
    "urgency": "How quickly to report (immediate/within hours/within days)"
  }
}

Focus on scams that are:
1. Currently active and widespread
2. Specifically targeting financial information or money
3. Have recent documented cases
4. Pose significant financial risk

Avoid outdated or less common scam types. Prioritize accuracy and current relevance.`;
    }

    async queryThroughProxy(prompt) {
        const response = await fetch(this.config.proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                provider: this.config.provider,
                model: this.config.model
            })
        });

        if (!response.ok) {
            throw new Error(`AI API request failed: ${response.status}`);
        }

        const data = await response.json();
        return this.parseAIResponse(data.content);
    }

    async queryDirectly(prompt) {
        let requestData, headers;

        if (this.config.provider === 'openai') {
            headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            };
            
            requestData = {
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial security expert providing current scam information.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            };
        } else if (this.config.provider === 'anthropic') {
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            };
            
            requestData = {
                model: this.config.model,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            };
        }

        const response = await fetch(this.config.baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`AI API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        let content;
        if (this.config.provider === 'openai') {
            content = data.choices[0].message.content;
        } else if (this.config.provider === 'anthropic') {
            content = data.content[0].text;
        }

        return this.parseAIResponse(content);
    }

    parseAIResponse(content) {
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }

            const scamData = JSON.parse(jsonMatch[0]);
            
            // Validate required fields
            this.validateScamData(scamData);
            
            return scamData;
        } catch (error) {
            console.error('Error parsing AI response:', error);
            throw new Error('Failed to parse AI response');
        }
    }

    validateScamData(data) {
        const requiredFields = ['title', 'description', 'keyIndicators', 'howItWorks', 'protectionMeasures'];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Ensure arrays have content
        if (!Array.isArray(data.keyIndicators) || data.keyIndicators.length === 0) {
            throw new Error('keyIndicators must be a non-empty array');
        }
    }

    getCachedScam() {
        const cached = this.cache.get('latestScam');
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    cacheScamData(data) {
        this.cache.set('latestScam', {
            data: data,
            timestamp: Date.now()
        });
    }

    getFallbackScam() {
        return {
            title: "AI-Generated Romance Scams",
            alertDate: new Date().toLocaleDateString(),
            severity: "high",
            description: "Scammers are using AI tools to create more convincing fake profiles and personas on dating apps and social media to build emotional connections before requesting money.",
            targetAudience: "Adults using dating apps and social media, particularly those seeking romantic connections",
            keyIndicators: [
                "Profile photos that look too perfect or professional",
                "Rapid escalation of romantic feelings",
                "Reluctance to meet in person or video chat",
                "Requests for money for emergencies or travel",
                "Limited or inconsistent personal details",
                "Messages that seem scripted or overly polished"
            ],
            howItWorks: [
                "Scammer creates fake profiles using AI-generated photos",
                "Initiates contact and builds emotional connection over weeks/months",
                "Creates elaborate backstory using AI-assisted writing",
                "Manufactures emergency requiring immediate financial help",
                "Requests money transfer through untraceable methods",
                "Disappears once money is sent or continues with new emergencies"
            ],
            examples: [
                "Military personnel deployed overseas needing help with travel expenses",
                "Business traveler stuck in foreign country needing emergency funds"
            ],
            protectionMeasures: [
                "Reverse image search profile photos",
                "Video chat before developing serious feelings",
                "Never send money to someone you haven't met in person",
                "Be suspicious of requests for wire transfers or gift cards",
                "Trust your instincts if something feels off"
            ],
            victimSteps: [
                "Stop all contact with the scammer immediately",
                "Report to the dating platform or social media site",
                "Contact your bank if you've sent money",
                "File a report with the FTC and local police"
            ],
            reportingInfo: {
                description: "Report to FTC, dating platform, and local authorities",
                urgency: "immediate"
            }
        };
    }

    showLoadingState() {
        const latestScamSection = document.querySelector('#latest-scam-page .scam-alert');
        if (latestScamSection) {
            latestScamSection.innerHTML = `
                <div class="loading-container" style="text-align: center; padding: 3rem;">
                    <div class="loading-spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(34, 197, 94, 0.1);
                        border-left: 4px solid #22c55e;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    "></div>
                    <h3 style="color: #f8fafc; margin-bottom: 0.5rem;">
                        <i class="fas fa-robot"></i>
                        AI Analyzing Current Threats
                    </h3>
                    <p style="color: #94a3b8;">
                        Our AI is scanning the latest security reports to identify the most current financial scams...
                    </p>
                </div>
            `;
        }
    }
}

// Enhanced Security Center with AI Integration
class EnhancedSecurityCenter extends SecurityStatusManager {
    constructor() {
        super();
        this.aiScamService = new AIScamDetectionService(AI_CONFIG);
        this.currentScamData = null;
    }

    async handleLatestScamClick() {
        try {
            // Show the latest scam page first
            showPage(latestScamPage);
            
            // Get AI-detected scam data
            this.currentScamData = await this.aiScamService.detectLatestScam();
            
            // Update the page with AI data
            this.updateLatestScamPage(this.currentScamData);
            
        } catch (error) {
            console.error('Error loading latest scam:', error);
            this.showScamLoadError();
        }
    }

    updateLatestScamPage(scamData) {
        const latestScamSection = document.getElementById('latest-scam-page');
        
        if (!latestScamSection) return;

        // Update the scam alert content
        const scamAlert = latestScamSection.querySelector('.scam-alert');
        
        if (scamAlert) {
            scamAlert.innerHTML = this.generateScamAlertHTML(scamData);
            
            // Re-attach event listeners
            this.attachScamPageEventListeners();
        }
    }

    generateScamAlertHTML(scamData) {
        const severityColor = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#22c55e'
        }[scamData.severity] || '#f59e0b';

        const severityIcon = {
            high: 'fas fa-exclamation-triangle',
            medium: 'fas fa-exclamation-circle',
            low: 'fas fa-info-circle'
        }[scamData.severity] || 'fas fa-exclamation-circle';

        return `
            <header class="alert-header">
                <i class="${severityIcon}" style="color: ${severityColor};"></i>
                <h2>${scamData.title}</h2>
                <time datetime="${scamData.alertDate}">Alert Date: ${scamData.alertDate}</time>
                <div class="ai-badge" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    border-radius: 12px;
                    padding: 0.25rem 0.75rem;
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    color: #22c55e;
                ">
                    <i class="fas fa-robot"></i>
                    AI-Detected Current Threat
                </div>
            </header>
            
            <section class="alert-content">
                <p>${scamData.description}</p>
                
                <section class="scam-details">
                    <h3>Key Warning Signs:</h3>
                    <ul>
                        ${scamData.keyIndicators.map(indicator => `<li>${indicator}</li>`).join('')}
                    </ul>
                </section>

                ${scamData.targetAudience ? `
                    <section class="scam-details">
                        <h3>Primary Targets:</h3>
                        <p>${scamData.targetAudience}</p>
                    </section>
                ` : ''}

                ${scamData.examples ? `
                    <section class="scam-details">
                        <h3>Common Examples:</h3>
                        <ul>
                            ${scamData.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                    </section>
                ` : ''}
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
                    <button class="card-btn" id="how-it-works-btn">
                        <i class="fas fa-info-circle"></i>
                        How It Works
                    </button>
                    <button class="card-btn secondary" id="protection-tips-btn">
                        <i class="fas fa-shield-alt"></i>
                        Protection Tips
                    </button>
                    <button class="card-btn secondary" id="victim-help-btn">
                        <i class="fas fa-life-ring"></i>
                        If You're a Victim
                    </button>
                </div>
            </section>
        `;
    }

    attachScamPageEventListeners() {
        // How it works button
        const howItWorksBtn = document.getElementById('how-it-works-btn');
        if (howItWorksBtn) {
            howItWorksBtn.addEventListener('click', () => {
                this.showScamDetailsModal(this.currentScamData);
            });
        }

        // Protection tips button
        const protectionBtn = document.getElementById('protection-tips-btn');
        if (protectionBtn) {
            protectionBtn.addEventListener('click', () => {
                this.showProtectionTipsModal(this.currentScamData);
            });
        }

        // Victim help button
        const victimBtn = document.getElementById('victim-help-btn');
        if (victimBtn) {
            victimBtn.addEventListener('click', () => {
                this.showVictimHelpModal(this.currentScamData);
            });
        }
    }

    showScamDetailsModal(scamData) {
        const modal = this.createDynamicModal('scam-details', 'How This Scam Works', `
            <section class="scam-steps">
                <h3>Step-by-Step Breakdown:</h3>
                <ol>
                    ${scamData.howItWorks.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </section>
            
            <section class="report-reminder">
                <h3>Report This Scam:</h3>
                <p>If you encounter this scam, report it immediately using the numbers in our <strong>Report Fraud</strong> section.</p>
                <p><strong>Urgency:</strong> ${scamData.reportingInfo?.urgency || 'immediate'}</p>
                <button class="card-btn" onclick="document.getElementById('report-fraud-btn').click()">
                    <i class="fas fa-phone-alt"></i>
                    Report Now
                </button>
            </section>
        `);
        
        toggleModal(modal);
    }

    showProtectionTipsModal(scamData) {
        const modal = this.createDynamicModal('protection-tips', 'Protection Measures', `
            <section class="protection-measures">
                <h3>How to Protect Yourself:</h3>
                <ul>
                    ${scamData.protectionMeasures.map(measure => `<li>${measure}</li>`).join('')}
                </ul>
            </section>
        `);
        
        toggleModal(modal);
    }

    showVictimHelpModal(scamData) {
        const modal = this.createDynamicModal('victim-help', 'If You\'re a Victim', `
            <section class="victim-steps">
                <h3>Immediate Steps to Take:</h3>
                <ol>
                    ${scamData.victimSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </section>
            
            ${scamData.reportingInfo ? `
                <section class="reporting-info">
                    <h3>Reporting Information:</h3>
                    <p>${scamData.reportingInfo.description}</p>
                </section>
            ` : ''}
        `);
        
        toggleModal(modal);
    }

    createDynamicModal(id, title, content) {
        // Remove existing modal if it exists
        const existing = document.getElementById(`${id}-modal`);
        if (existing) {
            document.body.removeChild(existing);
        }

        const modal = document.createElement('dialog');
        modal.className = 'modal';
        modal.id = `${id}-modal`;
        
        modal.innerHTML = `
            <article class="modal-content">
                <header class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </header>
                <section class="modal-body">
                    ${content}
                </section>
            </article>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    showScamLoadError() {
        const latestScamSection = document.querySelector('#latest-scam-page .scam-alert');
        if (latestScamSection) {
            latestScamSection.innerHTML = `
                <div class="error-container" style="text-align: center; padding: 3rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                    <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Unable to Load Latest Scam Data</h3>
                    <p style="color: #94a3b8; margin-bottom: 1.5rem;">
                        We're having trouble connecting to our AI threat detection service. Please try again later.
                    </p>
                    <button class="card-btn" onclick="enhancedSecurityCenter.handleLatestScamClick()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Initialize enhanced security center
const enhancedSecurityCenter = new EnhancedSecurityCenter();

// Override the original latest scam button click handler
document.addEventListener('DOMContentLoaded', function() {
    const latestScamBtn = document.getElementById('latest-scam-btn');
    if (latestScamBtn) {
        // Remove existing event listeners
        latestScamBtn.replaceWith(latestScamBtn.cloneNode(true));
        
        // Add new AI-powered event listener
        document.getElementById('latest-scam-btn').addEventListener('click', () => {
            enhancedSecurityCenter.handleLatestScamClick();
        });
    }
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);