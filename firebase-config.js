// Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase project configuration
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
let app, auth, db;

function initializeFirebase() {
    try {
        // Initialize Firebase app
        app = firebase.initializeApp(firebaseConfig);
        
        // Initialize Firebase services
        auth = firebase.auth();
        db = firebase.firestore();
        
        console.log('Firebase initialized successfully');
        
        // Set up authentication state observer
        setupAuthStateObserver();
        
        // Configure Firestore settings
        configureFirestore();
        
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        return false;
    }
}

function setupAuthStateObserver() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            handleUserSignedIn(user);
        } else {
            handleUserSignedOut();
        }
    });
}

function configureFirestore() {
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
    console.log('User signed in:', user.email);
    
    // Update UI
    updateUIForSignedInUser(user);
    
    // Check if user is admin
    checkAdminStatus(user.uid);
    
    // Load user-specific data
    loadUserData(user.uid);
    
    // Update app state
    AppState.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
}

function handleUserSignedOut() {
    console.log('User signed out');
    
    // Update UI
    updateUIForSignedOutUser();
    
    // Clear app state
    AppState.user = null;
    AppState.isAdmin = false;
    
    // Remove admin mode
    document.body.classList.remove('admin-mode');
}

function updateUIForSignedInUser(user) {
    // Hide login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.classList.add('hidden');
    }
    
    // Show user menu
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.remove('hidden');
        
        // Update user avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            userAvatar.alt = user.displayName || user.email;
        }
    }
}

function updateUIForSignedOutUser() {
    // Show login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.classList.remove('hidden');
    }
    
    // Hide user menu
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.add('hidden');
    }
}

async function checkAdminStatus(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const isAdmin = userData.role === 'admin';
            
            AppState.isAdmin = isAdmin;
            
            if (isAdmin) {
                document.body.classList.add('admin-mode');
                console.log('Admin access granted');
            }
        } else {
            // Create user document if it doesn't exist
            await createUserDocument(userId);
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

// Export functions
window.initializeFirebase = initializeFirebase;
window.savePublication = savePublication;
window.loadPublicationsFromFirestore = loadPublicationsFromFirestore;
window.saveProject = saveProject;
window.loadProjectsFromFirestore = loadProjectsFromFirestore;
window.saveFeedback = saveFeedback;
window.loadFeedbackFromFirestore = loadFeedbackFromFirestore;
window.saveContactMessage = saveContactMessage;
window.trackPageView = trackPageView;
window.trackInteraction = trackInteraction; 