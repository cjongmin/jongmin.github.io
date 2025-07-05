// 데이터 관리 모듈
class DataManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // 데이터 매니저 초기화
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.isInitialized = true;
        console.log('데이터 매니저 초기화 완료');
    }

    // 프로필 편집 모달 표시
    showProfileEditModal() {
        const currentData = window.appManager.profileData;
        
        const modalHTML = `
            <div id="profile-edit-modal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>프로필 편집</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('profile-edit-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="profile-edit-form" onsubmit="window.dataManager.handleProfileSave(event)">
                            <div class="form-group">
                                <label for="edit-name">이름</label>
                                <input type="text" id="edit-name" value="${currentData.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-title">직책/전공</label>
                                <input type="text" id="edit-title" value="${currentData.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-bio">소개</label>
                                <textarea id="edit-bio" rows="4" required>${currentData.bio}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="edit-avatar">프로필 이미지 URL</label>
                                <input type="url" id="edit-avatar" value="${currentData.avatar}">
                            </div>
                            <div class="form-group">
                                <label for="edit-email">이메일</label>
                                <input type="email" id="edit-email" value="${currentData.email}">
                            </div>
                            <div class="form-group">
                                <label for="edit-phone">전화번호</label>
                                <input type="tel" id="edit-phone" value="${currentData.phone}">
                            </div>
                            <div class="form-group">
                                <label for="edit-location">위치</label>
                                <input type="text" id="edit-location" value="${currentData.location}">
                            </div>
                            <div class="form-group">
                                <label for="edit-website">웹사이트</label>
                                <input type="url" id="edit-website" value="${currentData.website}">
                            </div>
                            
                            <h3>소셜 링크</h3>
                            <div class="form-group">
                                <label for="edit-scholar">Google Scholar</label>
                                <input type="url" id="edit-scholar" value="${currentData.social.scholar}">
                            </div>
                            <div class="form-group">
                                <label for="edit-github">GitHub</label>
                                <input type="url" id="edit-github" value="${currentData.social.github}">
                            </div>
                            <div class="form-group">
                                <label for="edit-linkedin">LinkedIn</label>
                                <input type="url" id="edit-linkedin" value="${currentData.social.linkedin}">
                            </div>
                            <div class="form-group">
                                <label for="edit-twitter">Twitter</label>
                                <input type="url" id="edit-twitter" value="${currentData.social.twitter}">
                            </div>
                            <div class="form-group">
                                <label for="edit-orcid">ORCID</label>
                                <input type="url" id="edit-orcid" value="${currentData.social.orcid}">
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('profile-edit-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 프로필 저장 처리
    handleProfileSave(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const updatedData = {
            name: document.getElementById('edit-name').value,
            title: document.getElementById('edit-title').value,
            bio: document.getElementById('edit-bio').value,
            avatar: document.getElementById('edit-avatar').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            location: document.getElementById('edit-location').value,
            website: document.getElementById('edit-website').value,
            social: {
                scholar: document.getElementById('edit-scholar').value,
                github: document.getElementById('edit-github').value,
                linkedin: document.getElementById('edit-linkedin').value,
                twitter: document.getElementById('edit-twitter').value,
                orcid: document.getElementById('edit-orcid').value
            }
        };
        
        // 기존 데이터와 병합
        window.appManager.profileData = { ...window.appManager.profileData, ...updatedData };
        
        // localStorage에 저장
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        // UI 업데이트
        window.appManager.updateProfileUI();
        
        // 현재 섹션이 about이면 다시 로드
        if (window.appManager.currentSection === 'about') {
            window.appManager.showSection('about');
        }
        
        // 모달 닫기
        window.authUI.closeModal('profile-edit-modal');
        window.authUI.showToast('프로필이 저장되었습니다.', 'success');
    }

    // 연구 관심사 편집 모달
    showResearchInterestsModal() {
        const currentInterests = window.appManager.profileData.research_interests;
        
        const modalHTML = `
            <div id="research-interests-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>연구 관심사 편집</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('research-interests-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="research-interests-form" onsubmit="window.dataManager.handleResearchInterestsSave(event)">
                            <div class="form-group">
                                <label for="research-interests">연구 관심사 (쉼표로 구분)</label>
                                <textarea id="research-interests" rows="4" placeholder="Machine Learning, Deep Learning, NLP...">${currentInterests.join(', ')}</textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('research-interests-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 연구 관심사 저장
    handleResearchInterestsSave(event) {
        event.preventDefault();
        
        const interestsText = document.getElementById('research-interests').value;
        const interests = interestsText.split(',').map(item => item.trim()).filter(item => item);
        
        window.appManager.profileData.research_interests = interests;
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        if (window.appManager.currentSection === 'about') {
            window.appManager.showSection('about');
        }
        
        window.authUI.closeModal('research-interests-modal');
        window.authUI.showToast('연구 관심사가 저장되었습니다.', 'success');
    }

    // 학력 편집 모달
    showEducationModal() {
        const currentEducation = window.appManager.profileData.education;
        
        const modalHTML = `
            <div id="education-modal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>학력 편집</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('education-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="education-form" onsubmit="window.dataManager.handleEducationSave(event)">
                            <div id="education-items">
                                ${currentEducation.map((edu, index) => `
                                    <div class="education-item" data-index="${index}">
                                        <h4>학력 ${index + 1}</h4>
                                        <div class="form-group">
                                            <label>학위</label>
                                            <input type="text" name="degree-${index}" value="${edu.degree}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>기관</label>
                                            <input type="text" name="institution-${index}" value="${edu.institution}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>년도</label>
                                            <input type="text" name="year-${index}" value="${edu.year}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>설명</label>
                                            <textarea name="description-${index}" rows="2">${edu.description || ''}</textarea>
                                        </div>
                                        <button type="button" onclick="window.dataManager.removeEducationItem(${index})" class="btn danger small">삭제</button>
                                    </div>
                                `).join('')}
                            </div>
                            <button type="button" onclick="window.dataManager.addEducationItem()" class="btn secondary">학력 추가</button>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('education-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 학력 항목 추가
    addEducationItem() {
        const container = document.getElementById('education-items');
        const index = container.children.length;
        
        const itemHTML = `
            <div class="education-item" data-index="${index}">
                <h4>학력 ${index + 1}</h4>
                <div class="form-group">
                    <label>학위</label>
                    <input type="text" name="degree-${index}" required>
                </div>
                <div class="form-group">
                    <label>기관</label>
                    <input type="text" name="institution-${index}" required>
                </div>
                <div class="form-group">
                    <label>년도</label>
                    <input type="text" name="year-${index}" required>
                </div>
                <div class="form-group">
                    <label>설명</label>
                    <textarea name="description-${index}" rows="2"></textarea>
                </div>
                <button type="button" onclick="window.dataManager.removeEducationItem(${index})" class="btn danger small">삭제</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
    }

    // 학력 항목 제거
    removeEducationItem(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.remove();
        }
    }

    // 학력 저장
    handleEducationSave(event) {
        event.preventDefault();
        
        const educationItems = document.querySelectorAll('.education-item');
        const education = [];
        
        educationItems.forEach((item, index) => {
            const degree = item.querySelector(`[name="degree-${index}"]`)?.value;
            const institution = item.querySelector(`[name="institution-${index}"]`)?.value;
            const year = item.querySelector(`[name="year-${index}"]`)?.value;
            const description = item.querySelector(`[name="description-${index}"]`)?.value;
            
            if (degree && institution && year) {
                education.push({
                    degree,
                    institution,
                    year,
                    description: description || ''
                });
            }
        });
        
        window.appManager.profileData.education = education;
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        if (window.appManager.currentSection === 'about') {
            window.appManager.showSection('about');
        }
        
        window.authUI.closeModal('education-modal');
        window.authUI.showToast('학력이 저장되었습니다.', 'success');
    }

    // 논문 추가
    addPublication() {
        const modalHTML = `
            <div id="publication-add-modal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>논문 추가</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('publication-add-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="publication-add-form" onsubmit="window.dataManager.handlePublicationSave(event)">
                            <div class="form-group">
                                <label for="pub-title">제목</label>
                                <input type="text" id="pub-title" required>
                            </div>
                            <div class="form-group">
                                <label for="pub-authors">저자</label>
                                <input type="text" id="pub-authors" required>
                            </div>
                            <div class="form-group">
                                <label for="pub-venue">출판지</label>
                                <input type="text" id="pub-venue" required>
                            </div>
                            <div class="form-group">
                                <label for="pub-year">년도</label>
                                <input type="number" id="pub-year" min="1900" max="2030" required>
                            </div>
                            <div class="form-group">
                                <label for="pub-type">유형</label>
                                <select id="pub-type" required>
                                    <option value="">선택하세요</option>
                                    <option value="journal">저널</option>
                                    <option value="conference">컨퍼런스</option>
                                    <option value="preprint">프리프린트</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="pub-abstract">초록</label>
                                <textarea id="pub-abstract" rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="pub-pdf">PDF URL</label>
                                <input type="url" id="pub-pdf">
                            </div>
                            <div class="form-group">
                                <label for="pub-code">코드 URL</label>
                                <input type="url" id="pub-code">
                            </div>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('publication-add-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 논문 저장
    handlePublicationSave(event) {
        event.preventDefault();
        
        const publication = {
            id: Date.now().toString(),
            title: document.getElementById('pub-title').value,
            authors: document.getElementById('pub-authors').value,
            venue: document.getElementById('pub-venue').value,
            year: document.getElementById('pub-year').value,
            type: document.getElementById('pub-type').value,
            abstract: document.getElementById('pub-abstract').value,
            pdf: document.getElementById('pub-pdf').value,
            code: document.getElementById('pub-code').value
        };
        
        window.appManager.profileData.publications.push(publication);
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        window.appManager.updateStats();
        
        if (window.appManager.currentSection === 'publications') {
            window.appManager.showSection('publications');
        }
        
        window.authUI.closeModal('publication-add-modal');
        window.authUI.showToast('논문이 추가되었습니다.', 'success');
    }

    // 프로젝트 추가
    addProject() {
        const modalHTML = `
            <div id="project-add-modal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>프로젝트 추가</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('project-add-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="project-add-form" onsubmit="window.dataManager.handleProjectSave(event)">
                            <div class="form-group">
                                <label for="project-title">제목</label>
                                <input type="text" id="project-title" required>
                            </div>
                            <div class="form-group">
                                <label for="project-description">설명</label>
                                <textarea id="project-description" rows="4" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="project-status">상태</label>
                                <select id="project-status" required>
                                    <option value="">선택하세요</option>
                                    <option value="ongoing">진행중</option>
                                    <option value="completed">완료</option>
                                    <option value="paused">중단</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="project-tags">태그 (쉼표로 구분)</label>
                                <input type="text" id="project-tags" placeholder="Python, ML, Django">
                            </div>
                            <div class="form-group">
                                <label for="project-demo">데모 URL</label>
                                <input type="url" id="project-demo">
                            </div>
                            <div class="form-group">
                                <label for="project-code">코드 URL</label>
                                <input type="url" id="project-code">
                            </div>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('project-add-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 프로젝트 저장
    handleProjectSave(event) {
        event.preventDefault();
        
        const tagsText = document.getElementById('project-tags').value;
        const tags = tagsText ? tagsText.split(',').map(tag => tag.trim()) : [];
        
        const project = {
            id: Date.now().toString(),
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            status: document.getElementById('project-status').value,
            tags: tags,
            demo: document.getElementById('project-demo').value,
            code: document.getElementById('project-code').value
        };
        
        window.appManager.profileData.projects.push(project);
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        if (window.appManager.currentSection === 'projects') {
            window.appManager.showSection('projects');
        }
        
        window.authUI.closeModal('project-add-modal');
        window.authUI.showToast('프로젝트가 추가되었습니다.', 'success');
    }

    // 수상 추가
    addAward() {
        const modalHTML = `
            <div id="award-add-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>수상 추가</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('award-add-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="award-add-form" onsubmit="window.dataManager.handleAwardSave(event)">
                            <div class="form-group">
                                <label for="award-title">수상명</label>
                                <input type="text" id="award-title" required>
                            </div>
                            <div class="form-group">
                                <label for="award-organization">수여기관</label>
                                <input type="text" id="award-organization" required>
                            </div>
                            <div class="form-group">
                                <label for="award-year">년도</label>
                                <input type="number" id="award-year" min="1900" max="2030" required>
                            </div>
                            <div class="form-group">
                                <label for="award-description">설명</label>
                                <textarea id="award-description" rows="3"></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('award-add-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 수상 저장
    handleAwardSave(event) {
        event.preventDefault();
        
        const award = {
            id: Date.now().toString(),
            title: document.getElementById('award-title').value,
            organization: document.getElementById('award-organization').value,
            year: document.getElementById('award-year').value,
            description: document.getElementById('award-description').value
        };
        
        window.appManager.profileData.awards.push(award);
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        if (window.appManager.currentSection === 'awards') {
            window.appManager.showSection('awards');
        }
        
        window.authUI.closeModal('award-add-modal');
        window.authUI.showToast('수상이 추가되었습니다.', 'success');
    }

    // 타임라인 이벤트 추가
    addTimelineEvent() {
        const modalHTML = `
            <div id="timeline-add-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>타임라인 이벤트 추가</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('timeline-add-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="timeline-add-form" onsubmit="window.dataManager.handleTimelineEventSave(event)">
                            <div class="form-group">
                                <label for="timeline-title">제목</label>
                                <input type="text" id="timeline-title" required>
                            </div>
                            <div class="form-group">
                                <label for="timeline-date">날짜</label>
                                <input type="date" id="timeline-date" required>
                            </div>
                            <div class="form-group">
                                <label for="timeline-description">설명</label>
                                <textarea id="timeline-description" rows="3" required></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('timeline-add-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // 타임라인 이벤트 저장
    handleTimelineEventSave(event) {
        event.preventDefault();
        
        const timelineEvent = {
            id: Date.now().toString(),
            title: document.getElementById('timeline-title').value,
            date: document.getElementById('timeline-date').value,
            description: document.getElementById('timeline-description').value
        };
        
        window.appManager.profileData.timeline.push(timelineEvent);
        localStorage.setItem('profileData', JSON.stringify(window.appManager.profileData));
        
        if (window.appManager.currentSection === 'timeline') {
            window.appManager.showSection('timeline');
        }
        
        window.authUI.closeModal('timeline-add-modal');
        window.authUI.showToast('타임라인 이벤트가 추가되었습니다.', 'success');
    }

    // 연락처 폼 처리
    handleContactForm(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            timestamp: new Date().toISOString()
        };
        
        // localStorage에 연락처 메시지 저장
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(formData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        // 폼 초기화
        event.target.reset();
        
        window.authUI.showToast('메시지가 전송되었습니다.', 'success');
    }

    // 피드백 폼 처리
    handleFeedbackForm(event) {
        event.preventDefault();
        
        const rating = window.appManager.selectedRating || 0;
        if (rating === 0) {
            window.authUI.showToast('별점을 선택해주세요.', 'warning');
            return;
        }
        
        const formData = {
            rating: rating,
            category: document.getElementById('feedback-category').value,
            message: document.getElementById('feedback-message').value,
            timestamp: new Date().toISOString()
        };
        
        // localStorage에 피드백 저장
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(formData);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        // 폼 초기화
        event.target.reset();
        window.appManager.selectedRating = 0;
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        
        window.authUI.showToast('피드백이 제출되었습니다.', 'success');
    }

    // 협업 제안 폼 처리
    handleCollaborationForm(event) {
        event.preventDefault();
        
        const formData = {
            type: document.getElementById('collab-type').value,
            title: document.getElementById('collab-title').value,
            description: document.getElementById('collab-description').value,
            duration: document.getElementById('collab-duration').value,
            timestamp: new Date().toISOString()
        };
        
        // localStorage에 협업 제안 저장
        const collaborations = JSON.parse(localStorage.getItem('collaborations') || '[]');
        collaborations.push(formData);
        localStorage.setItem('collaborations', JSON.stringify(collaborations));
        
        // 폼 초기화
        event.target.reset();
        
        window.authUI.showToast('협업 제안이 제출되었습니다.', 'success');
    }
}

// 전역 DataManager 인스턴스 생성
window.dataManager = new DataManager(); 