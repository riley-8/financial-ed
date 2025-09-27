// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    initPortfolio();
    
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }
    
    // Set active nav link
    setActiveNavLink();
    
    // Initialize charts
    initCharts();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize AI widget
    initAIWidget();
});

function initPortfolio() {
    console.log('Portfolio module initialized');
    
    // Load portfolio data
    loadPortfolioData();
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function initCharts() {
    // Portfolio Performance Chart
    const performanceCtx = document.getElementById('portfolio-performance-chart').getContext('2d');
    
    // Sample data with proper scaling
    const portfolioData = [20000, 21000, 21500, 22000, 21800, 22500, 23000, 23500, 24000, 24200, 24500, 24750];
    const benchmarkData = [20000, 20500, 20800, 21200, 21000, 21500, 21800, 22200, 22500, 22800, 23200, 23500];
    
    // Calculate min and max for proper scaling
    const allData = [...portfolioData, ...benchmarkData];
    const minValue = Math.min(...allData);
    const maxValue = Math.max(...allData);
    
    // Add some padding to the scale
    const range = maxValue - minValue;
    const minScale = minValue - range * 0.1;
    const maxScale = maxValue + range * 0.1;

    const performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Portfolio Value',
                    data: portfolioData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Market Benchmark',
                    data: benchmarkData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    borderColor: '#22c55e',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: R${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(34, 197, 94, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    min: minScale,
                    max: maxScale,
                    grid: {
                        color: 'rgba(34, 197, 94, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            if (value >= 1000) {
                                return 'R' + (value / 1000).toFixed(0) + 'K';
                            }
                            return 'R' + value;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
    
    // Asset Allocation Chart
    const allocationCtx = document.getElementById('allocation-chart').getContext('2d');
    const allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Bonds', 'Cash', 'Alternative'],
            datasets: [{
                data: [65, 20, 10, 5],
                backgroundColor: [
                    '#22c55e',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 2,
                borderColor: '#0a0e1a',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    borderColor: '#22c55e',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (R${(24750.5 * value / 100).toLocaleString()})`;
                        }
                    }
                }
            }
        }
    });
    
    // Store charts for later updates
    window.portfolioCharts = {
        performance: performanceChart,
        allocation: allocationChart
    };
}

function initEventListeners() {
    // Time range selector
    const timeRangeSelect = document.getElementById('time-range');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            updateChartData(this.value);
        });
    }
    
    // Add investment modal
    const addInvestmentBtn = document.getElementById('add-investment');
    const addInvestmentModal = document.getElementById('add-investment-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelInvestmentBtn = document.getElementById('cancel-investment');
    const saveInvestmentBtn = document.getElementById('save-investment');
    
    if (addInvestmentBtn && addInvestmentModal) {
        addInvestmentBtn.addEventListener('click', function() {
            addInvestmentModal.classList.add('active');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeInvestmentModal);
    }
    
    if (cancelInvestmentBtn) {
        cancelInvestmentBtn.addEventListener('click', closeInvestmentModal);
    }
    
    if (saveInvestmentBtn) {
        saveInvestmentBtn.addEventListener('click', saveInvestment);
    }
    
    // Close modal when clicking outside
    if (addInvestmentModal) {
        addInvestmentModal.addEventListener('click', function(e) {
            if (e.target === addInvestmentModal) {
                closeInvestmentModal();
            }
        });
    }
    
    // Export data button
    const exportDataBtn = document.getElementById('export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportPortfolioData);
    }
    
    // Rebalance portfolio button
    const rebalanceBtn = document.getElementById('rebalance-portfolio');
    if (rebalanceBtn) {
        rebalanceBtn.addEventListener('click', showRebalanceSuggestions);
    }
    
    // Holdings search and sort
    const holdingsSearch = document.getElementById('holdings-search');
    const holdingsSort = document.getElementById('holdings-sort');
    
    if (holdingsSearch) {
        holdingsSearch.addEventListener('input', filterHoldings);
    }
    
    if (holdingsSort) {
        holdingsSort.addEventListener('change', sortHoldings);
    }
    
    // Asset action buttons
    initAssetActions();
}

function initAssetActions() {
    // Buy/sell/details buttons for each asset
    const buyButtons = document.querySelectorAll('.btn-icon .fa-plus-circle');
    const sellButtons = document.querySelectorAll('.btn-icon .fa-minus-circle');
    const detailsButtons = document.querySelectorAll('.btn-icon .fa-chart-line');
    
    buyButtons.forEach(btn => {
        btn.closest('.btn-icon').addEventListener('click', function() {
            const assetSymbol = this.closest('.table-row').querySelector('.asset-symbol').textContent;
            showTradeModal('buy', assetSymbol);
        });
    });
    
    sellButtons.forEach(btn => {
        btn.closest('.btn-icon').addEventListener('click', function() {
            const assetSymbol = this.closest('.table-row').querySelector('.asset-symbol').textContent;
            showTradeModal('sell', assetSymbol);
        });
    });
    
    detailsButtons.forEach(btn => {
        btn.closest('.btn-icon').addEventListener('click', function() {
            const assetSymbol = this.closest('.table-row').querySelector('.asset-symbol').textContent;
            showAssetDetails(assetSymbol);
        });
    });
}

function closeInvestmentModal() {
    const modal = document.getElementById('add-investment-modal');
    if (modal) {
        modal.classList.remove('active');
        // Reset form
        const form = document.getElementById('investment-form');
        if (form) form.reset();
    }
}

function saveInvestment() {
    const form = document.getElementById('investment-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const investmentData = {
        symbol: formData.get('asset-symbol') || document.getElementById('asset-symbol').value,
        name: formData.get('asset-name') || document.getElementById('asset-name').value,
        shares: parseFloat(formData.get('shares') || document.getElementById('shares').value),
        price: parseFloat(formData.get('price') || document.getElementById('price').value),
        date: formData.get('purchase-date') || document.getElementById('purchase-date').value
    };
    
    // Basic validation
    if (!investmentData.symbol || !investmentData.name || isNaN(investmentData.shares) || isNaN(investmentData.price) || !investmentData.date) {
        showNotification('Please fill in all fields correctly.', 'error');
        return;
    }
    
    // Here you would typically send this data to your backend
    console.log('Saving investment:', investmentData);
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Investment added successfully!', 'success');
        closeInvestmentModal();
        // Refresh portfolio data
        loadPortfolioData();
    }, 1000);
}

function exportPortfolioData() {
    // Simulate data export
    const data = {
        portfolioValue: 24750.50,
        holdings: [
            { symbol: 'AAPL', shares: 50, value: 7512.50 },
            { symbol: 'GOOGL', shares: 25, value: 68770.00 },
            { symbol: 'MSFT', shares: 30, value: 10062.00 },
            { symbol: 'VANG', shares: 100, value: 23890.00 }
        ],
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Portfolio data exported successfully!', 'success');
}



function filterHoldings() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        const assetSymbol = row.querySelector('.asset-symbol').textContent.toLowerCase();
        const assetName = row.querySelector('.asset-name').textContent.toLowerCase();
        
        if (assetSymbol.includes(searchTerm) || assetName.includes(searchTerm)) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortHoldings() {
    const sortBy = this.value;
    const table = document.querySelector('.holdings-table');
    const rows = Array.from(document.querySelectorAll('.table-row'));
    
    rows.sort((a, b) => {
        switch (sortBy) {
            case 'value':
                const valueA = parseFloat(a.children[4].textContent.replace('R', '').replace(',', ''));
                const valueB = parseFloat(b.children[4].textContent.replace('R', '').replace(',', ''));
                return valueB - valueA;
                
            case 'gain':
                const gainA = parseFloat(a.children[5].textContent.match(/[+-]?\d+\.?\d*/)[0]);
                const gainB = parseFloat(b.children[5].textContent.match(/[+-]?\d+\.?\d*/)[0]);
                return gainB - gainA;
                
            case 'name':
                const nameA = a.children[0].querySelector('.asset-symbol').textContent;
                const nameB = b.children[0].querySelector('.asset-symbol').textContent;
                return nameA.localeCompare(nameB);
                
            default:
                return 0;
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => table.appendChild(row));
}

function showRebalanceSuggestions() {
    const suggestions = [
        { action: 'Consider increasing bond allocation to 25% for better diversification', priority: 'medium' },
        { action: 'Reduce cash holdings by 2% to maximize returns', priority: 'low' },
        { action: 'Rebalance tech stocks to maintain target allocation', priority: 'high' }
    ];
    
    let message = 'Rebalancing Suggestions:\n\n';
    suggestions.forEach((suggestion, index) => {
        message += `${index + 1}. ${suggestion.action} (${suggestion.priority} priority)\n`;
    });
    
    alert(message);
}

function showTradeModal(action, symbol) {
    // This would open a modal for buying/selling the specific asset
    console.log(`${action} ${symbol}`);
    showNotification(`Preparing to ${action} ${symbol}...`, 'info');
}

function showAssetDetails(symbol) {
    // This would show detailed information about the asset
    console.log(`Showing details for ${symbol}`);
    showNotification(`Loading details for ${symbol}...`, 'info');
}

function loadPortfolioData() {
    // Simulate loading portfolio data from an API
    console.log('Loading portfolio data...');
    
    // In a real application, you would fetch this from your backend
    setTimeout(() => {
        // Update any dynamic content here
        console.log('Portfolio data loaded');
    }, 500);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
                top: 20px;
                right: 20px;
                background: rgba(30, 41, 59, 0.95);
                border: 1px solid;
                border-radius: 8px;
                padding: 1rem 1.5rem;
                color: white;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            .notification-success { border-color: #22c55e; }
            .notification-error { border-color: #ef4444; }
            .notification-info { border-color: #3b82f6; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// AI Widget functionality
function initAIWidget() {
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeAiWidget = document.getElementById('close-ai-widget');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    
    if (aiFab && aiWidget) {
        aiFab.addEventListener('click', function() {
            aiWidget.classList.toggle('active');
        });
    }
    
    if (closeAiWidget) {
        closeAiWidget.addEventListener('click', function() {
            aiWidget.classList.remove('active');
        });
    }
    
    if (sendAiMessage && aiInput) {
        sendAiMessage.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');
    const message = aiInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message';
    userMessage.innerHTML = `<p><strong>You:</strong> ${message}</p>`;
    aiMessages.appendChild(userMessage);
    
    // Clear input
    aiInput.value = '';
    
    // Scroll to bottom
    aiMessages.scrollTop = aiMessages.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = document.createElement('div');
        aiResponse.className = 'ai-message';
        
        // Simple response logic based on keywords
        let response = "I can help you analyze your portfolio performance and suggest improvements. ";
        
        if (message.toLowerCase().includes('performance')) {
            response = "Your portfolio has gained 5.32% this month. The tech sector is performing particularly well, with AAPL up 3.48% and MSFT up 2.96%.";
        } else if (message.toLowerCase().includes('rebalance')) {
            response = "Based on your current allocation, I recommend increasing bond exposure to 25% and considering some profit-taking in the tech sector.";
        } else if (message.toLowerCase().includes('risk')) {
            response = "Your portfolio has moderate risk exposure. The 65% stock allocation provides growth potential while 20% bonds offer stability.";
        } else if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('sell')) {
            response = "I can help you analyze potential trades. Would you like me to run a scenario analysis for specific assets?";
        }
        
        aiResponse.innerHTML = `<p><strong>AI Assistant:</strong> ${response}</p>`;
        aiMessages.appendChild(aiResponse);
        
        // Scroll to bottom
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 1000);
}

// Export functions for potential use in other modules
window.portfolioModule = {
    initPortfolio,
    updateChartData,
    exportPortfolioData,
    showNotification
};