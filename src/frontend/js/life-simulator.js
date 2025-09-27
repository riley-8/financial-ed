// Life Simulator Game Logic
document.addEventListener('DOMContentLoaded', function() {
    initializeLifeSimulator();
});

function initializeLifeSimulator() {
    // Initialize game state
    const gameState = {
        balance: 50000,
        age: 25,
        health: 100,
        security: 85,
        knowledge: 75,
        decisions: [],
        achievements: ['security_expert'],
        currentScenario: null,
        score: 0
    };

    // DOM Elements
    const balanceEl = document.getElementById('sim-balance');
    const ageEl = document.getElementById('sim-age');
    const healthEl = document.getElementById('sim-health');
    const securityEl = document.getElementById('sim-security');
    const knowledgeEl = document.getElementById('sim-knowledge');
    const scenarioTitleEl = document.getElementById('scenario-title');
    const scenarioDescEl = document.getElementById('scenario-description');
    const scenarioOptionsEl = document.getElementById('scenario-options');
    const historyListEl = document.getElementById('history-list');
    const resetBtn = document.getElementById('reset-game');
    const saveBtn = document.getElementById('save-game');
    const hintBtn = document.getElementById('hint-btn');

    // Scenario Database
    const scenarios = [
        {
            id: 1,
            title: "Investment Opportunity",
            description: "A friend recommends investing in a new cryptocurrency. The potential returns are high, but so are the risks. What do you do?",
            difficulty: "medium",
            options: [
                {
                    text: "Invest 20% of savings",
                    choice: "invest",
                    icon: "fa-chart-line",
                    consequences: {
                        balance: { min: -10000, max: 5000 },
                        security: { min: -10, max: 0 },
                        knowledge: { min: 5, max: 10 }
                    }
                },
                {
                    text: "Research first",
                    choice: "research",
                    icon: "fa-search",
                    consequences: {
                        balance: { min: -500, max: 0 },
                        security: { min: 5, max: 10 },
                        knowledge: { min: 10, max: 15 }
                    }
                },
                {
                    text: "Decline the offer",
                    choice: "decline",
                    icon: "fa-times-circle",
                    consequences: {
                        balance: { min: 0, max: 0 },
                        security: { min: 2, max: 5 },
                        knowledge: { min: 0, max: 5 }
                    }
                }
            ]
        },
        {
            id: 2,
            title: "Email from Bank",
            description: "You receive an email claiming to be from your bank asking you to verify your account details. The email looks legitimate but has some spelling errors. What do you do?",
            difficulty: "easy",
            options: [
                {
                    text: "Click the link immediately",
                    choice: "click",
                    icon: "fa-link",
                    consequences: {
                        balance: { min: -5000, max: -2000 },
                        security: { min: -20, max: -10 },
                        knowledge: { min: -5, max: 0 }
                    }
                },
                {
                    text: "Call the bank directly",
                    choice: "verify",
                    icon: "fa-phone",
                    consequences: {
                        balance: { min: 0, max: 0 },
                        security: { min: 10, max: 15 },
                        knowledge: { min: 5, max: 10 }
                    }
                },
                {
                    text: "Delete the email",
                    choice: "delete",
                    icon: "fa-trash",
                    consequences: {
                        balance: { min: 0, max: 0 },
                        security: { min: 5, max: 8 },
                        knowledge: { min: 2, max: 5 }
                    }
                }
            ]
        },
        {
            id: 3,
            title: "Unexpected Windfall",
            description: "You receive an unexpected bonus of R15,000. How do you allocate this money?",
            difficulty: "medium",
            options: [
                {
                    text: "Invest in diversified portfolio",
                    choice: "invest_diversified",
                    icon: "fa-chart-pie",
                    consequences: {
                        balance: { min: 2000, max: 5000 },
                        security: { min: 5, max: 10 },
                        knowledge: { min: 10, max: 15 }
                    }
                },
                {
                    text: "Add to emergency fund",
                    choice: "emergency_fund",
                    icon: "fa-piggy-bank",
                    consequences: {
                        balance: { min: 0, max: 0 },
                        security: { min: 15, max: 20 },
                        knowledge: { min: 5, max: 10 }
                    }
                },
                {
                    text: "Splurge on luxury items",
                    choice: "splurge",
                    icon: "fa-shopping-bag",
                    consequences: {
                        balance: { min: -5000, max: -2000 },
                        security: { min: -5, max: 0 },
                        knowledge: { min: -3, max: 0 }
                    }
                }
            ]
        },
        {
            id: 4,
            title: "Job Opportunity",
            description: "You're offered a new job with higher pay but requires relocating to a new city. The company has mixed reviews online. What's your decision?",
            difficulty: "hard",
            options: [
                {
                    text: "Accept immediately",
                    choice: "accept",
                    icon: "fa-briefcase",
                    consequences: {
                        balance: { min: 10000, max: 20000 },
                        security: { min: -10, max: 5 },
                        knowledge: { min: 5, max: 15 }
                    }
                },
                {
                    text: "Negotiate and research",
                    choice: "negotiate",
                    icon: "fa-handshake",
                    consequences: {
                        balance: { min: 5000, max: 15000 },
                        security: { min: 10, max: 20 },
                        knowledge: { min: 10, max: 20 }
                    }
                },
                {
                    text: "Decline and stay put",
                    choice: "decline_job",
                    icon: "fa-home",
                    consequences: {
                        balance: { min: 0, max: 0 },
                        security: { min: 5, max: 10 },
                        knowledge: { min: 0, max: 5 }
                    }
                }
            ]
        }
    ];

    // Initialize the game
    function initGame() {
        loadGameState();
        updateStatsDisplay();
        generateNewScenario();
        updateHistoryDisplay();
        updateAchievementsDisplay();
    }

    // Load game state from localStorage
    function loadGameState() {
        const savedState = localStorage.getItem('lifeSimulatorState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            Object.assign(gameState, parsedState);
        }
    }

    // Save game state to localStorage
    function saveGameState() {
        localStorage.setItem('lifeSimulatorState', JSON.stringify(gameState));
        showNotification('Game progress saved successfully!', 'success');
    }

    // Update stats display
    function updateStatsDisplay() {
        balanceEl.textContent = gameState.balance.toLocaleString();
        ageEl.textContent = Math.floor(gameState.age);
        healthEl.textContent = Math.floor(gameState.health);
        securityEl.textContent = Math.floor(gameState.security);
        knowledgeEl.textContent = Math.floor(gameState.knowledge);
    }

    // Generate new scenario
    function generateNewScenario() {
        // Filter out recently used scenarios
        const recentScenarioIds = gameState.decisions.slice(-3).map(d => d.scenarioId);
        const availableScenarios = scenarios.filter(s => !recentScenarioIds.includes(s.id));
        
        // Select random scenario
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        gameState.currentScenario = availableScenarios[randomIndex] || scenarios[0];
        
        displayScenario(gameState.currentScenario);
    }

    // Display scenario
    function displayScenario(scenario) {
        scenarioTitleEl.textContent = scenario.title;
        scenarioDescEl.textContent = scenario.description;
        
        // Update difficulty badge
        const difficultyBadge = document.querySelector('.difficulty-badge');
        difficultyBadge.className = 'difficulty-badge ' + scenario.difficulty;
        difficultyBadge.textContent = scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1);
        
        // Clear options
        scenarioOptionsEl.innerHTML = '';
        
        // Add options
        scenario.options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.setAttribute('data-choice', option.choice);
            optionBtn.innerHTML = `
                <i class="fas ${option.icon}"></i>
                <span>${option.text}</span>
            `;
            
            optionBtn.addEventListener('click', () => handleChoice(option));
            scenarioOptionsEl.appendChild(optionBtn);
        });
    }

    // Handle player choice
    function handleChoice(option) {
        const scenario = gameState.currentScenario;
        
        // Calculate consequences
        const balanceChange = getRandomInRange(option.consequences.balance);
        const securityChange = getRandomInRange(option.consequences.security);
        const knowledgeChange = getRandomInRange(option.consequences.knowledge);
        
        // Update game state
        gameState.balance = Math.max(0, gameState.balance + balanceChange);
        gameState.security = Math.max(0, Math.min(100, gameState.security + securityChange));
        gameState.knowledge = Math.max(0, Math.min(100, gameState.knowledge + knowledgeChange));
        gameState.age += 0.1;
        
        // Calculate outcome type
        let outcomeType = 'neutral';
        if (balanceChange > 0 && securityChange >= 0) outcomeType = 'good';
        if (balanceChange < 0 || securityChange < 0) outcomeType = 'bad';
        
        // Add to decision history
        const decision = {
            scenarioId: scenario.id,
            choice: option.choice,
            outcome: outcomeType,
            balanceChange: balanceChange,
            securityChange: securityChange,
            knowledgeChange: knowledgeChange,
            timestamp: new Date().toLocaleString()
        };
        
        gameState.decisions.push(decision);
        gameState.score += calculateScore(decision);
        
        // Check for achievements
        checkAchievements();
        
        // Update displays
        updateStatsDisplay();
        updateHistoryDisplay();
        
        // Show outcome modal
        showOutcomeModal(decision, scenario, option);
    }

    // Calculate random value in range
    function getRandomInRange(range) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    // Calculate score for decision
    function calculateScore(decision) {
        let score = 0;
        score += decision.balanceChange * 0.1;
        score += decision.securityChange * 2;
        score += decision.knowledgeChange * 1.5;
        
        if (decision.outcome === 'good') score += 50;
        if (decision.outcome === 'bad') score -= 25;
        
        return Math.max(0, score);
    }

    // Show outcome modal
    function showOutcomeModal(decision, scenario, option) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('outcome-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'outcome-modal';
            modal.className = 'outcome-modal';
            modal.innerHTML = `
                <div class="outcome-content">
                    <div class="outcome-icon"></div>
                    <h3></h3>
                    <p></p>
                    <div class="outcome-stats"></div>
                    <button class="continue-btn">Continue</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.continue-btn').addEventListener('click', () => {
                modal.classList.remove('active');
                generateNewScenario();
            });
        }
        
        const content = modal.querySelector('.outcome-content');
        const icon = modal.querySelector('.outcome-icon');
        const title = modal.querySelector('h3');
        const description = modal.querySelector('p');
        const stats = modal.querySelector('.outcome-stats');
        
        // Set content based on outcome
        content.className = `outcome-content ${decision.outcome}`;
        
        if (decision.outcome === 'good') {
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            title.textContent = 'Great Decision!';
            description.textContent = 'Your choice had positive consequences. Keep making smart financial decisions!';
        } else if (decision.outcome === 'bad') {
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            title.textContent = 'Learning Experience';
            description.textContent = 'This decision had negative consequences. Use this as a learning opportunity for the future.';
        } else {
            icon.innerHTML = '<i class="fas fa-info-circle"></i>';
            title.textContent = 'Neutral Outcome';
            description.textContent = 'Your choice had mixed or neutral consequences. Consider the long-term implications.';
        }
        
        // Add stats
        stats.innerHTML = `
            <div class="outcome-stat">
                <div class="label">Balance Change</div>
                <div class="value ${decision.balanceChange >= 0 ? 'positive' : 'negative'}">
                    ${decision.balanceChange >= 0 ? '+' : ''}R${decision.balanceChange.toLocaleString()}
                </div>
            </div>
            <div class="outcome-stat">
                <div class="label">Security Change</div>
                <div class="value ${decision.securityChange >= 0 ? 'positive' : 'negative'}">
                    ${decision.securityChange >= 0 ? '+' : ''}${decision.securityChange}%
                </div>
            </div>
            <div class="outcome-stat">
                <div class="label">Knowledge Change</div>
                <div class="value ${decision.knowledgeChange >= 0 ? 'positive' : 'negative'}">
                    ${decision.knowledgeChange >= 0 ? '+' : ''}${decision.knowledgeChange}%
                </div>
            </div>
            <div class="outcome-stat">
                <div class="label">Age</div>
                <div class="value">+0.1 years</div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    // Update history display
    function updateHistoryDisplay() {
        historyListEl.innerHTML = '';
        
        const recentDecisions = gameState.decisions.slice(-5).reverse();
        
        recentDecisions.forEach(decision => {
            const scenario = scenarios.find(s => s.id === decision.scenarioId);
            const option = scenario.options.find(o => o.choice === decision.choice);
            
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${decision.outcome}`;
            historyItem.innerHTML = `
                <div class="history-icon">
                    <i class="fas ${option.icon}"></i>
                </div>
                <div class="history-content">
                    <p>${scenario.title}</p>
                    <span>${option.text}</span>
                </div>
                <div class="history-outcome">
                    ${decision.balanceChange >= 0 ? '+' : ''}R${decision.balanceChange.toLocaleString()}
                </div>
            `;
            
            historyListEl.appendChild(historyItem);
        });
    }

    // Update achievements display
    function updateAchievementsDisplay() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            const achievementName = card.querySelector('h4').textContent.toLowerCase().replace(' ', '_');
            
            if (gameState.achievements.includes(achievementName)) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
                card.querySelector('.achievement-icon i').className = 'fas fa-check';
            }
        });
    }

    // Check for new achievements
    function checkAchievements() {
        const totalDecisions = gameState.decisions.length;
        const goodDecisions = gameState.decisions.filter(d => d.outcome === 'good').length;
        const securityThreatsAvoided = gameState.decisions.filter(d => 
            d.scenarioId === 2 && d.choice !== 'click'
        ).length;
        
        const newAchievements = [];
        
        if (totalDecisions >= 10 && !gameState.achievements.includes('financial_guru')) {
            newAchievements.push('financial_guru');
        }
        
        if (securityThreatsAvoided >= 5 && !gameState.achievements.includes('security_expert')) {
            newAchievements.push('security_expert');
        }
        
        if (gameState.balance >= 100000 && !gameState.achievements.includes('savings_master')) {
            newAchievements.push('savings_master');
        }
        
        if (goodDecisions >= 5 && !gameState.achievements.includes('wise_investor')) {
            newAchievements.push('wise_investor');
        }
        
        if (newAchievements.length > 0) {
            gameState.achievements.push(...newAchievements);
            showAchievementNotification(newAchievements);
            updateAchievementsDisplay();
        }
    }

    // Show achievement notification
    function showAchievementNotification(achievements) {
        achievements.forEach(achievement => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-notification-content">
                    <i class="fas fa-trophy"></i>
                    <div>
                        <h4>Achievement Unlocked!</h4>
                        <p>${achievement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Event Listeners
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            gameState.balance = 50000;
            gameState.age = 25;
            gameState.health = 100;
            gameState.security = 85;
            gameState.knowledge = 75;
            gameState.decisions = [];
            gameState.achievements = ['security_expert'];
            gameState.score = 0;
            
            updateStatsDisplay();
            generateNewScenario();
            updateHistoryDisplay();
            updateAchievementsDisplay();
            
            localStorage.removeItem('lifeSimulatorState');
            showNotification('Game reset successfully!', 'success');
        }
    });

    saveBtn.addEventListener('click', saveGameState);

    hintBtn.addEventListener('click', () => {
        const scenario = gameState.currentScenario;
        const hints = {
            1: "Consider the volatility of cryptocurrency and your risk tolerance before investing.",
            2: "Banks never ask for sensitive information via email. Always verify through official channels.",
            3: "A balanced approach between saving, investing, and spending is often the wisest choice.",
            4: "Research company reputation and consider all factors before relocating for a job."
        };
        
        const hint = hints[scenario.id] || "Consider the long-term consequences of your decision on your financial security.";
        showNotification(`💡 Hint: ${hint}`, 'info');
    });

    // Initialize AI Widget
    initializeAIWidget();

    // Start the game
    initGame();
}

// AI Widget functionality
function initializeAIWidget() {
    const aiWidget = document.getElementById('ai-widget');
    const aiFab = document.getElementById('ai-fab');
    const closeBtn = document.getElementById('close-ai-widget');
    const sendBtn = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');

    let isWidgetOpen = false;

    // Toggle widget visibility
    function toggleWidget() {
        isWidgetOpen = !isWidgetOpen;
        if (isWidgetOpen) {
            aiWidget.style.display = 'block';
            aiFab.style.display = 'none';
            setTimeout(() => {
                aiWidget.classList.add('active');
            }, 10);
        } else {
            aiWidget.classList.remove('active');
            setTimeout(() => {
                aiWidget.style.display = 'none';
                aiFab.style.display = 'flex';
            }, 300);
        }
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user-message' : ''}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Handle AI response
    function handleAIResponse(message) {
        const responses = {
            'help': "I'm your simulation coach! I can help you understand scenarios, give advice, or explain financial concepts.",
            'hint': "Check the hint button for scenario-specific advice, or ask me about financial security best practices.",
            'balance': "Your balance represents your financial resources. Make wise decisions to grow it over time.",
            'security': "Security measures your protection against fraud and financial risks. Keep it high for safety.",
            'invest': "Always research investments thoroughly and consider your risk tolerance before committing.",
            'scenario': "Each scenario teaches real financial lessons. Think carefully about long-term consequences."
        };

        const lowerMessage = message.toLowerCase();
        let response = "I'm here to help you learn about financial decision-making. What would you like to know?";

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        setTimeout(() => {
            addMessage(response);
        }, 500);
    }

    // Event listeners
    aiFab.addEventListener('click', toggleWidget);
    closeBtn.addEventListener('click', toggleWidget);

    sendBtn.addEventListener('click', () => {
        const message = aiInput.value.trim();
        if (message) {
            addMessage(message, true);
            aiInput.value = '';
            handleAIResponse(message);
        }
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Initial welcome message
    setTimeout(() => {
        addMessage("Welcome! I'm your Financial Life Simulator coach. Ask me anything about the scenarios or financial concepts!");
    }, 1000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: #22c55e;
    }
    
    .notification.info {
        background: #3b82f6;
    }
    
    .notification.error {
        background: #ef4444;
    }
    
    .achievement-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 1000;
        transition: transform 0.3s ease;
    }
    
    .achievement-notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .achievement-notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .achievement-notification-content i {
        font-size: 2rem;
    }
    
    .achievement-notification-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
    }
    
    .achievement-notification-content p {
        margin: 0;
        opacity: 0.9;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);