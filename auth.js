// Authentication module
class AuthManager {
    constructor() {
        this.providers = {
            github: new firebase.auth.GithubAuthProvider(),
            google: new firebase.auth.GoogleAuthProvider()
        };
        
        this.setupProviders();
    }
    
    setupProviders() {
        // Configure GitHub provider
        this.providers.github.addScope('user:email');
        this.providers.github.addScope('read:user');
        
        // Configure Google provider
        this.providers.google.addScope('profile');
        this.providers.google.addScope('email');
    }
    
    async signInWithGitHub() {
        try {
            const result = await auth.signInWithPopup(this.providers.github);
            const user = result.user;
            
            console.log('GitHub sign-in successful:', user.email);
            
            // Track the login event
            trackInteraction('login', { method: 'github' });
            
            // Close login modal if open
            closeModal('login-modal');
            
            showToast('GitHub 로그인 성공!');
            
            return result;
        } catch (error) {
            console.error('GitHub sign-in error:', error);
            this.handleAuthError(error);
            throw error;
        }
    }
    
    async signInWithGoogle() {
        try {
            const result = await auth.signInWithPopup(this.providers.google);
            const user = result.user;
            
            console.log('Google sign-in successful:', user.email);
            
            // Track the login event
            trackInteraction('login', { method: 'google' });
            
            // Close login modal if open
            closeModal('login-modal');
            
            showToast('Google 로그인 성공!');
            
            return result;
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.handleAuthError(error);
            throw error;
        }
    }
    
    async signInWithEmail(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const user = result.user;
            
            console.log('Email sign-in successful:', user.email);
            
            // Track the login event
            trackInteraction('login', { method: 'email' });
            
            // Close login modal if open
            closeModal('login-modal');
            
            showToast('이메일 로그인 성공!');
            
            return result;
        } catch (error) {
            console.error('Email sign-in error:', error);
            this.handleAuthError(error);
            throw error;
        }
    }
    
    async signUpWithEmail(email, password, displayName) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            const user = result.user;
            
            // Update user profile
            if (displayName) {
                await user.updateProfile({
                    displayName: displayName
                });
            }
            
            console.log('Email sign-up successful:', user.email);
            
            // Track the signup event
            trackInteraction('signup', { method: 'email' });
            
            showToast('회원가입 성공!');
            
            return result;
        } catch (error) {
            console.error('Email sign-up error:', error);
            this.handleAuthError(error);
            throw error;
        }
    }
    
    async signOut() {
        try {
            await auth.signOut();
            
            console.log('User signed out');
            
            // Track the logout event
            trackInteraction('logout');
            
            showToast('로그아웃되었습니다.');
            
        } catch (error) {
            console.error('Sign-out error:', error);
            showToast('로그아웃 중 오류가 발생했습니다.', 'error');
        }
    }
    
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            
            console.log('Password reset email sent to:', email);
            showToast('비밀번호 재설정 이메일이 발송되었습니다.');
            
        } catch (error) {
            console.error('Password reset error:', error);
            this.handleAuthError(error);
            throw error;
        }
    }
    
    handleAuthError(error) {
        let message = '';
        
        switch (error.code) {
            case 'auth/user-not-found':
                message = '존재하지 않는 사용자입니다.';
                break;
            case 'auth/wrong-password':
                message = '잘못된 비밀번호입니다.';
                break;
            case 'auth/email-already-in-use':
                message = '이미 사용 중인 이메일입니다.';
                break;
            case 'auth/weak-password':
                message = '비밀번호가 너무 약합니다. (최소 6자 이상)';
                break;
            case 'auth/invalid-email':
                message = '유효하지 않은 이메일 주소입니다.';
                break;
            case 'auth/popup-closed-by-user':
                message = '로그인 창이 닫혔습니다.';
                break;
            case 'auth/popup-blocked':
                message = '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.';
                break;
            case 'auth/cancelled-popup-request':
                message = '로그인 요청이 취소되었습니다.';
                break;
            case 'auth/network-request-failed':
                message = '네트워크 연결을 확인해주세요.';
                break;
            case 'auth/too-many-requests':
                message = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
                break;
            default:
                message = '로그인 중 오류가 발생했습니다.';
                console.error('Auth error details:', error);
        }
        
        showToast(message, 'error');
    }
    
    getCurrentUser() {
        return auth.currentUser;
    }
    
    isSignedIn() {
        return !!auth.currentUser;
    }
    
    async updateUserProfile(profileData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user signed in');
            
            await user.updateProfile(profileData);
            
            // Update Firestore user document
            if (db) {
                await db.collection('users').doc(user.uid).update({
                    ...profileData,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('User profile updated successfully');
            showToast('프로필이 업데이트되었습니다.');
            
        } catch (error) {
            console.error('Profile update error:', error);
            showToast('프로필 업데이트 중 오류가 발생했습니다.', 'error');
            throw error;
        }
    }
    
    async saveUserPreferences(preferences) {
        try {
            const user = auth.currentUser;
            if (!user || !db) return;
            
            await db.collection('users').doc(user.uid).update({
                preferences: preferences,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('User preferences saved');
            
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }
}

// Initialize AuthManager
const authManager = new AuthManager();

// Login functions for global use
function loginWithGitHub() {
    authManager.signInWithGitHub().catch(error => {
        // Error already handled in AuthManager
    });
}

function loginWithGoogle() {
    authManager.signInWithGoogle().catch(error => {
        // Error already handled in AuthManager
    });
}

function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    authManager.signInWithEmail(email, password).catch(error => {
        // Error already handled in AuthManager
    });
}

function logout() {
    authManager.signOut();
}

function showSignupModal() {
    closeModal('login-modal');
    createSignupModal();
}

function createSignupModal() {
    const modalHTML = `
        <div id="signup-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="signup">Sign Up</h2>
                    <button class="modal-close" onclick="closeModal('signup-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="login-options">
                        <button class="login-btn github" onclick="loginWithGitHub()">
                            <i class="fab fa-github"></i>
                            <span data-i18n="signup_github">Sign up with GitHub</span>
                        </button>
                        <button class="login-btn google" onclick="loginWithGoogle()">
                            <i class="fab fa-google"></i>
                            <span data-i18n="signup_google">Sign up with Google</span>
                        </button>
                    </div>
                    
                    <div class="login-divider">
                        <span data-i18n="or">또는</span>
                    </div>
                    
                    <form id="email-signup-form" onsubmit="handleEmailSignup(event)">
                        <div class="form-group">
                            <label for="signup-name" data-i18n="name">Name</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email" data-i18n="email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password" data-i18n="password">Password</label>
                            <input type="password" id="signup-password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm-password" data-i18n="confirm_password">Confirm Password</label>
                            <input type="password" id="signup-confirm-password" required minlength="6">
                        </div>
                        <button type="submit" class="submit-btn">
                            <span data-i18n="signup">Sign Up</span>
                        </button>
                    </form>
                    
                    <div class="signup-link">
                        <span data-i18n="have_account">이미 계정이 있으신가요?</span>
                        <a href="#" onclick="showLoginModal()" data-i18n="login">로그인</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing signup modal if any
    const existingModal = document.getElementById('signup-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('signup-modal');
}

function handleEmailSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (password !== confirmPassword) {
        showToast('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    authManager.signUpWithEmail(email, password, name).then(() => {
        closeModal('signup-modal');
    }).catch(error => {
        // Error already handled in AuthManager
    });
}

function showForgotPasswordModal() {
    const modalHTML = `
        <div id="forgot-password-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="forgot_password">Forgot Password</h2>
                    <button class="modal-close" onclick="closeModal('forgot-password-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p data-i18n="forgot_password_desc">비밀번호 재설정 링크를 이메일로 보내드립니다.</p>
                    
                    <form id="forgot-password-form" onsubmit="handleForgotPassword(event)">
                        <div class="form-group">
                            <label for="forgot-email" data-i18n="email">Email</label>
                            <input type="email" id="forgot-email" required>
                        </div>
                        <button type="submit" class="submit-btn">
                            <span data-i18n="send_reset_link">Send Reset Link</span>
                        </button>
                    </form>
                    
                    <div class="signup-link">
                        <a href="#" onclick="showLoginModal()" data-i18n="back_to_login">로그인으로 돌아가기</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('forgot-password-modal');
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    authManager.resetPassword(email).then(() => {
        closeModal('forgot-password-modal');
    }).catch(error => {
        // Error already handled in AuthManager
    });
}

function showAdminPanel() {
    if (!AppState.isAdmin) {
        showToast('관리자 권한이 필요합니다.', 'error');
        return;
    }
    
    createAdminPanelModal();
}

function createAdminPanelModal() {
    const modalHTML = `
        <div id="admin-panel-modal" class="modal">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2 data-i18n="admin_panel">Admin Panel</h2>
                    <button class="modal-close" onclick="closeModal('admin-panel-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="admin-tabs">
                        <button class="admin-tab active" onclick="showAdminTab('content')">
                            <i class="fas fa-edit"></i> Content Management
                        </button>
                        <button class="admin-tab" onclick="showAdminTab('users')">
                            <i class="fas fa-users"></i> User Management
                        </button>
                        <button class="admin-tab" onclick="showAdminTab('analytics')">
                            <i class="fas fa-chart-bar"></i> Analytics
                        </button>
                        <button class="admin-tab" onclick="showAdminTab('settings')">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                    </div>
                    
                    <div id="admin-content" class="admin-tab-content">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('admin-panel-modal');
    showAdminTab('content');
}

function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showAdminTab('${tabName}')"]`).classList.add('active');
    
    // Load tab content
    const contentDiv = document.getElementById('admin-content');
    
    switch (tabName) {
        case 'content':
            loadContentManagement(contentDiv);
            break;
        case 'users':
            loadUserManagement(contentDiv);
            break;
        case 'analytics':
            loadAnalyticsDashboard(contentDiv);
            break;
        case 'settings':
            loadSettingsPanel(contentDiv);
            break;
    }
}

function loadContentManagement(container) {
    container.innerHTML = `
        <div class="admin-section">
            <h3>Content Management</h3>
            <div class="admin-actions">
                <button class="btn btn-primary" onclick="showAddPublicationModal()">
                    <i class="fas fa-plus"></i> Add Publication
                </button>
                <button class="btn btn-primary" onclick="showAddProjectModal()">
                    <i class="fas fa-plus"></i> Add Project
                </button>
                <button class="btn btn-secondary" onclick="exportData()">
                    <i class="fas fa-download"></i> Export Data
                </button>
                <button class="btn btn-secondary" onclick="showImportModal()">
                    <i class="fas fa-upload"></i> Import Data
                </button>
            </div>
            
            <div class="data-summary">
                <div class="summary-card">
                    <h4>Publications</h4>
                    <span class="summary-count">${AppState.publications.length}</span>
                </div>
                <div class="summary-card">
                    <h4>Projects</h4>
                    <span class="summary-count">${AppState.projects.length}</span>
                </div>
                <div class="summary-card">
                    <h4>Awards</h4>
                    <span class="summary-count">${AppState.awards.length}</span>
                </div>
            </div>
        </div>
    `;
}

function showSettings() {
    createSettingsModal();
}

function createSettingsModal() {
    const modalHTML = `
        <div id="settings-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="settings">Settings</h2>
                    <button class="modal-close" onclick="closeModal('settings-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h3 data-i18n="preferences">Preferences</h3>
                        
                        <div class="form-group">
                            <label data-i18n="theme">Theme</label>
                            <select id="settings-theme" onchange="changeThemeSetting()">
                                <option value="light" data-i18n="light_theme">Light</option>
                                <option value="dark" data-i18n="dark_theme">Dark</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label data-i18n="language">Language</label>
                            <select id="settings-language" onchange="changeLanguageSetting()">
                                <option value="ko" data-i18n="korean">한국어</option>
                                <option value="en" data-i18n="english">English</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3 data-i18n="account">Account</h3>
                        
                        <div class="form-group">
                            <label data-i18n="display_name">Display Name</label>
                            <input type="text" id="settings-display-name" value="${AppState.user?.displayName || ''}">
                        </div>
                        
                        <button class="btn btn-primary" onclick="saveSettings()">
                            <i class="fas fa-save"></i>
                            <span data-i18n="save_settings">Save Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    
    // Set current values
    document.getElementById('settings-theme').value = AppState.currentTheme;
    document.getElementById('settings-language').value = AppState.currentLanguage;
    
    showModal('settings-modal');
}

function changeThemeSetting() {
    const theme = document.getElementById('settings-theme').value;
    AppState.currentTheme = theme;
    applyTheme(theme);
}

function changeLanguageSetting() {
    const language = document.getElementById('settings-language').value;
    AppState.currentLanguage = language;
    updateLanguage();
}

function saveSettings() {
    const displayName = document.getElementById('settings-display-name').value;
    
    // Save to localStorage
    localStorage.setItem('theme', AppState.currentTheme);
    localStorage.setItem('language', AppState.currentLanguage);
    
    // Save user preferences to Firebase if logged in
    if (AppState.user) {
        const preferences = {
            theme: AppState.currentTheme,
            language: AppState.currentLanguage
        };
        
        authManager.saveUserPreferences(preferences);
        
        // Update display name if changed
        if (displayName !== AppState.user.displayName) {
            authManager.updateUserProfile({ displayName: displayName });
        }
    }
    
    showToast('설정이 저장되었습니다.');
    closeModal('settings-modal');
}

// Export functions for global use
window.loginWithGitHub = loginWithGitHub;
window.loginWithGoogle = loginWithGoogle;
window.handleEmailLogin = handleEmailLogin;
window.logout = logout;
window.showSignupModal = showSignupModal;
window.handleEmailSignup = handleEmailSignup;
window.showForgotPasswordModal = showForgotPasswordModal;
window.handleForgotPassword = handleForgotPassword;
window.showAdminPanel = showAdminPanel;
window.showSettings = showSettings;
window.authManager = authManager; 