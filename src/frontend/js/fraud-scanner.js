// Fraud Scanner JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFraudScanner();
});

function initializeFraudScanner() {
    initializeSidebar();
    initializeNavigation();
    initializeAIWidget();
    initializeScanners();
    initializeRecentScans();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
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
        showNotification('You have 3 new security alerts', 'info');
    });
    
    messagesBtn.addEventListener('click', function() {
        showNotification('You have 2 unread messages', 'info');
    });
}

// AI Widget Functionality
function initializeAIWidget() {
    const aiWidget = document.getElementById('ai-widget');
    const aiFab = document.getElementById('ai-fab');
    const closeWidget = document.getElementById('close-ai-widget');
    const aiInput = document.getElementById('ai-input');
    const sendAiMessage = document.getElementById('send-ai-message');
    const aiMessages = document.getElementById('ai-messages');
    
    // Toggle AI widget
    aiFab.addEventListener('click', function() {
        aiWidget.classList.add('active');
        aiFab.style.display = 'none';
    });
    
    closeWidget.addEventListener('click', function() {
        aiWidget.classList.remove('active');
        aiFab.style.display = 'flex';
    });
    
    // Send AI message with security context
    async function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Show typing indicator
            showAIWidgetTyping();
            
            try {
                // Use the correct /api/chat endpoint with security context
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        context: 'Fraud detection and cybersecurity consultation'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                removeAIWidgetTyping();
                
                if (data.message) {
                    addAIMessage(data.message, 'ai');
                } else {
                    addAIMessage("I'm having trouble processing that right now. Please try again.", 'ai');
                }
            } catch (error) {
                console.error('AI Widget error:', error);
                removeAIWidgetTyping();
                
                // Fallback responses for security context
                const securityResponses = [
                    "I'm here to help with fraud detection and security questions! What would you like to know?",
                    "I can assist with scanning URLs, analyzing messages for phishing, or general security concerns.",
                    "Having connection issues. You can use the fraud scanner tools above for immediate analysis."
                ];
                
                const randomResponse = securityResponses[Math.floor(Math.random() * securityResponses.length)];
                addAIMessage(randomResponse, 'ai');
            }
        }
    }
    
    function showAIWidgetTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-widget';
        typingDiv.id = 'ai-widget-typing';
        typingDiv.innerHTML = `
            <div class="typing-dots-widget">
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
                <div class="typing-dot-widget"></div>
            </div>
        `;
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Add CSS for widget typing indicator
        if (!document.getElementById('widget-typing-styles')) {
            const style = document.createElement('style');
            style.id = 'widget-typing-styles';
            style.textContent = `
                .typing-dots-widget {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    padding: 0.5rem;
                }
                .typing-dot-widget {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: typing-widget 1.4s infinite ease-in-out;
                }
                .typing-dot-widget:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dot-widget:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typing-widget {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-6px);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeAIWidgetTyping() {
        const typingIndicator = document.getElementById('ai-widget-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    sendAiMessage.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Scanner Functionality
function initializeScanners() {
    // URL Scanner
    const scanUrlBtn = document.getElementById('scan-url');
    const urlInput = document.getElementById('url-input');
    
    scanUrlBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (!url) {
            showNotification('Please enter a URL to scan', 'error');
            return;
        }
        
        scanURL(url);
    });
    
    // Message Scanner
    const scanMessageBtn = document.getElementById('scan-message');
    const messageInput = document.getElementById('message-input');
    
    scanMessageBtn.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (!message) {
            showNotification('Please enter a message to scan', 'error');
            return;
        }
        
        scanMessage(message);
    });
    
    // File Scanner
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');
    
    fileUpload.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            scanFiles(e.target.files);
        }
    });
    
    // Drag and drop for files
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUpload.style.borderColor = '#22c55e';
        fileUpload.style.background = 'rgba(34, 197, 94, 0.1)';
    });
    
    fileUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUpload.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        fileUpload.style.background = 'transparent';
    });
    
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUpload.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        fileUpload.style.background = 'transparent';
        
        if (e.dataTransfer.files.length > 0) {
            scanFiles(e.dataTransfer.files);
        }
    });
}

// URL Scanning - Updated to use real Gemini API
async function scanURL(url) {
    showScanProgress('url');
    
    try {
        console.log('Scanning URL with Gemini API:', url);
        
        const response = await fetch('/api/scan/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Raw API Response:', result);
        
        if (!response.ok) {
            console.error('API Error:', result);
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        
        // Handle both success and error responses from the API
        if (result.error) {
            console.error('Gemini API Error:', result.error);
            showNotification(`Scan failed: ${result.error}`, 'error');
            
            // Remove progress indicator on error
            const progress = document.querySelector('.scan-progress');
            if (progress) {
                progress.remove();
            }
            return;
        }
        
        // Transform the result to match the UI expectations
        const transformedResult = {
            isSafe: result.safe,
            confidence: result.confidence / 100, // Convert percentage to decimal
            threats: result.threats || [],
            recommendations: Array.isArray(result.recommendations) 
                ? result.recommendations.join(' ') 
                : result.recommendations || 'Exercise caution when visiting this URL.'
        };
        
        console.log('Transformed Result:', transformedResult);
        
        displayScanResult(transformedResult, 'url', url);
        saveScanToHistory(transformedResult, 'url', url);
        
    } catch (error) {
        console.error('URL scan error:', error);
        
        // Show more specific error messages
        let errorMessage = 'Failed to scan URL. ';
        if (error.message.includes('503')) {
            errorMessage += 'AI service is temporarily overloaded. Please try again in a few moments.';
        } else if (error.message.includes('fetch')) {
            errorMessage += 'Network connection issue. Check your internet connection.';
        } else if (error.message.includes('Invalid URL')) {
            errorMessage += 'Please enter a valid URL (e.g., https://example.com)';
        } else {
            errorMessage += 'Please try again.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Remove progress indicator on error
        const progress = document.querySelector('.scan-progress');
        if (progress) {
            progress.remove();
        }
    }
}

// Message Scanning - Updated to use real Gemini API
async function scanMessage(message) {
    showScanProgress('message');
    
    try {
        console.log('Scanning message with Gemini API:', message.substring(0, 50) + '...');
        
        const response = await fetch('/api/scan/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }) // Note: using 'content' not 'message'
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Raw API Response:', result);
        
        if (!response.ok) {
            console.error('API Error:', result);
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        
        // Handle both success and error responses from the API
        if (result.error) {
            console.error('Gemini API Error:', result.error);
            showNotification(`Scan failed: ${result.error}`, 'error');
            
            // Remove progress indicator on error
            const progress = document.querySelector('.scan-progress');
            if (progress) {
                progress.remove();
            }
            return;
        }
        
        // Transform the result to match the UI expectations
        const transformedResult = {
            isSafe: result.safe,
            confidence: result.confidence / 100, // Convert percentage to decimal
            threats: result.threats || [],
            recommendations: Array.isArray(result.recommendations) 
                ? result.recommendations.join(' ') 
                : result.recommendations || 'Exercise caution with this message.'
        };
        
        console.log('Transformed Result:', transformedResult);
        
        displayScanResult(transformedResult, 'message', message.substring(0, 50) + '...');
        saveScanToHistory(transformedResult, 'message', message.substring(0, 50) + '...');
        
    } catch (error) {
        console.error('Message scan error:', error);
        
        // Show more specific error messages
        let errorMessage = 'Failed to scan message. ';
        if (error.message.includes('503')) {
            errorMessage += 'AI service is temporarily overloaded. Please try again in a few moments.';
        } else if (error.message.includes('fetch')) {
            errorMessage += 'Network connection issue. Check your internet connection.';
        } else {
            errorMessage += 'Please try again.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Remove progress indicator on error
        const progress = document.querySelector('.scan-progress');
        if (progress) {
            progress.remove();
        }
    }
}

// File Scanning - Updated to show proper error handling
async function scanFiles(files) {
    showScanProgress('file');
    
    try {
        // For now, show that file scanning is not yet implemented
        setTimeout(() => {
            const progress = document.querySelector('.scan-progress');
            if (progress) {
                progress.remove();
            }
            
            showNotification('File scanning feature is coming soon!', 'info');
        }, 2000);
        
    } catch (error) {
        console.error('File scan error:', error);
        showNotification('File scanning is not available yet.', 'error');
        
        // Remove progress indicator on error
        const progress = document.querySelector('.scan-progress');
        if (progress) {
            progress.remove();
        }
    }
}

// Display Scan Results
function displayScanResult(result, type, target) {
    const resultsContainer = document.getElementById('scan-results');
    
    const resultDiv = document.createElement('div');
    resultDiv.className = `scan-result ${result.isSafe ? 'safe' : 'threat'}`;
    
    const scorePercentage = Math.round(result.confidence * 100);
    const threatsList = Array.isArray(result.threats) 
        ? result.threats.map(threat => `<li>${threat}</li>`).join('') 
        : `<li>${result.threats || 'No specific threats detected'}</li>`;
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-icon">
                <i class="fas ${result.isSafe ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            </div>
            <div class="result-info">
                <h4>${result.isSafe ? 'Safe' : 'Potential Threat Detected'}</h4>
                <p>${type.charAt(0).toUpperCase() + type.slice(1)} scan completed</p>
            </div>
            <div class="result-score ${result.isSafe ? 'safe' : 'threat'}">
                ${scorePercentage}%
            </div>
        </div>
        <div class="result-details">
            <h5>Scanned Target:</h5>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem; word-break: break-all;">${target}</p>
            
            <h5>${result.isSafe ? 'Security Analysis' : 'Detected Threats'}:</h5>
            <ul class="${result.isSafe ? 'safe' : 'threats'}">
                ${threatsList}
            </ul>
            
            <h5>Recommendations:</h5>
            <p style="color: #94a3b8; font-size: 0.9rem;">${result.recommendations}</p>
        </div>
    `;
    
    // Remove progress indicator
    const progress = document.querySelector('.scan-progress');
    if (progress) {
        progress.remove();
    }
    
    resultsContainer.appendChild(resultDiv);
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show Scan Progress
function showScanProgress(type) {
    const resultsContainer = document.getElementById('scan-results');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'scan-progress';
    
    const typeNames = {
        'url': 'URL',
        'message': 'Message',
        'file': 'File'
    };
    
    progressDiv.innerHTML = `
        <div class="progress-spinner"></div>
        <h4>Analyzing ${typeNames[type]} with AI...</h4>
        <p>Scanning for security threats and potential risks</p>
    `;
    
    resultsContainer.appendChild(progressDiv);
}

// Recent Scans History
function initializeRecentScans() {
    const history = getScanHistory();
    displayRecentScans(history);
}

function getScanHistory() {
    try {
        const stored = localStorage.getItem('fraudScannerHistory');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading scan history:', error);
        return [];
    }
}

function saveScanToHistory(result, type, target) {
    try {
        const history = getScanHistory();
        
        const scanRecord = {
            id: Date.now(),
            type,
            target,
            result: result.isSafe ? 'safe' : 'threat',
            confidence: result.confidence,
            timestamp: new Date().toISOString(),
            threats: result.threats
        };
        
        history.unshift(scanRecord); // Add to beginning
        history.splice(10); // Keep only last 10 scans
        
        localStorage.setItem('fraudScannerHistory', JSON.stringify(history));
        displayRecentScans(history);
    } catch (error) {
        console.error('Error saving scan to history:', error);
    }
}

function displayRecentScans(history) {
    const historyContainer = document.getElementById('scans-history');
    
    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #64748b;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No recent scans. Start scanning to see results here.</p>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = history.map(scan => `
        <div class="scan-history-item">
            <div class="scan-history-info">
                <div class="scan-history-icon ${scan.result}">
                    <i class="fas ${scan.result === 'safe' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div class="scan-history-details">
                    <h4>${scan.type.charAt(0).toUpperCase() + scan.type.slice(1)} Scan</h4>
                    <p style="word-break: break-all;">${scan.target}</p>
                </div>
            </div>
            <div class="scan-history-time">
                ${formatTimeAgo(scan.timestamp)}
            </div>
        </div>
    `).join('');
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const scanTime = new Date(timestamp);
    const diffMs = now - scanTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Utility Functions
function showNotification(message, type = 'info') {
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
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1100;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Add animation styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addAIMessage(message, sender) {
    const aiMessages = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    
    if (sender === 'user') {
        messageDiv.className = 'user-message-widget';
        messageDiv.innerHTML = `<p>${message}</p>`;
    } else {
        messageDiv.className = 'ai-message';
        // Handle formatting for AI responses
        const formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
    }
    
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// Export functions for global access
window.FraudScanner = {
    scanURL,
    scanMessage,
    scanFiles,
    showNotification
};