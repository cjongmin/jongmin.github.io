// Firebase configuration - Set to your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCNybLoW5J1o7oj7fz0zCQGmuC9DpCCVpI",
    authDomain: "research-profile-8ee9b.firebaseapp.com",
    projectId: "research-profile-8ee9b",
    storageBucket: "research-profile-8ee9b.firebasestorage.app",
    messagingSenderId: "108930331185",
    appId: "1:108930331185:web:ec6dc184c1ef342416db10",
    measurementId: "G-BGW23T7ZV5"
};

// Global variables
let app, auth, db;
let isFirebaseEnabled = false;
let isMockMode = false;

// Check if we have valid Firebase config
function hasValidFirebaseConfig() {
    return firebaseConfig.apiKey && 
           firebaseConfig.projectId && 
           firebaseConfig.apiKey !== "your-api-key";
}

// Initialize Firebase
function initializeFirebase() {
    return new Promise((resolve) => {
        // Firebase 초기화가 5초 이상 걸리면 오프라인 모드로 강제 전환
        const initTimeout = setTimeout(() => {
            console.warn('Firebase initialization timed out. Forcing mock mode.');
            initializeMockMode();
            resolve(false); // 초기화 실패로 간주
        }, 5000);

        try {
            if (hasValidFirebaseConfig() && typeof firebase !== 'undefined') {
                console.log('Initializing Firebase with real config...');
                
                app = firebase.initializeApp(firebaseConfig);
                auth = firebase.auth();
                db = firebase.firestore();
                
                isFirebaseEnabled = true;
                isMockMode = false;
                
                console.log('Firebase initialized successfully');
                
                // Firestore 설정
                configureFirestore().then(() => {
                    // 인증 상태 감시자 설정
                    setupAuthStateObserver();
                    clearTimeout(initTimeout);
                    resolve(true); // 초기화 성공
                }).catch(err => {
                    console.error("Firestore configuration failed", err);
                    clearTimeout(initTimeout);
                    initializeMockMode();
                    resolve(false);
                });

            } else {
                console.log('Firebase SDK not available or config invalid, switching to mock mode');
                clearTimeout(initTimeout);
                initializeMockMode();
                resolve(false);
            }
        } catch (error) {
            console.error('Firebase initialization failed, switching to mock mode:', error);
            clearTimeout(initTimeout);
            initializeMockMode();
            resolve(false);
        }
    });
}

// Mock mode initialization
function initializeMockMode() {
    isFirebaseEnabled = false;
    isMockMode = true;
    
    // Create mock auth object
    window.mockAuth = {
        currentUser: null,
        isSignedIn: false
    };
    
    // Create mock database
    window.mockDB = {
        publications: [],
        projects: [],
        feedback: [],
        contacts: []
    };
    
    console.log('Mock mode initialized - all features available for demo');
    handleUserSignedOut();
}

// Setup authentication state observer
function setupAuthStateObserver() {
    if (!isFirebaseEnabled || !auth) return;
    
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('User signed in:', user.email);
            await handleUserSignedIn(user);
        } else {
            console.log('User signed out');
            handleUserSignedOut();
        }
    });
}

// Configure Firestore settings
function configureFirestore() {
    if (!isFirebaseEnabled || !db) return Promise.resolve();
    
    // Enable multi-tab offline persistence
    return db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('Firestore persistence with tab synchronization enabled.');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Persistence failed: Another tab has exclusive lock. Synchronization will be attempted.');
            } else if (err.code === 'unimplemented') {
                console.warn('Persistence is not supported in this browser.');
            } else {
                console.error("Enable persistence failed:", err);
            }
        });
}

// Authentication functions
async function loginWithGoogle() {
    console.log('Google login attempt...');
    
    if (isMockMode) {
        return mockLogin('Google');
    }
    
    if (!isFirebaseEnabled || !auth) {
        showToast('Firebase not configured. Using mock login.', 'warning');
        return mockLogin('Google');
    }
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await auth.signInWithPopup(provider);
        console.log('Google login successful:', result.user.email);
        showToast('Google 로그인 성공!', 'success');
        closeModal('login-modal');
        return result;
        
    } catch (error) {
        console.error('Google login error:', error);
        showToast('Google 로그인 실패: ' + error.message, 'error');
        throw error;
    }
}

async function loginWithGitHub() {
    console.log('GitHub login attempt...');
    
    if (isMockMode) {
        return mockLogin('GitHub');
    }
    
    if (!isFirebaseEnabled || !auth) {
        showToast('Firebase not configured. Using mock login.', 'warning');
        return mockLogin('GitHub');
    }
    
    try {
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user:email');
        provider.addScope('read:user');
        
        const result = await auth.signInWithPopup(provider);
        console.log('GitHub login successful:', result.user.email);
        showToast('GitHub 로그인 성공!', 'success');
        closeModal('login-modal');
        return result;
        
    } catch (error) {
        console.error('GitHub login error:', error);
        showToast('GitHub 로그인 실패: ' + error.message, 'error');
        throw error;
    }
}

async function loginWithEmail(email, password) {
    console.log('Email login attempt...');
    
    if (isMockMode) {
        return mockLogin('Email');
    }
    
    if (!isFirebaseEnabled || !auth) {
        showToast('Firebase not configured. Using mock login.', 'warning');
        return mockLogin('Email');
    }
    
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log('Email login successful:', result.user.email);
        showToast('이메일 로그인 성공!', 'success');
        closeModal('login-modal');
        return result;
        
    } catch (error) {
        console.error('Email login error:', error);
        showToast('이메일 로그인 실패: ' + error.message, 'error');
        throw error;
    }
}

async function signUpWithEmail(email, password, displayName) {
    console.log('Email signup attempt...');
    
    if (isMockMode) {
        return mockLogin('Email');
    }
    
    if (!isFirebaseEnabled || !auth) {
        showToast('Firebase not configured. Using mock login.', 'warning');
        return mockLogin('Email');
    }
    
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update user profile
        if (displayName) {
            await result.user.updateProfile({
                displayName: displayName
            });
        }
        
        console.log('Email signup successful:', result.user.email);
        showToast('회원가입 성공!', 'success');
        closeModal('login-modal');
        return result;
        
    } catch (error) {
        console.error('Email signup error:', error);
        showToast('회원가입 실패: ' + error.message, 'error');
        throw error;
    }
}

async function logout() {
    console.log('Logout attempt...');
    
    if (isMockMode) {
        return mockLogout();
    }
    
    if (!isFirebaseEnabled || !auth) {
        return mockLogout();
    }
    
    try {
        await auth.signOut();
        console.log('Logout successful');
        showToast('로그아웃되었습니다.', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        showToast('로그아웃 중 오류가 발생했습니다.', 'error');
    }
}

// Mock authentication functions
function mockLogin(provider = 'Google') {
    const mockUser = {
        uid: 'mock-user-123',
        email: 'demo@example.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/40?text=DU'
    };
    
    window.mockAuth.currentUser = mockUser;
    window.mockAuth.isSignedIn = true;
    
    handleUserSignedIn(mockUser);
    showToast(`Mock ${provider} 로그인 성공! (데모 모드)`, 'success');
    closeModal('login-modal');
    
    return Promise.resolve({ user: mockUser });
}

function mockLogout() {
    window.mockAuth.currentUser = null;
    window.mockAuth.isSignedIn = false;
    
    handleUserSignedOut();
    showToast('Mock 로그아웃 성공! (데모 모드)', 'success');
    
    return Promise.resolve();
}

// User state handlers
async function handleUserSignedIn(user) {
    console.log('Handling user signed in:', user.email || user.displayName);
    
    // Update UI
    updateUIForSignedInUser(user);
    
    // Check admin status
    const isAdmin = await checkAdminStatus(user.uid);
    
    // Update app state
    if (typeof AppState !== 'undefined') {
        AppState.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        AppState.isAdmin = isAdmin;
    }
    
    // Save admin status to localStorage for persistence
    localStorage.setItem('is_admin', isAdmin.toString());
    
    // Update admin UI visibility
    if (typeof updateAdminUI === 'function') {
        updateAdminUI();
    }
    
    // Show welcome message
    const welcomeMsg = isAdmin ? 
        `관리자로 로그인했습니다, ${user.displayName || user.email}!` : 
        `환영합니다, ${user.displayName || user.email}!`;
    showToast(welcomeMsg, 'success');
    
    // Load user data (only if Firebase is enabled)
    if (isFirebaseEnabled) {
        await loadUserData(user.uid);
    }
}

function handleUserSignedOut() {
    console.log('Handling user signed out');
    
    // Update UI
    updateUIForSignedOutUser();
    
    // Clear app state
    if (typeof AppState !== 'undefined') {
        AppState.user = null;
        AppState.isAdmin = false;
    }
    
    // Clear admin status from localStorage
    localStorage.removeItem('is_admin');
    
    // Update admin UI visibility
    if (typeof updateAdminUI === 'function') {
        updateAdminUI();
    }
    
    // Remove admin mode
    document.body.classList.remove('admin-mode');
}

function updateUIForSignedInUser(user) {
    // Hide login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    
    // Show logout button and user info
    const authSection = document.querySelector('.auth-section');
    if (authSection) {
        authSection.innerHTML = `
            <div class="user-info">
                <img src="${user.photoURL || 'https://via.placeholder.com/32?text=' + (user.displayName ? user.displayName[0] : 'U')}" 
                     alt="User Avatar" class="user-avatar" id="user-avatar">
                <span class="user-name" id="user-name">${user.displayName || user.email}</span>
                <button onclick="logout()" class="logout-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>로그아웃</span>
                </button>
            </div>
        `;
    }
}

function updateUIForSignedOutUser() {
    // Show login button
    const authSection = document.querySelector('.auth-section');
    if (authSection) {
        authSection.innerHTML = `
            <button id="login-btn" onclick="showLoginModal()" class="login-btn">
                <i class="fas fa-sign-in-alt"></i>
                <span data-i18n="login">로그인</span>
            </button>
        `;
    }
}

async function checkAdminStatus(userId) {
    // 0. 하드코딩된 관리자 이메일 확인 (가장 먼저)
    const user = auth.currentUser;
    if (user && user.email === 'cjmin2925@gmail.com') {
        console.log('Admin user detected by email.');
        // 온라인 상태라면 DB에 상태를 기록해준다.
        if (isFirebaseEnabled && !db.isOffline) {
            ensureAdminDocument(user.uid).catch(err => console.warn("Could not ensure admin document online:", err));
        }
        return true;
    }

    // 1. Firebase 비활성화 시 mock 데이터 확인
    if (!isFirebaseEnabled || !db) {
        return localStorage.getItem('mock_is_admin') === 'true';
    }

    // 2. Firestore DB 확인 (온라인일 경우)
    try {
        const adminDoc = await db.collection('admins').doc(userId).get();
        if (adminDoc.exists && adminDoc.data().isAdmin) {
            console.log('User is an administrator (from Firestore).');
            return true;
        }
    } catch (error) {
        console.error('Error checking admin status from Firestore:', error);
        // 에러 발생 시 (주로 오프라인), 이메일 체크가 이미 위에서 수행되었으므로 여기서 false를 반환해도 안전.
    }

    console.log('User is not an administrator.');
    return false;
}

async function ensureAdminDocument(userId) {
    if (!isFirebaseEnabled || !db) return;
    
    try {
        const adminDoc = await db.collection('admins').doc(userId).get();
        if (!adminDoc.exists) {
            await db.collection('admins').doc(userId).set({
                email: 'cjmin2925@gmail.com',
                role: 'super_admin',
                permissions: ['edit_profile', 'manage_content', 'view_analytics'],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Admin document created');
        }
    } catch (error) {
        console.error('Error ensuring admin document:', error);
    }
}

async function loadUserData(userId) {
    if (!isFirebaseEnabled || !db) return;
    
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Apply user preferences
            if (userData.theme && typeof AppState !== 'undefined') {
                AppState.currentTheme = userData.theme;
                if (typeof applyTheme === 'function') {
                    applyTheme(userData.theme);
                }
            }
            
            if (userData.language && typeof AppState !== 'undefined') {
                AppState.currentLanguage = userData.language;
                if (typeof updateLanguage === 'function') {
                    updateLanguage();
                }
            }
        } else {
            // Create user document if it doesn't exist
            await createUserDocument(userId);
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function createUserDocument(userId) {
    if (!isFirebaseEnabled || !db || !auth.currentUser) return;
    
    try {
        const user = auth.currentUser;
        await db.collection('users').doc(userId).set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'visitor',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('User document created');
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    const style = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        zIndex: '10000',
        fontWeight: '500',
        fontSize: '14px',
        maxWidth: '300px',
        wordWrap: 'break-word',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'slideInRight 0.3s ease'
    };
    
    // Set background color based on type
    const colors = {
        info: '#2563eb',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626'
    };
    
    Object.assign(toast.style, style, {
        backgroundColor: colors[type] || colors.info
    });
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase config: Initializing...');
    initializeFirebase();
});

// Export functions for global use
window.initializeFirebase = initializeFirebase;
window.loginWithGoogle = loginWithGoogle;
window.loginWithGitHub = loginWithGitHub;
window.loginWithEmail = loginWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.logout = logout;
window.mockLogin = mockLogin;
window.mockLogout = mockLogout;
window.showToast = showToast; 