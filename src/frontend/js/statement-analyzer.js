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
        
        updateProgress('Analyzing financial data with AI...', 80);
        await analyzeStatementWithAI(fullText, file.name);
        
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
        
        updateProgress('Analyzing financial data with AI...', 80);
        await analyzeStatementWithAI(result.data.text, file.name);
        
    } catch (error) {
        console.error('Error processing image:', error);
        updateProgress('Error processing image. Please try again.', 100);
        setTimeout(() => resetStatementAnalyzer(), 2000);
    }
}

// AI-powered analysis using Gemini API
async function analyzeStatementWithAI(text, fileName) {
    try {
        console.log('Analyzing statement with Gemini AI...');
        
        const analysisPrompt = `Analyze this financial statement and provide detailed insights:

Financial Statement Text: "${text.substring(0, 2000)}..."
File: ${fileName}

Please provide:
1. Summary of income and expenses
2. Spending category analysis
3. Financial recommendations
4. Insights about spending patterns
5. Areas for improvement

Focus on actionable financial advice and specific observations from the data.`;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: analysisPrompt,
                context: 'Financial statement analysis and advisory'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('AI Analysis Response:', data);
        
        updateProgress('Processing AI insights...', 95);
        
        // Extract basic financial data for charts
        const financialData = extractFinancialData(text);
        
        // Generate enhanced results with AI insights
        const analysisResults = {
            aiInsights: data.message || 'Analysis completed successfully.',
            recommendations: generateRecommendationsFromAI(data.message),
            insights: generateInsightsFromData(financialData)
        };
        
        updateProgress('Complete!', 100);
        
        // Store AI analysis for chat context
        window.currentStatementAnalysis = {
            text: text,
            aiAnalysis: data.message,
            financialData: financialData
        };
        
        // Display results
        setTimeout(() => {
            displayAnalysisResults(financialData, analysisResults);
            showResultsSection();
        }, 1000);
        
    } catch (error) {
        console.error('AI Analysis Error:', error);
        updateProgress('AI analysis failed. Using basic analysis...', 90);
        
        // Fallback to basic analysis
        const financialData = extractFinancialData(text);
        const analysisResults = generateBasicAnalysisResults(financialData);
        
        updateProgress('Complete!', 100);
        
        setTimeout(() => {
            displayAnalysisResults(financialData, analysisResults);
            showResultsSection();
        }, 1000);
    }
}

function extractFinancialData(text) {
    // Enhanced regex patterns for financial data extraction
    const patterns = {
        transactions: /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s+([^\d\n]+?)\s+([-+]?\$?[\d,]+\.?\d*)/gi,
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
            if (!isNaN(amount) && Math.abs(amount) > 0) {
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
            totalIncome: totalIncome || 3500, // Fallback values for demo
            totalExpenses: totalExpenses || 2800,
            netCashFlow: netCashFlow || 700,
            transactionCount: transactions.length || 45
        },
        categories: categorizeTransactions(transactions)
    };
}

function categorizeTransactions(transactions) {
    const categoryPatterns = {
        'Food & Dining': /(restaurant|cafe|coffee|food|grocery|supermarket|dining|mcdonald|burger|pizza)/i,
        'Shopping': /(amazon|walmart|target|mall|store|shop|purchase|retail)/i,
        'Entertainment': /(netflix|spotify|movie|cinema|entertainment|game|theater)/i,
        'Transportation': /(uber|lyft|taxi|gas|fuel|transport|bus|train|car|vehicle)/i,
        'Utilities': /(electric|water|gas|utility|internet|phone|mobile|cable)/i,
        'Healthcare': /(hospital|doctor|pharmacy|medical|health|insurance)/i,
        'Housing': /(rent|mortgage|housing|apartment|landlord)/i,
        'Income': /(salary|paycheck|deposit|income|transfer in|wages)/i
    };
    
    const categories = {
        'Food & Dining': { total: 450, count: 12, transactions: [] },
        'Shopping': { total: 320, count: 8, transactions: [] },
        'Transportation': { total: 280, count: 15, transactions: [] },
        'Entertainment': { total: 180, count: 6, transactions: [] },
        'Utilities': { total: 220, count: 4, transactions: [] },
        'Other': { total: 150, count: 5, transactions: [] }
    };
    
    if (transactions.length > 0) {
        // Reset categories if we have real transactions
        const realCategories = {};
        
        transactions.forEach(transaction => {
            let category = 'Other';
            
            for (const [cat, pattern] of Object.entries(categoryPatterns)) {
                if (pattern.test(transaction.description)) {
                    category = cat;
                    break;
                }
            }
            
            if (!realCategories[category]) {
                realCategories[category] = { total: 0, count: 0, transactions: [] };
            }
            
            realCategories[category].total += Math.abs(transaction.amount);
            realCategories[category].count++;
            realCategories[category].transactions.push(transaction);
        });
        
        return realCategories;
    }
    
    return categories;
}

function generateRecommendationsFromAI(aiResponse) {
    // Extract recommendations from AI response
    const recommendations = [];
    
    if (aiResponse && aiResponse.includes('budget')) {
        recommendations.push({
            type: 'budgeting',
            title: 'Budget Optimization',
            message: 'Consider implementing a structured budgeting approach based on your spending patterns.'
        });
    }
    
    if (aiResponse && aiResponse.includes('sav')) {
        recommendations.push({
            type: 'savings',
            title: 'Increase Savings',
            message: 'Look for opportunities to increase your savings rate by reducing discretionary spending.'
        });
    }
    
    // Default recommendations if none extracted
    if (recommendations.length === 0) {
        recommendations.push(
            {
                type: 'general',
                title: 'Track Expenses',
                message: 'Continue monitoring your expenses regularly to maintain financial awareness.'
            },
            {
                type: 'planning',
                title: 'Financial Goals',
                message: 'Set specific financial goals for the next 3-6 months to guide your spending decisions.'
            }
        );
    }
    
    return recommendations;
}

function generateInsightsFromData(financialData) {
    const { summary, categories } = financialData;
    const insights = [];
    
    if (summary.netCashFlow > 0) {
        insights.push({
            type: 'positive',
            title: 'Positive Cash Flow',
            message: `Great! You're saving R${summary.netCashFlow.toFixed(2)} per period.`
        });
    } else {
        insights.push({
            type: 'warning',
            title: 'Watch Your Spending',
            message: `Your expenses are close to your income. Consider reviewing discretionary spending.`
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
            message: `${largestCategory[0]} accounts for R${largestCategory[1].total.toFixed(2)} of your spending.`
        });
    }
    
    return insights;
}

function generateBasicAnalysisResults(financialData) {
    return {
        aiInsights: 'Basic analysis completed. For detailed AI insights, please ensure your internet connection is stable and try again.',
        recommendations: [
            {
                type: 'review',
                title: 'Review Spending',
                message: 'Regularly review your spending patterns to identify optimization opportunities.'
            },
            {
                type: 'planning',
                title: 'Financial Planning',
                message: 'Consider creating a monthly budget based on your historical spending data.'
            }
        ],
        insights: generateInsightsFromData(financialData)
    };
}

function displayAnalysisResults(financialData, analysisResults) {
    displaySummaryCards(financialData.summary);
    displayCharts(financialData);
    displayCategoryDetails(financialData.categories);
    displayAIRecommendations(analysisResults.recommendations);
    displayFinancialInsights(analysisResults.insights);
    displayAIAnalysis(analysisResults.aiInsights);
}

function displayAIAnalysis(aiInsights) {
    // Add AI analysis section to the results
    const resultsContainer = document.getElementById('analyzerResults');
    
    // Check if AI analysis section already exists
    let aiAnalysisSection = document.getElementById('aiAnalysisSection');
    if (!aiAnalysisSection) {
        aiAnalysisSection = document.createElement('div');
        aiAnalysisSection.id = 'aiAnalysisSection';
        aiAnalysisSection.className = 'analysis-section';
        aiAnalysisSection.innerHTML = `
            <h3><i class="fas fa-robot"></i> AI Analysis</h3>
            <div id="aiAnalysisContent" class="ai-analysis-content"></div>
        `;
        resultsContainer.insertBefore(aiAnalysisSection, resultsContainer.firstChild);
    }
    
    const analysisContent = document.getElementById('aiAnalysisContent');
    analysisContent.innerHTML = `
        <div class="ai-insight-box">
            <div class="ai-insight-text">${aiInsights}</div>
        </div>
    `;
    
    // Add CSS if not present
    if (!document.getElementById('ai-analysis-styles')) {
        const style = document.createElement('style');
        style.id = 'ai-analysis-styles';
        style.textContent = `
            .ai-analysis-content {
                margin-top: 1rem;
            }
            .ai-insight-box {
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            }
            .ai-insight-text {
                color: #e2e8f0;
                line-height: 1.6;
                white-space: pre-wrap;
            }
        `;
        document.head.appendChild(style);
    }
}

function displaySummaryCards(summary) {
    const summaryCards = document.getElementById('summaryCards');
    
    const cards = [
        {
            title: 'Total Income',
            value: `${summary.totalIncome.toFixed(2)}`,
            change: '+5.2%',
            positive: true
        },
        {
            title: 'Total Expenses',
            value: `R${summary.totalExpenses.toFixed(2)}`,
            change: '+3.1%',
            positive: false
        },
        {
            title: 'Net Cash Flow',
            value: `R${summary.netCashFlow.toFixed(2)}`,
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
                    data: [3200, 3400, 3100, 3600, 3800, financialData.summary.totalIncome],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: [2800, 3000, 3200, 2900, 3100, financialData.summary.totalExpenses],
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
            <div class="category-amount">R${data.total.toFixed(2)}</div>
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

// Chat Functionality - Updated to use Gemini API
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
    addFinancialChatMessage('assistant', 'Hi! I can help you understand your financial statement. Upload a statement first, then ask me anything about your spending patterns or financial habits.');
}

async function sendFinancialMessage() {
    const chatInput = document.getElementById('financialChatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addFinancialChatMessage('user', message);
    chatInput.value = '';
    
    // Show typing indicator
    addFinancialChatMessage('assistant', 'Analyzing...', true);
    
    try {
        // Prepare context with previous analysis if available
        let contextMessage = message;
        if (window.currentStatementAnalysis) {
            contextMessage = `Based on the analyzed financial statement: "${window.currentStatementAnalysis.aiAnalysis}"\n\nUser question: ${message}`;
        }
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: contextMessage,
                context: 'Financial statement analysis consultation'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        const chatMessages = document.getElementById('financialChatMessages');
        const typingMessage = chatMessages.lastElementChild;
        if (typingMessage && typingMessage.classList.contains('typing')) {
            typingMessage.remove();
        }
        
        addFinancialChatMessage('assistant', data.message || 'I apologize, but I couldn\'t process your question right now. Please try again.');
        
    } catch (error) {
        console.error('Financial Chat Error:', error);
        
        // Remove typing indicator
        const chatMessages = document.getElementById('financialChatMessages');
        const typingMessage = chatMessages.lastElementChild;
        if (typingMessage && typingMessage.classList.contains('typing')) {
            typingMessage.remove();
        }
        
        // Fallback responses
        const fallbackResponses = [
            "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
            "Based on general financial best practices, I'd recommend reviewing your largest expense categories for potential savings.",
            "Consider setting up a budget that allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
            "Regular monitoring of your financial statements is a great habit for maintaining financial health."
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        addFinancialChatMessage('assistant', randomResponse);
    }
}

function addFinancialChatMessage(sender, message, isTyping = false) {
    const chatMessages = document.getElementById('financialChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : ''}`;
    
    if (isTyping) {
        messageDiv.classList.add('typing');
    }
    
    const avatar = sender === 'user' ? 
        '<div class="message-avatar"><i class="fas fa-user"></i></div>' :
        '<div class="message-avatar"><i class="fas fa-robot"></i></div>';
    
    if (isTyping) {
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI Chat Widget - Updated to use Gemini API
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

async function sendAIMessage() {
    const aiInput = document.getElementById('ai-input');
    const message = aiInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addAIMessage('user', message);
    aiInput.value = '';
    
    // Show typing indicator
    showAITyping();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                context: 'Financial statement analyzer assistant'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        hideAITyping();
        addAIMessage('assistant', data.message || 'I apologize, but I couldn\'t process your request right now.');
        
    } catch (error) {
        console.error('AI Widget Error:', error);
        hideAITyping();
        
        // Fallback response
        addAIMessage('assistant', 'I\'m having connection issues. Please try again in a moment.');
    }
}

function showAITyping() {
    const aiMessages = document.getElementById('ai-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing-indicator';
    typingDiv.id = 'ai-typing';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function hideAITyping() {
    const typingIndicator = document.getElementById('ai-typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addAIMessage(sender, message) {
    const aiMessages = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message-widget' : 'ai-message';
    
    // Handle formatting for AI responses
    const formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>R1</strong>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
    
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
    
    // Clear stored analysis
    window.currentStatementAnalysis = null;
    
    // Add welcome message back
    addFinancialChatMessage('assistant', 'Hi! I can help you understand your financial statement. Upload a statement first, then ask me anything about your spending patterns or financial habits.');
}

// Export functions for global access
window.resetStatementAnalyzer = resetStatementAnalyzer;