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
    timeline: [],
    profileData: null,
    
    // 테스트용 관리자 로그인 함수
    testAdminLogin() {
        console.log('Test admin login activated');
        this.isAdmin = true;
        updateAdminUI();
        showToast('관리자 모드로 로그인되었습니다 (테스트)', 'success');
    },
    
    // 로그아웃 함수
    logout() {
        console.log('Logging out');
        this.isAdmin = false;
        updateAdminUI();
        showToast('로그아웃되었습니다', 'info');
    }
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
            <div id="projects-grid" class="projects-grid">
                <!-- Projects will be loaded here with admin controls -->
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

async function initializeApp() {
    console.log('Initializing application...');
    
    // 로딩 화면 표시
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }

    // Firebase 초기화 시도 (시간 초과 기능 포함)
    await initializeFirebase();
    
    // 기본 설정 및 데이터 로드
    loadPreferences();
    loadSavedProfileData();
    loadAllData();
    
    // 네비게이션 및 이벤트 리스너 설정
    setupNavigationEventListeners();
    setupHeaderEventListeners();
    setupMobileEventListeners();
    
    // 초기 섹션 표시
    showSection('about');
    
    // 로딩 화면 숨기기
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500); // Fade-out transition
        }, 200); // 약간의 딜레이를 주어 콘텐츠가 렌더링될 시간을 확보
    }
    
    console.log(`Application initialized. Firebase Enabled: ${isFirebaseEnabled}, Mock Mode: ${isMockMode}`);
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
        const savedProfile = localStorage.getItem('profileData');
        if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            console.log('Loading saved profile data:', profileData);
            
            // 프로필 데이터를 DOM에 적용
            updateProfileInDOM(profileData);
            
            // AppState에도 저장
            AppState.profileData = profileData;
        } else {
            console.log('No saved profile data found');
        }
    } catch (error) {
        console.error('Error loading saved profile data:', error);
    }
}

function updateProfileInDOM(profileData) {
    // 헤더 프로필 정보 업데이트
    const profileName = document.querySelector('.profile-name');
    const profileTitle = document.querySelector('.profile-title');
    const profileBio = document.querySelector('.profile-bio');
    
    if (profileName && profileData.name) {
        profileName.textContent = profileData.name;
    }
    
    if (profileTitle && profileData.title) {
        profileTitle.textContent = profileData.title;
    }
    
    if (profileBio && profileData.bio) {
        profileBio.textContent = profileData.bio;
    }
    
    // About 섹션의 모든 프로필 요소 업데이트
    const aboutNameElements = document.querySelectorAll('.about-name, h1[data-i18n="name"]');
    const aboutTitleElements = document.querySelectorAll('.about-title, .current-position');
    const aboutBioElements = document.querySelectorAll('.about-bio, .bio-content');
    
    aboutNameElements.forEach(el => {
        if (profileData.name) el.textContent = profileData.name;
    });
    
    aboutTitleElements.forEach(el => {
        if (profileData.title) el.textContent = profileData.title;
    });
    
    aboutBioElements.forEach(el => {
        if (profileData.bio) el.textContent = profileData.bio;
    });
    
    // 연구 관심사 업데이트
    if (profileData.research_interests) {
        const researchSection = document.querySelector('.research-interests-content, .interests-list');
        if (researchSection) {
            if (Array.isArray(profileData.research_interests)) {
                researchSection.innerHTML = profileData.research_interests
                    .map(interest => `<span class="interest-tag">${interest}</span>`)
                    .join('');
            } else {
                researchSection.textContent = profileData.research_interests;
            }
        }
    }
    
    // 학력 정보 업데이트
    if (profileData.education) {
        const educationSection = document.querySelector('.education-content, .education-list');
        if (educationSection) {
            if (Array.isArray(profileData.education)) {
                educationSection.innerHTML = profileData.education
                    .map(edu => `<div class="education-item">
                        <h4>${edu.degree}</h4>
                        <p>${edu.institution} (${edu.year})</p>
                    </div>`)
                    .join('');
            } else {
                educationSection.textContent = profileData.education;
            }
        }
    }
    
    console.log('Profile data applied to DOM');
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

    const publicationsHTML = AppState.publications.map(pub => {
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
                <img src="${project.image || 'https://via.placeholder.com/300x200'}" alt="${project.title}">
                <div class="project-status status-${project.status?.toLowerCase() || 'active'}">${project.status || 'Active'}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${(project.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.links?.github ? `<a href="${project.links.github}" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${project.links?.demo ? `<a href="${project.links.demo}" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
                <div class="admin-controls admin-only hidden">
                    <button class="btn-small btn-primary" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    projectsGrid.innerHTML = projectsHTML;
    updateAdminUI();
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
    
    const rating = document.querySelector('.rating-stars .active')?.dataset?.rating || 0;
    const comment = document.getElementById('feedback-comment').value?.trim() || '';
    
    if (!rating) {
        showToast('평점을 선택해주세요.', 'error');
        return;
    }
    
    // 사용자 정보 가져오기 (로그인된 경우 Firebase, 아니면 기본값)
    let userName = 'Anonymous';
    let userEmail = '';
    let userId = `anonymous_${Date.now()}`;
    
    if (typeof auth !== 'undefined' && auth.currentUser) {
        userName = auth.currentUser.displayName || auth.currentUser.email || 'Logged User';
        userEmail = auth.currentUser.email || '';
        userId = auth.currentUser.uid;
    } else {
        // 로그인하지 않은 경우에도 피드백 허용
        userName = 'Anonymous User';
    }
    
    const feedbackData = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        rating: parseInt(rating),
        comment: comment,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    
    console.log('Saving feedback:', feedbackData);
    
    // localStorage에 피드백 저장
    try {
        let savedFeedbacks = [];
        const existingFeedbacks = localStorage.getItem('feedbacks');
        if (existingFeedbacks) {
            savedFeedbacks = JSON.parse(existingFeedbacks);
        }
        
        savedFeedbacks.unshift(feedbackData); // 최신 피드백을 앞에 추가
        
        // 최대 50개의 피드백만 보관
        if (savedFeedbacks.length > 50) {
            savedFeedbacks = savedFeedbacks.slice(0, 50);
        }
        
        localStorage.setItem('feedbacks', JSON.stringify(savedFeedbacks));
        console.log('Feedback saved to localStorage');
        
        // Firebase에도 저장 시도 (가능한 경우)
        if (typeof db !== 'undefined' && db) {
            db.collection('feedback').add(feedbackData)
                .then(() => {
                    console.log('Feedback also saved to Firebase');
                })
                .catch((error) => {
                    console.log('Firebase save failed, but localStorage save succeeded:', error);
                });
        }
        
        // 성공 메시지 및 폼 리셋
        showToast('피드백이 성공적으로 등록되었습니다!', 'success');
        document.getElementById('feedback-form').reset();
        resetRating();
        loadFeedback(); // 피드백 목록 새로고침
        
    } catch (error) {
        console.error('Error saving feedback:', error);
        showToast('피드백 저장에 실패했습니다. 다시 시도해주세요.', 'error');
    }
}

// Load feedback from localStorage (and Firebase if available)
async function loadFeedback() {
    try {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;
        
        let allFeedbacks = [];
        
        // localStorage에서 피드백 로드
        try {
            const savedFeedbacks = localStorage.getItem('feedbacks');
            if (savedFeedbacks) {
                const localFeedbacks = JSON.parse(savedFeedbacks);
                allFeedbacks = [...localFeedbacks];
                console.log('Loaded feedbacks from localStorage:', localFeedbacks.length);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        
        // Firebase에서도 로드 시도 (가능한 경우)
        if (typeof db !== 'undefined' && db) {
            try {
                const snapshot = await db.collection('feedback')
                    .orderBy('timestamp', 'desc')
                    .limit(20)
                    .get();
                
                const firebaseFeedbacks = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        createdAt: data.timestamp ? data.timestamp.toDate().toISOString() : data.createdAt
                    };
                });
                
                // Firebase 피드백과 localStorage 피드백 병합 (중복 제거)
                const combinedFeedbacks = [...allFeedbacks];
                firebaseFeedbacks.forEach(fbFeedback => {
                    if (!combinedFeedbacks.find(f => f.id === fbFeedback.id)) {
                        combinedFeedbacks.push(fbFeedback);
                    }
                });
                
                allFeedbacks = combinedFeedbacks;
                console.log('Combined feedbacks from Firebase and localStorage:', allFeedbacks.length);
            } catch (error) {
                console.log('Firebase loading failed, using localStorage only:', error);
            }
        }
        
        // 날짜순으로 정렬
        allFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (allFeedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="no-feedback">아직 피드백이 없습니다. 첫 번째 피드백을 남겨주세요!</p>';
            return;
        }
        
        const feedbackHTML = allFeedbacks.slice(0, 10).map(feedback => {
            const createdAt = new Date(feedback.createdAt);
            
            return `
                <div class="feedback-item">
                    <div class="feedback-header">
                        <div class="feedback-user">
                            <strong>${feedback.userName}</strong>
                        </div>
                        <div class="feedback-rating">
                            ${generateStarRating(feedback.rating)}
                        </div>
                    </div>
                    <div class="feedback-time">${formatDate(createdAt)}</div>
                    <div class="feedback-comment">${feedback.comment || '(코멘트 없음)'}</div>
                </div>
            `;
        }).join('');
        
        feedbackList.innerHTML = feedbackHTML;
        console.log('Feedback list rendered with', allFeedbacks.length, 'items');
        
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
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Language toggle  
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // AI Panel toggle
    const aiToggle = document.getElementById('ai-toggle');
    if (aiToggle) {
        aiToggle.addEventListener('click', toggleAIPanel);
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Search functionality to be implemented
            console.log('Search:', e.target.value);
        });
    }

    // Login/Logout button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (AppState.isLoggedIn) {
                // Logout functionality
                if (typeof auth !== 'undefined' && auth.currentUser) {
                    auth.signOut();
                }
            } else {
                showLoginModal();
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Feedback form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackForm);
    }
    
    // 별점 클릭 이벤트 설정
    const ratingStars = document.querySelectorAll('.rating-stars i');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            setRating(index + 1);
            star.dataset.rating = index + 1;
            // 클릭된 별에 active 표시
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            ratingStars.forEach(s => s.classList.remove('hover'));
        });
    });

    // Collaboration form
    const collaborationForm = document.getElementById('collaboration-form');
    if (collaborationForm) {
        collaborationForm.addEventListener('submit', handleCollaborationForm);
    }

    // Publication search and filter
    const pubSearch = document.getElementById('pub-search');
    const pubFilter = document.getElementById('pub-filter');
    
    if (pubSearch) {
        pubSearch.addEventListener('input', filterPublications);
    }
    
    if (pubFilter) {
        pubFilter.addEventListener('change', filterPublications);
    }
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
    
    // 기존 저장된 데이터 가져오기
    const currentProfile = AppState.profileData || {};
    
    const modalId = 'profile-edit-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>프로필 편집</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="profile-edit-form" onsubmit="handleProfileEdit(event)">
                        <div class="form-group">
                            <label for="edit-name">이름</label>
                            <input type="text" id="edit-name" value="${currentProfile.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-title">직책/직함</label>
                            <input type="text" id="edit-title" value="${currentProfile.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-bio">소개</label>
                            <textarea id="edit-bio" rows="4" required>${currentProfile.bio || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-research-interests">연구 관심사</label>
                            <textarea id="edit-research-interests" rows="3" placeholder="연구 관심사를 입력하세요">${currentProfile.research_interests || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-education">학력</label>
                            <textarea id="edit-education" rows="4" placeholder="학력 정보를 입력하세요">${currentProfile.education || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">저장</button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('${modalId}')">취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
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
    if (!AppState.isAdmin) return;

    const profileData = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        bio: document.getElementById('edit-bio').value,
        research_interests: document.getElementById('edit-research-interests').value,
        education: document.getElementById('edit-education').value
    };
    
    console.log('Saving profile data:', profileData);
    
    // localStorage에 저장
    try {
        localStorage.setItem('profileData', JSON.stringify(profileData));
        console.log('Profile data saved to localStorage');
    } catch (error) {
        console.error('Error saving profile data:', error);
        showToast('프로필 저장 중 오류가 발생했습니다.', 'error');
        return;
    }
    
    // DOM에 즉시 적용
    updateProfileInDOM(profileData);
    
    // AppState 업데이트
    AppState.profileData = profileData;
    
    // 모달 닫기
    closeModal('profile-edit-modal');
    
    // 성공 메시지
    showToast('프로필이 성공적으로 저장되었습니다!', 'success');
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
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    // 현재 저장된 데이터 가져오기
    const currentData = AppState.profileData?.research_interests || '';
    
    const modalId = 'research-interests-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>연구 관심사 편집</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="research-interests-form" onsubmit="handleSaveResearchInterests(event)">
                        <div class="form-group">
                            <label>연구 관심사</label>
                            <textarea id="research-interests-input" rows="6" placeholder="연구 관심사를 입력하세요. 여러 항목은 쉼표로 구분하세요.">${currentData}</textarea>
                            <small>예: Machine Learning, Natural Language Processing, Computer Vision</small>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">저장</button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('${modalId}')">취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handleSaveResearchInterests(event) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const researchInterests = document.getElementById('research-interests-input').value.trim();
    
    // 현재 프로필 데이터 가져오기 또는 초기화
    const currentProfile = AppState.profileData || {};
    
    // 연구 관심사 업데이트
    currentProfile.research_interests = researchInterests;
    
    // AppState와 localStorage에 저장
    AppState.profileData = currentProfile;
    localStorage.setItem('profileData', JSON.stringify(currentProfile));
    
    // DOM 업데이트
    updateProfileInDOM(currentProfile);
    
    closeModal('research-interests-modal');
    showToast('연구 관심사가 성공적으로 저장되었습니다!', 'success');
}

function editEducation() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    
    // 현재 저장된 데이터 가져오기
    const currentData = AppState.profileData?.education || '';
    
    const modalId = 'education-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>학력 편집</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="education-form" onsubmit="handleSaveEducation(event)">
                        <div class="form-group">
                            <label>학력 정보</label>
                            <textarea id="education-input" rows="8" placeholder="학력 정보를 입력하세요. 각 학위는 새 줄로 구분하세요.">${currentData}</textarea>
                            <small>예:<br/>
                            Ph.D. in Computer Science, KAIST (2020)<br/>
                            M.S. in Computer Science, Seoul National University (2016)<br/>
                            B.S. in Computer Science, Yonsei University (2014)
                            </small>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">저장</button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('${modalId}')">취소</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handleSaveEducation(event) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const education = document.getElementById('education-input').value.trim();
    
    // 현재 프로필 데이터 가져오기 또는 초기화
    const currentProfile = AppState.profileData || {};
    
    // 학력 정보 업데이트
    currentProfile.education = education;
    
    // AppState와 localStorage에 저장
    AppState.profileData = currentProfile;
    localStorage.setItem('profileData', JSON.stringify(currentProfile));
    
    // DOM 업데이트
    updateProfileInDOM(currentProfile);
    
    closeModal('education-modal');
    showToast('학력 정보가 성공적으로 저장되었습니다!', 'success');
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
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    showAwardModal(null);
}

function showAddTimelineModal() {
    if (!AppState.isAdmin) {
        showToast('관리자만 접근할 수 있습니다.', 'error');
        return;
    }
    showTimelineModal(null);
}

function showTimelineModal(event) {
    const modalId = 'timeline-modal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const title = event ? 'Edit Timeline Event' : 'Add Timeline Event';
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="timeline-form" onsubmit="handleSaveTimeline(event, '${event?.id || ''}')">
                        <div class="form-group">
                            <label>Year</label>
                            <input type="text" id="timeline-year" value="${event?.year || new Date().getFullYear()}" required>
                        </div>
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="timeline-title" value="${event?.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="timeline-description" rows="3" required>${event?.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Icon (Font Awesome)</label>
                            <input type="text" id="timeline-icon" value="${event?.icon || 'calendar'}">
                            <small>e.g., briefcase, graduation-cap, university, trophy</small>
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

function handleSaveTimeline(event, eventId) {
    event.preventDefault();
    if (!AppState.isAdmin) return;

    const timelineEvent = {
        id: eventId || `timeline_${new Date().getTime()}`,
        year: document.getElementById('timeline-year').value,
        title: document.getElementById('timeline-title').value,
        description: document.getElementById('timeline-description').value,
        icon: document.getElementById('timeline-icon').value,
    };

    if (eventId) {
        // Edit existing
        const index = AppState.timeline.findIndex(t => t.id === eventId);
        AppState.timeline[index] = timelineEvent;
    } else {
        // Add new
        AppState.timeline.unshift(timelineEvent);
    }

    renderTimeline();
    closeModal('timeline-modal');
    showToast('Timeline event saved successfully.');
}

function editTimeline(eventId) {
    if (!AppState.isAdmin) return;
    const event = AppState.timeline.find(t => t.id === eventId);
    if (event) {
        showTimelineModal(event);
    }
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
    const event = AppState.timeline.find(t => t.id === eventId);
    if (event) {
        showTimelineModal(event);
    }
}

function deleteTimeline(eventId) {
    if (!AppState.isAdmin) return;
    
    if (confirm('이 타임라인 이벤트를 삭제하시겠습니까?')) {
        AppState.timeline = AppState.timeline.filter(event => event.id !== eventId);
        renderTimeline();
        showToast('타임라인 이벤트가 삭제되었습니다.');
    }
} 