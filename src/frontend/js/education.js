// Enhanced Education Hub JavaScript with YouTube API Integration
document.addEventListener('DOMContentLoaded', function() {
    initializeEducationHub();
});

// Configuration
const CONFIG = {
    youtube: {
        apiKey: '566b36e871mshf136eda735af7d0p15faa2jsneeec1b98f446',
        apiHost: 'youtube138.p.rapidapi.com',
        apiUrl: 'https://youtube138.p.rapidapi.com'
    },
    supabase: {
        url: 'https://mjygtcjwkqdnimytgtfl.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeWd0Y2p3a3FkbmlteXRndGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjYwNzYsImV4cCI6MjA3NDQwMjA3Nn0.Pkk_OtnOW2SM7o383djUKxD1QJjKHX9oqUN-kOx0GCQ'
    }
};

// Global state
let youtubeVideos = [];
let currentUser = null;
let learningProgress = {};

function initializeEducationHub() {
    initializeSidebar();
    initializeNavigation();
    initializeEducationTabs();
    initializeCourseInteractions();
    initializeSearch();
    initializeAIWidget();
    initializeLearningProgress();
    initializeYouTubeIntegration();
    loadUserData();
}

// YouTube API Integration
async function initializeYouTubeIntegration() {
    try {
        await loadFinancialLiteracyVideos();
        setupVideoSearch();
        initializeVideoPlayers();
    } catch (error) {
        console.error('YouTube integration failed:', error);
        showNotification('Unable to load videos. Please check your internet connection.', 'warning');
    }
}

async function loadFinancialLiteracyVideos() {
    const financialTopics = [
        'personal finance basics',
        'budgeting for beginners',
        'investing 101',
        'cryptocurrency explained',
        'retirement planning',
        'credit score improvement',
        'emergency fund planning',
        'debt management strategies',
        'financial literacy education',
        'money management tips'
    ];

    try {
        const allVideos = [];
        
        for (const topic of financialTopics.slice(0, 3)) { // Limit to avoid rate limiting
            const videos = await searchYouTubeVideos(topic, 5);
            allVideos.push(...videos.map(video => ({
                ...video,
                category: topic
            })));
        }

        youtubeVideos = allVideos;
        updateVideoTab();
        
    } catch (error) {
        console.error('Error loading financial videos:', error);
        loadFallbackVideos();
    }
}

async function searchYouTubeVideos(query, maxResults = 10) {
    try {
        const response = await fetch(`${CONFIG.youtube.apiUrl}/search/?q=${encodeURIComponent(query)}&maxResults=${maxResults}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': CONFIG.youtube.apiKey,
                'X-RapidAPI-Host': CONFIG.youtube.apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.contents) {
            return data.contents
                .filter(item => item.video && item.video.videoId)
                .map(item => ({
                    id: item.video.videoId,
                    title: item.video.title,
                    description: item.video.descriptionSnippet || '',
                    thumbnail: item.video.thumbnails?.[0]?.url || '',
                    channelTitle: item.video.author?.title || 'Unknown Channel',
                    duration: item.video.lengthSeconds ? formatDuration(item.video.lengthSeconds) : 'Unknown',
                    views: item.video.stats?.views || 0,
                    publishedAt: item.video.publishedTimeText || 'Unknown'
                }));
        }
        
        return [];
    } catch (error) {
        console.error('YouTube search error:', error);
        return [];
    }
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function loadFallbackVideos() {
    youtubeVideos = [
        {
            id: 'dQw4w9WgXcQ',
            title: 'Personal Finance Basics for Beginners',
            description: 'Learn the fundamentals of personal finance management',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            channelTitle: 'Finance Education Channel',
            duration: '10:30',
            views: '1.2M',
            publishedAt: '2 months ago',
            category: 'personal finance basics'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'How to Create Your First Budget',
            description: 'Step-by-step guide to budgeting',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            channelTitle: 'Budget Master',
            duration: '15:45',
            views: '850K',
            publishedAt: '1 month ago',
            category: 'budgeting for beginners'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'Investing for Complete Beginners',
            description: 'Everything you need to know about investing',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            channelTitle: 'Investment Academy',
            duration: '22:15',
            views: '2.1M',
            publishedAt: '3 weeks ago',
            category: 'investing 101'
        }
    ];
    
    updateVideoTab();
}

function setupVideoSearch() {
    const videoSearchContainer = document.getElementById('video-search-container');
    if (videoSearchContainer) {
        const searchInput = videoSearchContainer.querySelector('#video-search');
        const searchBtn = videoSearchContainer.querySelector('#video-search-btn');
        
        if (searchInput && searchBtn) {
            const performVideoSearch = async () => {
                const query = searchInput.value.trim();
                if (query) {
                    showNotification('Searching for videos...', 'info');
                    try {
                        const results = await searchYouTubeVideos(query + ' financial literacy', 12);
                        displayVideoSearchResults(results);
                    } catch (error) {
                        showNotification('Search failed. Please try again.', 'error');
                    }
                }
            };
            
            searchBtn.addEventListener('click', performVideoSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performVideoSearch();
                }
            });
        }
    }
}

function displayVideoSearchResults(videos) {
    const videoGrid = document.querySelector('#videos-tab .course-grid');
    if (videoGrid && videos.length > 0) {
        videoGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
        attachVideoEventListeners();
        showNotification(`Found ${videos.length} videos`, 'success');
    } else {
        showNotification('No videos found. Try different search terms.', 'warning');
    }
}

function updateVideoTab() {
    const videoGrid = document.querySelector('#videos-tab .course-grid');
    if (videoGrid) {
        // Add search container
        const searchContainer = `
            <div id="video-search-container" class="video-search-section">
                <div class="search-header">
                    <h3>Search Financial Education Videos</h3>
                    <p>Find the best YouTube videos about financial literacy</p>
                </div>
                <div class="video-search-box">
                    <input type="text" id="video-search" placeholder="Search for budgeting, investing, saving..." />
                    <button id="video-search-btn" class="search-btn">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
                <div class="search-suggestions">
                    <span class="suggestion-label">Popular topics:</span>
                    <button class="suggestion-tag" data-query="budgeting basics">Budgeting</button>
                    <button class="suggestion-tag" data-query="investing for beginners">Investing</button>
                    <button class="suggestion-tag" data-query="credit score">Credit Score</button>
                    <button class="suggestion-tag" data-query="emergency fund">Emergency Fund</button>
                    <button class="suggestion-tag" data-query="retirement planning">Retirement</button>
                </div>
            </div>
            <div class="recommended-section">
                <h3>Recommended Videos</h3>
                <div class="video-grid">
                    ${youtubeVideos.map(video => createVideoCard(video)).join('')}
                </div>
            </div>
        `;
        
        videoGrid.innerHTML = searchContainer;
        
        // Setup search functionality
        setupVideoSearch();
        attachVideoEventListeners();
        setupSuggestionTags();
    }
}

function setupSuggestionTags() {
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', async function() {
            const query = this.getAttribute('data-query');
            document.getElementById('video-search').value = query;
            
            showNotification(`Searching for ${query} videos...`, 'info');
            try {
                const results = await searchYouTubeVideos(query + ' financial literacy', 12);
                displayVideoSearchResults(results);
            } catch (error) {
                showNotification('Search failed. Please try again.', 'error');
            }
        });
    });
}

function createVideoCard(video) {
    return `
        <div class="course-card video-card" data-video-id="${video.id}">
            <div class="course-image video-thumbnail-container">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                <div class="video-overlay">
                    <div class="video-play-button">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                </div>
            </div>
            <div class="course-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-channel">
                    <i class="fas fa-user"></i> ${video.channelTitle}
                </p>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="video-views">
                        <i class="fas fa-eye"></i> ${formatViews(video.views)}
                    </span>
                    <span class="video-date">
                        <i class="fas fa-calendar"></i> ${video.publishedAt}
                    </span>
                </div>
                <div class="video-actions">
                    <button class="course-btn watch-video-btn" data-video-id="${video.id}">
                        <i class="fab fa-youtube"></i> Watch on YouTube
                    </button>
                    <button class="bookmark-btn" data-video-id="${video.id}" title="Save for later">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function formatViews(views) {
    if (typeof views === 'string') return views;
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
}

function attachVideoEventListeners() {
    // Watch video buttons
    const watchBtns = document.querySelectorAll('.watch-video-btn');
    watchBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.getAttribute('data-video-id');
            watchVideo(videoId);
        });
    });
    
    // Bookmark buttons
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.getAttribute('data-video-id');
            toggleBookmark(videoId, this);
        });
    });
    
    // Video thumbnail clicks
    const videoThumbnails = document.querySelectorAll('.video-thumbnail-container');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoCard = this.closest('.video-card');
            const videoId = videoCard.getAttribute('data-video-id');
            watchVideo(videoId);
        });
    });
}

function watchVideo(videoId) {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Track video view
    trackVideoView(videoId);
    
    // Open YouTube in new tab
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    
    showNotification('Opening video on YouTube...', 'success');
    
    // Update learning progress
    updateVideoWatchProgress();
}

function toggleBookmark(videoId, buttonElement) {
    const video = youtubeVideos.find(v => v.id === videoId);
    if (!video) return;
    
    const isBookmarked = buttonElement.classList.contains('bookmarked');
    
    if (isBookmarked) {
        removeBookmark(videoId);
        buttonElement.classList.remove('bookmarked');
        buttonElement.innerHTML = '<i class="fas fa-bookmark"></i>';
        buttonElement.title = 'Save for later';
        showNotification('Removed from bookmarks', 'info');
    } else {
        addBookmark(video);
        buttonElement.classList.add('bookmarked');
        buttonElement.innerHTML = '<i class="fas fa-bookmark"></i>';
        buttonElement.title = 'Bookmarked';
        showNotification('Added to bookmarks', 'success');
    }
}

async function addBookmark(video) {
    try {
        const bookmarks = JSON.parse(localStorage.getItem('videoBookmarks') || '[]');
        const existingIndex = bookmarks.findIndex(b => b.id === video.id);
        
        if (existingIndex === -1) {
            bookmarks.push({
                ...video,
                bookmarkedAt: new Date().toISOString()
            });
            localStorage.setItem('videoBookmarks', JSON.stringify(bookmarks));
        }
    } catch (error) {
        console.error('Error saving bookmark:', error);
    }
}

function removeBookmark(videoId) {
    try {
        const bookmarks = JSON.parse(localStorage.getItem('videoBookmarks') || '[]');
        const filteredBookmarks = bookmarks.filter(b => b.id !== videoId);
        localStorage.setItem('videoBookmarks', JSON.stringify(filteredBookmarks));
    } catch (error) {
        console.error('Error removing bookmark:', error);
    }
}

function trackVideoView(videoId) {
    try {
        const viewHistory = JSON.parse(localStorage.getItem('videoViewHistory') || '[]');
        viewHistory.push({
            videoId,
            viewedAt: new Date().toISOString()
        });
        
        // Keep only last 100 views
        if (viewHistory.length > 100) {
            viewHistory.splice(0, viewHistory.length - 100);
        }
        
        localStorage.setItem('videoViewHistory', JSON.stringify(viewHistory));
    } catch (error) {
        console.error('Error tracking video view:', error);
    }
}

function updateVideoWatchProgress() {
    learningProgress.videosWatched = (learningProgress.videosWatched || 0) + 1;
    updateLearningProgress();
}

// Sidebar Navigation
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'education.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Navigation Features
function initializeNavigation() {
    const notificationBtn = document.getElementById('notifications');
    const messagesBtn = document.getElementById('messages');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('You have new course recommendations', 'info');
        });
    }
    
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            showNotification('You have unread messages from instructors', 'info');
        });
    }
}

// Education Tabs System
function initializeEducationTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.remove('hidden');
                initializeTabContent(targetTab);
            }
        });
    });
}

function initializeTabContent(tabName) {
    switch(tabName) {
        case 'courses':
            initializeCourseProgress();
            break;
        case 'articles':
            initializeArticleReading();
            break;
        case 'videos':
            if (youtubeVideos.length === 0) {
                loadFinancialLiteracyVideos();
            }
            setupVideoSearch();
            break;
        case 'webinars':
            initializeWebinarRegistration();
            break;
    }
}

// Course Interactions
function initializeCourseInteractions() {
    const courseBtns = document.querySelectorAll('.course-btn:not(.watch-video-btn)');
    
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('completed')) {
                showCertificateModal(this.closest('.course-card'));
            } else {
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('h3').textContent;
                startCourse(courseTitle, courseCard);
            }
        });
    });
}

function startCourse(courseTitle, courseCard) {
    showNotification(`Starting "${courseTitle}"...`, 'success');
    
    setTimeout(() => {
        const progressBar = courseCard.querySelector('.progress');
        const progressText = courseCard.querySelector('.course-progress span');
        
        let currentProgress = parseInt(progressBar.style.width) || 0;
        let newProgress = Math.min(currentProgress + 25, 100);
        
        progressBar.style.width = newProgress + '%';
        progressText.textContent = newProgress + '% Complete';
        
        if (newProgress === 100) {
            progressText.textContent = 'Completed';
            const courseBtn = courseCard.querySelector('.course-btn');
            courseBtn.textContent = 'View Certificate';
            courseBtn.classList.add('completed');
            courseCard.classList.add('course-completed');
            
            showNotification(`Congratulations! You've completed "${courseTitle}"`, 'success');
            awardBadge(courseTitle);
        }
    }, 1000);
}

function awardBadge(courseTitle) {
    const badges = {
        'Cybersecurity Fundamentals': 'Cyber Defender',
        'Investment Basics': 'Smart Investor',
        'Budgeting & Saving': 'Budget Master',
        'Fraud Prevention': 'Fraud Fighter',
        'Credit Management': 'Credit Expert',
        'Home Ownership': 'Home Guru'
    };
    
    const badgeName = badges[courseTitle] || 'Achiever';
    showNotification(`🎉 You earned the "${badgeName}" badge!`, 'success');
    updateLearningProgress();
}

function initializeCourseProgress() {
    console.log('Course progress tracking initialized');
}

// Article reading functionality
function initializeArticleReading() {
    const articleBtns = document.querySelectorAll('#articles-tab .course-btn');
    
    articleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const articleCard = this.closest('.course-card');
            const articleTitle = articleCard.querySelector('h3').textContent;
            
            showArticleModal(articleTitle);
        });
    });
}

function showArticleModal(articleTitle) {
    showNotification(`Opening "${articleTitle}"...`, 'info');
    
    setTimeout(() => {
        const modalContent = `
            <div class="article-modal">
                <h2>${articleTitle}</h2>
                <div class="article-meta">
                    <span><i class="fas fa-clock"></i> 8 min read</span>
                    <span><i class="fas fa-calendar"></i> Published: Oct 15, 2023</span>
                </div>
                <div class="article-content">
                    <p>This is a preview of the article content. In a real implementation, 
                    this would contain the full article text with proper formatting, 
                    images, and interactive elements.</p>
                    <p>The article would provide valuable financial education content 
                    tailored to the specific topic.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" id="close-article">Close</button>
                    <button class="btn-primary" id="save-article">
                        <i class="fas fa-bookmark"></i> Save for Later
                    </button>
                </div>
            </div>
        `;
        
        showModal(articleTitle, modalContent);
        
        document.getElementById('close-article').addEventListener('click', closeModal);
        document.getElementById('save-article').addEventListener('click', function() {
            saveArticle(articleTitle);
            closeModal();
        });
    }, 500);
}

// Video player functionality (for non-YouTube content)
function initializeVideoPlayers() {
    // This handles non-YouTube video content if any
    console.log('Video players initialized');
}

// Webinar registration functionality
function initializeWebinarRegistration() {
    const webinarBtns = document.querySelectorAll('#webinars-tab .course-btn');
    
    webinarBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const webinarCard = this.closest('.course-card');
            const webinarTitle = webinarCard.querySelector('h3').textContent;
            
            registerForWebinar(webinarTitle);
        });
    });
}

function registerForWebinar(webinarTitle) {
    const modalContent = `
        <div class="webinar-modal">
            <h3>Register for "${webinarTitle}"</h3>
            <form id="webinar-registration-form">
                <div class="form-group">
                    <label for="attendee-name">Full Name</label>
                    <input type="text" id="attendee-name" required>
                </div>
                <div class="form-group">
                    <label for="attendee-email">Email</label>
                    <input type="email" id="attendee-email" required>
                </div>
                <div class="form-group">
                    <label for="attendee-questions">Questions for Speakers (Optional)</label>
                    <textarea id="attendee-questions" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" id="cancel-registration">Cancel</button>
                    <button type="submit" class="btn-primary">Register Now</button>
                </div>
            </form>
        </div>
    `;
    
    showModal(`Register for ${webinarTitle}`, modalContent);
    
    document.getElementById('webinar-registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        completeWebinarRegistration(webinarTitle);
    });
    
    document.getElementById('cancel-registration').addEventListener('click', closeModal);
}

function completeWebinarRegistration(webinarTitle) {
    const name = document.getElementById('attendee-name').value;
    const email = document.getElementById('attendee-email').value;
    
    showNotification(`Registering ${name} for "${webinarTitle}"...`, 'info');
    
    setTimeout(() => {
        closeModal();
        showNotification(`Successfully registered for "${webinarTitle}"! Confirmation sent to ${email}`, 'success');
    }, 1500);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 2) {
                performSearch(query);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
}

async function performSearch(query) {
    console.log(`Searching for: ${query}`);
    
    // Search in videos
    const videoResults = youtubeVideos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(query.toLowerCase())
    );
    
    // If no local results, search YouTube
    if (videoResults.length === 0) {
        try {
            const youtubeResults = await searchYouTubeVideos(query + ' financial education', 6);
            if (youtubeResults.length > 0) {
                displaySearchResults([...videoResults, ...youtubeResults], query);
                return;
            }
        } catch (error) {
            console.error('YouTube search failed:', error);
        }
    }
    
    displaySearchResults(videoResults, query);
}

function displaySearchResults(results, query) {
    if (results.length > 0) {
        showNotification(`Found ${results.length} results for "${query}"`, 'info');
        
        // Switch to videos tab and show results
        const videoTab = document.querySelector('[data-tab="videos"]');
        const videosTabContent = document.getElementById('videos-tab');
        
        if (videoTab && videosTabContent) {
            // Activate videos tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            
            videoTab.classList.add('active');
            videosTabContent.classList.remove('hidden');
            
            // Display search results
            displayVideoSearchResults(results);
        }
    } else {
        showNotification(`No results found for "${query}"`, 'warning');
    }
}

// AI Widget functionality
function initializeAIWidget() {
    const aiFab = document.getElementById('ai-fab');
    const aiWidget = document.getElementById('ai-widget');
    const closeBtn = document.getElementById('close-ai-widget');
    const sendBtn = document.getElementById('send-ai-message');
    const aiInput = document.getElementById('ai-input');
    
    if (aiFab && aiWidget) {
        aiFab.addEventListener('click', function() {
            aiWidget.classList.toggle('active');
            aiFab.style.opacity = '0';
        });
        
        closeBtn.addEventListener('click', function() {
            aiWidget.classList.remove('active');
            aiFab.style.opacity = '1';
        });
        
        const sendMessage = () => {
            const message = aiInput.value.trim();
            if (message) {
                addUserMessage(message);
                aiInput.value = '';
                
                setTimeout(() => {
                    addAIMessage(getAIResponse(message));
                }, 1000);
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message user-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addAIMessage(message) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAIResponse(message) {
    const responses = {
        'videos': 'I can help you find great YouTube videos on financial topics! Try searching for "budgeting", "investing", "credit score", or any financial topic you\'re interested in.',
        'youtube': 'Our video section features curated YouTube content from top financial educators. Click on any video to watch it directly on YouTube.',
        'hello': 'Hello! How can I help you with your financial education today?',
        'hi': 'Hi there! What would you like to learn about?',
        'cybersecurity': 'Cybersecurity is crucial for financial protection. I recommend starting with our "Cybersecurity Fundamentals" course to learn about password security, two-factor authentication, and recognizing phishing attempts.',
        'investing': 'Investing can help grow your wealth over time. Check out our "Investment Basics" course to understand different investment types, risk management, and building a diversified portfolio.',
        'budget': 'Budgeting is the foundation of financial health. Our "Budgeting & Saving" course covers creating a realistic budget, tracking expenses, and building an emergency fund.',
        'fraud': 'Fraud prevention is essential. Learn to identify common scams in our "Fraud Prevention" course, which covers everything from credit card fraud to identity theft protection.',
        'credit': 'Good credit management can save you money. Our "Credit Management" course explains credit scores, reports, and strategies for improving your credit health.',
        'search': 'You can search for financial videos using the search bar in the Videos tab. I\'ll find relevant YouTube content from trusted financial educators.',
        'bookmark': 'You can bookmark any video by clicking the bookmark icon. Your saved videos will be stored locally for easy access later.',
        'default': 'I\'d be happy to help you learn about that topic! We have courses, articles, and videos on various financial education topics. Could you be more specific about what you\'d like to learn?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

// Learning progress tracking
function initializeLearningProgress() {
    loadLearningProgress();
    updateLearningProgress();
}

function loadLearningProgress() {
    try {
        const saved = localStorage.getItem('learningProgress');
        learningProgress = saved ? JSON.parse(saved) : {
            coursesCompleted: 0,
            totalCourses: 6,
            learningStreak: 0,
            totalLearningTime: 0,
            videosWatched: 0,
            articlesRead: 0,
            badgesEarned: [],
            lastActivity: null
        };
    } catch (error) {
        console.error('Error loading learning progress:', error);
        learningProgress = {
            coursesCompleted: 0,
            totalCourses: 6,
            learningStreak: 0,
            totalLearningTime: 0,
            videosWatched: 0,
            articlesRead: 0,
            badgesEarned: [],
            lastActivity: null
        };
    }
}

function updateLearningProgress() {
    try {
        learningProgress.lastActivity = new Date().toISOString();
        localStorage.setItem('learningProgress', JSON.stringify(learningProgress));
        
        // Update UI if progress display exists
        updateProgressDisplay();
    } catch (error) {
        console.error('Error updating learning progress:', error);
    }
}

function updateProgressDisplay() {
    // Update progress stats in UI
    const progressElements = {
        coursesCompleted: document.querySelector('[data-progress="courses-completed"]'),
        videosWatched: document.querySelector('[data-progress="videos-watched"]'),
        articlesRead: document.querySelector('[data-progress="articles-read"]'),
        learningStreak: document.querySelector('[data-progress="learning-streak"]')
    };
    
    if (progressElements.coursesCompleted) {
        progressElements.coursesCompleted.textContent = learningProgress.coursesCompleted;
    }
    if (progressElements.videosWatched) {
        progressElements.videosWatched.textContent = learningProgress.videosWatched;
    }
    if (progressElements.articlesRead) {
        progressElements.articlesRead.textContent = learningProgress.articlesRead;
    }
    if (progressElements.learningStreak) {
        progressElements.learningStreak.textContent = learningProgress.learningStreak;
    }
}

function loadUserData() {
    // Load user preferences and data
    try {
        const userData = localStorage.getItem('userData');
        currentUser = userData ? JSON.parse(userData) : {
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
                autoplay: false,
                notifications: true,
                theme: 'dark'
            }
        };
        
        // Load bookmarks
        loadBookmarkedVideos();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function loadBookmarkedVideos() {
    try {
        const bookmarks = JSON.parse(localStorage.getItem('videoBookmarks') || '[]');
        
        // Update bookmark buttons for loaded videos
        setTimeout(() => {
            bookmarks.forEach(bookmark => {
                const bookmarkBtn = document.querySelector(`[data-video-id="${bookmark.id}"].bookmark-btn`);
                if (bookmarkBtn) {
                    bookmarkBtn.classList.add('bookmarked');
                    bookmarkBtn.title = 'Bookmarked';
                }
            });
        }, 1000);
        
    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 1000;
                max-width: 300px;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            .notification-info { background: #3b82f6; }
            .notification-success { background: #22c55e; }
            .notification-warning { background: #f59e0b; }
            .notification-error { background: #ef4444; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function showModal(title, content) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .modal {
                background: #1e293b;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h2 {
                color: #f8fafc;
                margin: 0;
            }
            .modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s;
            }
            .modal-close:hover {
                background: rgba(148, 163, 184, 0.1);
                color: #f8fafc;
            }
            .modal-content {
                padding: 1.5rem;
                color: #e2e8f0;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }
            .btn-primary, .btn-secondary {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            .btn-primary {
                background: #22c55e;
                color: white;
            }
            .btn-primary:hover {
                background: #16a34a;
            }
            .btn-secondary {
                background: #475569;
                color: #f8fafc;
            }
            .btn-secondary:hover {
                background: #334155;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes modalSlideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modalOverlay.remove();
        }, 200);
    }
}

function saveArticle(articleTitle) {
    try {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const article = {
            title: articleTitle,
            savedAt: new Date().toISOString()
        };
        
        if (!savedArticles.find(a => a.title === articleTitle)) {
            savedArticles.push(article);
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
            
            learningProgress.articlesRead = (learningProgress.articlesRead || 0) + 1;
            updateLearningProgress();
        }
        
        showNotification(`"${articleTitle}" saved to your reading list`, 'success');
    } catch (error) {
        console.error('Error saving article:', error);
        showNotification('Error saving article', 'error');
    }
}

function showCertificateModal(courseCard) {
    const courseTitle = courseCard.querySelector('h3').textContent;
    const completionDate = new Date().toLocaleDateString();
    
    const modalContent = `
        <div class="certificate-modal">
            <div class="certificate-preview">
                <div class="certificate-design">
                    <div class="certificate-header">
                        <i class="fas fa-award certificate-icon"></i>
                        <h2>Certificate of Completion</h2>
                    </div>
                    <div class="certificate-body">
                        <p>This certifies that</p>
                        <h3>${currentUser.name}</h3>
                        <p>has successfully completed the course</p>
                        <h4>"${courseTitle}"</h4>
                        <div class="certificate-date">Completed on: ${completionDate}</div>
                        <div class="certificate-signature">
                            <div class="signature-line">
                                <span>FinSecure Education</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="close-certificate">Close</button>
                <button class="btn-primary" id="download-certificate">
                    <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn-primary" id="share-certificate">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    showModal('Certificate of Completion', modalContent);
    
    document.getElementById('close-certificate').addEventListener('click', closeModal);
    document.getElementById('download-certificate').addEventListener('click', function() {
        downloadCertificate(courseTitle);
    });
    document.getElementById('share-certificate').addEventListener('click', function() {
        shareCertificate(courseTitle);
    });
}

function downloadCertificate(courseTitle) {
    showNotification(`Generating certificate for "${courseTitle}"...`, 'info');
    
    setTimeout(() => {
        showNotification('Certificate download started', 'success');
    }, 1500);
}

function shareCertificate(courseTitle) {
    if (navigator.share) {
        navigator.share({
            title: 'Certificate of Completion',
            text: `I just completed "${courseTitle}" on FinSecure Education!`,
            url: window.location.href
        }).then(() => {
            showNotification('Certificate shared successfully!', 'success');
        }).catch((error) => {
            console.error('Error sharing:', error);
            copyToClipboard(`I just completed "${courseTitle}" on FinSecure Education!`);
        });
    } else {
        copyToClipboard(`I just completed "${courseTitle}" on FinSecure Education!`);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Achievement copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to copy to clipboard', 'error');
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    updateLearningProgress();
});