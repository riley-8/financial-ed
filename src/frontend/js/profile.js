// Profile JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Initialize profile functionality
    initProfile();
    
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
    
    // Initialize event listeners
    initEventListeners();
}

function initProfile() {
    console.log('Profile module initialized');
    
    // Load profile data
    loadProfileData();
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

function initEventListeners() {
    // Profile picture upload
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarUpload = document.getElementById('avatar-upload');
    
    if (avatarContainer && avatarUpload) {
        avatarContainer.addEventListener('click', function() {
            avatarUpload.click();
        });
        
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveProfileBtn = document.getElementById('save-profile');
    const profileForm = document.getElementById('profile-form');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', enableEditMode);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', disableEditMode);
    }
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    // Password change modal
    const changePasswordBtn = document.getElementById('change-password');
    const passwordModal = document.getElementById('password-modal');
    const closePasswordModal = document.getElementById('close-password-modal');
    const cancelPasswordBtn = document.getElementById('cancel-password');
    const savePasswordBtn = document.getElementById('save-password');
    
    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', function() {
            passwordModal.classList.add('active');
        });
    }
    
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', closePasswordModalFunc);
    }
    
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', closePasswordModalFunc);
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', changePassword);
    }
    
    // Close modal when clicking outside
    if (passwordModal) {
        passwordModal.addEventListener('click', function(e) {
            if (e.target === passwordModal) {
                closePasswordModalFunc();
            }
        });
    }
    
    // Other settings buttons
    const manageNotificationsBtn = document.getElementById('manage-notifications');
    const privacySettingsBtn = document.getElementById('privacy-settings');
    const changeLanguageBtn = document.getElementById('change-language');
    
    if (manageNotificationsBtn) {
        manageNotificationsBtn.addEventListener('click', function() {
            showNotification('Notifications settings will be available soon!', 'info');
        });
    }
    
    if (privacySettingsBtn) {
        privacySettingsBtn.addEventListener('click', function() {
            showNotification('Privacy settings will be available soon!', 'info');
        });
    }
    
    if (changeLanguageBtn) {
        changeLanguageBtn.addEventListener('click', function() {
            showNotification('Language settings will be available soon!', 'info');
        });
    }
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB.', 'error');
            return;
        }
        
        // Show loading state
        const avatar = document.getElementById('profile-avatar');
        const originalSrc = avatar.src;
        avatar.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzFlMjkzYiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjQ3NDhiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==';
        
        // Simulate upload process
        const reader = new FileReader();
        reader.onload = function(e) {
            // Simulate API call delay
            setTimeout(() => {
                avatar.src = e.target.result;
                
                // Update navbar profile image as well
                const navbarImg = document.getElementById('navbar-profile-img');
                if (navbarImg) {
                    navbarImg.src = e.target.result;
                }
                
                showNotification('Profile picture updated successfully!', 'success');
                
                // Save to localStorage for persistence
                const profileData = getProfileData();
                profileData.avatar = e.target.result;
                saveProfileData(profileData);
                
            }, 1000);
        };
        reader.readAsDataURL(file);
    }
}

function enableEditMode() {
    const inputs = document.querySelectorAll('#profile-form input');
    const editBtn = document.getElementById('edit-profile');
    const formActions = document.getElementById('form-actions');
    
    inputs.forEach(input => {
        input.readOnly = false;
        input.classList.add('editable');
    });
    
    editBtn.style.display = 'none';
    formActions.style.display = 'flex';
    
    showNotification('You can now edit your profile information.', 'info');
}

function disableEditMode() {
    const inputs = document.querySelectorAll('#profile-form input');
    const editBtn = document.getElementById('edit-profile');
    const formActions = document.getElementById('form-actions');
    
    // Reload original data
    loadProfileData();
    
    inputs.forEach(input => {
        input.readOnly = true;
        input.classList.remove('editable');
    });
    
    editBtn.style.display = 'flex';
    formActions.style.display = 'none';
    
    showNotification('Edit mode cancelled.', 'info');
}

function saveProfile() {
    const formData = new FormData(document.getElementById('profile-form'));
    const profileData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        dateOfBirth: document.getElementById('date-of-birth').value,
        occupation: document.getElementById('occupation').value
    };
    
    // Basic validation
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const saveBtn = document.getElementById('save-profile');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage
        const existingData = getProfileData();
        const updatedData = { ...existingData, ...profileData };
        saveProfileData(updatedData);
        
        // Update displayed name
        document.getElementById('profile-name').textContent = `${profileData.firstName} ${profileData.lastName}`;
        document.getElementById('profile-email').textContent = profileData.email;
        
        // Disable edit mode
        disableEditMode();
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        showNotification('Profile updated successfully!', 'success');
    }, 1500);
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all password fields.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }
    
    // Show loading state
    const saveBtn = document.getElementById('save-password');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    saveBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.getElementById('password-form').reset();
        
        // Close modal
        closePasswordModalFunc();
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        showNotification('Password updated successfully!', 'success');
    }, 1500);
}

function closePasswordModalFunc() {
    const passwordModal = document.getElementById('password-modal');
    if (passwordModal) {
        passwordModal.classList.remove('active');
        document.getElementById('password-form').reset();
    }
}

function loadProfileData() {
    let profileData = getProfileData();
    
    // Set default values if no data exists
    if (!profileData.firstName) {
        profileData = {
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'alex.johnson@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main Street, New York, NY 10001',
            dateOfBirth: '1990-01-15',
            occupation: 'Software Engineer',
            memberSince: new Date().getFullYear() - 2,
            completedCourses: 15,
            securityScore: 98,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        saveProfileData(profileData);
    }
    
    // Populate form fields
    document.getElementById('first-name').value = profileData.firstName;
    document.getElementById('last-name').value = profileData.lastName;
    document.getElementById('email').value = profileData.email;
    document.getElementById('phone').value = profileData.phone;
    document.getElementById('address').value = profileData.address;
    document.getElementById('date-of-birth').value = profileData.dateOfBirth;
    document.getElementById('occupation').value = profileData.occupation;
    
    // Update profile header
    document.getElementById('profile-name').textContent = `${profileData.firstName} ${profileData.lastName}`;
    document.getElementById('profile-email').textContent = profileData.email;
    document.getElementById('member-since').textContent = new Date().getFullYear() - profileData.memberSince;
    document.getElementById('completed-courses').textContent = profileData.completedCourses;
    document.getElementById('security-score').textContent = `${profileData.securityScore}%`;
    
    // Update avatar if exists
    if (profileData.avatar) {
        document.getElementById('profile-avatar').src = profileData.avatar;
        const navbarImg = document.getElementById('navbar-profile-img');
        if (navbarImg) {
            navbarImg.src = profileData.avatar;
        }
    }
}

function getProfileData() {
    const saved = localStorage.getItem('finsecure_profile');
    return saved ? JSON.parse(saved) : {};
}

function saveProfileData(data) {
    localStorage.setItem('finsecure_profile', JSON.stringify(data));
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Add CSS animations for notifications
const style = document.createElement('style');
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