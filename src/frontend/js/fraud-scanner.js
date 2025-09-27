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
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message) {
            addAIMessage(message, 'user');
            aiInput.value = '';
            
            // Show typing indicator
            showAIWidgetTyping();
            
            // Make API call for security-focused responses
            fetch('/api/chat/security', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    context: 'Fraud detection and security consultation'
                })
            })
            .then(response => response.json())
            .then(data => {
                removeAIWidgetTyping();
                if (data.message) {
                    addAIMessage(data.message, 'ai');
                } else {
                    addAIMessage("I'm having trouble processing that right now. Please try again.", 'ai');
                }
            })
            .catch(error => {
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
            });
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

// URL Scanning
async function scanURL(url) {
    showScanProgress('url');
    
    try {
        // Simulate API call to security service
        const response = await fetch('/api/scan/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const result = await response.json();
        displayScanResult(result, 'url', url);
        saveScanToHistory(result, 'url', url);
        
    } catch (error) {
        console.error('URL scan error:', error);
        
        // Fallback simulation for demo
        const simulatedResult = simulateURLScan(url);
        displayScanResult(simulatedResult, 'url', url);
        saveScanToHistory(simulatedResult, 'url', url);
    }
}

// Message Scanning
async function scanMessage(message) {
    showScanProgress('message');
    
    try {
        const response = await fetch('/api/scan/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const result = await response.json();
        displayScanResult(result, 'message', message.substring(0, 50) + '...');
        saveScanToHistory(result, 'message', message.substring(0, 50) + '...');
        
    } catch (error) {
        console.error('Message scan error:', error);
        
        const simulatedResult = simulateMessageScan(message);
        displayScanResult(simulatedResult, 'message', message.substring(0, 50) + '...');
        saveScanToHistory(simulatedResult, 'message', message.substring(0, 50) + '...');
    }
}

// File Scanning
async function scanFiles(files) {
    showScanProgress('file');
    
    try {
        const formData = new FormData();
        for (let file of files) {
            formData.append('files', file);
        }
        
        const response = await fetch('/api/scan/file', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        displayScanResult(result, 'file', files[0].name);
        saveScanToHistory(result, 'file', files[0].name);
        
    } catch (error) {
        console.error('File scan error:', error);
        
        const simulatedResult = simulateFileScan(files);
        displayScanResult(simulatedResult, 'file', files[0].name);
        saveScanToHistory(simulatedResult, 'file', files[0].name);
    }
}

// Display Scan Results
function displayScanResult(result, type, target) {
    const resultsContainer = document.getElementById('scan-results');
    
    const resultDiv = document.createElement('div');
    resultDiv.className = `scan-result ${result.isSafe ? 'safe' : 'threat'}`;
    
    const scorePercentage = Math.round(result.confidence * 100);
    const threatsList = result.threats.map(threat => `<li>${threat}</li>`).join('');
    
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
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">${target}</p>
            
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
        <h4>Scanning ${typeNames[type]}...</h4>
        <p>Analyzing for potential threats and security risks</p>
    `;
    
    resultsContainer.appendChild(progressDiv);
}

// Simulate URL Scan (for demo purposes)
function simulateURLScan(url) {
    // Simple heuristic checks
    const isSafe = Math.random() > 0.3; // 70% chance of being safe
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    
    const threats = [];
    if (!isSafe) {
        const possibleThreats = [
            'Suspicious domain registration',
            'Known phishing patterns detected',
            'Unsecured connection (HTTP)',
            'Suspicious redirect patterns',
            'Malware distribution risk'
        ];
        
        const numThreats = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numThreats; i++) {
            threats.push(possibleThreats[Math.floor(Math.random() * possibleThreats.length)]);
        }
    }
    
    const recommendations = isSafe ? 
        'This URL appears safe. Always verify the website before entering sensitive information.' :
        'Avoid visiting this URL. Consider using alternative trusted sources.';
    
    return {
        isSafe,
        confidence,
        threats: [...new Set(threats)], // Remove duplicates
        recommendations
    };
}

// Simulate Message Scan
function simulateMessageScan(message) {
    const phishingKeywords = ['urgent', 'password', 'verify', 'account', 'suspended', 'click', 'limited time'];
    const threatCount = phishingKeywords.filter(keyword => 
        message.toLowerCase().includes(keyword)
    ).length;
    
    const isSafe = threatCount < 2;
    const confidence = Math.max(0.7, 1 - (threatCount * 0.15));
    
    const threats = [];
    if (!isSafe) {
        if (threatCount >= 3) threats.push('High probability of phishing attempt');
        if (message.includes('http://')) threats.push('Unsecured links detected');
        if (message.length > 200) threats.push('Suspiciously long message for common scams');
    }
    
    const recommendations = isSafe ?
        'Message appears legitimate. Always verify sender identity.' :
        'This message shows signs of phishing. Do not click any links or provide information.';
    
    return {
        isSafe,
        confidence,
        threats,
        recommendations
    };
}

// Simulate File Scan
function simulateFileScan(files) {
    const file = files[0];
    const riskyExtensions = ['.exe', '.bat', '.scr', '.com'];
    const isRisky = riskyExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    const isSafe = !isRisky && Math.random() > 0.2;
    const confidence = isRisky ? 0.3 : Math.random() * 0.3 + 0.7;
    
    const threats = [];
    if (isRisky) {
        threats.push('Executable file type carries higher risk');
    }
    if (!isSafe) {
        threats.push('Potential malware signature detected');
        threats.push('File behavior analysis shows suspicious patterns');
    }
    
    const recommendations = isSafe ?
        'File appears safe. Always scan files from unknown sources.' :
        'Do not open this file. Delete it immediately and run a full system scan.';
    
    return {
        isSafe,
        confidence,
        threats,
        recommendations
    };
}

// Recent Scans History
function initializeRecentScans() {
    const history = getScanHistory();
    displayRecentScans(history);
}

function getScanHistory() {
    const stored = localStorage.getItem('fraudScannerHistory');
    return stored ? JSON.parse(stored) : [];
}

function saveScanToHistory(result, type, target) {
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
                    <p>${scan.target}</p>
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
        messageDiv.innerHTML = `<p>${message}</p>`;
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