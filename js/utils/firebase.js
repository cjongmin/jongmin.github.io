// Firebase 통합 설정 모듈
class FirebaseManager {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.isEnabled = false;
        this.isMockMode = false;
        this.currentUser = null;
        
        this.config = {
            apiKey: "AIzaSyCNybLoW5J1o7oj7fz0zCQGmuC9DpCCVpI",
            authDomain: "research-profile-8ee9b.firebaseapp.com",
            projectId: "research-profile-8ee9b",
            storageBucket: "research-profile-8ee9b.firebasestorage.app",
            messagingSenderId: "108930331185",
            appId: "1:108930331185:web:ec6dc184c1ef342416db10",
            measurementId: "G-BGW23T7ZV5"
        };
        
        this.adminEmail = 'cjmin2925@gmail.com';
        this.authCallbacks = [];
    }

    // Firebase 초기화
    async initialize() {
        try {
            if (this.hasValidConfig() && typeof firebase !== 'undefined') {
                console.log('Firebase 초기화 중...');
                
                this.app = firebase.initializeApp(this.config);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
                
                this.isEnabled = true;
                this.isMockMode = false;
                
                // 인증 상태 관찰자 설정
                this.setupAuthObserver();
                
                // Firestore 설정
                this.configureFirestore();
                
                console.log('Firebase 초기화 완료');
                return true;
            } else {
                console.log('Firebase 비활성화, Mock 모드로 전환');
                this.initializeMockMode();
                return false;
            }
        } catch (error) {
            console.warn('Firebase 초기화 실패, Mock 모드로 전환:', error);
            this.initializeMockMode();
            return false;
        }
    }

    // 유효한 Firebase 설정 확인
    hasValidConfig() {
        return this.config.apiKey && 
               this.config.projectId && 
               this.config.apiKey !== "your-api-key";
    }

    // Mock 모드 초기화
    initializeMockMode() {
        this.isEnabled = false;
        this.isMockMode = true;
        
        // Mock 사용자 상태
        this.mockUser = null;
        
        console.log('Mock 모드 활성화');
        this.notifyAuthChange(null);
    }

    // 인증 상태 관찰자 설정
    setupAuthObserver() {
        if (!this.isEnabled || !this.auth) return;
        
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.notifyAuthChange(user);
        });
    }

    // Firestore 설정
    configureFirestore() {
        if (!this.isEnabled || !this.db) return;
        
        try {
            this.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('여러 탭이 열려있어 persistence가 제한됩니다.');
                } else if (err.code === 'unimplemented') {
                    console.warn('현재 브라우저는 persistence를 지원하지 않습니다.');
                }
            });
        } catch (error) {
            console.warn('Firestore 설정 오류:', error);
        }
    }

    // 인증 상태 변경 콜백 등록
    onAuthStateChanged(callback) {
        this.authCallbacks.push(callback);
        // 현재 사용자 상태로 즉시 호출
        if (this.currentUser !== undefined) {
            callback(this.currentUser);
        }
    }

    // 인증 상태 변경 알림
    notifyAuthChange(user) {
        this.authCallbacks.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('인증 콜백 오류:', error);
            }
        });
    }

    // Google 로그인
    async loginWithGoogle() {
        if (this.isMockMode) {
            return this.mockLogin('Google', 'user@example.com', 'Demo User');
        }
        
        if (!this.isEnabled || !this.auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            const result = await this.auth.signInWithPopup(provider);
            console.log('Google 로그인 성공:', result.user.email);
            return result;
        } catch (error) {
            console.error('Google 로그인 오류:', error);
            throw error;
        }
    }

    // GitHub 로그인
    async loginWithGitHub() {
        if (this.isMockMode) {
            return this.mockLogin('GitHub', 'github@example.com', 'GitHub User');
        }
        
        if (!this.isEnabled || !this.auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        try {
            const provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('user:email');
            provider.addScope('read:user');
            
            const result = await this.auth.signInWithPopup(provider);
            console.log('GitHub 로그인 성공:', result.user.email);
            return result;
        } catch (error) {
            console.error('GitHub 로그인 오류:', error);
            throw error;
        }
    }

    // 이메일 로그인
    async loginWithEmail(email, password) {
        if (this.isMockMode) {
            return this.mockLogin('Email', email, 'Email User');
        }
        
        if (!this.isEnabled || !this.auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('이메일 로그인 성공:', result.user.email);
            return result;
        } catch (error) {
            console.error('이메일 로그인 오류:', error);
            throw error;
        }
    }

    // 로그아웃
    async logout() {
        if (this.isMockMode) {
            this.mockUser = null;
            this.notifyAuthChange(null);
            console.log('Mock 로그아웃 완료');
            return;
        }
        
        if (!this.isEnabled || !this.auth) {
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }
        
        try {
            await this.auth.signOut();
            console.log('로그아웃 성공');
        } catch (error) {
            console.error('로그아웃 오류:', error);
            throw error;
        }
    }

    // Mock 로그인
    mockLogin(provider, email, displayName) {
        this.mockUser = {
            uid: 'mock-uid-' + Date.now(),
            email: email,
            displayName: displayName,
            photoURL: 'https://via.placeholder.com/40',
            provider: provider
        };
        
        console.log(`Mock ${provider} 로그인 성공:`, email);
        this.notifyAuthChange(this.mockUser);
        
        return Promise.resolve({
            user: this.mockUser,
            credential: null
        });
    }

    // 관리자 확인
    isAdmin(user = null) {
        const checkUser = user || this.currentUser || this.mockUser;
        if (!checkUser || !checkUser.email) return false;
        return checkUser.email === this.adminEmail;
    }

    // 현재 사용자 가져오기
    getCurrentUser() {
        return this.currentUser || this.mockUser;
    }

    // 로그인 상태 확인
    isSignedIn() {
        return !!(this.currentUser || this.mockUser);
    }
}

// 전역 Firebase 매니저 인스턴스
window.firebaseManager = new FirebaseManager();

// 초기화 함수
window.initializeFirebase = function() {
    return window.firebaseManager.initialize();
};

// 호환성을 위한 전역 함수들
window.loginWithGoogle = function() {
    return window.firebaseManager.loginWithGoogle();
};

window.loginWithGitHub = function() {
    return window.firebaseManager.loginWithGitHub();
};

window.loginWithEmail = function(email, password) {
    return window.firebaseManager.loginWithEmail(email, password);
};

window.logout = function() {
    return window.firebaseManager.logout();
};

// DOM 로드 완료 시 Firebase 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.initializeFirebase();
}); 