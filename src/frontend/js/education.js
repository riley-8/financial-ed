// Enhanced Education Hub with AI-generated content
document.addEventListener('DOMContentLoaded', function() {
    initializeEducationHub();
});

function initializeEducationHub() {
    initializeSidebar();
    initializeNavigation();
    initializeEducationTabs();
    initializeCourseInteractions();
    initializeSearch();
    initializeAIWidget();
    initializeLearningProgress();
    
    // Generate AI content on page load
    generateAICourses();
    generateAIArticles();
    generateAIVideos();
}

// AI Course Generation (existing code remains the same)
async function generateAICourses() {
    const courseTopics = [
        'Budgeting and Personal Finance Management',
        'Understanding Credit Scores and Credit Management', 
        'Investment Fundamentals for Beginners',
        'Emergency Fund Planning and Savings Strategies',
        'Debt Management and Elimination',
        'Retirement Planning Basics'
    ];

    const coursesContainer = document.querySelector('#courses-tab .course-grid');
    coursesContainer.innerHTML = '<div class="loading-message">Generating AI-powered courses...</div>';

    try {
        const courses = [];
        
        for (let i = 0; i < 6; i++) {
            const topic = courseTopics[i];
            const courseData = await generateCourseContent(topic);
            courses.push({
                ...courseData,
                progress: Math.floor(Math.random() * 100),
                icon: getCourseIcon(topic)
            });
        }

        displayCourses(courses);
    } catch (error) {
        console.error('Error generating courses:', error);
        displayCourseError();
    }
}

// AI Articles Generation - Real API Integration
async function generateAIArticles() {
    const articlesContainer = document.querySelector('#articles-tab .course-grid');
    articlesContainer.innerHTML = '<div class="loading-message">Generating AI-powered financial articles...</div>';

    try {
        const articleTopics = [
            'Emergency Fund Planning',
            'Investment Strategies for Beginners', 
            'Credit Score Improvement',
            'Budgeting Techniques',
            'Retirement Planning',
            'Financial Security in 2024'
        ];
        
        const articles = [];
        
        for (const topic of articleTopics) {
            try {
                const response = await fetch('/api/search-financial-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: topic,
                        type: 'articles',
                        limit: 1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.articles && data.articles.length > 0) {
                        articles.push(data.articles[0]);
                    }
                }
            } catch (error) {
                console.log(`Error fetching article for ${topic}:`, error);
                // Continue with other topics
            }
        }
        
        if (articles.length > 0) {
            displayAIArticles(articles);
        } else {
            throw new Error('No articles generated');
        }
        
    } catch (error) {
        console.error('Error generating articles:', error);
        displayArticleError();
    }
}

// AI Videos Generation - Real API Integration
async function generateAIVideos() {
    const videosContainer = document.querySelector('#videos-tab .course-grid');
    videosContainer.innerHTML = '<div class="loading-message">Curating AI-recommended financial education videos...</div>';

    try {
        const videoTopics = [
            'Personal Finance Basics',
            'Investment for Beginners',
            'Budgeting Strategies',
            'Credit Management',
            'Emergency Fund Planning',
            'Financial Literacy Education'
        ];
        
        const videos = [];
        
        for (const topic of videoTopics) {
            try {
                const response = await fetch('/api/search-financial-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: topic,
                        type: 'videos',
                        limit: 1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.videos && data.videos.length > 0) {
                        videos.push(data.videos[0]);
                    }
                }
            } catch (error) {
                console.log(`Error fetching video for ${topic}:`, error);
                // Continue with other topics
            }
        }
        
        if (videos.length > 0) {
            displayAIVideos(videos);
        } else {
            throw new Error('No videos generated');
        }
        
    } catch (error) {
        console.error('Error generating videos:', error);
        displayVideoError();
    }
}

// Display AI-generated articles
function displayAIArticles(articles) {
    const articlesContainer = document.querySelector('#articles-tab .course-grid');
    articlesContainer.innerHTML = '';
    
    articles.forEach((article, index) => {
        const colors = [
            'linear-gradient(135deg, #3b82f6, #2563eb)',
            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            'linear-gradient(135deg, #10b981, #059669)',
            'linear-gradient(135deg, #f59e0b, #d97706)',
            'linear-gradient(135deg, #ef4444, #dc2626)',
            'linear-gradient(135deg, #06b6d4, #0891b2)'
        ];
        
        const articleCard = document.createElement('div');
        articleCard.className = 'course-card';
        articleCard.innerHTML = `
            <div class="course-image" style="background: ${colors[index % colors.length]};">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="course-info">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <div class="article-insights" style="margin: 0.5rem 0; font-size: 0.8rem; color: #94a3b8;">
                    ${article.tags ? article.tags.slice(0, 2).map(tag => `• ${tag}`).join('<br>') : ''}
                </div>
                <div class="article-source" style="margin: 0.5rem 0; font-size: 0.8rem; color: #22c55e;">
                    <i class="fas fa-star"></i> Quality Score: ${article.qualityScore || 'N/A'}
                    <br>
                    <i class="fas fa-external-link-alt"></i> ${article.source}
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(article.publishedAt)}</span>
                </div>
                <button class="course-btn read-external-article-btn" 
                        data-article-url="${article.url}"
                        data-article-title="${article.title}"
                        data-article-source="${article.source}">
                    <i class="fas fa-external-link-alt"></i> Read Article
                </button>
            </div>
        `;
        
        articlesContainer.appendChild(articleCard);
    });
    
    // Initialize external article buttons
    initializeExternalArticleButtons();
}

// Display AI-generated videos
function displayAIVideos(videos) {
    const videosContainer = document.querySelector('#videos-tab .course-grid');
    videosContainer.innerHTML = '';
    
    videos.forEach((video, index) => {
        const colors = [
            'linear-gradient(135deg, #ef4444, #dc2626)',
            'linear-gradient(135deg, #f59e0b, #d97706)', 
            'linear-gradient(135deg, #06b6d4, #0891b2)',
            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            'linear-gradient(135deg, #10b981, #059669)',
            'linear-gradient(135deg, #ec4899, #db2777)'
        ];
        
        const videoCard = document.createElement('div');
        videoCard.className = 'course-card';
        videoCard.innerHTML = `
            <div class="course-image" style="background: ${colors[index % colors.length]};">
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="course-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <div class="video-channel" style="margin: 0.5rem 0; font-size: 0.85rem; color: #22c55e;">
                    <i class="fab fa-youtube"></i> ${video.channelTitle}
                </div>
                <div class="video-quality" style="margin: 0.5rem 0; font-size: 0.8rem; color: #94a3b8;">
                    <i class="fas fa-star"></i> Quality Score: ${video.qualityScore || 'N/A'}
                    <br>
                    <i class="fas fa-tag"></i> ${video.category || 'Educational'}
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${video.duration}</span>
                    <span><i class="fas fa-eye"></i> ${formatViews(video.viewCount)}</span>
                </div>
                <button class="course-btn" onclick="openYouTubeVideo('${video.url}', '${video.title}')">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </button>
            </div>
        `;
        
        videosContainer.appendChild(videoCard);
    });
}

// Open YouTube video
function openYouTubeVideo(url, title) {
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        showNotification(`Opening "${title}" on YouTube`, 'info');
        
        // Track video view
        trackVideoWatch(title, url);
    } else {
        // Fallback: search for the video
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' financial literacy')}`;
        window.open(searchUrl, '_blank');
        showNotification(`Searching for "${title}" on YouTube`, 'info');
    }
}

function trackVideoWatch(title, url) {
    console.log('Video watched:', { title, url, timestamp: new Date().toISOString() });
    
    // Update watch history
    const watchHistory = JSON.parse(localStorage.getItem('videoHistory') || '[]');
    watchHistory.unshift({
        title: title,
        url: url,
        watchedAt: new Date().toISOString()
    });
    
    localStorage.setItem('videoHistory', JSON.stringify(watchHistory.slice(0, 50)));
}

function initializeExternalArticleButtons() {
    const articleBtns = document.querySelectorAll('.read-external-article-btn');
    
    articleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const articleUrl = this.getAttribute('data-article-url');
            const articleTitle = this.getAttribute('data-article-title');
            const articleSource = this.getAttribute('data-article-source');
            
            openExternalArticle(articleUrl, articleTitle, articleSource);
        });
    });
}

function openExternalArticle(url, title, source) {
    if (url && url !== 'undefined') {
        // Show quick notification and open link
        showNotification(`Opening "${title}" from ${source}`, 'info');
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Track article read
        trackArticleRead(title, source, url);
    } else {
        // Show modal with article content generated by AI
        showAIArticleModal(title, source);
    }
}

async function showAIArticleModal(title, source) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Write a comprehensive financial education article about "${title}". Include practical advice, current market insights, and actionable tips. Structure it with clear headings and bullet points for easy reading.`,
                context: 'article_generation'
            })
        });

        const data = await response.json();
        const articleContent = formatArticleContent(data.message);
        
        const modalContent = `
            <div class="article-modal">
                <div class="article-header">
                    <h2>${title}</h2>
                    <div class="article-meta">
                        <span><i class="fas fa-robot"></i> AI-Generated Content</span>
                        <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="article-content">
                    ${articleContent}
                </div>
                <div class="article-footer">
                    <div class="article-actions">
                        <button class="action-btn" onclick="bookmarkArticle('${title}')">
                            <i class="fas fa-bookmark"></i> Bookmark
                        </button>
                        <button class="action-btn" onclick="shareArticle('${title}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(title, modalContent);
        
    } catch (error) {
        console.error('Error generating article content:', error);
        showNotification('Unable to load article content', 'error');
    }
}

function formatArticleContent(content) {
    // Basic formatting for AI-generated content
    return content
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return '';
            
            // Handle headers
            if (line.match(/^#{1,3}\s/)) {
                const level = line.match(/^(#{1,3})/)[1].length;
                const text = line.replace(/^#{1,3}\s/, '');
                return `<h${level}>${text}</h${level}>`;
            }
            
            // Handle bullet points
            if (line.match(/^[•\-\*]\s/)) {
                return `<li>${line.replace(/^[•\-\*]\s/, '')}</li>`;
            }
            
            // Regular paragraphs
            return `<p>${line}</p>`;
        })
        .join('')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // Wrap consecutive list items
}

function bookmarkArticle(title) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks.unshift({
        title: title,
        bookmarkedAt: new Date().toISOString(),
        type: 'article'
    });
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks.slice(0, 100)));
    showNotification('Article bookmarked successfully', 'success');
    closeModal();
}

function shareArticle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this financial education article: "${title}"`,
            url: window.location.href
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`"${title}" - Financial Education Article`);
        showNotification('Article title copied to clipboard', 'success');
    }
}

function trackArticleRead(title, source, url) {
    console.log('Article read:', { title, source, url, timestamp: new Date().toISOString() });
    
    const readingHistory = JSON.parse(localStorage.getItem('articleHistory') || '[]');
    readingHistory.unshift({
        title: title,
        source: source,
        url: url,
        readAt: new Date().toISOString(),
        category: 'financial-literacy'
    });
    
    localStorage.setItem('articleHistory', JSON.stringify(readingHistory.slice(0, 50)));
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'Recent';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        return 'Recent';
    }
}

function formatViews(viewCount) {
    if (!viewCount) return '0 views';
    
    const num = parseInt(viewCount);
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K views`;
    } else {
        return `${num} views`;
    }
}

// Error display functions
function displayArticleError() {
    const articlesContainer = document.querySelector('#articles-tab .course-grid');
    articlesContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #ef4444;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>Unable to generate AI articles. Please try again later.</p>
            <button class="course-btn" onclick="generateAIArticles()" style="margin-top: 1rem;">
                <i class="fas fa-refresh"></i> Retry
            </button>
        </div>
    `;
}

function displayVideoError() {
    const videosContainer = document.querySelector('#videos-tab .course-grid');
    videosContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #ef4444;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>Unable to generate AI videos. Please try again later.</p>
            <button class="course-btn" onclick="generateAIVideos()" style="margin-top: 1rem;">
                <i class="fas fa-refresh"></i> Retry
            </button>
        </div>
    `;
}

// Existing helper functions (keeping all the original functions)
async function generateCourseContent(topic) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Create a financial literacy course about "${topic}". Provide: 1) A compelling course title (max 50 chars), 2) A practical description (max 120 chars) that explains what students will learn, 3) Key learning outcomes (3-4 bullet points). Focus on actionable, beginner-friendly content.`,
                context: 'course_generation'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate course content');
        }

        const data = await response.json();
        const courseInfo = parseCourseResponse(data.message, topic);
        
        return {
            title: courseInfo.title || topic,
            description: courseInfo.description || `Learn essential ${topic.toLowerCase()} skills and strategies.`,
            outcomes: courseInfo.outcomes || [`Master ${topic} fundamentals`, 'Apply practical strategies', 'Build financial confidence']
        };
    } catch (error) {
        return {
            title: topic,
            description: `Learn essential ${topic.toLowerCase()} skills and strategies for better financial health.`,
            outcomes: [`Understand ${topic} basics`, 'Apply key concepts', 'Make informed decisions']
        };
    }
}

function parseCourseResponse(aiResponse, fallbackTopic) {
    try {
        const lines = aiResponse.split('\n').filter(line => line.trim());
        
        let title = fallbackTopic;
        let description = '';
        let outcomes = [];
        
        const titleMatch = aiResponse.match(/(?:Title:?\s*)?(.+?)(?:\n|$)/i);
        if (titleMatch) {
            title = titleMatch[1].trim().replace(/['"]/g, '').substring(0, 50);
        }
        
        const descMatch = aiResponse.match(/(?:Description:?\s*)?([^.\n]+\.)/i);
        if (descMatch) {
            description = descMatch[1].trim().substring(0, 120);
        }
        
        const bulletRegex = /[•\-\*]\s*(.+)/g;
        let match;
        while ((match = bulletRegex.exec(aiResponse)) !== null && outcomes.length < 4) {
            outcomes.push(match[1].trim());
        }
        
        return { title, description, outcomes };
    } catch (error) {
        return {
            title: fallbackTopic,
            description: `Learn essential ${fallbackTopic.toLowerCase()} skills.`,
            outcomes: ['Master key concepts', 'Apply practical strategies']
        };
    }
}

function getCourseIcon(topic) {
    const iconMap = {
        'Budgeting': 'fas fa-calculator',
        'Credit': 'fas fa-credit-card',
        'Investment': 'fas fa-chart-line',
        'Emergency': 'fas fa-piggy-bank',
        'Debt': 'fas fa-hand-holding-usd',
        'Retirement': 'fas fa-umbrella',
        'Tax': 'fas fa-file-invoice-dollar',
        'Insurance': 'fas fa-shield-alt',
        'Real Estate': 'fas fa-home',
        'Cryptocurrency': 'fas fa-coins'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (topic.toLowerCase().includes(key.toLowerCase())) {
            return icon;
        }
    }
    return 'fas fa-graduation-cap';
}

function displayCourses(courses) {
    const coursesContainer = document.querySelector('#courses-tab .course-grid');
    coursesContainer.innerHTML = '';
    
    courses.forEach((course, index) => {
        const progressText = course.progress === 100 ? 'Completed' : 
                           course.progress === 0 ? 'Not Started' : 
                           `${course.progress}% Complete`;
        
        const buttonText = course.progress === 100 ? 'View Certificate' : 
                          course.progress === 0 ? 'Start Learning' : 
                          'Continue Learning';
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image">
                <i class="${course.icon}"></i>
            </div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="learning-outcomes" style="margin: 0.5rem 0; font-size: 0.8rem; color: #94a3b8;">
                    ${course.outcomes.slice(0, 2).map(outcome => `• ${outcome}`).join('<br>')}
                </div>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${course.progress}%"></div>
                    </div>
                    <span>${progressText}</span>
                </div>
                <button class="course-btn ${course.progress === 100 ? 'completed' : ''}">${buttonText}</button>
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
    
    initializeCourseInteractions();
}

function displayCourseError() {
    const coursesContainer = document.querySelector('#courses-tab .course-grid');
    coursesContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #ef4444;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>Unable to generate AI courses. Please try again later.</p>
            <button class="course-btn" onclick="generateAICourses()" style="margin-top: 1rem;">
                <i class="fas fa-refresh"></i> Retry
            </button>
        </div>
    `;
}

// Rest of the existing functions (navigation, sidebar, etc.)
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
            if (!document.querySelector('#courses-tab .course-card')) {
                generateAICourses();
            }
            break;
        case 'articles':
            if (!document.querySelector('#articles-tab .course-card')) {
                generateAIArticles();
            }
            break;
        case 'videos':
            if (!document.querySelector('#videos-tab .course-card')) {
                generateAIVideos();
            }
            break;
    }
}

function initializeCourseInteractions() {
    const courseBtns = document.querySelectorAll('.course-btn:not(.read-external-article-btn)');
    
    courseBtns.forEach(btn => {
        if (!btn.hasEventListener) {
            btn.hasEventListener = true;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('completed')) {
                    showCertificateModal(this.closest('.course-card'));
                } else if (this.textContent.includes('YouTube')) {
                    return;
                } else {
                    const courseCard = this.closest('.course-card');
                    const courseTitle = courseCard.querySelector('h3').textContent;
                    startCourse(courseTitle, courseCard);
                }
            });
        }
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
    showNotification(`You earned a badge for completing "${courseTitle}"!`, 'success');
    updateLearningProgress();
}

function showCertificateModal(courseCard) {
    const courseTitle = courseCard.querySelector('h3').textContent;
    const modalContent = `
        <div class="certificate-modal">
            <div class="certificate-preview">
                <div class="certificate-design">
                    <h2>Certificate of Completion</h2>
                    <p>This certifies that</p>
                    <h3>John Doe</h3>
                    <p>has successfully completed the course</p>
                    <h4>"${courseTitle}"</h4>
                    <div class="certificate-date">Completed on: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" id="close-certificate">Close</button>
                <button class="btn-primary" id="download-certificate">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        </div>
    `;
    
    showModal('Certificate of Completion', modalContent);
    
    document.getElementById('close-certificate').addEventListener('click', closeModal);
    document.getElementById('download-certificate').addEventListener('click', function() {
        showNotification(`Downloading certificate for "${courseTitle}"...`, 'info');
        closeModal();
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                performSearch(query);
            }
        });
    }
}

function performSearch(query) {
    showNotification(`Searching for "${query}"...`, 'info');
    // Search implementation would go here
}

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
        'courses': 'Our AI-generated courses cover essential financial literacy topics. Each course is personalized based on current market trends and expert insights.',
        'articles': 'We curate the latest financial articles using AI to ensure you get the most current and relevant information.',
        'videos': 'I recommend high-quality YouTube channels like Ben Felix, The Plain Bagel, and Two Cents for excellent financial education content.',
        'investing': 'Start with our AI-generated investment courses. They cover fundamentals like diversification, risk assessment, and long-term planning strategies.',
        'budget': 'Check out our budgeting course and articles. The 50/30/20 rule is a great starting point: 50% needs, 30% wants, 20% savings.',
        'default': 'I can help you navigate our AI-powered education content. What specific financial topic interests you most?'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

function initializeLearningProgress() {
    updateLearningProgress();
}

function updateLearningProgress() {
    console.log('Learning progress updated');
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
            }
            .modal {
                background: #1e293b;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: white;
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h2 {
                margin: 0;
                color: #f8fafc;
            }
            .modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .modal-content {
                padding: 1.5rem;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #334155;
            }
            .btn-primary, .btn-secondary {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            .btn-primary {
                background: #22c55e;
                color: white;
            }
            .btn-primary:hover {
                background: #16a34a;
            }
            .btn-secondary {
                background: transparent;
                color: #94a3b8;
                border: 1px solid #334155;
            }
            .btn-secondary:hover {
                background: #334155;
                color: white;
            }
            .certificate-design {
                background: linear-gradient(135deg, #1e293b, #334155);
                border: 2px solid #22c55e;
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                margin-bottom: 1rem;
            }
            .certificate-design h2 {
                color: #22c55e;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            .certificate-design h3 {
                color: #f8fafc;
                font-size: 1.25rem;
                margin: 1rem 0;
            }
            .certificate-design h4 {
                color: #22c55e;
                font-size: 1.1rem;
                margin: 1rem 0;
            }
            .certificate-date {
                color: #94a3b8;
                font-size: 0.9rem;
                margin-top: 1rem;
            }
            .article-modal {
                max-height: 70vh;
                overflow-y: auto;
            }
            .article-content {
                color: #e2e8f0;
                line-height: 1.7;
                font-size: 1rem;
            }
            .article-content h1, .article-content h2, .article-content h3 {
                color: #22c55e;
                margin: 2rem 0 1rem 0;
                border-bottom: 2px solid #22c55e;
                padding-bottom: 0.5rem;
            }
            .article-content p {
                margin-bottom: 1.5rem;
                text-align: justify;
            }
            .article-content ul {
                margin: 1rem 0;
                padding-left: 1.5rem;
            }
            .article-content li {
                margin-bottom: 0.5rem;
                color: #cbd5e1;
            }
            .article-content strong {
                color: #f8fafc;
                font-weight: 600;
            }
            .article-content em {
                color: #94a3b8;
                font-style: italic;
            }
            .article-header {
                border-bottom: 1px solid #334155;
                padding-bottom: 1rem;
                margin-bottom: 2rem;
            }
            .article-header h2 {
                color: #f8fafc;
                margin-bottom: 1rem;
                line-height: 1.3;
            }
            .article-meta {
                display: flex;
                gap: 2rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
                color: #94a3b8;
                font-size: 0.9rem;
            }
            .article-footer {
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #334155;
            }
            .article-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            .action-btn {
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
            .action-btn:hover {
                background: rgba(34, 197, 94, 0.2);
                border-color: #22c55e;
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
        modalOverlay.remove();
    }
}