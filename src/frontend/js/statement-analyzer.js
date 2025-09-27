// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStatementAnalyzer();
});

function initializeStatementAnalyzer() {
    // Initialize sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Initialize AI Widget
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeAiWidget = document.getElementById('close-ai-widget');

    if (aiFab && aiWidget) {
        aiFab.addEventListener('click', function() {
            aiWidget.classList.toggle('active');
        });
    }

    if (closeAiWidget && aiWidget) {
        closeAiWidget.addEventListener('click', function() {
            aiWidget.classList.remove('active');
        });
    }

    // Initialize file upload handlers
    setupFileUploadHandlers();
    
    // Initialize chat functionality
    setupChatFunctionality();
    
    // Initialize AI chat
    setupAIChat();
}

// File Upload Handlers
function setupFileUploadHandlers() {
    const pdfUpload = document.getElementById('analyzerPdfUpload');
    const imageUpload = document.getElementById('analyzerImageUpload');
    const cameraUpload = document.getElementById('analyzerCameraCapture');
    
    const pdfInput = document.getElementById('analyzerPdfInput');
    const imageInput = document.getElementById('analyzerImageInput');
    const cameraInput = document.getElementById('analyzerCameraInput');
    
    if (pdfUpload && pdfInput) {
        pdfUpload.addEventListener('click', () => pdfInput.click());
        pdfInput.addEventListener('change', handlePdfUpload);
    }
    
    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    if (cameraUpload && cameraInput) {
        cameraUpload.addEventListener('click', () => cameraInput.click());
        cameraInput.addEventListener('change', handleImageUpload);
    }
}

async function handlePdfUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showProcessingSection();
    await processPdfStatement(file);
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showProcessingSection();
    await processImageStatement(file);
}

function showProcessingSection() {
    const uploadSection = document.getElementById('analyzerUploadSection');
    const processingSection = document.getElementById('analyzerProcessingSection');
    
    uploadSection.style.display = 'none';
    processingSection.classList.add('active');
}

function showResultsSection() {
    const processingSection = document.getElementById('analyzerProcessingSection');
    const resultsSection = document.getElementById('analyzerResults');
    
    processingSection.classList.remove('active');
    resultsSection.classList.add('active');
}

// Processing Functions
async function processPdfStatement(file) {
    updateProgress('Loading PDF...', 10);
    
    try {
        // Initialize PDF.js
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        
        updateProgress('Extracting text from PDF...', 30);
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
            
            updateProgress(`Processing page ${i} of ${pdf.numPages}...`, 30 + (i / pdf.numPages) * 40);
        }
        
        updateProgress('Analyzing financial data...', 80);
        await analyzeStatement(fullText);
        
    } catch (error) {
        console.error('Error processing PDF:', error);
        updateProgress('Error processing PDF. Please try again.', 100);
        setTimeout(() => resetStatementAnalyzer(), 2000);
    }
}

async function processImageStatement(file) {
    updateProgress('Processing image...', 20);
    
    try {
        const Tesseract = window.Tesseract;
        
        updateProgress('Extracting text from image...', 40);
        
        const result = await Tesseract.recognize(file, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    updateProgress('Extracting text...', 40 + (m.progress * 30));
                }
            }
        });
        
        updateProgress('Analyzing financial data...', 80);
        await analyzeStatement(result.data.text);
        
    } catch (error) {
        console.error('Error processing image:', error);
        updateProgress('Error processing image. Please try again.', 100);
        setTimeout(() => resetStatementAnalyzer(), 2000);
    }
}

async function analyzeStatement(text) {
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract financial data using regex patterns
    const financialData = extractFinancialData(text);
    
    updateProgress('Generating insights...', 90);
    
    // Generate AI insights and recommendations
    const analysisResults = generateAnalysisResults(financialData);
    
    updateProgress('Complete!', 100);
    
    // Display results
    setTimeout(() => {
        displayAnalysisResults(financialData, analysisResults);
        showResultsSection();
    }, 1000);
}

function extractFinancialData(text) {
    // Enhanced regex patterns for financial data extraction
    const patterns = {
        transactions: /(\d{2}\/\d{2})\s+([^\d]+?)\s+([-+]?\$?[\d,]+\.?\d*)/gi,
        balance: /(balance|total|current balance)[:\s]*\$?([\d,]+\.?\d*)/gi,
        deposits: /(deposit|credit|income)[:\s]*\$?([\d,]+\.?\d*)/gi,
        withdrawals: /(withdrawal|debit|payment)[:\s]*\$?([\d,]+\.?\d*)/gi
    };
    
    const transactions = [];
    let match;
    
    // Extract transactions
    while ((match = patterns.transactions.exec(text)) !== null) {
        if (match[3]) {
            const amount = parseFloat(match[3].replace(/[^\d.-]/g, ''));
            if (!isNaN(amount)) {
                transactions.push({
                    date: match[1],
                    description: match[2].trim(),
                    amount: amount,
                    type: amount >= 0 ? 'income' : 'expense'
                });
            }
        }
    }
    
    // Calculate totals
    const totalIncome = transactions.filter(t => t.type === 'income')
                                   .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense')
                                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netCashFlow = totalIncome - totalExpenses;
    
    return {
        transactions: transactions,
        summary: {
            totalIncome,
            totalExpenses,
            netCashFlow,
            transactionCount: transactions.length
        },
        categories: categorizeTransactions(transactions)
    };
}

function categorizeTransactions(transactions) {
    const categoryPatterns = {
        'Food & Dining': /(restaurant|cafe|coffee|food|grocery|supermarket|dining)/i,
        'Shopping': /(amazon|walmart|target|mall|store|shop|purchase)/i,
        'Entertainment': /(netflix|spotify|movie|cinema|entertainment|game)/i,
        'Transportation': /(uber|lyft|taxi|gas|fuel|transport|bus|train)/i,
        'Utilities': /(electric|water|gas|utility|internet|phone|mobile)/i,
        'Healthcare': /(hospital|doctor|pharmacy|medical|health)/i,
        'Housing': /(rent|mortgage|housing|apartment)/i,
        'Income': /(salary|paycheck|deposit|income|transfer in)/i
    };
    
    const categories = {};
    
    transactions.forEach(transaction => {
        let category = 'Other';
        
        for (const [cat, pattern] of Object.entries(categoryPatterns)) {
            if (pattern.test(transaction.description)) {
                category = cat;
                break;
            }
        }
        
        if (!categories[category]) {
            categories[category] = { total: 0, count: 0, transactions: [] };
        }
        
        categories[category].total += Math.abs(transaction.amount);
        categories[category].count++;
        categories[category].transactions.push(transaction);
    });
    
    return categories;
}

function generateAnalysisResults(financialData) {
    const { summary, categories } = financialData;
    
    const insights = [];
    const recommendations = [];
    
    // Generate insights based on financial data
    if (summary.netCashFlow > 0) {
        insights.push({
            type: 'positive',
            title: 'Positive Cash Flow',
            message: `Great! You're saving $${summary.netCashFlow.toFixed(2)} per period.`
        });
    } else {
        insights.push({
            type: 'warning',
            title: 'Negative Cash Flow',
            message: `You're spending $${Math.abs(summary.netCashFlow).toFixed(2)} more than you earn.`
        });
    }
    
    // Analyze spending categories
    const largestCategory = Object.entries(categories)
        .filter(([cat]) => cat !== 'Income')
        .sort(([,a], [,b]) => b.total - a.total)[0];
    
    if (largestCategory) {
        insights.push({
            type: 'info',
            title: 'Largest Expense',
            message: `${largestCategory[0]} is your biggest expense at $${largestCategory[1].total.toFixed(2)}`
        });
    }
    
    // Generate recommendations
    if (summary.totalExpenses / summary.totalIncome > 0.8) {
        recommendations.push({
            type: 'savings',
            title: 'Reduce Expenses',
            message: 'Your expenses are high relative to income. Consider cutting discretionary spending.'
        });
    }
    
    if (Object.keys(categories).some(cat => cat.includes('Food') && categories[cat].total > 300)) {
        recommendations.push({
            type: 'dining',
            title: 'Dining Budget',
            message: 'Food expenses seem high. Consider meal planning to save money.'
        });
    }
    
    return { insights, recommendations };
}

function displayAnalysisResults(financialData, analysisResults) {
    displaySummaryCards(financialData.summary);
    displayCharts(financialData);
    displayCategoryDetails(financialData.categories);
    displayAIRecommendations(analysisResults.recommendations);
    displayFinancialInsights(analysisResults.insights);
}

function displaySummaryCards(summary) {
    const summaryCards = document.getElementById('summaryCards');
    
    const cards = [
        {
            title: 'Total Income',
            value: `$${summary.totalIncome.toFixed(2)}`,
            change: '+5.2%',
            positive: true
        },
        {
            title: 'Total Expenses',
            value: `$${summary.totalExpenses.toFixed(2)}`,
            change: '+3.1%',
            positive: false
        },
        {
            title: 'Net Cash Flow',
            value: `$${summary.netCashFlow.toFixed(2)}`,
            change: summary.netCashFlow >= 0 ? '+12.5%' : '-8.3%',
            positive: summary.netCashFlow >= 0
        },
        {
            title: 'Transactions',
            value: summary.transactionCount.toString(),
            change: '+2.4%',
            positive: true
        }
    ];
    
    summaryCards.innerHTML = cards.map(card => `
        <div class="summary-card">
            <h3>${card.title}</h3>
            <div class="summary-value ${card.positive ? 'positive' : 'negative'}">${card.value}</div>
            <div class="summary-change ${card.positive ? 'positive' : 'negative'}">${card.change}</div>
        </div>
    `).join('');
}

function displayCharts(financialData) {
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryLabels = Object.keys(financialData.categories).filter(cat => cat !== 'Income');
    const categoryData = categoryLabels.map(cat => financialData.categories[cat].total);
    
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryData,
                backgroundColor: [
                    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
                    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
                ],
                borderWidth: 2,
                borderColor: '#0f172a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
    
    // Trends Chart
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Income',
                    data: [3200, 3400, 3100, 3600, 3800, 4000],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: [2800, 3000, 3200, 2900, 3100, 3300],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
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
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
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

function displayCategoryDetails(categories) {
    const categoryDetails = document.getElementById('categoryDetails');
    const categoryIcons = {
        'Food & Dining': 'fas fa-utensils',
        'Shopping': 'fas fa-shopping-bag',
        'Entertainment': 'fas fa-film',
        'Transportation': 'fas fa-car',
        'Utilities': 'fas fa-bolt',
        'Healthcare': 'fas fa-heartbeat',
        'Housing': 'fas fa-home',
        'Income': 'fas fa-money-bill-wave',
        'Other': 'fas fa-ellipsis-h'
    };
    
    const sortedCategories = Object.entries(categories)
        .filter(([cat]) => cat !== 'Income')
        .sort(([,a], [,b]) => b.total - a.total);
    
    categoryDetails.innerHTML = sortedCategories.map(([category, data]) => `
        <div class="category-item">
            <div class="category-info">
                <div class="category-icon">
                    <i class="${categoryIcons[category] || categoryIcons.Other}"></i>
                </div>
                <div>
                    <div class="category-name">${category}</div>
                    <div class="category-count">${data.count} transactions</div>
                </div>
            </div>
            <div class="category-amount">$${data.total.toFixed(2)}</div>
        </div>
    `).join('');
}

function displayAIRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('aiRecommendations');
    
    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-type">${rec.title}</div>
            <div class="recommendation-text">${rec.message}</div>
        </div>
    `).join('');
}

function displayFinancialInsights(insights) {
    const insightsDiv = document.getElementById('financialInsights');
    
    insightsDiv.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-type">${insight.title}</div>
            <div class="insight-text">${insight.message}</div>
        </div>
    `).join('');
}

// Chat Functionality
function setupChatFunctionality() {
    const chatInput = document.getElementById('financialChatInput');
    const sendButton = document.getElementById('sendFinancialMessage');
    const chatMessages = document.getElementById('financialChatMessages');
    
    if (sendButton && chatInput) {
        sendButton.addEventListener('click', sendFinancialMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendFinancialMessage();
        });
    }
    
    // Add welcome message
    addFinancialChatMessage('assistant', 'Hi! I can help you understand your financial statement. Ask me anything about your spending patterns or financial habits.');
}

function sendFinancialMessage() {
    const chatInput = document.getElementById('financialChatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addFinancialChatMessage('user', message);
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "Based on your statement, I notice you're spending quite a bit on dining out. Consider meal prepping to save money.",
            "Your transportation costs seem high this month. Have you considered carpooling or public transit?",
            "I see a positive cash flow this period. Great job managing your expenses!",
            "Your utility bills have increased compared to last month. Check if there are any energy-saving opportunities.",
            "You have several recurring subscriptions. Review them to see if you're using all of them regularly."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addFinancialChatMessage('assistant', randomResponse);
    }, 1000);
}

function addFinancialChatMessage(sender, message) {
    const chatMessages = document.getElementById('financialChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : ''}`;
    
    const avatar = sender === 'user' ? 
        '<div class="message-avatar"><i class="fas fa-user"></i></div>' :
        '<div class="message-avatar"><i class="fas fa-robot"></i></div>';
    
    messageDiv.innerHTML = `
        ${avatar}
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI Chat Widget
function setupAIChat() {
    const aiInput = document.getElementById('ai-input');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiMessages = document.getElementById('ai-messages');
    
    if (sendAiMessage && aiInput) {
        sendAiMessage.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
}

function sendAIMessage() {
    const aiInput = document.getElementById('ai-input');
    const message = aiInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addAIMessage('user', message);
    aiInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "I can help you analyze your financial statements and provide personalized advice.",
            "Based on your spending patterns, I recommend creating a budget for discretionary expenses.",
            "Would you like me to help you set up financial goals for the upcoming month?",
            "I notice some opportunities to optimize your savings. Let me know if you'd like specific suggestions.",
            "Your financial health looks good overall! Keep monitoring your expenses regularly."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addAIMessage('assistant', randomResponse);
    }, 1500);
}

function addAIMessage(sender, message) {
    const aiMessages = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message-widget' : 'ai-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// Utility Functions
function updateProgress(text, percentage) {
    const progressBar = document.getElementById('analyzerProgressBar');
    const progressText = document.getElementById('analyzerProgressText');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = text;
}

function resetStatementAnalyzer() {
    const uploadSection = document.getElementById('analyzerUploadSection');
    const processingSection = document.getElementById('analyzerProcessingSection');
    const resultsSection = document.getElementById('analyzerResults');
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => input.value = '');
    
    // Reset sections
    uploadSection.style.display = 'block';
    processingSection.classList.remove('active');
    resultsSection.classList.remove('active');
    
    // Clear chat
    const chatMessages = document.getElementById('financialChatMessages');
    if (chatMessages) chatMessages.innerHTML = '';
    
    // Add welcome message back
    addFinancialChatMessage('assistant', 'Hi! I can help you understand your financial statement. Ask me anything about your spending patterns or financial habits.');
}

// Export functions for global access
window.resetStatementAnalyzer = resetStatementAnalyzer;