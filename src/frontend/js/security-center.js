// Security Center JavaScript

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

// Modals
const reportFraudModal = document.getElementById('report-fraud-modal');
const scamDetailsModal = document.getElementById('scam-details-modal');
const closeReportModal = document.getElementById('close-report-modal');
const closeScamModal = document.getElementById('close-scam-modal');
const howItWorksBtn = document.getElementById('how-it-works-btn');
const reportFromModal = document.getElementById('report-from-modal');

// Safety Tips Modals
const identityTheftTips = document.getElementById('identity-theft-tips');
const closeSafetyTips = document.querySelectorAll('.close-safety-tips');

// Protection Tabs
const protectionTabs = document.querySelectorAll('.protection-tab');
const protectionSections = document.querySelectorAll('.protection-section');

// Digital Fraud Tabs
const digitalTabs = document.querySelectorAll('.digital-tab');
const digitalSections = document.querySelectorAll('.digital-section');

// Other Fraud Tabs
const otherTabs = document.querySelectorAll('.other-tab');
const otherSections = document.querySelectorAll('.other-section');

// Fraud Type Buttons
const fraudTypeBtns = document.querySelectorAll('.fraud-type-btn');
const atmDosDontsBtn = document.getElementById('atm-dos-donts');

// AI Widget
const aiWidget = document.getElementById('ai-widget');
const aiFab = document.getElementById('ai-fab');
const closeAiWidget = document.getElementById('close-ai-widget');
const aiInput = document.getElementById('ai-input');
const sendAiMessage = document.getElementById('send-ai-message');
const aiMessages = document.getElementById('ai-messages');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active page
    showPage(securityCenter);
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    // Create dynamic modals
    createDynamicModals();
});

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    reportFraudBtn?.addEventListener('click', () => toggleModal(reportFraudModal));
    latestScamBtn?.addEventListener('click', () => showPage(latestScamPage));
    protectYourselfBtn?.addEventListener('click', () => showPage(protectYourselfPage));
    digitalFraudBtn?.addEventListener('click', () => showPage(digitalFraudPage));
    otherFraudBtn?.addEventListener('click', () => showPage(otherFraudPage));
    
    // Back buttons
    backFromScam?.addEventListener('click', () => showPage(securityCenter));
    backFromProtect?.addEventListener('click', () => showPage(securityCenter));
    backFromDigital?.addEventListener('click', () => showPage(securityCenter));
    backFromOther?.addEventListener('click', () => showPage(securityCenter));
    
    // Modal controls
    closeReportModal?.addEventListener('click', () => toggleModal(reportFraudModal));
    closeScamModal?.addEventListener('click', () => toggleModal(scamDetailsModal));
    howItWorksBtn?.addEventListener('click', () => toggleModal(scamDetailsModal));
    reportFromModal?.addEventListener('click', () => {
        toggleModal(scamDetailsModal);
        toggleModal(reportFraudModal);
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
    protectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchProtectionTab(tabId);
        });
    });
    
    // Digital fraud tabs
    digitalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchDigitalTab(tabId);
        });
    });
    
    // Other fraud tabs
    otherTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchOtherTab(tabId);
        });
    });
    
    // Card Fraud Type Buttons
    fraudTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fraudType = this.getAttribute('data-type');
            showCardFraudModal(fraudType);
        });
    });
    
    // ATM Do's and Don'ts
    atmDosDontsBtn?.addEventListener('click', showAtmDosDontsModal);
    
    // AI Widget
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
    
    // Add modals to the page
    modalContainer.insertAdjacentHTML('beforeend', safetyTipsModalHTML);
    modalContainer.insertAdjacentHTML('beforeend', cardFraudModalHTML);
    modalContainer.insertAdjacentHTML('beforeend', atmModalHTML);
    
    // Add event listeners for new modals
    document.getElementById('close-safety-tips-modal').addEventListener('click', () => {
        toggleModal(document.getElementById('safety-tips-modal'));
    });
    
    document.getElementById('close-card-fraud-modal').addEventListener('click', () => {
        toggleModal(document.getElementById('card-fraud-modal'));
    });
    
    document.getElementById('close-atm-modal').addEventListener('click', () => {
        toggleModal(document.getElementById('atm-modal'));
    });
}

// Show safety tips modal with specific content
function showSafetyTipsModal(type) {
    const modal = document.getElementById('safety-tips-modal');
    const title = document.getElementById('safety-tips-title');
    const content = document.getElementById('safety-tips-content');
    
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
    title.textContent = data.title;
    content.innerHTML = data.content;
    
    toggleModal(modal);
}

// Show card fraud modal with specific content
function showCardFraudModal(type) {
    const modal = document.getElementById('card-fraud-modal');
    const title = document.getElementById('card-fraud-title');
    const content = document.getElementById('card-fraud-content');
    
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
    title.textContent = data.title;
    content.innerHTML = data.content;
    
    toggleModal(modal);
}

// Show ATM Do's and Don'ts modal
function showAtmDosDontsModal() {
    const modal = document.getElementById('atm-modal');
    toggleModal(modal);
}

// Show a specific page and hide others
function showPage(page) {
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
    if (aiWidget) {
        aiWidget.classList.toggle('active');
    }
}

// Handle AI message sending
function sendAiMessageHandler(e) {
    if (e) e.preventDefault();
    
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
    
    if (lowerMessage.includes('fraud') || lowerMessage.includes('scam')) {
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
    } else {
        return "I'm here to help with security questions. You can ask me about fraud prevention, password security, phishing, identity theft protection, ATM safety, or card security.";
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
    showAtmDosDontsModal
};