// AI 어시스턴트 관리 모듈
class AIManager {
    constructor() {
        this.apiKeys = {
            openai: null,
            anthropic: null,
            google: null
        };
        this.currentModel = 'gpt-4';
        this.isEnabled = false;
        this.init();
    }

    // AI 매니저 초기화
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.loadApiKeys();
        this.setupEventListeners();
        this.updateUI();
        console.log('AI 매니저 초기화 완료');
    }

    // API 키 로드
    loadApiKeys() {
        const savedKeys = localStorage.getItem('aiApiKeys');
        if (savedKeys) {
            try {
                this.apiKeys = { ...this.apiKeys, ...JSON.parse(savedKeys) };
                this.isEnabled = Object.values(this.apiKeys).some(key => key);
            } catch (error) {
                console.warn('API 키 로드 오류:', error);
            }
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');
        const aiModel = document.getElementById('ai-model');

        if (aiInput) {
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (aiSend) {
            aiSend.addEventListener('click', () => this.sendMessage());
        }

        if (aiModel) {
            aiModel.addEventListener('change', (e) => {
                this.currentModel = e.target.value;
            });
        }
    }

    // UI 업데이트
    updateUI() {
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');

        if (aiInput && aiSend) {
            if (this.isEnabled) {
                aiInput.disabled = false;
                aiSend.disabled = false;
                aiInput.placeholder = '연구에 대해 질문해보세요...';
            } else {
                aiInput.disabled = true;
                aiSend.disabled = true;
                aiInput.placeholder = 'API 키를 설정해주세요...';
            }
        }
    }

    // API 설정 모달 표시
    showAPISetupModal() {
        const modalHTML = `
            <div id="api-setup-modal" class="modal">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>AI API 키 설정</h2>
                        <button class="modal-close" onclick="window.authUI.closeModal('api-setup-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="api-setup-info">
                            <p>AI 어시스턴트를 사용하려면 하나 이상의 API 키가 필요합니다.</p>
                        </div>
                        
                        <form id="api-setup-form" onsubmit="window.aiManager.handleAPIKeySave(event)">
                            <div class="api-service">
                                <h3><i class="fas fa-robot"></i> OpenAI (GPT-4)</h3>
                                <div class="form-group">
                                    <label for="openai-key">API Key</label>
                                    <input type="password" id="openai-key" value="${this.apiKeys.openai || ''}" placeholder="sk-...">
                                    <small>OpenAI 계정에서 API 키를 발급받으세요.</small>
                                </div>
                            </div>
                            
                            <div class="api-service">
                                <h3><i class="fas fa-brain"></i> Anthropic (Claude)</h3>
                                <div class="form-group">
                                    <label for="anthropic-key">API Key</label>
                                    <input type="password" id="anthropic-key" value="${this.apiKeys.anthropic || ''}" placeholder="sk-ant-...">
                                    <small>Anthropic 계정에서 API 키를 발급받으세요.</small>
                                </div>
                            </div>
                            
                            <div class="api-service">
                                <h3><i class="fas fa-search"></i> Google (Gemini)</h3>
                                <div class="form-group">
                                    <label for="google-key">API Key</label>
                                    <input type="password" id="google-key" value="${this.apiKeys.google || ''}" placeholder="AIza...">
                                    <small>Google Cloud Console에서 API 키를 발급받으세요.</small>
                                </div>
                            </div>
                            
                            <div class="api-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>API 키는 로컬에만 저장되며 외부로 전송되지 않습니다.</p>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" onclick="window.authUI.closeModal('api-setup-modal')" class="btn secondary">취소</button>
                                <button type="submit" class="btn primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        window.authUI.showModal(modalHTML);
    }

    // API 키 저장
    handleAPIKeySave(event) {
        event.preventDefault();
        
        const newKeys = {
            openai: document.getElementById('openai-key').value.trim(),
            anthropic: document.getElementById('anthropic-key').value.trim(),
            google: document.getElementById('google-key').value.trim()
        };
        
        // 유효한 키만 저장
        Object.keys(newKeys).forEach(key => {
            if (newKeys[key]) {
                this.apiKeys[key] = newKeys[key];
            }
        });
        
        // localStorage에 저장
        localStorage.setItem('aiApiKeys', JSON.stringify(this.apiKeys));
        
        this.isEnabled = Object.values(this.apiKeys).some(key => key);
        this.updateUI();
        
        window.authUI.closeModal('api-setup-modal');
        window.authUI.showToast('API 키가 저장되었습니다.', 'success');
    }

    // 메시지 전송
    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        if (!this.isEnabled) {
            window.authUI.showToast('먼저 API 키를 설정해주세요.', 'warning');
            this.showAPISetupModal();
            return;
        }
        
        // 사용자 메시지 추가
        this.addMessageToChat('user', message);
        input.value = '';
        
        // AI 응답 생성
        try {
            const response = await this.generateResponse(message);
            this.addMessageToChat('assistant', response);
        } catch (error) {
            console.error('AI 응답 오류:', error);
            this.addMessageToChat('assistant', '죄송합니다. AI 서비스에 문제가 발생했습니다. API 키를 확인해주세요.');
        }
    }

    // 채팅에 메시지 추가
    addMessageToChat(role, content) {
        const chatContainer = document.getElementById('ai-chat');
        if (!chatContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${role}`;
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'chat-avatar';
        avatarEl.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentEl = document.createElement('div');
        contentEl.className = 'chat-content';
        contentEl.textContent = content;
        
        messageEl.appendChild(avatarEl);
        messageEl.appendChild(contentEl);
        
        // 웰컴 메시지 제거
        const welcome = chatContainer.querySelector('.ai-welcome');
        if (welcome) {
            welcome.remove();
        }
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // AI 응답 생성 (Mock)
    async generateResponse(message) {
        // 실제 API 호출 대신 Mock 응답 반환
        const responses = [
            "죄송합니다. 현재 AI 기능은 데모 모드입니다. 실제 API 연동을 위해서는 유효한 API 키가 필요합니다.",
            "연구에 대한 질문을 해주셨군요. API 키가 설정되면 더 자세한 답변을 드릴 수 있습니다.",
            "흥미로운 질문이네요. 완전한 AI 기능을 위해 API 설정을 완료해주세요."
        ];
        
        return new Promise(resolve => {
            setTimeout(() => {
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                resolve(randomResponse);
            }, 1000);
        });
    }

    // AI 패널 토글
    togglePanel() {
        const aiAssistant = document.querySelector('.ai-assistant');
        const toggleBtn = document.querySelector('.ai-toggle');
        
        if (aiAssistant && toggleBtn) {
            aiAssistant.classList.toggle('collapsed');
            
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (aiAssistant.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-left';
                } else {
                    icon.className = 'fas fa-chevron-right';
                }
            }
        }
    }
}

// 전역 AIManager 인스턴스 생성
window.aiManager = new AIManager();

// 전역 함수들
window.showAPISetup = function() {
    window.aiManager.showAPISetupModal();
};

window.sendAIMessage = function() {
    window.aiManager.sendMessage();
};

window.toggleAIPanel = function() {
    window.aiManager.togglePanel();
}; 