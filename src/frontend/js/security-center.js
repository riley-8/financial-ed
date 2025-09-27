// Security Center JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSecurityCenter();
});

function initializeSecurityCenter() {
    initializeSidebar();
    initializeNavigation();
    initializeSecuritySettings();
    initializeDeviceManagement();
    initializeQuickActions();
    initializeAIWidget();
    initializeNotifications();
    initializeSearch();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    // Toggle sidebar on mobile
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Navigate to the page
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
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

// Security Settings Functionality
function initializeSecuritySettings() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            // Simulate API call to update setting
            updateSecuritySetting(settingName, isEnabled);
            
            showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 
                           isEnabled ? 'success' : 'info');
        });
    });
}

function updateSecuritySetting(settingName, isEnabled) {
    // Simulate API call
    console.log(`Updating ${settingName} to ${isEnabled ? 'enabled' : 'disabled'}`);
    
    // Update security score based on settings
    updateSecurityScore();
}

function updateSecurityScore() {
    const enabledSettings = document.querySelectorAll('.toggle-switch input:checked').length;
    const totalSettings = document.querySelectorAll('.toggle-switch input').length;
    const securityPercentage = (enabledSettings / totalSettings) * 100;
    
    // Update score display
    const scoreValue = document.querySelector('.score-value');
    const scoreProgress = document.querySelector('.score-circle');
    
    if (scoreValue && scoreProgress) {
        const newScore = Math.min(98, 70 + (securityPercentage * 0.28)); // Base 70 + up to 28
        scoreValue.textContent = Math.round(newScore);
        
        // Update progress circle
        const degrees = (newScore / 100) * 360;
        scoreProgress.style.background = `conic-gradient(#22c55e 0deg ${degrees}deg, rgba(34, 197, 94, 0.2) ${degrees}deg)`;
    }
}

// Device Management
function initializeDeviceManagement() {
    const deviceItems = document.querySelectorAll('.device-item');
    const manageDevicesBtn = document.querySelector('.manage-devices-btn');
    
    deviceItems.forEach(device => {
        device.addEventListener('click', function() {
            const deviceName = this.querySelector('h4').textContent;
            showDeviceDetails(deviceName);
        });
    });
    
    if (manageDevicesBtn) {
        manageDevicesBtn.addEventListener('click', function() {
            showAllDevicesModal();
        });
    }
}

function showDeviceDetails(deviceName) {
    showNotification(`Showing details for ${deviceName}`, 'info');
    
    // In a real application, this would open a detailed view
    console.log(`Device details: ${deviceName}`);
}

function showAllDevicesModal() {
    // Create and show modal with all devices
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Manage Connected Devices</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="device-list">
                <!-- Enhanced device list would go here -->
                <p>Device management interface would be implemented here.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Quick Actions
function initializeQuickActions() {
    const quickActionButtons = document.querySelectorAll('.action-btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionName = this.querySelector('span').textContent;
            handleQuickAction(actionName);
        });
    });
}

function handleQuickAction(actionName) {
    switch(actionName) {
        case 'Change Password':
            showChangePasswordModal();
            break;
        case 'Backup Codes':
            showBackupCodesModal();
            break;
        case 'Emergency Contacts':
            showEmergencyContactsModal();
            break;
        case 'Privacy Settings':
            showPrivacySettingsModal();
            break;
        default:
            showNotification(`Action "${actionName}" clicked`, 'info');
    }
}

function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close">&times;</button>
            </div>
            <form id="change-password-form">
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" id="current-password" required>
                </div>
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm New Password</label>
                    <input type="password" id="confirm-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#change-password-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle password change logic
        showNotification('Password updated successfully', 'success');
        document.body.removeChild(modal);
    });
    
    setupModalClose(modal);
}

function showBackupCodesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Backup Codes</h3>
                <button class="modal-close">&times;</button>
            </div>
            <p>Your backup codes for two-factor authentication:</p>
            <div class="backup-codes">
                <code>ABCD-EFGH-IJKL</code>
                <code>MNOP-QRST-UVWX</code>
                <code>YZ12-3456-7890</code>
            </div>
            <p class="warning-text">Save these codes in a secure place!</p>
            <button class="btn btn-secondary">Generate New Codes</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function showEmergencyContactsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Emergency Contacts</h3>
                <button class="modal-close">&times;</button>
            </div>
            <p>Manage your emergency contacts for security alerts.</p>
            <!-- Contact management interface would go here -->
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function showPrivacySettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Privacy Settings</h3>
                <button class="modal-close">&times;</button>
            </div>
            <p>Configure your privacy preferences and data sharing settings.</p>
            <!-- Privacy settings interface would go here -->
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function setupModalClose(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// AI Widget Functionality
function initializeAIWidget() {
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeBtn = document.getElementById('close-ai-widget');
    const sendBtn = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    
    if (aiFab && aiWidget) {
        aiFab.addEventListener('click', function() {
            aiWidget.classList.toggle('active');
            aiFab.style.display = aiWidget.classList.contains('active') ? 'none' : 'flex';
        });
        
        closeBtn.addEventListener('click', function() {
            aiWidget.classList.remove('active');
            aiFab.style.display = 'flex';
        });
        
        sendBtn.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
}

function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const messagesContainer = document.getElementById('ai-messages');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'ai-message user-message';
        userMessage.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse = document.createElement('div');
            aiResponse.className = 'ai-message';
            aiResponse.innerHTML = `<p>${generateAIResponse(message)}</p>`;
            messagesContainer.appendChild(aiResponse);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

function generateAIResponse(message) {
    const responses = {
        'password': 'I recommend using a strong, unique password with at least 12 characters including numbers, symbols, and mixed case letters.',
        '2fa': 'Two-factor authentication adds an extra layer of security. I suggest enabling it for all important accounts.',
        'security': 'Your current security score is excellent! Make sure to keep your software updated and avoid suspicious links.',
        'device': 'You can manage connected devices in the Device Management section. Review any unfamiliar devices regularly.',
        'default': 'I can help you with security settings, password management, device security, and general security best practices. What specific area are you interested in?'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    return responses.default;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
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
                background: rgba(30, 41, 59, 0.95);
                border: 1px solid;
                border-radius: 8px;
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 3000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            
            .notification.success {
                border-color: #22c55e;
            }
            
            .notification.error {
                border-color: #ef4444;
            }
            
            .notification.warning {
                border-color: #f59e0b;
            }
            
            .notification.info {
                border-color: #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 0.25rem;
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
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                // Implement search functionality
                console.log('Searching for:', query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim()) {
        showNotification(`Searching for "${query}"`, 'info');
        // Implement actual search logic
    }
}

// Security Alert Handling
function initializeNotifications() {
    // Simulate real-time security alerts
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            simulateSecurityAlert();
        }
    }, 30000); // Check every 30 seconds
}

function simulateSecurityAlert() {
    const alerts = [
        {
            type: 'high',
            title: 'Suspicious Activity Detected',
            message: 'Unusual login pattern detected from multiple locations',
            action: 'Review Now'
        },
        {
            type: 'medium',
            title: 'Security Update Available',
            message: 'New security patch available for your system',
            action: 'Update'
        },
        {
            type: 'low',
            title: 'Security Scan Complete',
            message: 'Routine security scan completed successfully',
            action: 'View Report'
        }
    ];
    
    const alert = alerts[Math.floor(Math.random() * alerts.length)];
    showNotification(`${alert.title}: ${alert.message}`, alert.type);
}

// Export functions for global access
window.SecurityCenter = {
    initializeSecurityCenter,
    showNotification,
    updateSecurityScore
};