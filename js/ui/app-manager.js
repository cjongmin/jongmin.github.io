// 메인 애플리케이션 관리 모듈
class AppManager {
    constructor() {
        this.currentSection = 'about';
        this.isInitialized = false;
        this.sections = ['about', 'publications', 'projects', 'awards', 'timeline', 'contact', 'feedback', 'collaboration'];
        this.profileData = this.getDefaultProfileData();
        
        this.init();
    }

    // 애플리케이션 초기화
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    // 초기화 프로세스
    async initialize() {
        try {
            console.log('앱 초기화 시작...');
            
            // 로딩 화면 표시
            this.showLoading();
            
            // 프로필 데이터 로드
            await this.loadProfileData();
            
            // 네비게이션 이벤트 리스너 설정
            this.setupNavigation();
            
            // 기본 섹션 로드
            await this.showSection(this.currentSection);
            
            // 테마 및 언어 설정 로드
            this.loadUserPreferences();
            
            // 초기화 완료
            this.isInitialized = true;
            this.hideLoading();
            
            console.log('앱 초기화 완료');
            
        } catch (error) {
            console.error('앱 초기화 오류:', error);
            this.showError('애플리케이션을 초기화하는 중 오류가 발생했습니다.');
        }
    }

    // 프로필 데이터 로드
    async loadProfileData() {
        try {
            // localStorage에서 저장된 프로필 데이터 로드
            const savedData = localStorage.getItem('profileData');
            if (savedData) {
                this.profileData = { ...this.profileData, ...JSON.parse(savedData) };
            }
            
            // 프로필 UI 업데이트
            this.updateProfileUI();
            
        } catch (error) {
            console.warn('프로필 데이터 로드 오류:', error);
        }
    }

    // 기본 프로필 데이터
    getDefaultProfileData() {
        return {
            name: 'Dr. [Your Name]',
            title: 'AI Researcher & Data Scientist',
            bio: '인공지능과 데이터 사이언스 분야의 연구자입니다.',
            avatar: 'https://via.placeholder.com/120',
            email: '',
            phone: '',
            location: '',
            website: '',
            social: {
                scholar: '',
                github: '',
                linkedin: '',
                twitter: '',
                orcid: ''
            },
            research_interests: [
                'Machine Learning',
                'Deep Learning', 
                'Natural Language Processing',
                'Computer Vision'
            ],
            education: [
                {
                    degree: 'Ph.D. in Computer Science',
                    institution: 'University Name',
                    year: '2020',
                    description: ''
                }
            ],
            publications: [],
            projects: [],
            awards: [],
            timeline: []
        };
    }

    // 프로필 UI 업데이트
    updateProfileUI() {
        // 프로필 이름
        const nameElement = document.getElementById('profile-name');
        if (nameElement) {
            nameElement.textContent = this.profileData.name;
        }

        // 프로필 타이틀
        const titleElement = document.getElementById('profile-title');
        if (titleElement) {
            titleElement.textContent = this.profileData.title;
        }

        // 프로필 이미지
        const imgElement = document.getElementById('profile-img');
        if (imgElement) {
            imgElement.src = this.profileData.avatar;
        }

        // 통계 업데이트
        this.updateStats();
    }

    // 통계 업데이트
    updateStats() {
        const pubCount = document.getElementById('publications-count');
        const citCount = document.getElementById('citations-count');
        const hIndex = document.getElementById('h-index');
        const pubBadge = document.getElementById('pub-badge');

        if (pubCount) pubCount.textContent = this.profileData.publications.length;
        if (pubBadge) pubBadge.textContent = this.profileData.publications.length;
        
        // 인용 수와 H-index는 실제 데이터가 있을 때 계산
        if (citCount) citCount.textContent = '0';
        if (hIndex) hIndex.textContent = '0';
    }

    // 네비게이션 설정
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const section = href.substring(1);
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showSection(section);
                    });
                }
            }
        });
    }

    // 섹션 표시
    async showSection(sectionName) {
        if (!this.sections.includes(sectionName)) {
            console.warn('알 수 없는 섹션:', sectionName);
            return;
        }

        try {
            // 현재 섹션 업데이트
            this.currentSection = sectionName;
            
            // 네비게이션 활성 상태 업데이트
            this.updateNavigationState(sectionName);
            
            // 섹션 콘텐츠 로드
            const content = await this.getSectionContent(sectionName);
            
            // 메인 콘텐츠 영역에 표시
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
                
                // 섹션별 초기화 함수 호출
                await this.initializeSection(sectionName);
            }
            
        } catch (error) {
            console.error('섹션 로드 오류:', error);
            this.showError('섹션을 로드하는 중 오류가 발생했습니다.');
        }
    }

    // 네비게이션 상태 업데이트
    updateNavigationState(activeSection) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href === `#${activeSection}`) {
                    item.classList.add('active');
                }
            }
        });
    }

    // 섹션 콘텐츠 가져오기
    async getSectionContent(sectionName) {
        const templates = {
            about: this.getAboutTemplate(),
            publications: this.getPublicationsTemplate(),
            projects: this.getProjectsTemplate(),
            awards: this.getAwardsTemplate(),
            timeline: this.getTimelineTemplate(),
            contact: this.getContactTemplate(),
            feedback: this.getFeedbackTemplate(),
            collaboration: this.getCollaborationTemplate()
        };

        return templates[sectionName] || '<div>섹션을 찾을 수 없습니다.</div>';
    }

    // About 섹션 템플릿
    getAboutTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>About Me</h1>
                    <button class="admin-only edit-btn" onclick="window.appManager.editProfile()" title="프로필 편집">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
                
                <div class="about-content">
                    <div class="bio-section">
                        <h3>Biography</h3>
                        <p>${this.profileData.bio}</p>
                    </div>
                    
                    <div class="research-section">
                        <h3>Research Interests</h3>
                        <div class="tags">
                            ${this.profileData.research_interests.map(interest => 
                                `<span class="tag">${interest}</span>`
                            ).join('')}
                        </div>
                        <button class="admin-only edit-btn small" onclick="window.appManager.editResearchInterests()" title="연구 관심사 편집">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    
                    <div class="education-section">
                        <h3>Education</h3>
                        <div class="education-list">
                            ${this.profileData.education.map(edu => `
                                <div class="education-item">
                                    <h4>${edu.degree}</h4>
                                    <p class="institution">${edu.institution}</p>
                                    <p class="year">${edu.year}</p>
                                    ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        <button class="admin-only edit-btn small" onclick="window.appManager.editEducation()" title="학력 편집">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Publications 섹션 템플릿
    getPublicationsTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Publications</h1>
                    <button class="admin-only add-btn" onclick="window.dataManager.addPublication()" title="논문 추가">
                        <i class="fas fa-plus"></i> Add Publication
                    </button>
                </div>
                
                <div class="publications-content">
                    <div class="publications-filter">
                        <select id="pub-year-filter">
                            <option value="">All Years</option>
                        </select>
                        <select id="pub-type-filter">
                            <option value="">All Types</option>
                            <option value="journal">Journal</option>
                            <option value="conference">Conference</option>
                            <option value="preprint">Preprint</option>
                        </select>
                    </div>
                    
                    <div id="publications-list" class="publications-list">
                        ${this.renderPublications()}
                    </div>
                </div>
            </div>
        `;
    }

    // Projects 섹션 템플릿
    getProjectsTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Projects</h1>
                    <button class="admin-only add-btn" onclick="window.dataManager.addProject()" title="프로젝트 추가">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                </div>
                
                <div id="projects-grid" class="projects-grid">
                    ${this.renderProjects()}
                </div>
            </div>
        `;
    }

    // Awards 섹션 템플릿
    getAwardsTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Awards & Honors</h1>
                    <button class="admin-only add-btn" onclick="window.dataManager.addAward()" title="수상 추가">
                        <i class="fas fa-plus"></i> Add Award
                    </button>
                </div>
                
                <div id="awards-list" class="awards-list">
                    ${this.renderAwards()}
                </div>
            </div>
        `;
    }

    // Timeline 섹션 템플릿
    getTimelineTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Timeline</h1>
                    <button class="admin-only add-btn" onclick="window.dataManager.addTimelineEvent()" title="이벤트 추가">
                        <i class="fas fa-plus"></i> Add Event
                    </button>
                </div>
                
                <div id="timeline-container" class="timeline-container">
                    ${this.renderTimeline()}
                </div>
            </div>
        `;
    }

    // Contact 섹션 템플릿
    getContactTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Contact</h1>
                </div>
                
                <div class="contact-content">
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${this.profileData.email || 'email@example.com'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${this.profileData.phone || '+82-000-0000-0000'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${this.profileData.location || 'Seoul, South Korea'}</span>
                        </div>
                    </div>
                    
                    <div class="contact-form">
                        <h3>Send Message</h3>
                        <form id="contact-form" onsubmit="window.dataManager.handleContactForm(event)">
                            <div class="form-group">
                                <label for="contact-name">Name</label>
                                <input type="text" id="contact-name" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email</label>
                                <input type="email" id="contact-email" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-subject">Subject</label>
                                <input type="text" id="contact-subject" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-message">Message</label>
                                <textarea id="contact-message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // Feedback 섹션 템플릿
    getFeedbackTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Feedback</h1>
                </div>
                
                <div class="feedback-content">
                    <div class="feedback-form">
                        <h3>Share Your Feedback</h3>
                        <form id="feedback-form" onsubmit="window.dataManager.handleFeedbackForm(event)">
                            <div class="rating-section">
                                <label>Rating:</label>
                                <div class="star-rating">
                                    <span class="star" data-rating="1">★</span>
                                    <span class="star" data-rating="2">★</span>
                                    <span class="star" data-rating="3">★</span>
                                    <span class="star" data-rating="4">★</span>
                                    <span class="star" data-rating="5">★</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="feedback-category">Category</label>
                                <select id="feedback-category" required>
                                    <option value="">Select Category</option>
                                    <option value="research">Research</option>
                                    <option value="collaboration">Collaboration</option>
                                    <option value="website">Website</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="feedback-message">Message</label>
                                <textarea id="feedback-message" rows="4" required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-comments"></i> Submit Feedback
                            </button>
                        </form>
                    </div>
                    
                    <div class="feedback-list">
                        <h3>Recent Feedback</h3>
                        <div id="feedback-items">
                            <!-- 피드백 목록이 여기에 로드됩니다 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Collaboration 섹션 템플릿
    getCollaborationTemplate() {
        return `
            <div class="section-content">
                <div class="section-header">
                    <h1>Collaboration</h1>
                </div>
                
                <div class="collaboration-content">
                    <div class="collaboration-intro">
                        <h3>Let's Work Together</h3>
                        <p>I'm always interested in new collaboration opportunities, research partnerships, and academic discussions.</p>
                    </div>
                    
                    <div class="collaboration-areas">
                        <h3>Collaboration Areas</h3>
                        <div class="areas-grid">
                            <div class="area-card">
                                <i class="fas fa-flask"></i>
                                <h4>Research Projects</h4>
                                <p>Joint research in AI and ML</p>
                            </div>
                            <div class="area-card">
                                <i class="fas fa-users"></i>
                                <h4>Academic Partnerships</h4>
                                <p>University collaborations</p>
                            </div>
                            <div class="area-card">
                                <i class="fas fa-industry"></i>
                                <h4>Industry Projects</h4>
                                <p>Applied research solutions</p>
                            </div>
                            <div class="area-card">
                                <i class="fas fa-graduation-cap"></i>
                                <h4>Student Supervision</h4>
                                <p>PhD and Master's guidance</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="collaboration-form">
                        <h3>Propose Collaboration</h3>
                        <form id="collaboration-form" onsubmit="window.dataManager.handleCollaborationForm(event)">
                            <div class="form-group">
                                <label for="collab-type">Collaboration Type</label>
                                <select id="collab-type" required>
                                    <option value="">Select Type</option>
                                    <option value="research">Research Project</option>
                                    <option value="academic">Academic Partnership</option>
                                    <option value="industry">Industry Collaboration</option>
                                    <option value="supervision">Student Supervision</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="collab-title">Project Title</label>
                                <input type="text" id="collab-title" required>
                            </div>
                            <div class="form-group">
                                <label for="collab-description">Description</label>
                                <textarea id="collab-description" rows="5" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="collab-duration">Expected Duration</label>
                                <select id="collab-duration">
                                    <option value="">Select Duration</option>
                                    <option value="1-3 months">1-3 months</option>
                                    <option value="3-6 months">3-6 months</option>
                                    <option value="6-12 months">6-12 months</option>
                                    <option value="1+ years">1+ years</option>
                                </select>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-handshake"></i> Submit Proposal
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    // 섹션별 초기화
    async initializeSection(sectionName) {
        switch (sectionName) {
            case 'feedback':
                this.initializeFeedbackSection();
                break;
            case 'publications':
                this.initializePublicationsSection();
                break;
            // 다른 섹션들도 필요에 따라 추가
        }
    }

    // 피드백 섹션 초기화
    initializeFeedbackSection() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.setStarRating(rating);
            });
        });
    }

    // 별점 설정
    setStarRating(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // 선택된 별점 저장
        this.selectedRating = rating;
    }

    // Publications 섹션 초기화
    initializePublicationsSection() {
        // 필터 이벤트 리스너 설정
        const yearFilter = document.getElementById('pub-year-filter');
        const typeFilter = document.getElementById('pub-type-filter');
        
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.filterPublications());
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterPublications());
        }
    }

    // Publications 렌더링
    renderPublications() {
        if (this.profileData.publications.length === 0) {
            return '<div class="empty-state">No publications yet.</div>';
        }
        
        return this.profileData.publications.map(pub => `
            <div class="publication-item">
                <h4>${pub.title}</h4>
                <p class="authors">${pub.authors}</p>
                <p class="venue">${pub.venue}, ${pub.year}</p>
                ${pub.abstract ? `<p class="abstract">${pub.abstract}</p>` : ''}
                <div class="publication-links">
                    ${pub.pdf ? `<a href="${pub.pdf}" target="_blank"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                    ${pub.code ? `<a href="${pub.code}" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
                <div class="admin-only publication-controls">
                    <button onclick="window.dataManager.editPublication('${pub.id}')" title="편집">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="window.dataManager.deletePublication('${pub.id}')" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Projects 렌더링
    renderProjects() {
        if (this.profileData.projects.length === 0) {
            return '<div class="empty-state">No projects yet.</div>';
        }
        
        return this.profileData.projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <h3>${project.title}</h3>
                    <span class="project-status ${project.status}">${project.status}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="project-links">
                    ${project.demo ? `<a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    ${project.code ? `<a href="${project.code}" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
                <div class="admin-only project-controls">
                    <button onclick="window.dataManager.editProject('${project.id}')" title="편집">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="window.dataManager.deleteProject('${project.id}')" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Awards 렌더링
    renderAwards() {
        if (this.profileData.awards.length === 0) {
            return '<div class="empty-state">No awards yet.</div>';
        }
        
        return this.profileData.awards.map(award => `
            <div class="award-item">
                <div class="award-header">
                    <h4>${award.title}</h4>
                    <span class="award-year">${award.year}</span>
                </div>
                <p class="award-organization">${award.organization}</p>
                ${award.description ? `<p class="award-description">${award.description}</p>` : ''}
                <div class="admin-only award-controls">
                    <button onclick="window.dataManager.editAward('${award.id}')" title="편집">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="window.dataManager.deleteAward('${award.id}')" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Timeline 렌더링
    renderTimeline() {
        if (this.profileData.timeline.length === 0) {
            return '<div class="empty-state">No timeline events yet.</div>';
        }
        
        const sortedEvents = this.profileData.timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return sortedEvents.map(event => `
            <div class="timeline-item">
                <div class="timeline-date">${event.date}</div>
                <div class="timeline-content">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <div class="admin-only timeline-controls">
                        <button onclick="window.dataManager.editTimelineEvent('${event.id}')" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.dataManager.deleteTimelineEvent('${event.id}')" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 사용자 환경설정 로드
    loadUserPreferences() {
        // 테마 설정
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // 언어 설정
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            this.setLanguage(savedLang);
        }
    }

    // 언어 설정
    setLanguage(lang) {
        // 언어 설정 로직 구현
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('language', lang);
    }

    // 로딩 화면 표시
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    // 로딩 화면 숨기기
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    // 오류 표시
    showError(message) {
        if (window.authUI) {
            window.authUI.showToast(message, 'error');
        } else {
            console.error(message);
        }
    }

    // 프로필 편집
    editProfile() {
        if (window.dataManager) {
            window.dataManager.showProfileEditModal();
        }
    }

    // 연구 관심사 편집
    editResearchInterests() {
        if (window.dataManager) {
            window.dataManager.showResearchInterestsModal();
        }
    }

    // 학력 편집
    editEducation() {
        if (window.dataManager) {
            window.dataManager.showEducationModal();
        }
    }
}

// 전역 AppManager 인스턴스 생성
window.appManager = new AppManager();

// 전역 함수들
window.showSection = function(sectionName) {
    return window.appManager.showSection(sectionName);
}; 