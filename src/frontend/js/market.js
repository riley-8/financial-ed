// Market JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const marketSearch = document.getElementById('market-search');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const redeemBtns = document.querySelectorAll('.redeem-btn');
    const redeemModal = document.getElementById('redeem-modal');
    const successModal = document.getElementById('success-modal');
    const closeRedeemModal = document.getElementById('close-redeem-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const cancelRedeem = document.getElementById('cancel-redeem');
    const confirmRedeem = document.getElementById('confirm-redeem');
    const closeSuccess = document.getElementById('close-success');
    const copyCodeBtn = document.getElementById('copy-code');
    
    // User data
    let userPoints = 1250;
    let currentBusiness = null;
    let currentPointsCost = 0;

    // Initialize market
    initMarket();

    // Initialize market functionality
    function initMarket() {
        updatePointsDisplay();
        loadUserDiscounts();
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        marketSearch.addEventListener('input', debounce(filterBusinesses, 300));

        // Category filtering
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterBusinessesByCategory(btn.dataset.category);
            });
        });

        // Redeem buttons
        redeemBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const businessCard = e.target.closest('.business-card');
                const businessId = businessCard.dataset.businessId;
                const pointsCost = parseInt(e.target.dataset.points);
                
                openRedeemModal(businessId, pointsCost);
            });
        });

        // Modal controls
        closeRedeemModal.addEventListener('click', closeModals);
        closeSuccessModal.addEventListener('click', closeModals);
        cancelRedeem.addEventListener('click', closeModals);
        confirmRedeem.addEventListener('click', confirmRedemption);
        closeSuccess.addEventListener('click', closeModals);
        copyCodeBtn.addEventListener('click', copyDiscountCode);

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === redeemModal) closeModals();
            if (e.target === successModal) closeModals();
        });
    }

    // Filter businesses by search term
    function filterBusinesses() {
        const searchTerm = marketSearch.value.toLowerCase();
        const businesses = document.querySelectorAll('.business-card');
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;

        businesses.forEach(business => {
            const businessName = business.querySelector('h3').textContent.toLowerCase();
            const businessDesc = business.querySelector('.business-description').textContent.toLowerCase();
            const businessCategory = business.classList.contains(activeCategory) || activeCategory === 'all';

            const matchesSearch = businessName.includes(searchTerm) || businessDesc.includes(searchTerm);
            const matchesCategory = businessCategory;

            business.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });
    }

    // Filter businesses by category
    function filterBusinessesByCategory(category) {
        const businesses = document.querySelectorAll('.business-card');
        
        businesses.forEach(business => {
            if (category === 'all' || business.classList.contains(category)) {
                business.style.display = 'block';
            } else {
                business.style.display = 'none';
            }
        });

        // Re-apply search filter
        filterBusinesses();
    }

    // Open redeem modal
    function openRedeemModal(businessId, pointsCost) {
        const businessCard = document.querySelector(`[data-business-id="${businessId}"]`);
        const businessName = businessCard.querySelector('h3').textContent;
        const discountOffer = businessCard.querySelector('.discount-amount').textContent;

        currentBusiness = businessId;
        currentPointsCost = pointsCost;

        // Update modal content
        document.getElementById('redeem-business-name').textContent = businessName;
        document.getElementById('redeem-offer').textContent = discountOffer;
        document.getElementById('redeem-points-cost').textContent = `${pointsCost} points`;
        document.getElementById('modal-current-points').textContent = userPoints.toLocaleString();
        document.getElementById('points-after').textContent = (userPoints - pointsCost).toLocaleString();

        // Enable/disable confirm button based on points
        confirmRedeem.disabled = userPoints < pointsCost;
        if (userPoints < pointsCost) {
            confirmRedeem.innerHTML = '<i class="fas fa-lock"></i> Insufficient Points';
            confirmRedeem.classList.add('disabled');
        } else {
            confirmRedeem.innerHTML = 'Confirm Redemption';
            confirmRedeem.classList.remove('disabled');
        }

        redeemModal.classList.add('active');
    }

    // Confirm redemption
    async function confirmRedemption() {
        if (userPoints < currentPointsCost) return;

        try {
            // Simulate API call to backend
            const response = await redeemDiscount(currentBusiness, currentPointsCost);
            
            if (response.success) {
                // Update user points
                userPoints = response.newPoints;
                updatePointsDisplay();
                
                // Show success modal
                showSuccessModal(response.discount);
                
                // Close redeem modal
                redeemModal.classList.remove('active');
            } else {
                alert('Redemption failed: ' + response.error);
            }
        } catch (error) {
            console.error('Redemption error:', error);
            alert('Error processing redemption. Please try again.');
        }
    }

    // Show success modal
    function showSuccessModal(discount) {
        document.getElementById('generated-code').textContent = discount.code;
        successModal.classList.add('active');
        
        // Add discount to active discounts
        addDiscountToUI(discount);
    }

    // Close all modals
    function closeModals() {
        redeemModal.classList.remove('active');
        successModal.classList.remove('active');
    }

    // Copy discount code to clipboard
    function copyDiscountCode() {
        const code = document.getElementById('generated-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            // Show copied feedback
            const originalHtml = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyCodeBtn.style.background = '#22c55e';
            
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalHtml;
                copyCodeBtn.style.background = '';
            }, 2000);
        });
    }

    // Update points display throughout the page
    function updatePointsDisplay() {
        document.getElementById('user-points').textContent = userPoints.toLocaleString();
        document.getElementById('current-points').textContent = userPoints.toLocaleString();
        
        // Update discount value
        const discountValue = (userPoints * 0.10).toFixed(2);
        document.querySelector('.points-card:nth-child(2) h3').textContent = `R${discountValue}`;
    }

    // Add discount to UI
    function addDiscountToUI(discount) {
        const discountsGrid = document.querySelector('.discounts-grid');
        const discountCard = createDiscountCard(discount);
        
        // Insert at the beginning
        discountsGrid.insertBefore(discountCard, discountsGrid.firstChild);
    }

    // Create discount card element
    function createDiscountCard(discount) {
        const card = document.createElement('div');
        card.className = 'discount-card active';
        card.innerHTML = `
            <div class="discount-header">
                <div class="discount-icon">
                    <i class="fas fa-tag"></i>
                </div>
                <div class="discount-status active">Active</div>
            </div>
            <h4>${discount.businessName} - ${discount.discount}</h4>
            <p class="discount-code">Code: ${discount.code}</p>
            <div class="discount-expiry">
                <i class="fas fa-clock"></i>
                <span>Expires: ${new Date(discount.expiresAt).toLocaleDateString()}</span>
            </div>
            <button class="use-discount-btn">Use Now</button>
        `;
        
        return card;
    }

    // Load user discounts from API
    async function loadUserDiscounts() {
        try {
            // Simulate API call
            const response = await fetchUserDiscounts();
            if (response.discounts) {
                // Clear existing discounts (except template ones)
                const discountsGrid = document.querySelector('.discounts-grid');
                discountsGrid.innerHTML = '';
                
                // Add active discounts
                response.discounts.forEach(discount => {
                    const discountCard = createDiscountCard(discount);
                    discountsGrid.appendChild(discountCard);
                });
            }
        } catch (error) {
            console.error('Error loading discounts:', error);
        }
    }

    // API Functions (simulated - replace with actual API calls)
    async function redeemDiscount(businessId, pointsCost) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate unique code
                const code = `FIN${Math.floor(1000 + Math.random() * 9000)}${businessId.slice(0, 3).toUpperCase()}`;
                
                resolve({
                    success: true,
                    newPoints: userPoints - pointsCost,
                    discount: {
                        id: Date.now().toString(),
                        businessId,
                        businessName: document.querySelector(`[data-business-id="${businessId}"] h3`).textContent,
                        discount: document.querySelector(`[data-business-id="${businessId}"] .discount-amount`).textContent,
                        code,
                        pointsCost,
                        redeemedAt: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active'
                    }
                });
            }, 1000);
        });
    }

    async function fetchUserDiscounts() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    discounts: [
                        {
                            id: '1',
                            businessId: 'coffee-corner',
                            businessName: 'Coffee Corner',
                            discount: '15% OFF',
                            code: 'FIN15COFFEE',
                            pointsCost: 500,
                            redeemedAt: new Date().toISOString(),
                            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                            status: 'active'
                        },
                        {
                            id: '2',
                            businessId: 'book-nook',
                            businessName: 'Book Nook',
                            discount: '20% OFF',
                            code: 'FIN20BOOKS',
                            pointsCost: 800,
                            redeemedAt: new Date().toISOString(),
                            expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                            status: 'active'
                        }
                    ]
                });
            }, 500);
        });
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add points from challenges (called when user completes challenges)
    window.addPointsFromChallenge = function(points, challengeId) {
        userPoints += points;
        updatePointsDisplay();
        
        // Show points added notification
        showPointsNotification(points, challengeId);
    };

    // Show points notification
    function showPointsNotification(points, challengeId) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-coins"></i>
                <div>
                    <strong>+${points} Points Earned!</strong>
                    <p>Completed: ${challengeId}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS for points notification
    const notificationStyles = `
        .points-notification {
            position: fixed;
            top: 100px;
            right: 30px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .points-notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-content i {
            font-size: 1.5rem;
        }
        
        .notification-content strong {
            display: block;
            margin-bottom: 0.25rem;
        }
        
        .notification-content p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.875rem;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
});