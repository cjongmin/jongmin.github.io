// Main application state
const AppState = {
    currentSection: 'about',
    currentLanguage: 'ko',
    currentTheme: 'light',
    isAdmin: false,
    user: null,
    publications: [],
    projects: [],
    awards: [],
    timeline: []
};

// Internationalization
const i18n = {
    ko: {
        login: '로그인',
        logout: '로그아웃',
        admin_panel: '관리자 패널',
        settings: '설정',
        about: 'About Me',
        publications: 'Publications',
        projects: 'Projects',
        awards: 'Awards',
        contact: 'Contact',
        feedback: 'Feedback',
        timeline: 'Timeline',
        collaboration: 'Collaboration',
        profile_name: 'Dr. [Your Name]',
        profile_title: 'AI 연구자 & 데이터 사이언티스트',
        research_interests: '연구 관심사',
        education: '학력',
        ai_assistant: 'AI 어시스턴트',
        ai_welcome: '안녕하세요! 연구 관련 질문이나 페이지 내용에 대해 문의해주세요.',
        setup_api: 'API 키 설정',
        send_message: '메시지 보내기',
        submit_feedback: '피드백 제출',
        name: '이름',
        email: '이메일',
        subject: '제목',
        message: '메시지',
        or: '또는',
        no_account: '계정이 없으신가요?',
        signup: '회원가입',
        login_welcome: 'Google 또는 GitHub 계정으로 로그인하세요',
        login_google: 'Google로 로그인',
        login_github: 'GitHub로 로그인',
        api_setup: 'API 키 설정',
        api_setup_desc: 'AI 어시스턴트를 사용하려면 API 키를 설정해주세요. 모든 키는 안전하게 암호화되어 저장됩니다.',
        citations: '인용수',
        rating: '평점',
        comment: '코멘트'
    },
    en: {
        login: 'Login',
        logout: 'Logout',
        admin_panel: 'Admin Panel',
        settings: 'Settings',
        about: 'About Me',
        publications: 'Publications',
        projects: 'Projects',
        awards: 'Awards',
        contact: 'Contact',
        feedback: 'Feedback',
        timeline: 'Timeline',
        collaboration: 'Collaboration',
        profile_name: 'Dr. [Your Name]',
        profile_title: 'AI Researcher & Data Scientist',
        research_interests: 'Research Interests',
        education: 'Education',
        ai_assistant: 'AI Assistant',
        ai_welcome: 'Hello! Please feel free to ask about my research or page content.',
        setup_api: 'Setup API Keys',
        send_message: 'Send Message',
        submit_feedback: 'Submit Feedback',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        or: 'or',
        no_account: "Don't have an account?",
        signup: 'Sign Up',
        login_welcome: 'Please login with your Google or GitHub account',
        login_google: 'Login with Google',
        login_github: 'Login with GitHub',
        api_setup: 'API Key Setup',
        api_setup_desc: 'Please set up API keys to use the AI assistant. All keys are securely encrypted and stored.',
        citations: 'Citations',
        rating: 'Rating',
        comment: 'Comment'
    }
};

// Section content templates
const sectionTemplates = {
    about: `
        <div class="section-header">
            <h1 data-i18n="about">About Me</h1>
            <button class="edit-btn admin-only hidden" onclick="editSection('about')">
                <i class="fas fa-edit"></i>
                <span data-i18n="edit">편집</span>
            </button>
        </div>
        
        <div class="about-content">
            <div class="profile-edit-section admin-only hidden">
                <h3 data-i18n="profile_management">프로필 관리</h3>
                <div class="profile-controls">
                    <button class="btn btn-secondary" onclick="showProfileEditModal()">
                        <i class="fas fa-edit"></i>
                        <span data-i18n="edit_profile">프로필 편집</span>
                    </button>
                    <button class="btn btn-secondary" onclick="showProfilePhotoModal()">
                        <i class="fas fa-camera"></i>
                        <span data-i18n="change_photo">사진 변경</span>
                    </button>
                </div>
            </div>
            
            <div class="about-text" id="about-text">
                <p>안녕하세요! 저는 인공지능과 머신러닝 분야의 연구자입니다. 특히 자연어처리와 컴퓨터 비전 분야에서 혁신적인 연구를 수행하고 있습니다.</p>
                <p>현재 [대학명/연구소명]에서 [직책]으로 재직 중이며, 최첨단 AI 기술을 활용한 실용적인 솔루션 개발에 집중하고 있습니다.</p>
            </div>
            
            <div class="research-interests">
                <h3 data-i18n="research_interests">Research Interests</h3>
                <div class="tags">
                    <span class="tag">Machine Learning</span>
                    <span class="tag">Natural Language Processing</span>
                    <span class="tag">Computer Vision</span>
                    <span class="tag">Deep Learning</span>
                    <span class="tag">AI Ethics</span>
                </div>
                <button class="edit-btn admin-only hidden" onclick="editResearchInterests()">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            
            <div class="education">
                <h3 data-i18n="education">Education</h3>
                <div class="education-item">
                    <div class="degree">Ph.D. in Computer Science</div>
                    <div class="institution">[University Name]</div>
                    <div class="year">2020</div>
                </div>
                <div class="education-item">
                    <div class="degree">M.S. in Computer Science</div>
                    <div class="institution">[University Name]</div>
                    <div class="year">2016</div>
                </div>
                <button class="edit-btn admin-only hidden" onclick="editEducation()">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `,
    
    publications: `
        <div class="section-header">
            <h1 data-i18n="publications">Publications</h1>
            <div class="section-controls">
                <button class="add-btn admin-only hidden" onclick="showAddPublicationModal()">
                    <i class="fas fa-plus"></i>
                    <span data-i18n="add_publication">Add Publication</span>
                </button>
                <div class="search-filter">
                    <input type="text" id="pub-search" placeholder="Search publications..." onkeyup="filterPublications()">
                    <select id="pub-filter" onchange="filterPublications()">
                        <option value="all">All Years</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div id="publications-list" class="publications-list">
            <!-- Publications will be loaded here -->
        </div>
    `,
    
    projects: `
        <div class="section-header">
            <h1 data-i18n="projects">Projects</h1>
            <button class="add-btn admin-only hidden" onclick="showAddProjectModal()">
                <i class="fas fa-plus"></i>
                <span data-i18n="add_project">Add Project</span>
            </button>
        </div>
        
        <div class="projects-section">
            <h2>Active Projects</h2>
            <div class="project-card">
                <div class="project-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="project-content">
                    <h3>AI-Powered Research Assistant</h3>
                    <p>An intelligent system for helping researchers discover and analyze academic papers.</p>
                    <div class="project-technologies">
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">TensorFlow</span>
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">Firebase</span>
                    </div>
                    <div class="project-links">
                        <a href="javascript:void(0)" class="project-link" onclick="event.preventDefault()"><i class="fab fa-github"></i> GitHub</a>
                        <a href="javascript:void(0)" class="project-link" onclick="event.preventDefault()"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                    <div class="admin-controls admin-only hidden">
                        <button class="btn-small btn-primary" onclick="editProject(1)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small btn-danger" onclick="deleteProject(1)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="project-card">
                <div class="project-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="project-content">
                    <h3>Data Analytics Platform</h3>
                    <p>A comprehensive platform for analyzing and visualizing research data with advanced machine learning capabilities.</p>
                    <div class="project-technologies">
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">Pandas</span>
                        <span class="tech-tag">D3.js</span>
                        <span class="tech-tag">PostgreSQL</span>
                    </div>
                    <div class="project-links">
                        <a href="javascript:void(0)" class="project-link" onclick="event.preventDefault()"><i class="fab fa-github"></i> GitHub</a>
                        <a href="javascript:void(0)" class="project-link" onclick="event.preventDefault()"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                    <div class="admin-controls admin-only hidden">
                        <button class="btn-small btn-primary" onclick="editProject(2)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-small btn-danger" onclick="deleteProject(2)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    awards: `
        <div class="section-header">
            <h1 data-i18n="awards">Awards</h1>
            <button class="add-btn admin-only hidden" onclick="showAddAwardModal()">
                <i class="fas fa-plus"></i>
                <span data-i18n="add_award">Add Award</span>
            </button>
        </div>
        
        <div id="awards-list" class="awards-list">
            <!-- Awards will be loaded here with admin controls -->
        </div>
    `,
    
    timeline: `
        <div class="section-header">
            <h1 data-i18n="timeline">Timeline</h1>
            <button class="add-btn admin-only hidden" onclick="showAddTimelineModal()">
                <i class="fas fa-plus"></i>
                <span data-i18n="add_timeline">Add Event</span>
            </button>
        </div>
        
        <div id="timeline-list" class="timeline-list">
            <!-- Timeline events will be loaded here with admin controls -->
        </div>
    `,
    
    contact: `
        <div class="section-header">
            <h1 data-i18n="contact">Contact</h1>
        </div>
        
        <div class="contact-content">
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>jongmin@mmai.io</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>+82 10-2925-6477</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>KAIST, 291 Daehak-ro, Yuseong-gu, Daejeon, Republic of Korea, 34141</span>
                </div>
            </div>
            
            <form id="contact-form" class="contact-form" onsubmit="handleContactForm(event)">
                <div class="form-group">
                    <label for="contact-name" data-i18n="name">Name</label>
                    <input type="text" id="contact-name" required>
                </div>
                <div class="form-group">
                    <label for="contact-email" data-i18n="email">Email</label>
                    <input type="email" id="contact-email" required>
                </div>
                <div class="form-group">
                    <label for="contact-subject" data-i18n="subject">Subject</label>
                    <input type="text" id="contact-subject" required>
                </div>
                <div class="form-group">
                    <label for="contact-message" data-i18n="message">Message</label>
                    <textarea id="contact-message" rows="5" required></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i>
                    <span data-i18n="send_message">Send Message</span>
                </button>
            </form>
        </div>
    `,
    
    feedback: `
        <div class="section-header">
            <h1 data-i18n="feedback">Visitor Feedback</h1>
        </div>
        
        <div id="feedback-container">
            <form id="feedback-form" class="feedback-form" onsubmit="handleFeedbackForm(event)">
                <div class="form-group">
                    <label for="feedback-rating" data-i18n="rating">Rating</label>
                    <div class="rating-stars">
                        <i class="fas fa-star" data-rating="1" onclick="setRating(1)"></i>
                        <i class="fas fa-star" data-rating="2" onclick="setRating(2)"></i>
                        <i class="fas fa-star" data-rating="3" onclick="setRating(3)"></i>
                        <i class="fas fa-star" data-rating="4" onclick="setRating(4)"></i>
                        <i class="fas fa-star" data-rating="5" onclick="setRating(5)"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label for="feedback-comment" data-i18n="comment">Comment</label>
                    <textarea id="feedback-comment" rows="4" placeholder="Share your thoughts about my research..."></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fas fa-comment"></i>
                    <span data-i18n="submit_feedback">Submit Feedback</span>
                </button>
            </form>
            
            <div id="feedback-list" class="feedback-list">
                <!-- Feedback will be loaded here -->
            </div>
        </div>
    `,
    
    collaboration: `
        <div class="section-header">
            <h1 data-i18n="collaboration">Collaboration</h1>
        </div>
        
        <div class="collaboration-content">
            <div class="collaboration-intro">
                <p>I'm always interested in collaborating with fellow researchers, industry partners, and students. Here are some areas where I'm looking for collaboration:</p>
            </div>
            
            <div class="collaboration-areas">
                <div class="collaboration-card">
                    <i class="fas fa-brain"></i>
                    <h3>Research Collaboration</h3>
                    <p>Joint research projects in AI, ML, and NLP</p>
                </div>
                <div class="collaboration-card">
                    <i class="fas fa-industry"></i>
                    <h3>Industry Partnership</h3>
                    <p>Applied research and technology transfer</p>
                </div>
                <div class="collaboration-card">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>Student Mentoring</h3>
                    <p>PhD and Master's student supervision</p>
                </div>
            </div>
            
            <div class="collaboration-form">
                <h3>Collaboration Proposal</h3>
                <form id="collaboration-form" onsubmit="handleCollaborationForm(event)">
                    <div class="form-group">
                        <label for="collab-name">Name</label>
                        <input type="text" id="collab-name" required>
                    </div>
                    <div class="form-group">
                        <label for="collab-email">Email</label>
                        <input type="email" id="collab-email" required>
                    </div>
                    <div class="form-group">
                        <label for="collab-type">Collaboration Type</label>
                        <select id="collab-type" required>
                            <option value="">Select Type</option>
                            <option value="research">Research Collaboration</option>
                            <option value="industry">Industry Partnership</option>
                            <option value="mentoring">Student Mentoring</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="collab-proposal">Proposal Description</label>
                        <textarea id="collab-proposal" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn">Send Proposal</button>
                </form>
            </div>
        </div>
    `
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize the app
    initializeApp();
    
    // Set up navigation menu click handlers
    setupNavigationEventListeners();
    
    // Set up header controls
    setupHeaderEventListeners();
    
    // Set up mobile menu handlers
    setupMobileEventListeners();
    
    console.log('App initialization complete');
});

function initializeApp() {
    console.log('Initializing Profile Page Application...');
    
    // Initialize Firebase first
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Load preferences
    loadPreferences();
    
    // Load saved profile data
    loadSavedProfileData();
    
    // Initialize sections
    showSection('about');
    
    // Set up event listeners
    setupNavigationEventListeners();
    setupHeaderEventListeners();
    setupMobileEventListeners();
    
    // Initialize AI assistant
    if (typeof aiAssistant !== 'undefined') {
        console.log('AI Assistant initialized');
    }
    
    // Load all data
    loadAllData();
    
    // Initialize resize functionality
    initializeAIResize();
    
    console.log('Application initialized successfully!');
}

function loadPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        AppState.currentTheme = savedTheme;
    }
    
    // Load language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        AppState.currentLanguage = savedLanguage;
    }
}

function loadSavedProfileData() {
    try {
        // Load profile data
        const savedProfile = localStorage.getItem('profile_data');
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            
            const profileName = document.getElementById('profile-name');
            const profileTitle = document.getElementById('profile-title');
            const aboutText = document.getElementById('about-text');
            
            if (profileName && profileData.name) {
                profileName.textContent = profileData.name;
            }
            if (profileTitle && profileData.title) {
                profileTitle.textContent = profileData.title;
            }
            if (aboutText && profileData.bio) {
                aboutText.innerHTML = profileData.bio.split('\n').map(p => `<p>${p}</p>`).join('');
            }
            
            console.log('Profile data loaded from localStorage');
        }
        
        // Load profile photo
        const savedPhoto = localStorage.getItem('profile_photo');
        if (savedPhoto) {
            const profileImg = document.getElementById('profile-img');
            if (profileImg) {
                profileImg.src = savedPhoto;
                console.log('Profile photo loaded from localStorage');
            }
        }
        
        // Check for saved admin status (for page refresh persistence)
        const savedAdminStatus = localStorage.getItem('is_admin');
        if (savedAdminStatus === 'true') {
            AppState.isAdmin = true;
            document.body.classList.add('admin-mode');
            updateAdminUI();
        }
        
    } catch (error) {
        console.error('Error loading saved profile data:', error);
    }
}

function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.querySelector(`[href="#${sectionName}"]`)?.parentElement;
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Update content
    const mainContent = document.getElementById('main-content');
    if (mainContent && sectionTemplates[sectionName]) {
        mainContent.innerHTML = sectionTemplates[sectionName];
        
        // Load data for the new section
        loadSectionData(sectionName);
        
        // Update language
        updateLanguage();
        
        // Update app state
        AppState.currentSection = sectionName;
        
        // Update URL
        window.history.pushState({section: sectionName}, '', `#${sectionName}`);
    }
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'about':
            // About data is mostly static text
            break;
        case 'publications':
            renderPublications();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'awards':
            renderAwards();
            break;
        case 'timeline':
            renderTimeline();
            break;
        case 'contact':
            // No specific data to load, form is static
            break;
        case 'feedback':
            loadFeedback();
            break;
        case 'collaboration':
            // No specific data to load, form is static
            break;
        default:
            console.warn(`No data loading logic for section: ${sectionName}`);
    }
}

// Theme management
function toggleTheme() {
    const newTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
    AppState.currentTheme = newTheme;
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Language management
function toggleLanguage() {
    const newLanguage = AppState.currentLanguage === 'ko' ? 'en' : 'ko';
    AppState.currentLanguage = newLanguage;
    updateLanguage();
    localStorage.setItem('language', newLanguage);
}

function updateLanguage() {
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = AppState.currentLanguage.toUpperCase();
    }
    
    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18n[AppState.currentLanguage][key];
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const searchInput = document.getElementById('pub-search');
    if (searchInput) {
        searchInput.placeholder = AppState.currentLanguage === 'ko' ? 
            '논문 검색...' : 'Search publications...';
    }
}

// Mobile menu management
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

function toggleAIPanel() {
    const aiAssistant = document.querySelector('.ai-assistant');
    aiAssistant.classList.toggle('mobile-open');
}

// AI Assistant resize functionality
function initializeAIResize() {
    const aiAssistant = document.querySelector('.ai-assistant');
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'ai-resize-handle';
    aiAssistant.appendChild(resizeHandle);
    
    let isResizing = false;
    let startX, startWidth;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(aiAssistant).width, 10);
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    });
    
    function handleResize(e) {
        if (!isResizing) return;
        
        const width = startWidth - (e.clientX - startX);
        const minWidth = 300;
        const maxWidth = 600;
        
        if (width >= minWidth && width <= maxWidth) {
            aiAssistant.style.width = width + 'px';
            document.documentElement.style.setProperty('--ai-panel-width', width + 'px');
            
            // Update main content margin
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.marginRight = width + 'px';
            }
        }
    }
    
    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// Modal management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showLoginModal() {
    if (!document.getElementById('login-modal')) {
        createLoginModal();
    }
    showModal('login-modal');
}

// showSignupModal and createSignupModal functions are handled by auth.js

function createLoginModal() {
    const modalHTML = `
        <div id="login-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="login">Login</h2>
                    <button class="modal-close" onclick="closeModal('login-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="login-welcome">
                        <p data-i18n="login_welcome">Google 또는 GitHub 계정으로 로그인하세요</p>
                    </div>
                    <div class="login-options">
                        <button class="login-btn google" onclick="loginWithGoogle()">
                            <i class="fab fa-google"></i>
                            <span data-i18n="login_google">Google로 로그인</span>
                        </button>
                        <button class="login-btn github" onclick="loginWithGitHub()">
                            <i class="fab fa-github"></i>
                            <span data-i18n="login_github">GitHub로 로그인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
}

// handleEmailLogin and handleEmailSignup functions are handled by auth.js

// Data loading functions
function loadAllData() {
    loadPublications();
    loadProjects();
    loadAwards();
    loadTimeline();
    loadFeedback();
}

function loadPublications() {
    // This would typically load from Firebase
    // For now, using sample data
    const samplePublications = [
        {
            id: 1,
            title: "Advanced Machine Learning Techniques for Natural Language Processing",
            authors: "Dr. [Your Name], John Doe, Jane Smith",
            venue: "ICML 2023",
            year: 2023,
            abstract: "This paper presents novel approaches to improving NLP model performance...",
            links: {
                pdf: "#",
                code: "#",
                project: "#"
            },
            citations: 45
        }
    ];
    
    AppState.publications = samplePublications;
    renderPublications();
}

function renderPublications() {
    const publicationsList = document.getElementById('publications-list');
    if (!publicationsList) return;
    
    if (AppState.publications.length === 0) {
        publicationsList.innerHTML = '<p class="no-data">No publications found.</p>';
        return;
    }
    
    const publicationsHTML = AppState.publications.map(pub => `
        <div class="publication-card">
            <div class="publication-header">
                <h3 class="publication-title">${pub.title}</h3>
                <div class="publication-year">${pub.year}</div>
            </div>
            <div class="publication-authors">${pub.authors}</div>
            <div class="publication-venue">${pub.venue}</div>
            <div class="publication-abstract">${pub.abstract}</div>
            <div class="publication-links">
                ${pub.links.pdf ? `<a href="${pub.links.pdf}" class="pub-link pdf"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                ${pub.links.code ? `<a href="${pub.links.code}" class="pub-link code"><i class="fas fa-code"></i> Code</a>` : ''}
                ${pub.links.project ? `<a href="${pub.links.project}" class="pub-link project"><i class="fas fa-external-link-alt"></i> Project</a>` : ''}
            </div>
            <div class="publication-stats">
                <span class="citations">Citations: ${pub.citations}</span>
            </div>
        </div>
    `).join('');
    
    publicationsList.innerHTML = publicationsHTML;
}

function loadProjects() {
    // Sample project data
    const sampleProjects = [
        {
            id: 1,
            title: "AI-Powered Research Assistant",
            description: "An intelligent system for helping researchers discover and analyze academic papers.",
            technologies: ["Python", "TensorFlow", "React", "Firebase"],
            status: "Active",
            image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBMMTUwIDExMEwxODAgODBNMTIwIDEyMEgxODAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2Zz4K",
            github: "#",
            demo: "#"
        }
    ];
    
    AppState.projects = sampleProjects;
    renderProjects();
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    if (AppState.projects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-data">No projects found.</p>';
        return;
    }
    
    const projectsHTML = AppState.projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-status status-${project.status.toLowerCase()}">${project.status}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    projectsGrid.innerHTML = projectsHTML;
}

function loadAwards() {
    // Sample awards data
    const sampleAwards = [
        {
            id: 1,
            title: "Best Paper Award",
            organization: "International Conference on Machine Learning",
            year: 2023,
            description: "Awarded for outstanding contribution to the field of machine learning.",
            icon: "trophy"
        },
        {
            id: 2,
            title: "Outstanding Researcher Award",
            organization: "Korean AI Society",
            year: 2022,
            description: "Recognition for exceptional research contributions in artificial intelligence",
            icon: "medal"
        },
        {
            id: 3,
            title: "Excellence in Teaching Award",
            organization: "KAIST",
            year: 2021,
            description: "Awarded for exceptional teaching performance and student mentorship",
            icon: "graduation-cap"
        }
    ];
    
    AppState.awards = sampleAwards;
    renderAwards();
}

function renderAwards() {
    const awardsList = document.getElementById('awards-list');
    if (!awardsList) return;

    const awardCards = AppState.awards.map(award => `
        <div class="award-card">
            <div class="award-icon">
                <i class="fas fa-${award.icon}"></i>
            </div>
            <div class="award-content">
                <h3>${award.title}</h3>
                <p class="award-description">${award.description}</p>
                <div class="award-meta">
                    <span class="award-year">${award.year}</span>
                    <span class="award-organization">${award.organization}</span>
                </div>
            </div>
            <div class="admin-controls admin-only hidden">
                <button class="btn-small btn-primary" onclick="editAward('${award.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-danger" onclick="deleteAward('${award.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    awardsList.innerHTML = awardCards;
    
    // Update admin UI visibility
    updateAdminUI();
}

function updateStats() {
    document.getElementById('publications-count').textContent = AppState.publications.length;
    document.getElementById('pub-badge').textContent = AppState.publications.length;
    
    const totalCitations = AppState.publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    document.getElementById('citations-count').textContent = totalCitations;
    
    // Calculate H-index (simplified)
    const sortedCitations = AppState.publications
        .map(pub => pub.citations || 0)
        .sort((a, b) => b - a);
    
    let hIndex = 0;
    for (let i = 0; i < sortedCitations.length; i++) {
        if (sortedCitations[i] >= i + 1) {
            hIndex = i + 1;
        } else {
            break;
        }
    }
    
    document.getElementById('h-index').textContent = hIndex;
}

// Form handlers
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // EmailJS를 사용하여 이메일 전송
    const templateParams = {
        to_email: 'jongmin@mmai.io',
        from_name: name,
        from_email: email,
        subject: `[Contact] ${name}; ${email}`,
        message: message,
        original_subject: subject
    };
    
    // EmailJS 초기화 (실제 서비스에서는 환경변수 사용)
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_id', 'template_id', templateParams)
            .then(() => {
                showToast('메시지가 성공적으로 전송되었습니다!', 'success');
                document.getElementById('contact-form').reset();
            })
            .catch((error) => {
                console.error('Email send error:', error);
                showToast('메시지 전송에 실패했습니다. 직접 jongmin@mmai.io로 연락해주세요.', 'error');
            });
    } else {
        // EmailJS가 로드되지 않은 경우 mailto 링크 생성
        const mailtoLink = `mailto:jongmin@mmai.io?subject=${encodeURIComponent(`[Contact] ${name}; ${email}`)}&body=${encodeURIComponent(`From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`)}`;
        window.open(mailtoLink);
        showToast('이메일 클라이언트를 통해 메시지를 보내주세요.', 'info');
        document.getElementById('contact-form').reset();
    }
}

function handleFeedbackForm(event) {
    event.preventDefault();
    
    // 로그인 확인
    if (!auth.currentUser) {
        showToast('피드백을 남기려면 로그인이 필요합니다.', 'error');
        showLoginModal();
        return;
    }
    
    const rating = document.querySelector('.rating-stars .active')?.dataset?.rating || 0;
    const comment = document.getElementById('feedback-comment').value;
    
    if (!rating) {
        showToast('평점을 선택해주세요.', 'error');
        return;
    }
    
    const feedbackData = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userEmail: auth.currentUser.email,
        rating: parseInt(rating),
        comment: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString()
    };
    
    // Firebase에 저장
    db.collection('feedback').add(feedbackData)
        .then(() => {
            showToast('피드백이 성공적으로 등록되었습니다!', 'success');
            document.getElementById('feedback-form').reset();
            resetRating();
            loadFeedback(); // 피드백 목록 새로고침
        })
        .catch((error) => {
            console.error('Error adding feedback:', error);
            showToast('피드백 등록에 실패했습니다.', 'error');
        });
}

// Load feedback from Firebase
async function loadFeedback() {
    try {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;
        
        const snapshot = await db.collection('feedback')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        if (snapshot.empty) {
            feedbackList.innerHTML = '<p class="no-feedback">아직 피드백이 없습니다. 첫 번째 피드백을 남겨주세요!</p>';
            return;
        }
        
        const feedbackHTML = snapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.timestamp ? data.timestamp.toDate() : new Date(data.createdAt);
            
            return `
                <div class="feedback-item">
                    <div class="feedback-header">
                        <div class="feedback-user">
                            <strong>${data.userName}</strong>
                        </div>
                        <div class="feedback-rating">
                            ${generateStarRating(data.rating)}
                        </div>
                    </div>
                    <div class="feedback-time">${formatDate(createdAt)}</div>
                    <div class="feedback-comment">${data.comment || '(코멘트 없음)'}</div>
                </div>
            `;
        }).join('');
        
        feedbackList.innerHTML = feedbackHTML;
        
    } catch (error) {
        console.error('Error loading feedback:', error);
        const feedbackList = document.getElementById('feedback-list');
        if (feedbackList) {
            feedbackList.innerHTML = '<p class="error">피드백을 불러오는데 실패했습니다.</p>';
        }
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'active' : ''}"></i>`;
    }
    return stars;
}

// Format date for display
function formatDate(date) {
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setRating(rating) {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetRating() {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach(star => {
        star.classList.remove('active');
    });
}

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function filterPublications() {
    const searchTerm = document.getElementById('pub-search')?.value.toLowerCase() || '';
    const yearFilter = document.getElementById('pub-filter')?.value || 'all';
    
    let filteredPublications = AppState.publications;
    
    if (searchTerm) {
        filteredPublications = filteredPublications.filter(pub => 
            pub.title.toLowerCase().includes(searchTerm) ||
            pub.authors.toLowerCase().includes(searchTerm) ||
            pub.venue.toLowerCase().includes(searchTerm)
        );
    }
    
    if (yearFilter !== 'all') {
        filteredPublications = filteredPublications.filter(pub => 
            pub.year.toString() === yearFilter
        );
    }
    
    renderFilteredPublications(filteredPublications);
}

function renderFilteredPublications(publications) {
    const publicationsList = document.getElementById('publications-list');
    if (!publicationsList) return;

    const publicationsHTML = publications.map(pub => {
        const links = [];
        if (pub.pdf) links.push(`<a href="${pub.pdf}" target="_blank" class="link-btn pdf">PDF</a>`);
        if (pub.code) links.push(`<a href="${pub.code}" target="_blank" class="link-btn code">Code</a>`);
        if (pub.project) links.push(`<a href="${pub.project}" target="_blank" class="link-btn project">Project</a>`);

        return `
            <div class="publication-card">
                <div class="publication-year">${pub.year}</div>
                <div class="publication-content">
                    <h3 class="publication-title">${pub.title}</h3>
                    <div class="publication-authors">${pub.authors}</div>
                    <div class="publication-venue">${pub.venue}</div>
                    <div class="publication-links">
                        ${links.join('')}
                    </div>
                </div>
                <div class="admin-controls admin-only hidden">
                    <button class="btn-small btn-primary" onclick="showEditPublicationModal('${pub.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="deletePublication('${pub.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    publicationsList.innerHTML = publicationsHTML;
    updateAdminUI();
}

function showAddPublicationModal() {
    if (!AppState.isAdmin) return;
    showPublicationModal(null);
}

function showEditPublicationModal(pubId) {
    if (!AppState.isAdmin) return;
    const publication = AppState.publications.find(p => p.id === pubId);
    if (publication) {
        showPublicationModal(publication);
    }
}

function showPublicationModal(pub) {
    const modalId = 'publication-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const title = pub ? 'Edit Publication' : 'Add Publication';
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="publication-form" onsubmit="handleSavePublication(event, '${pub?.id || ''}')">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="pub-title" value="${pub?.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Authors</label>
                            <input type="text" id="pub-authors" value="${pub?.authors || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Venue</label>
                            <input type="text" id="pub-venue" value="${pub?.venue || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Year</label>
                            <input type="number" id="pub-year" value="${pub?.year || new Date().getFullYear()}" required>
                        </div>
                        <div class="form-group">
                            <label>PDF Link</label>
                            <input type="url" id="pub-pdf" value="${pub?.pdf || ''}">
                        </div>
                        <div class="form-group">
                            <label>Code Link</label>
                            <input type="url" id="pub-code" value="${pub?.code || ''}">
                        </div>
                        <div class="form-group">
                            <label>Project Link</label>
                            <input type="url" id="pub-project" value="${pub?.project || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handleSavePublication(event, pubId) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const publication = {
        id: pubId || `pub_${new Date().getTime()}`,
        title: document.getElementById('pub-title').value,
        authors: document.getElementById('pub-authors').value,
        venue: document.getElementById('pub-venue').value,
        year: parseInt(document.getElementById('pub-year').value, 10),
        pdf: document.getElementById('pub-pdf').value,
        code: document.getElementById('pub-code').value,
        project: document.getElementById('pub-project').value,
    };

    if (pubId) {
        // Edit existing
        const index = AppState.publications.findIndex(p => p.id === pubId);
        AppState.publications[index] = publication;
    } else {
        // Add new
        AppState.publications.unshift(publication);
    }

    renderPublications();
    closeModal('publication-modal');
    showToast('Publication saved successfully.');
}

function deletePublication(pubId) {
    if (!AppState.isAdmin) return;
    if (confirm('Are you sure you want to delete this publication?')) {
        AppState.publications = AppState.publications.filter(p => p.id !== pubId);
        renderPublications();
        showToast('Publication deleted.');
    }
}

// Navigation event listeners
function setupNavigationEventListeners() {
    // Add click event listeners to all navigation links
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('href').substring(1); // Remove # from href
            console.log('Navigation clicked:', sectionName);
            showSection(sectionName);
        });
    });
    
    console.log('Navigation event listeners set up');
}

// Header controls event listeners
function setupHeaderEventListeners() {
    // Theme toggle button
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Language toggle button
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }
    
    // Login button (if not already handled by firebase-config.js)
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn && !loginBtn.hasAttribute('data-listener-added')) {
        loginBtn.addEventListener('click', function() {
            // This will be handled by firebase-config.js mock login
            if (typeof mockLogin === 'function') {
                mockLogin('google');
            } else {
                showLoginModal();
            }
        });
        loginBtn.setAttribute('data-listener-added', 'true');
    }
    
    // Logout button (if not already handled by firebase-config.js)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn && !logoutBtn.hasAttribute('data-listener-added')) {
        logoutBtn.addEventListener('click', function() {
            // This will be handled by firebase-config.js mock logout
            if (typeof mockLogout === 'function') {
                mockLogout();
            }
        });
        logoutBtn.setAttribute('data-listener-added', 'true');
    }
    
    console.log('Header event listeners set up');
}

// Mobile event listeners
function setupMobileEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // AI panel toggle for mobile
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    if (aiToggleBtn) {
        aiToggleBtn.addEventListener('click', toggleAIPanel);
    }
    
    // Close mobile menu when clicking on nav items
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    });
    
    console.log('Mobile event listeners set up');
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    const section = event.state?.section || 'about';
    showSection(section);
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('pub-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape key to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Handle URL hash on initial load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== AppState.currentSection) {
        showSection(hash);
    }
});

console.log('Script.js loaded successfully');

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting app initialization');
    initializeApp();
});

// Export functions for use in other modules
window.AppState = AppState;
window.showSection = showSection;
window.toggleTheme = toggleTheme;
window.toggleLanguage = toggleLanguage;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleAIPanel = toggleAIPanel;
window.showModal = showModal;
window.closeModal = closeModal;
window.showLoginModal = showLoginModal;
window.showToast = showToast;

// Collaboration form handler
function handleCollaborationForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('collab-name').value;
    const email = document.getElementById('collab-email').value;
    const organization = document.getElementById('collab-organization').value;
    const proposal = document.getElementById('collab-proposal').value;
    
    // EmailJS를 사용하여 이메일 전송
    const templateParams = {
        to_email: 'jongmin@mmai.io',
        from_name: name,
        from_email: email,
        subject: `[Collaboration] ${name}; ${email}`,
        message: `From: ${name} (${email})\nOrganization: ${organization}\n\nCollaboration Proposal:\n${proposal}`,
        organization: organization,
        proposal: proposal
    };
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_id', 'template_id', templateParams)
            .then(() => {
                showToast('협업 제안이 성공적으로 전송되었습니다!', 'success');
                document.getElementById('collaboration-form').reset();
            })
            .catch((error) => {
                console.error('Email send error:', error);
                showToast('협업 제안 전송에 실패했습니다. 직접 jongmin@mmai.io로 연락해주세요.', 'error');
            });
    } else {
        // EmailJS가 로드되지 않은 경우 mailto 링크 생성
        const mailtoLink = `mailto:jongmin@mmai.io?subject=${encodeURIComponent(`[Collaboration] ${name}; ${email}`)}&body=${encodeURIComponent(`From: ${name} (${email})\nOrganization: ${organization}\n\nCollaboration Proposal:\n${proposal}`)}`;
        window.open(mailtoLink);
        showToast('이메일 클라이언트를 통해 협업 제안을 보내주세요.', 'info');
        document.getElementById('collaboration-form').reset();
    }
}

// Profile management functions (admin only)
function showProfileEditModal() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    const modalHTML = `
        <div id="profile-edit-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="edit_profile">프로필 편집</h2>
                    <button class="modal-close" onclick="closeModal('profile-edit-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="profile-edit-form" onsubmit="handleProfileEdit(event)">
                        <div class="form-group">
                            <label for="profile-name-edit" data-i18n="name">이름</label>
                            <input type="text" id="profile-name-edit" 
                                   value="${document.getElementById('profile-name')?.textContent || 'Dr. [Your Name]'}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="profile-title-edit" data-i18n="title">직책</label>
                            <input type="text" id="profile-title-edit" 
                                   value="${document.getElementById('profile-title')?.textContent || 'AI Researcher & Data Scientist'}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="profile-bio-edit" data-i18n="bio">소개</label>
                            <textarea id="profile-bio-edit" rows="4" placeholder="자신에 대한 간단한 소개를 작성하세요...">${document.getElementById('about-text')?.textContent || ''}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                <span data-i18n="save">저장</span>
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('profile-edit-modal')">
                                <span data-i18n="cancel">취소</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('profile-edit-modal');
}

function showProfilePhotoModal() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    const modalHTML = `
        <div id="profile-photo-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="change_photo">프로필 사진 변경</h2>
                    <button class="modal-close" onclick="closeModal('profile-photo-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="photo-upload-section">
                        <div class="current-photo">
                            <img id="current-photo-preview" src="${document.getElementById('profile-img')?.src || 'https://via.placeholder.com/120'}" alt="Current Profile">
                            <p data-i18n="current_photo">현재 프로필 사진</p>
                        </div>
                        
                        <div class="photo-options">
                            <div class="form-group">
                                <label for="photo-url" data-i18n="photo_url">사진 URL</label>
                                <input type="url" id="photo-url" placeholder="https://example.com/photo.jpg">
                                <small data-i18n="photo_url_desc">온라인 이미지 URL을 입력하세요</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="photo-upload" data-i18n="upload_photo">파일 업로드</label>
                                <input type="file" id="photo-upload" accept="image/*" onchange="previewPhoto(event)">
                                <small data-i18n="upload_desc">JPG, PNG 파일을 선택하세요 (최대 2MB)</small>
                            </div>
                            
                            <div class="photo-preview" id="photo-preview" style="display: none;">
                                <img id="new-photo-preview" src="" alt="New Photo Preview">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-primary" onclick="saveProfilePhoto()">
                                <i class="fas fa-save"></i>
                                <span data-i18n="save_photo">사진 저장</span>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="deleteProfilePhoto()">
                                <i class="fas fa-trash"></i>
                                <span data-i18n="delete_photo">사진 삭제</span>
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('profile-photo-modal')">
                                <span data-i18n="cancel">취소</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('profile-photo-modal');
}

function handleProfileEdit(event) {
    event.preventDefault();
    
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    const name = document.getElementById('profile-name-edit').value.trim();
    const title = document.getElementById('profile-title-edit').value.trim();
    const bio = document.getElementById('profile-bio-edit').value.trim();
    
    // Update profile information
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const aboutText = document.getElementById('about-text');
    
    if (profileName) profileName.textContent = name;
    if (profileTitle) profileTitle.textContent = title;
    if (aboutText && bio) {
        aboutText.innerHTML = bio.split('\\n').map(p => `<p>${p}</p>`).join('');
    }
    
    // Save to localStorage
    localStorage.setItem('profile_data', JSON.stringify({
        name: name,
        title: title,
        bio: bio,
        updated: new Date().toISOString()
    }));
    
    showToast('프로필이 업데이트되었습니다.');
    closeModal('profile-edit-modal');
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
        showToast('파일 크기는 2MB 이하여야 합니다.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photo-preview');
        const img = document.getElementById('new-photo-preview');
        
        img.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function saveProfilePhoto() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    const photoUrl = document.getElementById('photo-url').value.trim();
    const photoFile = document.getElementById('photo-upload').files[0];
    
    let newPhotoSrc = null;
    
    if (photoUrl) {
        newPhotoSrc = photoUrl;
    } else if (photoFile) {
        // In a real implementation, you would upload to a service
        // For demo, we'll use the file reader result
        const preview = document.getElementById('new-photo-preview');
        if (preview && preview.src) {
            newPhotoSrc = preview.src;
        }
    }
    
    if (newPhotoSrc) {
        const profileImg = document.getElementById('profile-img');
        if (profileImg) {
            profileImg.src = newPhotoSrc;
            localStorage.setItem('profile_photo', newPhotoSrc);
            showToast('프로필 사진이 변경되었습니다.');
            closeModal('profile-photo-modal');
        }
    } else {
        showToast('사진을 선택하거나 URL을 입력해주세요.', 'error');
    }
}

function deleteProfilePhoto() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    if (confirm('프로필 사진을 삭제하시겠습니까?')) {
        const profileImg = document.getElementById('profile-img');
        if (profileImg) {
            profileImg.src = 'https://via.placeholder.com/120';
            localStorage.removeItem('profile_photo');
            showToast('프로필 사진이 삭제되었습니다.');
            closeModal('profile-photo-modal');
        }
    }
}

// Content management functions (admin only)
function editResearchInterests() {
    if (!AppState.isAdmin) return;
    
    showToast('연구 관심사 편집 기능이 곧 제공됩니다.', 'info');
}

function editEducation() {
    if (!AppState.isAdmin) return;
    
    showToast('학력 편집 기능이 곧 제공됩니다.', 'info');
}

function editProject(projectId) {
    if (!AppState.isAdmin) return;
    
    showToast('프로젝트 편집 기능이 곧 제공됩니다.', 'info');
}

function deleteProject(projectId) {
    if (!AppState.isAdmin) return;
    
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
        AppState.projects = AppState.projects.filter(p => p.id !== projectId);
        renderProjects();
        showToast('Project deleted.');
    }
}

function showAddProjectModal() {
    if (!AppState.isAdmin) return;
    showProjectModal(null);
}

function editProject(projectId) {
    if (!AppState.isAdmin) return;
    const project = AppState.projects.find(p => p.id === projectId);
    if (project) {
        showProjectModal(project);
    }
}

function showProjectModal(project) {
    const modalId = 'project-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const title = project ? 'Edit Project' : 'Add Project';
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="project-form" onsubmit="handleSaveProject(event, '${project?.id || ''}')">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="project-title" value="${project?.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="project-description" rows="3">${project?.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Technologies (comma-separated)</label>
                            <input type="text" id="project-tech" value="${project?.technologies.join(', ') || ''}">
                        </div>
                        <div class="form-group">
                            <label>Icon (Font Awesome)</label>
                            <input type="text" id="project-icon" value="${project?.icon || 'project-diagram'}">
                        </div>
                        <div class="form-group">
                            <label>GitHub Link</label>
                            <input type="url" id="project-github" value="${project?.links?.github || ''}">
                        </div>
                        <div class="form-group">
                            <label>Demo Link</label>
                            <input type="url" id="project-demo" value="${project?.links?.demo || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handleSaveProject(event, projectId) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const project = {
        id: projectId || `proj_${new Date().getTime()}`,
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        technologies: document.getElementById('project-tech').value.split(',').map(t => t.trim()),
        icon: document.getElementById('project-icon').value,
        links: {
            github: document.getElementById('project-github').value,
            demo: document.getElementById('project-demo').value,
        }
    };

    if (projectId) {
        // Edit existing
        const index = AppState.projects.findIndex(p => p.id === projectId);
        AppState.projects[index] = project;
    } else {
        // Add new
        AppState.projects.unshift(project);
    }

    renderProjects();
    closeModal('project-modal');
    showToast('Project saved successfully.');
}

function showAddAwardModal() {
    if (!AppState.isAdmin) return;
    
    showToast('수상 내역 추가 기능이 곧 제공됩니다.', 'info');
}

function showAddTimelineModal() {
    if (!AppState.isAdmin) return;
    
    showToast('타임라인 추가 기능이 곧 제공됩니다.', 'info');
}

// Admin UI visibility control
function updateAdminUI() {
    const adminElements = document.querySelectorAll('.admin-only');
    
    adminElements.forEach(element => {
        if (AppState.isAdmin) {
            element.classList.remove('hidden');
            element.style.display = '';
        } else {
            element.classList.add('hidden');
            element.style.display = 'none';
        }
    });
    
    // Update body class for admin mode
    if (AppState.isAdmin) {
        document.body.classList.add('admin-mode');
    } else {
        document.body.classList.remove('admin-mode');
    }
    
    console.log(`Admin UI updated - Admin: ${AppState.isAdmin}`);
}

// Add award management functions
function editAward(awardId) {
    if (!AppState.isAdmin) return;
    const award = AppState.awards.find(a => a.id === awardId);
    if (award) {
        showAwardModal(award);
    }
}

function deleteAward(awardId) {
    if (!AppState.isAdmin) return;
    
    if (confirm('이 수상 내역을 삭제하시겠습니까?')) {
        AppState.awards = AppState.awards.filter(award => award.id !== awardId);
        renderAwards();
        showToast('수상 내역이 삭제되었습니다.');
    }
}

function showAwardModal(award) {
    const modalId = 'award-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const title = award ? 'Edit Award' : 'Add Award';
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="award-form" onsubmit="handleSaveAward(event, '${award?.id || ''}')">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="award-title" value="${award?.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Organization</label>
                            <input type="text" id="award-organization" value="${award?.organization || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Year</label>
                            <input type="number" id="award-year" value="${award?.year || new Date().getFullYear()}" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="award-description" rows="3">${award?.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Icon (Font Awesome)</label>
                            <input type="text" id="award-icon" value="${award?.icon || 'trophy'}">
                            <small>e.g., trophy, medal, graduation-cap</small>
                        </div>
                        <div class="form-group">
                            <label>Link</label>
                            <input type="url" id="award-link" value="${award?.link || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handleSaveAward(event, awardId) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const award = {
        id: awardId || `award_${new Date().getTime()}`,
        title: document.getElementById('award-title').value,
        organization: document.getElementById('award-organization').value,
        year: parseInt(document.getElementById('award-year').value, 10),
        description: document.getElementById('award-description').value,
        icon: document.getElementById('award-icon').value,
        link: document.getElementById('award-link').value,
    };

    if (awardId) {
        // Edit existing
        const index = AppState.awards.findIndex(a => a.id === awardId);
        AppState.awards[index] = award;
    } else {
        // Add new
        AppState.awards.unshift(award);
    }

    renderAwards();
    closeModal('award-modal');
    showToast('Award saved successfully.');
}

// Timeline Management
function loadTimeline() {
    // Mock data for timeline
    AppState.timeline = [
        {
            id: 't1',
            year: '2024',
            title: 'Senior Researcher',
            description: 'Leading research in AI and Machine Learning at [Institution Name].',
            icon: 'briefcase'
        },
        {
            id: 't2',
            year: '2020',
            title: 'Ph.D. in Computer Science',
            description: 'Dissertation: "Advanced Neural Network Architectures" at [University Name].',
            icon: 'graduation-cap'
        },
        {
            id: 't3',
            year: '2016',
            title: 'M.S. in Computer Science',
            description: 'Specialization in Machine Learning at [University Name].',
            icon: 'university'
        }
    ];
    console.log('Timeline data loaded:', AppState.timeline);
}

function renderTimeline() {
    const timelineList = document.getElementById('timeline-list');
    if (!timelineList) return;

    if (AppState.timeline.length === 0) {
        timelineList.innerHTML = '<p class="no-data">No timeline events found.</p>';
        return;
    }

    const timelineHTML = AppState.timeline.map(event => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <i class="fas fa-${event.icon}"></i>
            </div>
            <div class="timeline-content">
                <span class="timeline-year">${event.year}</span>
                <h3 class="timeline-title">${event.title}</h3>
                <p>${event.description}</p>
                <div class="admin-controls admin-only hidden">
                    <button class="btn-small btn-primary" onclick="editTimeline('${event.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteTimeline('${event.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    timelineList.innerHTML = timelineHTML;
    updateAdminUI();
}

function editTimeline(eventId) {
    if (!AppState.isAdmin) return;
    showToast('타임라인 편집 기능이 곧 제공됩니다.', 'info');
}

function deleteTimeline(eventId) {
    if (!AppState.isAdmin) return;
    
    if (confirm('이 타임라인 이벤트를 삭제하시겠습니까?')) {
        AppState.timeline = AppState.timeline.filter(event => event.id !== eventId);
        renderTimeline();
        showToast('타임라인 이벤트가 삭제되었습니다.');
    }
} 