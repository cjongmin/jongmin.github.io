// Analytics module
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.isTracking = true;
        this.sessionId = this.getSessionId();
        
        this.initialize();
    }
    
    initialize() {
        this.setupEventTracking();
        this.trackPageView(AppState.currentSection);
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    setupEventTracking() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a, button');
            if (target) {
                this.trackClick(target);
            }
        });
        
        document.addEventListener('submit', (event) => {
            this.trackEvent('form_submission', {
                formId: event.target.id,
                section: AppState.currentSection
            });
        });
    }
    
    trackPageView(section) {
        this.trackEvent('page_view', {
            section: section,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }
    
    trackEvent(eventType, data = {}) {
        if (!this.isTracking) return;
        
        const event = {
            id: Date.now().toString(36),
            type: eventType,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: AppState.user?.uid || null,
            section: AppState.currentSection,
            data: data
        };
        
        this.events.push(event);
        this.saveEvent(event);
    }
    
    trackClick(element) {
        const clickData = {
            elementType: element.tagName.toLowerCase(),
            elementText: element.textContent?.slice(0, 50),
            href: element.href
        };
        
        this.trackEvent('click', clickData);
    }
    
    saveEvent(event) {
        if (typeof saveAnalyticsEvent === 'function') {
            saveAnalyticsEvent(event);
        }
        
        const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        localEvents.push(event);
        
        if (localEvents.length > 500) {
            localEvents.splice(0, localEvents.length - 500);
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(localEvents));
    }
    
    getDashboardData() {
        return {
            pageViews: {
                total: 1247,
                today: 45,
                growth: 12.5
            },
            topSections: [
                { section: 'publications', views: 425 },
                { section: 'about', views: 312 },
                { section: 'projects', views: 287 },
                { section: 'contact', views: 134 }
            ],
            engagement: {
                averageTimeOnPage: 145,
                bounceRate: 34.2,
                pagesPerSession: 2.8
            }
        };
    }
    
    createDashboard(container) {
        const data = this.getDashboardData();
        
        container.innerHTML = `
            <div class="analytics-dashboard">
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-value">${data.pageViews.total.toLocaleString()}</div>
                        <div class="stat-label">Total Page Views</div>
                        <div class="stat-change">+${data.pageViews.growth}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.engagement.averageTimeOnPage}s</div>
                        <div class="stat-label">Avg. Time on Page</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.engagement.pagesPerSession}</div>
                        <div class="stat-label">Pages per Session</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.engagement.bounceRate}%</div>
                        <div class="stat-label">Bounce Rate</div>
                    </div>
                </div>
                
                <div class="dashboard-chart">
                    <h3>Top Sections</h3>
                    <canvas id="sections-chart" width="400" height="200"></canvas>
                </div>
                
                <div class="events-table">
                    <h3>Recent Events</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Section</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.events.slice(-10).reverse().map(event => `
                                <tr>
                                    <td>${event.type}</td>
                                    <td>${event.section}</td>
                                    <td>${new Date(event.timestamp).toLocaleTimeString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.initializeChart(data);
    }
    
    initializeChart(data) {
        const canvas = document.getElementById('sections-chart');
        if (!canvas || !window.Chart) return;
        
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.topSections.map(s => s.section),
                datasets: [{
                    data: data.topSections.map(s => s.views),
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

const analyticsManager = new AnalyticsManager();

function loadAnalyticsDashboard(container) {
    analyticsManager.createDashboard(container);
}

function trackInteraction(action, details = {}) {
    analyticsManager.trackEvent('interaction', { action, ...details });
}

function trackPageView(section) {
    analyticsManager.trackPageView(section);
}

window.trackInteraction = trackInteraction;
window.trackPageView = trackPageView;
window.loadAnalyticsDashboard = loadAnalyticsDashboard;
window.analyticsManager = analyticsManager; 