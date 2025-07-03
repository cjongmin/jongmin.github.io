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
    try {
        if (hasValidFirebaseConfig() && typeof firebase !== 'undefined') {
            console.log('Initializing Firebase with real config...');
            
            // Initialize Firebase app
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            
            isFirebaseEnabled = true;
            isMockMode = false;
            
            console.log('Firebase initialized successfully');
            
            // Set up authentication state observer
            setupAuthStateObserver();
            
            // Configure Firestore settings
            configureFirestore();
            
            return true;
        } else {
            console.log('Firebase not available, switching to mock mode');
            initializeMockMode();
            return false;
        }
    } catch (error) {
        console.warn('Firebase initialization failed, switching to mock mode:', error);
        initializeMockMode();
        return false;
    }
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
    if (!isFirebaseEnabled || !db) return;
    
    try {
        // Enable offline persistence
        db.enablePersistence().catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser doesn\'t support persistence.');
            }
        });
    } catch (error) {
        console.warn('Error setting up Firestore:', error);
    }
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
    try {
        if (isMockMode) {
            // In mock mode, make demo user an admin for testing
            return false; // Set to true if you want mock user to be admin
        }
        
        if (!isFirebaseEnabled || !db) {
            return false;
        }
        
        const userDoc = await db.collection('admins').doc(userId).get();
        const isAdmin = userDoc.exists;
        
        if (isAdmin) {
            document.body.classList.add('admin-mode');
            console.log('Admin access granted');
        }
        
        return isAdmin;
        
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
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