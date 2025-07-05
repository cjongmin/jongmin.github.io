// 인증 UI 관리 모듈
class AuthUI {
    constructor() {
        this.elements = {
            loginBtn: null,
            userMenu: null,
            userAvatar: null,
            userName: null,
            adminPanelBtn: null
        };
        
        this.isInitialized = false;
        this.init();
    }

    // UI 요소 초기화
    init() {
        // DOM 로드 완료 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }

    // UI 요소 참조 설정
    initializeElements() {
        this.elements.loginBtn = document.getElementById('login-btn');
        this.elements.userMenu = document.getElementById('user-menu');
        this.elements.userAvatar = document.getElementById('user-avatar');
        this.elements.adminPanelBtn = document.querySelector('[onclick="showAdminPanel()"]');
        
        // Firebase 인증 상태 변경 감지
        if (window.firebaseManager) {
            window.firebaseManager.onAuthStateChanged((user) => {
                this.updateAuthUI(user);
            });
        }
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        this.isInitialized = true;
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 로그인 버튼 클릭
        if (this.elements.loginBtn) {
            this.elements.loginBtn.addEventListener('click', () => {
                this.showLoginModal();
            });
        }

        // 사용자 메뉴 토글
        if (this.elements.userAvatar) {
            this.elements.userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // 클릭 외부 영역에서 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (this.elements.userMenu && !this.elements.userMenu.contains(e.target)) {
                this.closeUserMenu();
            }
        });
    }

    // 인증 UI 업데이트
    updateAuthUI(user) {
        if (user) {
            this.setLoggedInState(user);
            
            // 관리자 권한 확인
            const isAdmin = window.firebaseManager ? window.firebaseManager.isAdmin(user) : false;
            this.updateAdminUI(isAdmin);
        } else {
            this.setLoggedOutState();
            this.updateAdminUI(false);
        }
    }

    // 로그인 상태 UI 설정
    setLoggedInState(user) {
        if (this.elements.loginBtn) {
            this.elements.loginBtn.style.display = 'none';
        }
        
        if (this.elements.userMenu) {
            this.elements.userMenu.classList.remove('hidden');
        }
        
        if (this.elements.userAvatar) {
            this.elements.userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            this.elements.userAvatar.alt = user.displayName || user.email || 'User';
        }

        // 사용자 이름 표시 (다른 위치에 있을 수 있음)
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = user.displayName || user.email || '사용자';
        });

        this.showToast(`${user.displayName || user.email}님 환영합니다!`, 'success');
    }

    // 로그아웃 상태 UI 설정
    setLoggedOutState() {
        if (this.elements.loginBtn) {
            this.elements.loginBtn.style.display = 'block';
        }
        
        if (this.elements.userMenu) {
            this.elements.userMenu.classList.add('hidden');
        }

        // 사용자 이름 숨기기
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = '';
        });
    }

    // 관리자 UI 업데이트
    updateAdminUI(isAdmin) {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        
        adminOnlyElements.forEach(el => {
            if (isAdmin) {
                el.style.display = el.dataset.originalDisplay || 'block';
                el.classList.add('admin-visible');
            } else {
                if (!el.dataset.originalDisplay) {
                    el.dataset.originalDisplay = window.getComputedStyle(el).display;
                }
                el.style.display = 'none';
                el.classList.remove('admin-visible');
            }
        });

        // 관리자 패널 버튼
        if (this.elements.adminPanelBtn) {
            this.elements.adminPanelBtn.style.display = isAdmin ? 'block' : 'none';
        }

        console.log(isAdmin ? '관리자 UI 활성화' : '관리자 UI 비활성화');
    }

    // 사용자 메뉴 토글
    toggleUserMenu() {
        if (!this.elements.userMenu) return;
        
        const dropdown = this.elements.userMenu.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    // 사용자 메뉴 닫기
    closeUserMenu() {
        if (!this.elements.userMenu) return;
        
        const dropdown = this.elements.userMenu.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    // 로그인 모달 표시
    showLoginModal() {
        const modalHTML = `
            <div id="login-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>로그인</h2>
                        <button class="modal-close" onclick="this.closeModal('login-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="auth-methods">
                            <button class="auth-btn google" onclick="this.handleGoogleLogin()">
                                <i class="fab fa-google"></i>
                                <span>Google로 로그인</span>
                            </button>
                            <button class="auth-btn github" onclick="this.handleGitHubLogin()">
                                <i class="fab fa-github"></i>
                                <span>GitHub로 로그인</span>
                            </button>
                        </div>
                        
                        <div class="divider">
                            <span>또는</span>
                        </div>
                        
                        <form id="email-login-form" onsubmit="this.handleEmailLogin(event)">
                            <div class="form-group">
                                <label for="login-email">이메일</label>
                                <input type="email" id="login-email" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">비밀번호</label>
                                <input type="password" id="login-password" required>
                            </div>
                            <button type="submit" class="auth-btn primary">
                                <i class="fas fa-envelope"></i>
                                <span>이메일로 로그인</span>
                            </button>
                        </form>
                        
                        <div class="auth-footer">
                            <p>계정이 없으신가요? <a href="#" onclick="this.showSignupModal()">회원가입</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalHTML);
    }

    // Google 로그인 처리
    async handleGoogleLogin() {
        try {
            await window.firebaseManager.loginWithGoogle();
            this.closeModal('login-modal');
        } catch (error) {
            this.showToast('Google 로그인에 실패했습니다: ' + error.message, 'error');
        }
    }

    // GitHub 로그인 처리
    async handleGitHubLogin() {
        try {
            await window.firebaseManager.loginWithGitHub();
            this.closeModal('login-modal');
        } catch (error) {
            this.showToast('GitHub 로그인에 실패했습니다: ' + error.message, 'error');
        }
    }

    // 이메일 로그인 처리
    async handleEmailLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            await window.firebaseManager.loginWithEmail(email, password);
            this.closeModal('login-modal');
        } catch (error) {
            this.showToast('이메일 로그인에 실패했습니다: ' + error.message, 'error');
        }
    }

    // 로그아웃 처리
    async handleLogout() {
        try {
            await window.firebaseManager.logout();
            this.showToast('로그아웃되었습니다.', 'info');
        } catch (error) {
            this.showToast('로그아웃에 실패했습니다: ' + error.message, 'error');
        }
    }

    // 모달 표시
    showModal(html) {
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }
        
        modalContainer.innerHTML = html;
        modalContainer.style.display = 'block';
    }

    // 모달 닫기
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
        
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer && !modalContainer.hasChildNodes()) {
            modalContainer.style.display = 'none';
        }
    }

    // 토스트 메시지 표시
    showToast(message, type = 'info') {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.toast.show');
        if (existingToast) {
            existingToast.remove();
        }

        // 새 토스트 생성
        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.innerHTML = `
            <i class="fas ${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 토스트 아이콘 가져오기
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// 전역 AuthUI 인스턴스 생성
window.authUI = new AuthUI();

// 전역 함수들을 AuthUI와 연결
window.showLoginModal = function() {
    window.authUI.showLoginModal();
};

window.logout = function() {
    window.authUI.handleLogout();
};

window.handleGoogleLogin = function() {
    return window.authUI.handleGoogleLogin();
};

window.handleGitHubLogin = function() {
    return window.authUI.handleGitHubLogin();
};

window.handleEmailLogin = function(event) {
    return window.authUI.handleEmailLogin(event);
}; 