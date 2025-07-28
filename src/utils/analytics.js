class SimpleAnalytics {
  constructor() {
    this.data = {
      sessionId: this.generateId(),
      startTime: Date.now(),
      pageViews: [],
      events: [],
      performance: {}
    };
    this.initialized = false;
  }

  generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  init() {
    if (this.initialized) return;
    
    try {
      const saved = localStorage.getItem('portfolio_analytics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.startTime > Date.now() - 86400000) {
          this.data = { ...this.data, ...parsed };
        }
      }
      this.initialized = true;
      console.log('📊 Analytics ready');
    } catch (error) {
      console.warn('Analytics init error:', error);
    }
  }

  trackPageView(path) {
    if (!this.initialized) this.init();
    
    try {
      this.data.pageViews.push({
        path,
        timestamp: Date.now(),
        title: document.title || 'Unknown'
      });
      this.save();
    } catch (error) {
      console.warn('Page view tracking error:', error);
    }
  }

  trackEvent(name, properties = {}) {
    if (!this.initialized) this.init();
    
    try {
      this.data.events.push({
        name,
        properties,
        timestamp: Date.now()
      });
      this.save();
    } catch (error) {
      console.warn('Event tracking error:', error);
    }
  }

  trackPerformance() {
    if (!this.initialized) this.init();
    
    try {
      if (performance && performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.data.performance = {
            loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            timestamp: Date.now()
          };
          this.save();
        }
      }
    } catch (error) {
      console.warn('Performance tracking error:', error);
    }
  }

  getStats() {
    try {
      const duration = Math.round((Date.now() - this.data.startTime) / 1000);
      return {
        sessionId: this.data.sessionId,
        duration,
        pageViews: this.data.pageViews.length,
        events: this.data.events.length,
        performance: this.data.performance
      };
    } catch (error) {
      console.warn('Get stats error:', error);
      return { duration: 0, pageViews: 0, events: 0, performance: {} };
    }
  }

  exportData() {
    try {
      const data = {
        ...this.data,
        stats: this.getStats(),
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Export error:', error);
    }
  }

  clearData() {
    try {
      this.data = {
        sessionId: this.generateId(),
        startTime: Date.now(),
        pageViews: [],
        events: [],
        performance: {}
      };
      localStorage.removeItem('portfolio_analytics');
      console.log('📊 Analytics cleared');
    } catch (error) {
      console.warn('Clear data error:', error);
    }
  }

  save() {
    try {
      localStorage.setItem('portfolio_analytics', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Save error:', error);
    }
  }
}

const analytics = new SimpleAnalytics();

export const initAnalytics = () => {
  try {
    analytics.init();
  } catch (error) {
    console.warn('Init analytics error:', error);
  }
};

export const trackPageView = (path, title) => {
  try {
    analytics.trackPageView(path, title);
  } catch (error) {
    console.warn('Track page view error:', error);
  }
};

export const trackEvent = (name, properties) => {
  try {
    analytics.trackEvent(name, properties);
  } catch (error) {
    console.warn('Track event error:', error);
  }
};

export const trackPerformance = () => {
  try {
    analytics.trackPerformance();
  } catch (error) {
    console.warn('Track performance error:', error);
  }
};

export const getSessionStats = () => {
  try {
    return analytics.getStats();
  } catch (error) {
    console.warn('Get session stats error:', error);
    return { duration: 0, pageViews: 0, events: 0, performance: {} };
  }
};

export const exportAnalyticsData = () => {
  try {
    analytics.exportData();
  } catch (error) {
    console.warn('Export analytics error:', error);
  }
};

export const clearAnalyticsData = () => {
  try {
    analytics.clearData();
  } catch (error) {
    console.warn('Clear analytics error:', error);
  }
};

export default analytics;