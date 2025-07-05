// Contact and feedback management module
class ContactManager {
    constructor() {
        this.contactMessages = [];
        this.feedback = [];
        this.collaborationProposals = [];
        this.emailService = new EmailService();
    }
    
    async sendContactMessage(messageData) {
        try {
            // Add timestamp and ID
            const message = {
                ...messageData,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                status: 'unread',
                userId: AppState.user?.uid || null,
                userEmail: AppState.user?.email || messageData.email
            };
            
            // Save to Firebase if available
            if (typeof saveContactMessage === 'function') {
                await saveContactMessage(message);
            }
            
            // Send email notification
            await this.emailService.sendContactEmail(message);
            
            // Add to local state
            this.contactMessages.push(message);
            
            // Track the interaction
            trackInteraction('contact_message_sent', {
                subject: messageData.subject,
                user_logged_in: !!AppState.user
            });
            
            showToast('메시지가 성공적으로 전송되었습니다!');
            
            return message;
            
        } catch (error) {
            console.error('Error sending contact message:', error);
            showToast('메시지 전송 중 오류가 발생했습니다.', 'error');
            throw error;
        }
    }
    
    async submitFeedback(feedbackData) {
        try {
            const feedback = {
                ...feedbackData,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                userId: AppState.user?.uid || null,
                userEmail: AppState.user?.email || null,
                userName: AppState.user?.displayName || 'Anonymous',
                currentSection: AppState.currentSection
            };
            
            // Save to Firebase if available
            if (typeof saveFeedback === 'function') {
                await saveFeedback(feedback);
            }
            
            // Add to local state
            this.feedback.push(feedback);
            
            // Re-render feedback if on feedback section
            if (AppState.currentSection === 'feedback') {
                this.renderFeedback();
            }
            
            // Track the interaction
            trackInteraction('feedback_submitted', {
                rating: feedbackData.rating,
                has_comment: !!feedbackData.comment,
                section: AppState.currentSection
            });
            
            showToast('피드백이 성공적으로 제출되었습니다!');
            
            return feedback;
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
            showToast('피드백 제출 중 오류가 발생했습니다.', 'error');
            throw error;
        }
    }
    
    async submitCollaborationProposal(proposalData) {
        try {
            const proposal = {
                ...proposalData,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                status: 'pending',
                userId: AppState.user?.uid || null
            };
            
            // Save to Firebase if available
            if (typeof db !== 'undefined' && db) {
                await db.collection('collaboration_proposals').add(proposal);
            }
            
            // Send email notification
            await this.emailService.sendCollaborationEmail(proposal);
            
            // Add to local state
            this.collaborationProposals.push(proposal);
            
            // Track the interaction
            trackInteraction('collaboration_proposal_submitted', {
                research_area: proposalData.researchArea,
                affiliation: proposalData.affiliation
            });
            
            showToast('협업 제안이 성공적으로 제출되었습니다!');
            
            return proposal;
            
        } catch (error) {
            console.error('Error submitting collaboration proposal:', error);
            showToast('협업 제안 제출 중 오류가 발생했습니다.', 'error');
            throw error;
        }
    }
    
    async loadFeedback() {
        try {
            if (typeof loadFeedbackFromFirestore === 'function') {
                this.feedback = await loadFeedbackFromFirestore();
            } else {
                // Load sample feedback
                this.loadSampleFeedback();
            }
            
            this.renderFeedback();
            
        } catch (error) {
            console.error('Error loading feedback:', error);
            this.loadSampleFeedback();
        }
    }
    
    loadSampleFeedback() {
        this.feedback = [
            {
                id: 'feedback1',
                rating: 5,
                comment: '정말 인상적인 연구들이네요! 특히 NLP 관련 연구가 흥미롭습니다.',
                userName: 'Dr. Kim',
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                currentSection: 'publications'
            },
            {
                id: 'feedback2',
                rating: 4,
                comment: 'AI 윤리에 대한 관점이 매우 유익했습니다.',
                userName: 'Lee Student',
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                currentSection: 'about'
            }
        ];
    }
    
    renderFeedback() {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;
        
        if (this.feedback.length === 0) {
            feedbackList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h3>No feedback yet</h3>
                    <p>Be the first to leave feedback!</p>
                </div>
            `;
            return;
        }
        
        const feedbackHTML = this.feedback
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(feedback => this.createFeedbackCard(feedback))
            .join('');
        
        feedbackList.innerHTML = feedbackHTML;
    }
    
    createFeedbackCard(feedback) {
        const date = new Date(feedback.timestamp);
        const timeAgo = this.getTimeAgo(date);
        
        return `
            <div class="feedback-card">
                <div class="feedback-header">
                    <div class="feedback-user">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info">
                            <div class="user-name">${feedback.userName || 'Anonymous'}</div>
                            <div class="feedback-time">${timeAgo}</div>
                        </div>
                    </div>
                    <div class="feedback-rating">
                        ${this.renderStars(feedback.rating)}
                    </div>
                </div>
                
                ${feedback.comment ? `
                    <div class="feedback-comment">
                        <p>${feedback.comment}</p>
                    </div>
                ` : ''}
                
                <div class="feedback-meta">
                    <span class="feedback-section">
                        <i class="fas fa-tag"></i>
                        ${feedback.currentSection || 'General'}
                    </span>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('<i class="fas fa-star active"></i>');
            } else {
                stars.push('<i class="fas fa-star"></i>');
            }
        }
        return stars.join('');
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays}일 전`;
        } else if (diffHours > 0) {
            return `${diffHours}시간 전`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes}분 전`;
        } else {
            return '방금 전';
        }
    }
    
    // Admin functions
    async getContactMessages() {
        try {
            if (typeof db !== 'undefined' && db) {
                const snapshot = await db.collection('contact_messages')
                    .orderBy('timestamp', 'desc')
                    .get();
                
                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                return messages;
            }
            
            return this.contactMessages;
            
        } catch (error) {
            console.error('Error getting contact messages:', error);
            return [];
        }
    }
    
    async markMessageAsRead(messageId) {
        try {
            if (typeof db !== 'undefined' && db) {
                await db.collection('contact_messages').doc(messageId).update({
                    status: 'read',
                    readAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Update local state
            const message = this.contactMessages.find(msg => msg.id === messageId);
            if (message) {
                message.status = 'read';
                message.readAt = new Date().toISOString();
            }
            
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }
}

// Email service for handling email functionality
class EmailService {
    constructor() {
        this.emailJSConfig = {
            serviceID: 'your_emailjs_service_id',
            templateID: 'your_emailjs_template_id',
            userID: 'your_emailjs_user_id'
        };
    }
    
    async sendContactEmail(messageData) {
        try {
            // Using EmailJS for client-side email sending
            // In a real implementation, you would configure EmailJS or use a backend service
            
            const templateParams = {
                from_name: messageData.name,
                from_email: messageData.email,
                subject: messageData.subject,
                message: messageData.message,
                reply_to: messageData.email,
                timestamp: new Date().toLocaleString()
            };
            
            // Simulate email sending
            console.log('Sending contact email:', templateParams);
            
            // In production, uncomment and configure EmailJS:
            // await emailjs.send(
            //     this.emailJSConfig.serviceID,
            //     this.emailJSConfig.templateID,
            //     templateParams,
            //     this.emailJSConfig.userID
            // );
            
            return true;
            
        } catch (error) {
            console.error('Error sending contact email:', error);
            throw error;
        }
    }
    
    async sendCollaborationEmail(proposalData) {
        try {
            const templateParams = {
                from_name: proposalData.name,
                from_email: proposalData.email,
                affiliation: proposalData.affiliation,
                research_area: proposalData.researchArea,
                proposal: proposalData.proposal,
                reply_to: proposalData.email,
                timestamp: new Date().toLocaleString()
            };
            
            console.log('Sending collaboration email:', templateParams);
            
            // In production, configure EmailJS for collaboration emails
            return true;
            
        } catch (error) {
            console.error('Error sending collaboration email:', error);
            throw error;
        }
    }
    
    async sendAutoReply(recipientEmail, messageType = 'contact') {
        try {
            const autoReplyTemplates = {
                contact: {
                    subject: 'Thank you for your message',
                    message: 'Thank you for reaching out. I will get back to you as soon as possible.'
                },
                collaboration: {
                    subject: 'Thank you for your collaboration proposal',
                    message: 'Thank you for your interest in collaboration. I will review your proposal and respond soon.'
                }
            };
            
            const template = autoReplyTemplates[messageType];
            
            console.log('Sending auto-reply:', {
                to: recipientEmail,
                subject: template.subject,
                message: template.message
            });
            
            return true;
            
        } catch (error) {
            console.error('Error sending auto-reply:', error);
            throw error;
        }
    }
}

// Initialize contact manager
const contactManager = new ContactManager();

// Form handlers
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim()
    };
    
    contactManager.sendContactMessage(formData)
        .then(() => {
            event.target.reset();
        })
        .catch(error => {
            console.error('Contact form error:', error);
        });
}

function handleFeedbackForm(event) {
    event.preventDefault();
    
    const ratingElement = document.querySelector('.rating-stars .active');
    const rating = ratingElement ? parseInt(ratingElement.dataset.rating) : 0;
    
    if (rating === 0) {
        showToast('평점을 선택해주세요.', 'error');
        return;
    }
    
    const formData = {
        rating: rating,
        comment: document.getElementById('feedback-comment').value.trim()
    };
    
    contactManager.submitFeedback(formData)
        .then(() => {
            event.target.reset();
            resetRating();
        })
        .catch(error => {
            console.error('Feedback form error:', error);
        });
}

function handleCollaborationForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('collab-name').value.trim(),
        affiliation: document.getElementById('collab-affiliation').value.trim(),
        email: document.getElementById('collab-email').value.trim(),
        researchArea: document.getElementById('collab-research-area').value.trim(),
        proposal: document.getElementById('collab-proposal').value.trim()
    };
    
    contactManager.submitCollaborationProposal(formData)
        .then(() => {
            event.target.reset();
        })
        .catch(error => {
            console.error('Collaboration form error:', error);
        });
}

// Rating system
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.rating-stars i');
    
    stars.forEach((star, index) => {
        star.classList.remove('active');
        if (index < rating) {
            star.classList.add('active');
        }
    });
    
    // Update star data attribute for form submission
    stars[rating - 1].dataset.rating = rating;
}

function resetRating() {
    currentRating = 0;
    document.querySelectorAll('.rating-stars i').forEach(star => {
        star.classList.remove('active');
    });
}

// Load feedback when needed
function loadFeedback() {
    contactManager.loadFeedback();
}

// Newsletter subscription
function subscribeToNewsletter(email) {
    // This would typically integrate with a newsletter service
    console.log('Newsletter subscription:', email);
    
    trackInteraction('newsletter_subscription', { email });
    
    showToast('뉴스레터 구독이 완료되었습니다!');
}

// Admin functions for managing messages
function showContactMessagesModal() {
    if (!AppState.isAdmin) {
        showToast('관리자 권한이 필요합니다.', 'error');
        return;
    }
    
    createContactMessagesModal();
}

function createContactMessagesModal() {
    const modalHTML = `
        <div id="contact-messages-modal" class="modal">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Contact Messages</h2>
                    <button class="modal-close" onclick="closeModal('contact-messages-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="contact-messages-list">
                        <div class="loading-spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal('contact-messages-modal');
    
    // Load and display messages
    loadContactMessagesForAdmin();
}

async function loadContactMessagesForAdmin() {
    try {
        const messages = await contactManager.getContactMessages();
        const messagesList = document.getElementById('contact-messages-list');
        
        if (messages.length === 0) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <h3>No messages</h3>
                    <p>No contact messages have been received yet.</p>
                </div>
            `;
            return;
        }
        
        const messagesHTML = messages.map(message => `
            <div class="message-card ${message.status === 'unread' ? 'unread' : ''}">
                <div class="message-header">
                    <div class="message-sender">
                        <strong>${message.name}</strong>
                        <span class="message-email">${message.email}</span>
                    </div>
                    <div class="message-time">
                        ${new Date(message.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="message-subject">
                    <strong>${message.subject}</strong>
                </div>
                <div class="message-content">
                    ${message.message}
                </div>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="replyToMessage('${message.id}')">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    ${message.status === 'unread' ? `
                        <button class="btn btn-secondary" onclick="markAsRead('${message.id}')">
                            <i class="fas fa-check"></i> Mark as Read
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        messagesList.innerHTML = messagesHTML;
        
    } catch (error) {
        console.error('Error loading contact messages:', error);
        document.getElementById('contact-messages-list').innerHTML = `
            <div class="error-state">
                <h3>Error loading messages</h3>
                <p>Unable to load contact messages. Please try again.</p>
            </div>
        `;
    }
}

function markAsRead(messageId) {
    contactManager.markMessageAsRead(messageId)
        .then(() => {
            // Update UI
            const messageCard = document.querySelector(`[onclick="markAsRead('${messageId}')"]`).closest('.message-card');
            if (messageCard) {
                messageCard.classList.remove('unread');
                const markAsReadBtn = messageCard.querySelector(`[onclick="markAsRead('${messageId}')"]`);
                if (markAsReadBtn) {
                    markAsReadBtn.remove();
                }
            }
        })
        .catch(error => {
            console.error('Error marking message as read:', error);
        });
}

function replyToMessage(messageId) {
    // This would open an email client or compose window
    // For now, we'll just show a placeholder
    showToast('이메일 클라이언트에서 답장을 작성하세요.');
}

// Export functions
window.handleContactForm = handleContactForm;
window.handleFeedbackForm = handleFeedbackForm;
window.handleCollaborationForm = handleCollaborationForm;
window.setRating = setRating;
window.resetRating = resetRating;
window.loadFeedback = loadFeedback;
window.subscribeToNewsletter = subscribeToNewsletter;
window.showContactMessagesModal = showContactMessagesModal;
window.markAsRead = markAsRead;
window.replyToMessage = replyToMessage;
window.contactManager = contactManager; 