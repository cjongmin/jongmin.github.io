# 연구자 개인 프로필 웹페이지

최고 수준의 연구자 개인 프로필 웹페이지입니다. 현대적이고 아름다운 디자인과 함께 논문 관리, AI 어시스턴트, 방문자 분석 등 다양한 기능을 제공합니다.

## 🌟 주요 기능

### 📌 접근 및 권한 관리
- GitHub/Google OAuth 로그인
- 관리자/방문자 권한 구분
- 방문자별 API 키 등록 (OpenAI, Claude, Gemini)

### 🗂️ 왼쪽 사이드바 네비게이션
- About Me (소개)
- Publications (논문)
- Projects (프로젝트)
- Awards (수상/활동)
- Contact (연락처)
- Feedback (방문자 피드백)

### 📄 논문 관리 시스템
- 논문 추가/편집/삭제 (관리자 전용)
- 검색 및 필터링 (연도, 키워드)
- PDF, Code, Project 링크 관리
- 인용 수 및 H-index 자동 계산

### 🤖 AI Assistant
- OpenAI GPT-4, Anthropic Claude, Google Gemini 지원
- 페이지 콘텐츠 기반 질의응답
- 채팅 기록 저장
- 방문자별 API 키 설정

### 💌 Contact & 커뮤니케이션
- 이메일 자동 발송 폼
- 방문자 피드백 시스템
- 연구 협업 제안 기능
- 실시간 알림 시스템

### 📈 방문자 분석
- 페이지 뷰 추적
- 클릭 및 상호작용 분석
- 실시간 차트 및 통계
- 관리자 대시보드

### 🌐 기타 기능
- 다국어 지원 (한국어/영어)
- 다크/라이트 모드
- 완전 반응형 디자인
- PWA 지원

## 🚀 설치 및 설정

### 1. 프로젝트 복제
```bash
git clone [repository-url]
cd profilepage
```

### 2. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication, Firestore, Hosting 활성화
3. `firebase-config.js` 파일의 설정 정보 업데이트:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 3. Firebase Authentication 설정
1. Firebase Console > Authentication > Sign-in method
2. Google, GitHub 로그인 활성화
3. 이메일/비밀번호 로그인 활성화

### 4. Firestore 규칙 설정
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /publications/{pubId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /feedback/{feedbackId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
    
    match /contact_messages/{messageId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
    
    match /analytics/{eventId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
  }
}
```

### 5. 관리자 계정 설정
1. 웹사이트에 로그인
2. Firestore Console에서 해당 사용자 문서를 찾아 `role` 필드를 `'admin'`으로 변경

### 6. 개인 정보 수정
`index.html`과 관련 파일에서 다음 정보를 수정하세요:
- 이름 및 타이틀
- 연락처 정보
- 소셜 미디어 링크
- 프로필 이미지
- About Me 섹션 내용

## 📱 사용 방법

### 방문자
1. 웹사이트 방문
2. 선택적으로 로그인 (GitHub/Google)
3. AI Assistant 사용을 위해 API 키 설정
4. 연구 내용 탐색 및 피드백 제출

### 관리자
1. GitHub/Google로 로그인
2. 관리자 패널에서 콘텐츠 관리
3. 논문, 프로젝트, 수상 내역 추가/편집
4. 방문자 메시지 및 분석 데이터 확인

## 🛠️ 커스터마이징

### 색상 테마 변경
`styles.css`의 CSS 변수를 수정:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* ... */
}
```

### 새로운 섹션 추가
1. `script.js`의 `sectionTemplates`에 새 섹션 템플릿 추가
2. 네비게이션 메뉴에 새 항목 추가
3. 필요한 CSS 스타일 추가

### AI 모델 추가
`ai-assistant.js`에서 새로운 AI 모델 지원을 추가할 수 있습니다.

## 🚀 배포

### GitHub Pages 배포
1. GitHub 저장소에 코드 업로드
2. Settings > Pages에서 소스를 main 브랜치로 설정
3. 제공된 URL에서 웹사이트 확인

### Firebase Hosting 배포
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify 배포
1. [Netlify](https://netlify.com)에 저장소 연결
2. 자동 빌드 및 배포 설정

## 📊 분석 및 모니터링

### Google Analytics 통합
`analytics.js`에서 Google Analytics 코드를 추가할 수 있습니다.

### 커스텀 이벤트 추적
```javascript
trackInteraction('custom_event', {
    category: 'research',
    action: 'paper_download',
    label: 'paper_title'
});
```

## 🔒 보안 고려사항

1. Firebase 보안 규칙 정기 검토
2. API 키는 클라이언트 사이드에만 저장
3. 관리자 권한 정기 확인
4. HTTPS 사용 필수

## 🐛 문제 해결

### 일반적인 문제
- Firebase 연결 오류: 설정 정보 확인
- 로그인 실패: OAuth 설정 확인
- AI Assistant 작동하지 않음: API 키 확인

### 디버깅
브라우저 개발자 도구 Console에서 오류 메시지 확인

## 📝 라이선스

MIT License

## 🤝 기여

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.

---

**최고 수준의 연구자 프로필 웹페이지로 전문적인 온라인 존재감을 구축하세요!** 🎓✨ 