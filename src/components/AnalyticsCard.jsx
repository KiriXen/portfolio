import React, { useState, useEffect, useRef } from 'react';
import { getSessionStats, exportAnalyticsData, clearAnalyticsData, trackEvent } from '../utils/analytics';

const AnalyticsCard = () => {
  const [stats, setStats] = useState({ duration: 0, pageViews: 0, events: 0, performance: {} });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [realtimeData, setRealtimeData] = useState({
    currentPage: '/',
    sessionStart: Date.now(),
    interactionRate: 0,
    avgTimePerPage: 0
  });
  const cardRef = useRef(null);

  useEffect(() => {
    const updateStats = () => {
      try {
        const newStats = getSessionStats();
        setStats(newStats);
        
        const interactionRate = newStats.events > 0 && newStats.pageViews > 0 
          ? Math.round((newStats.events / newStats.pageViews) * 100) / 100 
          : 0;
        
        const avgTimePerPage = newStats.pageViews > 1 
          ? Math.round(newStats.duration / newStats.pageViews) 
          : newStats.duration;

        setRealtimeData(prev => ({
          ...prev,
          currentPage: window.location.pathname,
          interactionRate,
          avgTimePerPage
        }));
      } catch (error) {
        console.warn('Stats update error:', error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getHealthScore = () => {
    let score = 0;
    if (stats.performance.loadTime < 2000) score += 25;
    else if (stats.performance.loadTime < 3000) score += 15;
    
    if (realtimeData.interactionRate > 1) score += 25;
    else if (realtimeData.interactionRate > 0.5) score += 15;
    
    if (stats.pageViews > 3) score += 25;
    else if (stats.pageViews > 1) score += 15;
    
    if (stats.duration > 60) score += 25;
    else if (stats.duration > 30) score += 15;
    
    return Math.min(score, 100);
  };

  const healthScore = getHealthScore();

  const handleExport = () => {
    trackEvent('analytics_export', { timestamp: Date.now() });
    exportAnalyticsData();
  };

  const handleClear = () => {
    trackEvent('analytics_clear', { timestamp: Date.now() });
    clearAnalyticsData();
    setStats({ duration: 0, pageViews: 0, events: 0, performance: {} });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    trackEvent('analytics_toggle', { expanded: !isExpanded });
  };

  return (
    <div 
      ref={cardRef}
      className="relative glass-effect rounded-2xl border border-[var(--border)] overflow-hidden transition-all duration-500 hover:border-[var(--accent)]/50 hover:shadow-2xl hover:shadow-[var(--accent)]/10"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--accent)/5 0%, transparent 50%)`
          : undefined
      }}
    >
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--accent) 0%, transparent 70%)`,
          opacity: isHovered ? 0.1 : 0
        }}
      />

      {/* Header */}
      <div 
        className="p-4 sm:p-6 cursor-pointer select-none relative z-10"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-lg sm:text-xl"></i>
              </div>
              {stats.events > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] flex items-center gap-2">
                Session Analytics
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-[var(--accent)] rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </h3>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <div className={`w-2 h-2 rounded-full ${stats.events > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                {formatTime(stats.duration)} active
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Health Score */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="var(--bg-secondary)"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={healthScore > 70 ? '#10B981' : healthScore > 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={`${healthScore * 1.257} 125.7`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--text)]">{healthScore}</span>
              </div>
            </div>
            
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[var(--text-secondary)] transition-all duration-300 ${isHovered ? 'transform rotate-180' : ''}`}></i>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-[var(--bg-secondary)]/30 rounded-lg p-2 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-[var(--accent)] animate-bounce">{stats.pageViews}</div>
            <div className="text-xs text-[var(--text-secondary)]">Pages</div>
          </div>
          <div className="bg-[var(--bg-secondary)]/30 rounded-lg p-2 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-[var(--accent-secondary)] animate-bounce" style={{ animationDelay: '0.1s' }}>{stats.events}</div>
            <div className="text-xs text-[var(--text-secondary)]">Events</div>
          </div>
          <div className="bg-[var(--bg-secondary)]/30 rounded-lg p-2 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-[var(--accent)] animate-bounce" style={{ animationDelay: '0.2s' }}>
              {realtimeData.interactionRate}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Rate</div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 relative z-10 animate-slide-up">
          {/* Real-time Metrics */}
          <div className="mb-6 p-4 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10 rounded-xl border border-[var(--accent)]/20">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-secondary)]">Current Page:</span>
                <code className="text-xs text-[var(--accent)] bg-[var(--bg-secondary)]/50 px-2 py-1 rounded">
                  {realtimeData.currentPage}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-secondary)]">Avg. Time/Page:</span>
                <span className="text-xs text-[var(--text)] font-mono">
                  {formatTime(realtimeData.avgTimePerPage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-secondary)]">Session Start:</span>
                <span className="text-xs text-[var(--text)] font-mono">
                  {new Date(realtimeData.sessionStart).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-secondary)]">Interaction Rate:</span>
                <span className="text-xs text-[var(--text)] font-mono">
                  {realtimeData.interactionRate}/page
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {stats.performance.loadTime > 0 && (
            <div className="mb-6 p-4 bg-[var(--bg-secondary)]/20 rounded-xl">
              <h4 className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <i className="fas fa-tachometer-alt text-[var(--accent)]"></i>
                Performance Metrics
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">Load Time:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-1000"
                        style={{ width: `${Math.min((stats.performance.loadTime / 3000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--text)] font-mono min-w-0">
                      {stats.performance.loadTime}ms
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">DOM Ready:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${Math.min((stats.performance.domContentLoaded / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--text)] font-mono min-w-0">
                      {stats.performance.domContentLoaded}ms
                    </span>
                  </div>
                </div>
                {stats.performance.firstPaint > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">First Paint:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-1000"
                          style={{ width: `${Math.min((stats.performance.firstPaint / 1500) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-[var(--text)] font-mono min-w-0">
                        {Math.round(stats.performance.firstPaint)}ms
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-[var(--bg-primary)] rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[var(--accent)]/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
            >
              <i className="fas fa-download mr-2"></i>
              Export Data
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] rounded-xl font-semibold text-sm border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 p-3 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/20">
            <div className="flex items-start gap-2">
              <i className="fas fa-shield-alt text-[var(--accent)] text-sm mt-0.5"></i>
              <div>
                <div className="text-xs font-semibold text-[var(--text)] mb-1">Privacy Protected</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  All analytics data is stored locally on your device. No data is sent to external servers.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;