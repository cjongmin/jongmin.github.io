// Main application state
const AppState = {
    currentSection: 'about',
    currentLanguage: 'ko',
    currentTheme: 'light',
    isAdmin: false,
    user: null,
    publications: [],
    projects: [],
    awards: []
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
        signup: '회원가입'
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
        signup: 'Sign Up'
    }
};

// Section content templates
const sectionTemplates = {
    about: `
        <div class="section-header">
            <h1 data-i18n="about">About Me</h1>
            <button class="edit-btn admin-only hidden" onclick="editSection('about')">
                <i class="fas fa-edit"></i>
            </button>
        </div>
        
        <div class="about-content">
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
                        <a href="#" class="project-link"><i class="fab fa-github"></i> GitHub</a>
                        <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
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
                        <span class="tech-tag">PostgreSQL</span>
                        <span class="tech-tag">D3.js</span>
                        <span class="tech-tag">Docker</span>
                    </div>
                    <div class="project-links">
                        <a href="#" class="project-link"><i class="fab fa-github"></i> GitHub</a>
                        <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="projects-grid" class="projects-grid hidden">
            <!-- Dynamic projects will be loaded here -->
        </div>
    `,
    
    awards: `
        <div class="section-header">
            <h1 data-i18n="awards">Honors & Awards</h1>
            <button class="add-btn admin-only hidden" onclick="showAddAwardModal()">
                <i class="fas fa-plus"></i>
                <span data-i18n="add_award">Add Award</span>
            </button>
        </div>
        
        <div id="awards-list" class="awards-list">
            <!-- Awards will be loaded here -->
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
                    <span>your.email@university.edu</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>+82-10-1234-5678</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Seoul, South Korea</span>
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
    
    timeline: `
        <div class="section-header">
            <h1 data-i18n="timeline">Timeline</h1>
        </div>
        
        <div class="timeline-container">
            <div class="timeline-item">
                <div class="timeline-date">2024</div>
                <div class="timeline-content">
                    <h3>Current Position</h3>
                    <p>Senior Researcher at [Institution Name]</p>
                    <p>Leading research in AI and Machine Learning</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">2020</div>
                <div class="timeline-content">
                    <h3>Ph.D. in Computer Science</h3>
                    <p>[University Name]</p>
                    <p>Dissertation: "Advanced Neural Network Architectures"</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">2016</div>
                <div class="timeline-content">
                    <h3>M.S. in Computer Science</h3>
                    <p>[University Name]</p>
                    <p>Specialization in Machine Learning</p>
                </div>
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
    console.log('Initializing app...');
    
    // Load saved preferences
    loadPreferences();
    
    // Initialize theme
    applyTheme(AppState.currentTheme);
    
    // Initialize language
    updateLanguage();
    
    // Set up all event listeners
    setupNavigationEventListeners();
    setupHeaderEventListeners();
    setupMobileEventListeners();
    
    // Initialize AI assistant resize functionality
    initializeAIResize();
    
    // Show initial section
    showSection(AppState.currentSection);
    
    // Initialize Firebase
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
    
    // Load data
    loadAllData();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1000);
    
    console.log('App initialization complete');
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
        
        // Update language
        updateLanguage();
        
        // Load section-specific data
        loadSectionData(sectionName);
        
        // Update app state
        AppState.currentSection = sectionName;
        
        // Update URL
        window.history.pushState({section: sectionName}, '', `#${sectionName}`);
    }
}

function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'publications':
            loadPublications();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'awards':
            loadAwards();
            break;
        case 'feedback':
            loadFeedback();
            break;
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
                    <div class="login-options">
                        <button class="login-btn github" onclick="loginWithGitHub()">
                            <i class="fab fa-github"></i>
                            <span data-i18n="login_github">Login with GitHub</span>
                        </button>
                        <button class="login-btn google" onclick="loginWithGoogle()">
                            <i class="fab fa-google"></i>
                            <span data-i18n="login_google">Login with Google</span>
                        </button>
                    </div>
                    
                    <div class="login-divider">
                        <span data-i18n="or">또는</span>
                    </div>
                    
                    <form id="email-login-form" onsubmit="handleEmailLogin(event)">
                        <div class="form-group">
                            <label for="login-email" data-i18n="email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password" data-i18n="password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="submit-btn">
                            <span data-i18n="login">Login</span>
                        </button>
                    </form>
                    
                    <div class="signup-link">
                        <span data-i18n="no_account">계정이 없으신가요?</span>
                        <a href="#" onclick="showSignupModal()" data-i18n="signup">회원가입</a>
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
    updateStats();
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
            description: "Awarded for outstanding contribution to the field of machine learning."
        }
    ];
    
    AppState.awards = sampleAwards;
    renderAwards();
}

function renderAwards() {
    const awardsList = document.getElementById('awards-list');
    if (!awardsList) return;
    
    if (AppState.awards.length === 0) {
        awardsList.innerHTML = '<p class="no-data">No awards found.</p>';
        return;
    }
    
    const awardsHTML = AppState.awards.map(award => `
        <div class="award-card">
            <div class="award-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="award-content">
                <h3 class="award-title">${award.title}</h3>
                <div class="award-organization">${award.organization}</div>
                <div class="award-year">${award.year}</div>
                <p class="award-description">${award.description}</p>
            </div>
        </div>
    `).join('');
    
    awardsList.innerHTML = awardsHTML;
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
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };
    
    // Here you would typically send the data to your backend
    console.log('Contact form submitted:', formData);
    
    showToast('Message sent successfully!');
    event.target.reset();
}

function handleFeedbackForm(event) {
    event.preventDefault();
    
    const formData = {
        rating: document.querySelector('.rating-stars .active')?.dataset.rating || 0,
        comment: document.getElementById('feedback-comment').value
    };
    
    // Here you would typically save to Firebase
    console.log('Feedback submitted:', formData);
    
    showToast('Feedback submitted successfully!');
    event.target.reset();
    resetRating();
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
    document.querySelectorAll('.rating-stars i').forEach(star => {
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
    
    // Temporarily update the publications for rendering
    const originalPublications = AppState.publications;
    AppState.publications = publications;
    renderPublications();
    AppState.publications = originalPublications;
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