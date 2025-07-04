// AI Assistant module
class AIAssistant {
    constructor() {
        this.apiKeys = {
            openai: null,
            anthropic: null,
            google: null
        };
        
        this.currentModel = localStorage.getItem('ai_model') || 'gpt-4';
        this.chatHistory = [];
        this.isEnabled = false;
        
        this.initialize();
    }
    
    initialize() {
        // Load API keys from localStorage
        this.loadAPIKeys();
        
        // Check if any API keys are available
        this.updateAvailability();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load chat history from localStorage
        this.loadChatHistory();
        
        // Update UI
        this.updateUI();
    }
    
    loadAPIKeys() {
        // Load API keys from localStorage
        this.apiKeys.openai = localStorage.getItem('openai_api_key') || null;
        this.apiKeys.anthropic = localStorage.getItem('anthropic_api_key') || null;
        this.apiKeys.google = localStorage.getItem('google_api_key') || null;
        
        console.log('API keys loaded:', {
            openai: !!this.apiKeys.openai,
            anthropic: !!this.apiKeys.anthropic,
            google: !!this.apiKeys.google
        });
    }
    
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
            aiSend.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        if (aiModel) {
            aiModel.addEventListener('change', (e) => {
                this.currentModel = e.target.value;
                localStorage.setItem('ai_model', this.currentModel);
                this.updateAvailability();
            });
            
            aiModel.value = this.currentModel;
        }
    }
    
    updateAvailability() {
        const modelRequirements = {
            'gpt-4': 'openai',
            'gpt-3.5-turbo': 'openai',
            'claude-3': 'anthropic',
            'claude-3-haiku': 'anthropic',
            'gemini-pro': 'google'
        };
        
        const requiredProvider = modelRequirements[this.currentModel];
        this.isEnabled = !!this.apiKeys[requiredProvider];
        
        this.updateUI();
    }
    
    updateUI() {
        const aiInput = document.getElementById('ai-input');
        const aiSend = document.getElementById('ai-send');
        
        if (aiInput && aiSend) {
            aiInput.disabled = !this.isEnabled;
            aiSend.disabled = !this.isEnabled;
            
            if (this.isEnabled) {
                aiInput.placeholder = 'Ask about research...';
            } else {
                aiInput.placeholder = 'API key required - click Setup API Keys';
            }
        }
    }
    
    async sendMessage() {
        const aiInput = document.getElementById('ai-input');
        if (!aiInput || !this.isEnabled) return;
        
        const message = aiInput.value.trim();
        if (!message) return;
        
        // Clear input
        aiInput.value = '';
        
        // Add user message to chat
        this.addMessageToChat('user', message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add AI response to chat
            this.addMessageToChat('assistant', response);
            
            // Save chat history
            this.saveChatHistory();
            
            // Track interaction
            trackInteraction('ai_chat', {
                model: this.currentModel,
                message_length: message.length,
                response_length: response.length
            });
            
        } catch (error) {
            console.error('AI response error:', error);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add error message
            this.addMessageToChat('assistant', '죄송합니다. 응답 생성 중 오류가 발생했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.');
        }
    }
    
    async getAIResponse(message) {
        const context = this.buildContext();
        
        switch (this.currentModel) {
            case 'gpt-4':
            case 'gpt-3.5-turbo':
                return await this.getOpenAIResponse(message, context);
            case 'claude-3':
            case 'claude-3-haiku':
                return await this.getAnthropicResponse(message, context);
            case 'gemini-pro':
                return await this.getGoogleResponse(message, context);
            default:
                throw new Error('Unsupported model');
        }
    }
    
    buildContext() {
        // Build context from current page content
        const currentSection = AppState.currentSection;
        let context = `You are an AI assistant for a researcher's profile page. Current section: ${currentSection}.\n\n`;
        
        // Add relevant data based on current section
        switch (currentSection) {
            case 'publications':
                context += `Publications data:\n${JSON.stringify(AppState.publications, null, 2)}\n\n`;
                break;
            case 'projects':
                context += `Projects data:\n${JSON.stringify(AppState.projects, null, 2)}\n\n`;
                break;
            case 'awards':
                context += `Awards data:\n${JSON.stringify(AppState.awards, null, 2)}\n\n`;
                break;
        }
        
        context += 'Please answer questions about the researcher\'s work, publications, projects, and research interests. Be helpful and informative.';
        
        return context;
    }
    
    async getOpenAIResponse(message, context) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.openai}`
            },
            body: JSON.stringify({
                model: this.currentModel,
                messages: [
                    { role: 'system', content: context },
                    ...this.chatHistory.slice(-10), // Last 10 messages for context
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    async getAnthropicResponse(message, context) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKeys.anthropic,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.currentModel.replace('claude-3', 'claude-3-sonnet-20240229'),
                max_tokens: 500,
                messages: [
                    { role: 'user', content: `${context}\n\nQuestion: ${message}` }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    async getGoogleResponse(message, context) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.google}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${context}\n\nQuestion: ${message}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Google API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    addMessageToChat(role, content) {
        const aiChat = document.getElementById('ai-chat');
        if (!aiChat) return;
        
        // Remove welcome message if it exists
        const welcomeMsg = aiChat.querySelector('.ai-welcome');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${role}`;
        
        const iconClass = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const roleText = role === 'user' ? 'You' : 'AI';
        
        messageDiv.innerHTML = `
            <div class="ai-message-header">
                <i class="${iconClass}"></i>
                <span class="ai-message-role">${roleText}</span>
                <span class="ai-message-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="ai-message-content">${this.formatMessage(content)}</div>
        `;
        
        aiChat.appendChild(messageDiv);
        
        // Scroll to bottom
        aiChat.scrollTop = aiChat.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({ role, content });
        
        // Limit chat history to last 20 messages
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }
    }
    
    formatMessage(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }
    
    showTypingIndicator() {
        const aiChat = document.getElementById('ai-chat');
        if (!aiChat) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-message-header">
                <i class="fas fa-robot"></i>
                <span class="ai-message-role">AI</span>
            </div>
            <div class="ai-typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        aiChat.appendChild(typingDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.querySelector('.ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    saveChatHistory() {
        localStorage.setItem('ai_chat_history', JSON.stringify(this.chatHistory));
    }
    
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('ai_chat_history');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                
                // Restore chat messages
                const aiChat = document.getElementById('ai-chat');
                if (aiChat && this.chatHistory.length > 0) {
                    // Clear welcome message
                    aiChat.innerHTML = '';
                    
                    // Add saved messages
                    this.chatHistory.forEach(msg => {
                        this.addMessageToChat(msg.role, msg.content);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.chatHistory = [];
        }
    }
    
    clearChatHistory() {
        this.chatHistory = [];
        localStorage.removeItem('ai_chat_history');
        
        const aiChat = document.getElementById('ai-chat');
        if (aiChat) {
            aiChat.innerHTML = `
                <div class="ai-welcome">
                    <p data-i18n="ai_welcome">안녕하세요! 연구 관련 질문이나 페이지 내용에 대해 문의해주세요.</p>
                </div>
            `;
            updateLanguage();
        }
    }
    
    setAPIKey(provider, key) {
        this.apiKeys[provider] = key;
        localStorage.setItem(`${provider}_api_key`, key);
        this.updateAvailability();
    }
    
    getAPIKey(provider) {
        return this.apiKeys[provider];
    }
}

// Initialize AI Assistant
const aiAssistant = new AIAssistant();

// API Setup functions
function showAPISetup() {
    createAPISetupModal();
}

function createAPISetupModal() {
    const modalHTML = `
        <div id="api-setup-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 data-i18n="api_setup">API Keys Setup</h2>
                    <button class="modal-close" onclick="closeModal('api-setup-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="api-info">
                        <p data-i18n="api_info">API 키를 설정하여 AI Assistant를 사용하세요. 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
                    </div>
                    
                    <form id="api-setup-form" onsubmit="handleAPISetup(event)">
                        <div class="form-group">
                            <label for="openai-key">
                                <i class="fas fa-robot"></i>
                                OpenAI API Key (GPT-4, GPT-3.5)
                            </label>
                            <div class="api-key-input-group">
                                <input type="password" id="openai-key" placeholder="sk-..." 
                                       value="${aiAssistant.getAPIKey('openai') || ''}"
                                       oninput="updateSaveButtonState()">
                                <button type="button" class="verify-btn" onclick="verifyAPIKey('openai')" id="verify-openai">
                                    <i class="fas fa-check-circle"></i> Verify
                                </button>
                                <span class="verification-status" id="openai-status"></span>
                            </div>
                            <small>Get your key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a></small>
                        </div>
                        
                        <div class="form-group">
                            <label for="anthropic-key">
                                <i class="fas fa-brain"></i>
                                Anthropic API Key (Claude-3)
                            </label>
                            <div class="api-key-input-group">
                                <input type="password" id="anthropic-key" placeholder="sk-ant-..." 
                                       value="${aiAssistant.getAPIKey('anthropic') || ''}"
                                       oninput="updateSaveButtonState()">
                                <button type="button" class="verify-btn" onclick="verifyAPIKey('anthropic')" id="verify-anthropic">
                                    <i class="fas fa-check-circle"></i> Verify
                                </button>
                                <span class="verification-status" id="anthropic-status"></span>
                            </div>
                            <small>Get your key from <a href="https://console.anthropic.com/" target="_blank">Anthropic Console</a></small>
                        </div>
                        
                        <div class="form-group">
                            <label for="google-key">
                                <i class="fab fa-google"></i>
                                Google API Key (Gemini Pro)
                            </label>
                            <div class="api-key-input-group">
                                <input type="password" id="google-key" placeholder="AI..." 
                                       value="${aiAssistant.getAPIKey('google') || ''}"
                                       oninput="updateSaveButtonState()">
                                <button type="button" class="verify-btn" onclick="verifyAPIKey('google')" id="verify-google">
                                    <i class="fas fa-check-circle"></i> Verify
                                </button>
                                <span class="verification-status" id="google-status"></span>
                            </div>
                            <small>Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></small>
                        </div>
                        
                        <div class="api-notice">
                            <i class="fas fa-info-circle"></i>
                            <span data-i18n="api_notice">API 키는 로컬에만 저장되며 서버로 전송되지 않습니다.</span>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="submit-btn" id="save-api-keys" disabled>
                                <i class="fas fa-save"></i>
                                <span data-i18n="save_keys">Save Keys</span>
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="clearAPIKeys()">
                                <i class="fas fa-trash"></i>
                                <span data-i18n="clear_keys">Clear All</span>
                            </button>
                        </div>
                    </form>
                    
                    <div class="api-status">
                        <h4 data-i18n="api_status">API Status</h4>
                        <div class="status-grid">
                            <div class="status-item">
                                <span>OpenAI:</span>
                                <span class="status ${aiAssistant.getAPIKey('openai') ? 'active' : 'inactive'}" id="openai-config-status">
                                    ${aiAssistant.getAPIKey('openai') ? 'Configured' : 'Not configured'}
                                </span>
                            </div>
                            <div class="status-item">
                                <span>Anthropic:</span>
                                <span class="status ${aiAssistant.getAPIKey('anthropic') ? 'active' : 'inactive'}" id="anthropic-config-status">
                                    ${aiAssistant.getAPIKey('anthropic') ? 'Configured' : 'Not configured'}
                                </span>
                            </div>
                            <div class="status-item">
                                <span>Google:</span>
                                <span class="status ${aiAssistant.getAPIKey('google') ? 'active' : 'inactive'}" id="google-config-status">
                                    ${aiAssistant.getAPIKey('google') ? 'Configured' : 'Not configured'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    updateLanguage();
    showModal('api-setup-modal');
    
    // Check verification status for existing keys
    updateVerificationStatus();
}

// API 키 검증 기능
async function verifyAPIKey(provider) {
    const button = document.getElementById(`verify-${provider}`);
    const status = document.getElementById(`${provider}-status`);
    const input = document.getElementById(`${provider}-key`);
    
    const apiKey = input.value.trim();
    if (!apiKey) {
        status.innerHTML = '<span class="error"><i class="fas fa-exclamation-triangle"></i> No key provided</span>';
        return;
    }
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    status.innerHTML = '<span class="loading"><i class="fas fa-spinner fa-spin"></i> Verifying...</span>';
    
    try {
        let isValid = false;
        
        switch (provider) {
            case 'openai':
                isValid = await verifyOpenAIKey(apiKey);
                break;
            case 'anthropic':
                isValid = await verifyAnthropicKey(apiKey);
                break;
            case 'google':
                isValid = await verifyGoogleKey(apiKey);
                break;
        }
        
        if (isValid) {
            status.innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Valid key</span>';
            button.innerHTML = '<i class="fas fa-check"></i> Verified';
            button.classList.add('verified');
            
            // Store verification status
            localStorage.setItem(`${provider}_key_verified`, 'true');
            
            updateSaveButtonState();
        } else {
            status.innerHTML = '<span class="error"><i class="fas fa-times-circle"></i> Invalid key</span>';
            button.innerHTML = '<i class="fas fa-check-circle"></i> Verify';
            button.classList.remove('verified');
            localStorage.removeItem(`${provider}_key_verified`);
        }
    } catch (error) {
        console.error(`Error verifying ${provider} key:`, error);
        status.innerHTML = '<span class="error"><i class="fas fa-exclamation-triangle"></i> Verification failed</span>';
        button.innerHTML = '<i class="fas fa-check-circle"></i> Verify';
        button.classList.remove('verified');
    }
    
    button.disabled = false;
}

// OpenAI 키 검증
async function verifyOpenAIKey(apiKey) {
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('OpenAI verification error:', error);
        return false;
    }
}

// Anthropic 키 검증
async function verifyAnthropicKey(apiKey) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'test' }]
            })
        });
        
        // 401은 인증 실패, 다른 상태는 키가 유효할 수 있음
        return response.status !== 401;
    } catch (error) {
        console.error('Anthropic verification error:', error);
        return false;
    }
}

// Google 키 검증
async function verifyGoogleKey(apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            method: 'GET'
        });
        
        return response.ok;
    } catch (error) {
        console.error('Google verification error:', error);
        return false;
    }
}

// 저장 버튼 상태 업데이트
function updateSaveButtonState() {
    const saveButton = document.getElementById('save-api-keys');
    if (!saveButton) return;
    
    const openaiVerified = localStorage.getItem('openai_key_verified') === 'true';
    const anthropicVerified = localStorage.getItem('anthropic_key_verified') === 'true';
    const googleVerified = localStorage.getItem('google_key_verified') === 'true';
    
    const openaiKey = document.getElementById('openai-key')?.value.trim();
    const anthropicKey = document.getElementById('anthropic-key')?.value.trim();
    const googleKey = document.getElementById('google-key')?.value.trim();
    
    // 최소 하나의 키가 검증되었거나, 기존에 저장된 키가 있는 경우 저장 버튼 활성화
    const hasValidKey = openaiVerified || anthropicVerified || googleVerified ||
                       (openaiKey && aiAssistant.getAPIKey('openai')) ||
                       (anthropicKey && aiAssistant.getAPIKey('anthropic')) ||
                       (googleKey && aiAssistant.getAPIKey('google'));
    
    saveButton.disabled = !hasValidKey;
}

// 검증 상태 업데이트
function updateVerificationStatus() {
    ['openai', 'anthropic', 'google'].forEach(provider => {
        const isVerified = localStorage.getItem(`${provider}_key_verified`) === 'true';
        if (isVerified) {
            const button = document.getElementById(`verify-${provider}`);
            const status = document.getElementById(`${provider}-status`);
            
            if (button && status) {
                button.innerHTML = '<i class="fas fa-check"></i> Verified';
                button.classList.add('verified');
                status.innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Valid key</span>';
            }
        }
    });
    
    updateSaveButtonState();
}

function handleAPISetup(event) {
    event.preventDefault();
    
    const openaiKey = document.getElementById('openai-key').value.trim();
    const anthropicKey = document.getElementById('anthropic-key').value.trim();
    const googleKey = document.getElementById('google-key').value.trim();
    
    // Save API keys only if they are verified or if they're existing keys
    let savedCount = 0;
    
    if (openaiKey && (localStorage.getItem('openai_key_verified') === 'true' || aiAssistant.getAPIKey('openai'))) {
        aiAssistant.setAPIKey('openai', openaiKey);
        savedCount++;
    }
    if (anthropicKey && (localStorage.getItem('anthropic_key_verified') === 'true' || aiAssistant.getAPIKey('anthropic'))) {
        aiAssistant.setAPIKey('anthropic', anthropicKey);
        savedCount++;
    }
    if (googleKey && (localStorage.getItem('google_key_verified') === 'true' || aiAssistant.getAPIKey('google'))) {
        aiAssistant.setAPIKey('google', googleKey);
        savedCount++;
    }
    
    if (savedCount > 0) {
        showToast(`${savedCount}개의 API 키가 저장되었습니다.`);
        closeModal('api-setup-modal');
    } else {
        showToast('저장할 수 있는 검증된 API 키가 없습니다.', 'error');
    }
}

function clearAPIKeys() {
    if (confirm('모든 API 키를 삭제하시겠습니까?')) {
        aiAssistant.setAPIKey('openai', '');
        aiAssistant.setAPIKey('anthropic', '');
        aiAssistant.setAPIKey('google', '');
        
        // Clear form
        document.getElementById('openai-key').value = '';
        document.getElementById('anthropic-key').value = '';
        document.getElementById('google-key').value = '';
        
        showToast('API 키가 삭제되었습니다.');
    }
}

function sendAIMessage() {
    aiAssistant.sendMessage();
}

function clearAIChat() {
    if (confirm('채팅 기록을 모두 삭제하시겠습니까?')) {
        aiAssistant.clearChatHistory();
        showToast('채팅 기록이 삭제되었습니다.');
    }
}

// Export functions for global use
window.showAPISetup = showAPISetup;
window.handleAPISetup = handleAPISetup;
window.clearAPIKeys = clearAPIKeys;
window.sendAIMessage = sendAIMessage;
window.clearAIChat = clearAIChat;
window.aiAssistant = aiAssistant; 