// Authentication module
import { getAuth, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const db = getFirestore(app);

// Admin email for special permissions
const ADMIN_EMAIL = 'cjmin2925@gmail.com';

// Function to check if a user is an admin
async function isAdmin(user) {
    if (!user || !user.email) return false;
    return user.email === ADMIN_EMAIL;
}

class AuthManager {
    constructor(ui) {
        this.ui = ui;
        this.setupEventListeners();
        this.checkAuthState();
    }

    checkAuthState() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User signed in:', user.displayName);
                this.ui.setLoggedIn(user.displayName);

                const userIsAdmin = await isAdmin(user);
                if (userIsAdmin) {
                    console.log("Welcome, Admin!");
                    window.isAdmin = true;
                    this.ui.showAdminFeatures();
                } else {
                    console.log("Welcome, User!");
                    window.isAdmin = false;
                    this.ui.hideAdminFeatures();
                }
            } else {
                console.log('User is signed out');
                this.ui.setLoggedOut();
                window.isAdmin = false;
                this.ui.hideAdminFeatures();
            }
        });
    }

    setupEventListeners() {
        const loginButton = document.getElementById('login-btn');
        const logoutButton = document.getElementById('logout-btn');

        loginButton.addEventListener('click', () => this.loginWithGoogle());
        logoutButton.addEventListener('click', () => this.logout());
    }

    loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Google login successful", result.user);
            })
            .catch((error) => {
                console.error("Google login error:", error);
            });
    }

    logout() {
        signOut(auth)
            .then(() => {
                console.log("Logout successful");
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    }
}

class UI {
    showAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'inline-block'; // or 'block' depending on element type
        });
        console.log("Admin features visible.");
    }

    hideAdminFeatures() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
        console.log("Admin features hidden.");
    }

    setLoggedIn(name) {
        const loginButton = document.getElementById('login-btn');
        const logoutButton = document.getElementById('logout-btn');
        const userNameSpan = document.getElementById('user-name');
        const adminPanelBtn = document.getElementById('admin-panel-btn');

        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        userNameSpan.textContent = name;
        userNameSpan.style.display = 'block';
        // The visibility of admin-panel-btn is now controlled by show/hideAdminFeatures
    }

    setLoggedOut() {
        const loginButton = document.getElementById('login-btn');
        const logoutButton = document.getElementById('logout-btn');
        const userNameSpan = document.getElementById('user-name');
        const adminPanelBtn = document.getElementById('admin-panel-btn');

        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        userNameSpan.textContent = '';
        userNameSpan.style.display = 'none';
        adminPanelBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const authManager = new AuthManager(ui);

    // Make instances available globally if needed for debugging or simple integrations
    window.ui = ui;
    window.authManager = authManager;
});

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

// 회원가입은 로그인과 동일하게 처리 (OAuth만 사용)
function createSignupModal() {
    showLoginModal(); // 로그인 모달과 동일
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