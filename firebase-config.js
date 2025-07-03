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
let isMockMode = true; // Enable mock mode for demo purposes

// Check if we have valid Firebase config
function hasValidFirebaseConfig() {
    return firebaseConfig.apiKey !== "your-api-key" && 
           firebaseConfig.projectId !== "your-project-id";
}

// Initialize Firebase or Mock Mode
function initializeFirebase() {
    try {
        if (hasValidFirebaseConfig() && typeof firebase !== 'undefined') {
            // Real Firebase initialization
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            isFirebaseEnabled = true;
            isMockMode = false;
            console.log('Firebase initialized successfully');
            setupAuthStateObserver();
            configureFirestore();
        } else {
            // Mock mode - for demo without Firebase
            console.log('Running in mock mode - Firebase not configured');
            initializeMockMode();
        }
        return true;
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
    
    // Simulate user signed out state
    handleUserSignedOut();
}

// Mock login function
function mockLogin(provider = 'google') {
    const mockUser = {
        uid: 'mock-user-123',
        email: 'demo@example.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/40?text=DU'
    };
    
    window.mockAuth.currentUser = mockUser;
    window.mockAuth.isSignedIn = true;
    
    handleUserSignedIn(mockUser);
    showToast(`Mock ${provider} login successful! (Demo mode)`);
    
    return Promise.resolve({ user: mockUser });
}

// Mock logout function
function mockLogout() {
    window.mockAuth.currentUser = null;
    window.mockAuth.isSignedIn = false;
    
    handleUserSignedOut();
    showToast('Mock logout successful! (Demo mode)');
    
    return Promise.resolve();
}

function setupAuthStateObserver() {
    if (!isFirebaseEnabled) return;
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            handleUserSignedIn(user);
        } else {
            handleUserSignedOut();
        }
    });
}

function configureFirestore() {
    if (!isFirebaseEnabled) return;
    
    // Configure Firestore settings for better performance
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    // Enable offline persistence
    db.enablePersistence()
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser doesn\'t support persistence.');
            }
        });
}

function handleUserSignedIn(user) {
    console.log('User signed in:', user.email || user.displayName);
    
    // Update UI
    updateUIForSignedInUser(user);
    
    // Check if user is admin (mock admin for demo)
    const isAdmin = isMockMode ? (user.email === 'admin@example.com') : false;
    checkAdminStatus(user.uid, isAdmin);
    
    // Load user-specific data
    if (!isMockMode) {
        loadUserData(user.uid);
    }
    
    // Update app state
    if (typeof AppState !== 'undefined') {
        AppState.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
    }
}

function handleUserSignedOut() {
    console.log('User signed out');
    
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
    
    // Show logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'inline-flex';
    }
    
    // Update user info
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = user.displayName || user.email;
        userName.style.display = 'inline';
    }
    
    // Update user avatar
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.src = user.photoURL || 'https://via.placeholder.com/40?text=' + (user.displayName ? user.displayName[0] : 'U');
        userAvatar.alt = user.displayName || user.email;
    }
}

function updateUIForSignedOutUser() {
    // Show login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'inline-flex';
    }
    
    // Hide logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    
    // Hide user info
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.style.display = 'none';
    }
}

async function checkAdminStatus(userId, mockAdmin = false) {
    try {
        let isAdmin = false;
        
        if (isMockMode) {
            // In mock mode, make demo user an admin for testing
            isAdmin = mockAdmin;
        } else if (isFirebaseEnabled) {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                isAdmin = userData.role === 'admin';
            } else {
                await createUserDocument(userId);
            }
        }
        
        if (typeof AppState !== 'undefined') {
            AppState.isAdmin = isAdmin;
        }
        
        if (isAdmin) {
            document.body.classList.add('admin-mode');
            console.log('Admin access granted');
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }
}

async function createUserDocument(userId) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
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

async function loadUserData(userId) {
    try {
        // Load user preferences
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Apply user preferences
            if (userData.theme) {
                AppState.currentTheme = userData.theme;
                applyTheme(userData.theme);
            }
            
            if (userData.language) {
                AppState.currentLanguage = userData.language;
                updateLanguage();
            }
            
            // Update last login
            await db.collection('users').doc(userId).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Firestore data operations
async function savePublication(publicationData) {
    try {
        const docRef = await db.collection('publications').add({
            ...publicationData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Publication saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving publication:', error);
        throw error;
    }
}

async function loadPublicationsFromFirestore() {
    try {
        const snapshot = await db.collection('publications')
            .orderBy('year', 'desc')
            .get();
        
        const publications = [];
        snapshot.forEach(doc => {
            publications.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        AppState.publications = publications;
        renderPublications();
        updateStats();
        
        return publications;
    } catch (error) {
        console.error('Error loading publications:', error);
        return [];
    }
}

async function saveProject(projectData) {
    try {
        const docRef = await db.collection('projects').add({
            ...projectData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Project saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving project:', error);
        throw error;
    }
}

async function loadProjectsFromFirestore() {
    try {
        const snapshot = await db.collection('projects')
            .orderBy('createdAt', 'desc')
            .get();
        
        const projects = [];
        snapshot.forEach(doc => {
            projects.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        AppState.projects = projects;
        renderProjects();
        
        return projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

async function saveFeedback(feedbackData) {
    try {
        const docRef = await db.collection('feedback').add({
            ...feedbackData,
            userId: AppState.user?.uid || null,
            userEmail: AppState.user?.email || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Feedback saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
}

async function loadFeedbackFromFirestore() {
    try {
        const snapshot = await db.collection('feedback')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        const feedback = [];
        snapshot.forEach(doc => {
            feedback.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return feedback;
    } catch (error) {
        console.error('Error loading feedback:', error);
        return [];
    }
}

async function saveContactMessage(messageData) {
    try {
        const docRef = await db.collection('contact_messages').add({
            ...messageData,
            userId: AppState.user?.uid || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'unread'
        });
        
        console.log('Contact message saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving contact message:', error);
        throw error;
    }
}

async function saveAnalyticsEvent(eventData) {
    try {
        await db.collection('analytics').add({
            ...eventData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: AppState.user?.uid || null,
            sessionId: getSessionId()
        });
    } catch (error) {
        console.error('Error saving analytics event:', error);
    }
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Real-time listeners
function setupRealtimeListeners() {
    if (!db) return;
    
    // Listen for publications changes
    db.collection('publications').onSnapshot((snapshot) => {
        const publications = [];
        snapshot.forEach(doc => {
            publications.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        AppState.publications = publications;
        if (AppState.currentSection === 'publications') {
            renderPublications();
        }
        updateStats();
    });
    
    // Listen for projects changes
    db.collection('projects').onSnapshot((snapshot) => {
        const projects = [];
        snapshot.forEach(doc => {
            projects.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        AppState.projects = projects;
        if (AppState.currentSection === 'projects') {
            renderProjects();
        }
    });
}

// Track page views
function trackPageView(section) {
    saveAnalyticsEvent({
        type: 'page_view',
        section: section,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
}

// Track user interactions
function trackInteraction(action, details = {}) {
    saveAnalyticsEvent({
        type: 'interaction',
        action: action,
        details: details,
        timestamp: new Date().toISOString()
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
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
        wordWrap: 'break-word'
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
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
    
    // Set up login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (isMockMode) {
                mockLogin('google');
            } else {
                // Real Firebase login would go here
                showToast('Please configure Firebase for real authentication', 'warning');
            }
        });
    }
    
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (isMockMode) {
                mockLogout();
            } else if (isFirebaseEnabled && auth) {
                auth.signOut();
            }
        });
    }
});

// Export functions for global use
window.initializeFirebase = initializeFirebase;
window.mockLogin = mockLogin;
window.mockLogout = mockLogout;
window.showToast = showToast;
window.savePublication = savePublication;
window.loadPublicationsFromFirestore = loadPublicationsFromFirestore;
window.saveProject = saveProject;
window.loadProjectsFromFirestore = loadProjectsFromFirestore;
window.saveFeedback = saveFeedback;
window.loadFeedbackFromFirestore = loadFeedbackFromFirestore;
window.saveContactMessage = saveContactMessage;
window.trackPageView = trackPageView;
window.trackInteraction = trackInteraction; 