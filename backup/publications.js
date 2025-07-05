// Publications management module
class PublicationsManager {
    constructor() {
        this.publications = [];
        this.filteredPublications = [];
        this.isLoading = false;
    }
    
    async loadPublications() {
        this.isLoading = true;
        
        try {
            // Try to load from Firebase first
            if (typeof loadPublicationsFromFirestore === 'function') {
                this.publications = await loadPublicationsFromFirestore();
            } else {
                // Load sample data if Firebase is not available
                this.loadSampleData();
            }
            
            this.filteredPublications = [...this.publications];
            this.renderPublications();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading publications:', error);
            this.loadSampleData();
        } finally {
            this.isLoading = false;
        }
    }
    
    loadSampleData() {
        this.publications = [
            {
                id: 'pub1',
                title: "Advanced Machine Learning Techniques for Natural Language Processing",
                authors: "Dr. [Your Name], John Doe, Jane Smith",
                venue: "International Conference on Machine Learning (ICML)",
                year: 2024,
                abstract: "This paper presents novel approaches to improving NLP model performance through advanced machine learning techniques. We demonstrate significant improvements in accuracy and efficiency across multiple benchmark datasets.",
                links: {
                    pdf: "#",
                    code: "https://github.com/example/ml-nlp",
                    project: "#",
                    arxiv: "https://arxiv.org/abs/2024.xxxxx"
                },
                citations: 45,
                tags: ["Machine Learning", "NLP", "Deep Learning"],
                type: "conference",
                status: "published"
            },
            {
                id: 'pub2',
                title: "Efficient Neural Architecture Search for Computer Vision",
                authors: "Dr. [Your Name], Alice Johnson",
                venue: "IEEE Conference on Computer Vision and Pattern Recognition (CVPR)",
                year: 2023,
                abstract: "We propose a novel neural architecture search method that significantly reduces computational cost while maintaining high performance in computer vision tasks.",
                links: {
                    pdf: "#",
                    code: "https://github.com/example/nas-cv",
                    project: "#"
                },
                citations: 28,
                tags: ["Computer Vision", "Neural Architecture Search", "Efficiency"],
                type: "conference",
                status: "published"
            },
            {
                id: 'pub3',
                title: "Ethical Considerations in AI-Driven Decision Making",
                authors: "Dr. [Your Name], Bob Wilson, Carol Davis",
                venue: "Journal of AI Ethics",
                year: 2023,
                abstract: "This paper explores the ethical implications of AI systems in critical decision-making processes and proposes guidelines for responsible AI development.",
                links: {
                    pdf: "#",
                    project: "#"
                },
                citations: 67,
                tags: ["AI Ethics", "Decision Making", "Responsible AI"],
                type: "journal",
                status: "published"
            }
        ];
        
        this.filteredPublications = [...this.publications];
        AppState.publications = this.publications;
    }
    
    renderPublications() {
        const publicationsList = document.getElementById('publications-list');
        if (!publicationsList) return;
        
        if (this.isLoading) {
            publicationsList.innerHTML = this.getLoadingHTML();
            return;
        }
        
        if (this.filteredPublications.length === 0) {
            publicationsList.innerHTML = this.getEmptyStateHTML();
            return;
        }
        
        const publicationsHTML = this.filteredPublications
            .sort((a, b) => b.year - a.year)
            .map(pub => this.createPublicationCard(pub))
            .join('');
        
        publicationsList.innerHTML = publicationsHTML;
        
        // Add animations
        setTimeout(() => {
            document.querySelectorAll('.publication-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 50);
    }
    
    createPublicationCard(publication) {
        const isAdmin = AppState.isAdmin;
        
        return `
            <div class="publication-card" data-id="${publication.id}">
                <div class="publication-header">
                    <h3 class="publication-title">${publication.title}</h3>
                    <div class="publication-actions">
                        <span class="publication-year">${publication.year}</span>
                        ${isAdmin ? `
                            <button class="edit-btn admin-only" onclick="editPublication('${publication.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn admin-only" onclick="deletePublication('${publication.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="publication-meta">
                    <div class="publication-authors">
                        <i class="fas fa-users"></i>
                        ${publication.authors}
                    </div>
                    <div class="publication-venue">
                        <i class="fas fa-university"></i>
                        ${publication.venue}
                    </div>
                    ${publication.type ? `
                        <div class="publication-type">
                            <span class="type-badge type-${publication.type}">${publication.type}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="publication-abstract">
                    <p>${publication.abstract}</p>
                </div>
                
                ${publication.tags && publication.tags.length > 0 ? `
                    <div class="publication-tags">
                        ${publication.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="publication-footer">
                    <div class="publication-links">
                        ${publication.links.pdf ? `
                            <a href="${publication.links.pdf}" class="pub-link pdf" target="_blank">
                                <i class="fas fa-file-pdf"></i> PDF
                            </a>
                        ` : ''}
                        ${publication.links.code ? `
                            <a href="${publication.links.code}" class="pub-link code" target="_blank">
                                <i class="fas fa-code"></i> Code
                            </a>
                        ` : ''}
                        ${publication.links.project ? `
                            <a href="${publication.links.project}" class="pub-link project" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Project
                            </a>
                        ` : ''}
                        ${publication.links.arxiv ? `
                            <a href="${publication.links.arxiv}" class="pub-link arxiv" target="_blank">
                                <i class="fas fa-file-alt"></i> arXiv
                            </a>
                        ` : ''}
                    </div>
                    
                    <div class="publication-stats">
                        <span class="citations">
                            <i class="fas fa-quote-left"></i>
                            ${publication.citations || 0} citations
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getLoadingHTML() {
        return `
            <div class="loading-publications">
                <div class="loading-spinner"></div>
                <p>Loading publications...</p>
            </div>
        `;
    }
    
    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>No publications found</h3>
                <p>No publications match your current search criteria.</p>
                ${AppState.isAdmin ? `
                    <button class="btn btn-primary" onclick="showAddPublicationModal()">
                        <i class="fas fa-plus"></i> Add First Publication
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    filterPublications(searchTerm = '', yearFilter = 'all', typeFilter = 'all') {
        let filtered = [...this.publications];
        
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(pub => 
                pub.title.toLowerCase().includes(term) ||
                pub.authors.toLowerCase().includes(term) ||
                pub.venue.toLowerCase().includes(term) ||
                pub.abstract.toLowerCase().includes(term) ||
                (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(term)))
            );
        }
        
        // Year filter
        if (yearFilter !== 'all') {
            filtered = filtered.filter(pub => pub.year.toString() === yearFilter);
        }
        
        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(pub => pub.type === typeFilter);
        }
        
        this.filteredPublications = filtered;
        this.renderPublications();
        
        // Update search results count
        this.updateSearchResults(filtered.length, this.publications.length);
    }
    
    updateSearchResults(filteredCount, totalCount) {
        const resultInfo = document.getElementById('search-results-info');
        if (resultInfo) {
            if (filteredCount === totalCount) {
                resultInfo.textContent = `Showing all ${totalCount} publications`;
            } else {
                resultInfo.textContent = `Showing ${filteredCount} of ${totalCount} publications`;
            }
        }
    }
    
    async addPublication(publicationData) {
        try {
            // Add timestamp and ID
            const newPublication = {
                ...publicationData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save to Firebase if available
            if (typeof savePublication === 'function') {
                const savedId = await savePublication(newPublication);
                newPublication.id = savedId;
            }
            
            // Add to local state
            this.publications.unshift(newPublication);
            this.filteredPublications = [...this.publications];
            AppState.publications = this.publications;
            
            // Re-render
            this.renderPublications();
            this.updateStats();
            
            showToast('Publication added successfully!');
            
            // Track the action
            trackInteraction('add_publication', {
                title: publicationData.title,
                year: publicationData.year
            });
            
            return newPublication;
            
        } catch (error) {
            console.error('Error adding publication:', error);
            showToast('Error adding publication', 'error');
            throw error;
        }
    }
    
    async updatePublication(id, publicationData) {
        try {
            const index = this.publications.findIndex(pub => pub.id === id);
            if (index === -1) {
                throw new Error('Publication not found');
            }
            
            // Update data
            const updatedPublication = {
                ...this.publications[index],
                ...publicationData,
                updatedAt: new Date().toISOString()
            };
            
            // Save to Firebase if available
            if (typeof savePublication === 'function') {
                await savePublication(updatedPublication);
            }
            
            // Update local state
            this.publications[index] = updatedPublication;
            this.filteredPublications = [...this.publications];
            AppState.publications = this.publications;
            
            // Re-render
            this.renderPublications();
            
            showToast('Publication updated successfully!');
            
            return updatedPublication;
            
        } catch (error) {
            console.error('Error updating publication:', error);
            showToast('Error updating publication', 'error');
            throw error;
        }
    }
    
    async deletePublication(id) {
        try {
            // Remove from Firebase if available
            if (typeof db !== 'undefined' && db) {
                await db.collection('publications').doc(id).delete();
            }
            
            // Remove from local state
            this.publications = this.publications.filter(pub => pub.id !== id);
            this.filteredPublications = this.filteredPublications.filter(pub => pub.id !== id);
            AppState.publications = this.publications;
            
            // Re-render
            this.renderPublications();
            this.updateStats();
            
            showToast('Publication deleted successfully!');
            
        } catch (error) {
            console.error('Error deleting publication:', error);
            showToast('Error deleting publication', 'error');
            throw error;
        }
    }
    
    updateStats() {
        const publicationsCount = document.getElementById('publications-count');
        const pubBadge = document.getElementById('pub-badge');
        const citationsCount = document.getElementById('citations-count');
        const hIndexElement = document.getElementById('h-index');
        
        if (publicationsCount) {
            publicationsCount.textContent = this.publications.length;
        }
        
        if (pubBadge) {
            pubBadge.textContent = this.publications.length;
        }
        
        // Calculate total citations
        const totalCitations = this.publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
        if (citationsCount) {
            citationsCount.textContent = totalCitations;
        }
        
        // Calculate H-index
        const hIndex = this.calculateHIndex();
        if (hIndexElement) {
            hIndexElement.textContent = hIndex;
        }
    }
    
    calculateHIndex() {
        const sortedCitations = this.publications
            .map(pub => pub.citations || 0)
            .sort((a, b) => b - a);
        
        let hIndex = 0;
        for (let i = 0; i < sortedCitations.length; i++) {
            if (sortedCitations[i] >= i + 1) {
                hIndex = i + 1;
            } else {
                break;
            }
        }
        
        return hIndex;
    }
    
    exportPublications() {
        const data = {
            publications: this.publications,
            exportDate: new Date().toISOString(),
            totalCount: this.publications.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `publications-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Publications exported successfully!');
    }
}

// Initialize publications manager
const publicationsManager = new PublicationsManager();

// Global functions for UI interaction
function filterPublications() {
    const searchTerm = document.getElementById('pub-search')?.value || '';
    const yearFilter = document.getElementById('pub-filter')?.value || 'all';
    const typeFilter = document.getElementById('pub-type-filter')?.value || 'all';
    
    publicationsManager.filterPublications(searchTerm, yearFilter, typeFilter);
}

function showAddPublicationModal() {
    createPublicationModal();
}

function createPublicationModal(publication = null) {
    const isEdit = !!publication;
    const modalId = 'publication-modal';
    
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>${isEdit ? 'Edit Publication' : 'Add Publication'}</h2>
                    <button class="modal-close" onclick="closeModal('${modalId}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="publication-form" onsubmit="handlePublicationForm(event, ${isEdit ? `'${publication.id}'` : 'null'})">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pub-title">Title *</label>
                                <input type="text" id="pub-title" required value="${publication?.title || ''}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pub-authors">Authors *</label>
                                <input type="text" id="pub-authors" required value="${publication?.authors || ''}" 
                                       placeholder="John Doe, Jane Smith, ...">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pub-venue">Venue *</label>
                                <input type="text" id="pub-venue" required value="${publication?.venue || ''}"
                                       placeholder="Conference or Journal name">
                            </div>
                            <div class="form-group">
                                <label for="pub-year">Year *</label>
                                <input type="number" id="pub-year" required value="${publication?.year || new Date().getFullYear()}"
                                       min="1900" max="${new Date().getFullYear() + 5}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pub-type">Type</label>
                                <select id="pub-type">
                                    <option value="conference" ${publication?.type === 'conference' ? 'selected' : ''}>Conference</option>
                                    <option value="journal" ${publication?.type === 'journal' ? 'selected' : ''}>Journal</option>
                                    <option value="workshop" ${publication?.type === 'workshop' ? 'selected' : ''}>Workshop</option>
                                    <option value="preprint" ${publication?.type === 'preprint' ? 'selected' : ''}>Preprint</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="pub-citations">Citations</label>
                                <input type="number" id="pub-citations" value="${publication?.citations || 0}" min="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="pub-abstract">Abstract</label>
                            <textarea id="pub-abstract" rows="4" placeholder="Brief description of the work...">${publication?.abstract || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="pub-tags">Tags</label>
                            <input type="text" id="pub-tags" value="${publication?.tags?.join(', ') || ''}"
                                   placeholder="Machine Learning, NLP, Computer Vision">
                            <small>Separate tags with commas</small>
                        </div>
                        
                        <div class="links-section">
                            <h4>Links</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="pub-pdf">PDF URL</label>
                                    <input type="url" id="pub-pdf" value="${publication?.links?.pdf || ''}"
                                           placeholder="https://example.com/paper.pdf">
                                </div>
                                <div class="form-group">
                                    <label for="pub-code">Code URL</label>
                                    <input type="url" id="pub-code" value="${publication?.links?.code || ''}"
                                           placeholder="https://github.com/user/repo">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="pub-project">Project URL</label>
                                    <input type="url" id="pub-project" value="${publication?.links?.project || ''}"
                                           placeholder="https://project-website.com">
                                </div>
                                <div class="form-group">
                                    <label for="pub-arxiv">arXiv URL</label>
                                    <input type="url" id="pub-arxiv" value="${publication?.links?.arxiv || ''}"
                                           placeholder="https://arxiv.org/abs/2024.xxxxx">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-save"></i>
                                ${isEdit ? 'Update Publication' : 'Add Publication'}
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('${modalId}')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    showModal(modalId);
}

function handlePublicationForm(event, publicationId = null) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('pub-title').value.trim(),
        authors: document.getElementById('pub-authors').value.trim(),
        venue: document.getElementById('pub-venue').value.trim(),
        year: parseInt(document.getElementById('pub-year').value),
        type: document.getElementById('pub-type').value,
        citations: parseInt(document.getElementById('pub-citations').value) || 0,
        abstract: document.getElementById('pub-abstract').value.trim(),
        tags: document.getElementById('pub-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        links: {
            pdf: document.getElementById('pub-pdf').value.trim(),
            code: document.getElementById('pub-code').value.trim(),
            project: document.getElementById('pub-project').value.trim(),
            arxiv: document.getElementById('pub-arxiv').value.trim()
        }
    };
    
    if (publicationId) {
        // Update existing publication
        publicationsManager.updatePublication(publicationId, formData)
            .then(() => {
                closeModal('publication-modal');
            })
            .catch(error => {
                console.error('Error updating publication:', error);
            });
    } else {
        // Add new publication
        publicationsManager.addPublication(formData)
            .then(() => {
                closeModal('publication-modal');
            })
            .catch(error => {
                console.error('Error adding publication:', error);
            });
    }
}

function editPublication(id) {
    const publication = publicationsManager.publications.find(pub => pub.id === id);
    if (publication) {
        createPublicationModal(publication);
    }
}

function deletePublication(id) {
    const publication = publicationsManager.publications.find(pub => pub.id === id);
    if (!publication) return;
    
    if (confirm(`Are you sure you want to delete "${publication.title}"?`)) {
        publicationsManager.deletePublication(id);
    }
}

// Load publications when the publications section is shown
function loadPublications() {
    publicationsManager.loadPublications();
}

// Export functions
window.filterPublications = filterPublications;
window.showAddPublicationModal = showAddPublicationModal;
window.handlePublicationForm = handlePublicationForm;
window.editPublication = editPublication;
window.deletePublication = deletePublication;
window.loadPublications = loadPublications;
window.publicationsManager = publicationsManager; 