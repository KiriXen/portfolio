import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import AnalyticsCard from './AnalyticsCard';


const Settings = () => {
  const { theme, themes, settings, updateTheme, updateSettings } = useContext(ThemeContext);
  const [customTheme, setCustomTheme] = useState(theme);
  const [activeTab, setActiveTab] = useState('themes');
  const [notification, setNotification] = useState(null);
  const [customThemeName, setCustomThemeName] = useState('');
  const [savedCustomThemes, setSavedCustomThemes] = useState(() => {
    const saved = localStorage.getItem('customThemes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    setCustomTheme(theme);
  }, [theme]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleThemeChange = (themeName) => {
    updateTheme(themes[themeName]);
    setCustomTheme(themes[themeName]);
    showNotification(`Theme changed to ${themeName}`, 'success');
  };

  const handleCustomColorChange = (key, value) => {
    const newTheme = { ...customTheme, [key]: value };
    setCustomTheme(newTheme);
    updateTheme(newTheme);
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
    showNotification(`${key} updated successfully`, 'success');
  };

  const saveCustomTheme = () => {
    if (!customThemeName.trim()) {
      showNotification('Please enter a theme name', 'error');
      return;
    }
    
    const newCustomThemes = {
      ...savedCustomThemes,
      [customThemeName]: { ...customTheme }
    };
    
    setSavedCustomThemes(newCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(newCustomThemes));
    showNotification(`Custom theme "${customThemeName}" saved!`, 'success');
    setCustomThemeName('');
  };

  const loadCustomTheme = (themeName) => {
    const themeData = savedCustomThemes[themeName];
    if (themeData) {
      updateTheme(themeData);
      setCustomTheme(themeData);
      showNotification(`Loaded custom theme "${themeName}"`, 'success');
    }
  };

  const deleteCustomTheme = (themeName) => {
    const newCustomThemes = { ...savedCustomThemes };
    delete newCustomThemes[themeName];
    setSavedCustomThemes(newCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(newCustomThemes));
    showNotification(`Custom theme "${themeName}" deleted`, 'success');
  };

  const resetToDefault = () => {
    updateTheme(themes.default);
    setCustomTheme(themes.default);
    updateSettings({
      animations: true,
      glowEffects: true,
      blurEffects: true,
      fontSize: 'medium',
      borderRadius: 'medium',
      compactMode: false,
    });
    showNotification('Settings reset to default', 'success');
  };

  const exportSettings = () => {
    const settingsData = {
      theme: customTheme,
      settings: settings,
      customThemes: savedCustomThemes,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully', 'success');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.theme) {
            updateTheme(importedData.theme);
            setCustomTheme(importedData.theme);
          }
          
          if (importedData.settings) {
            updateSettings(importedData.settings);
          }
          
          if (importedData.customThemes) {
            setSavedCustomThemes(importedData.customThemes);
            localStorage.setItem('customThemes', JSON.stringify(importedData.customThemes));
          }
          
          showNotification('Settings imported successfully', 'success');
        } catch (error) {
          showNotification('Invalid settings file format', 'error');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const previewTheme = (themeData) => {
    Object.entries(themeData).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssVarName}`, value);
    });
  };

  const resetPreview = () => {
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssVarName}`, value);
    });
  };

  const tabs = [
    { id: 'themes', label: 'Themes', icon: 'fas fa-palette' },
    { id: 'display', label: 'Display', icon: 'fas fa-desktop' },
    { id: 'animations', label: 'Effects', icon: 'fas fa-magic' },
    { id: 'accessibility', label: 'Accessibility', icon: 'fas fa-universal-access' },
    { id: 'advanced', label: 'Advanced', icon: 'fas fa-cogs' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      
      {/* Responsive Notification */}
      {notification && (
        <div className={`fixed top-3 sm:top-4 right-3 sm:right-4 left-3 sm:left-auto z-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg animate-slide-up max-w-sm mx-auto sm:mx-0 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <i className={`fas ${
              notification.type === 'success' ? 'fa-check-circle' : 
              notification.type === 'error' ? 'fa-exclamation-circle' : 
              'fa-info-circle'
            }`}></i>
            <span className="text-xs sm:text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Dynamic Background decoration */}
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container py-section relative z-10">
        {/* Responsive Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-responsive-4xl sm:text-responsive-5xl md:text-responsive-6xl font-bold text-[var(--text)] mb-4 sm:mb-6 animate-scale-in">
            <span className="gradient-text">Settings</span>
          </h1>
          <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-4 sm:mb-6 rounded-full animate-fade-in"></div>
          <p className="text-responsive-base sm:text-responsive-lg text-[var(--text-secondary)] animate-fade-in-up" style={{'--stagger-delay': '200ms'}}>
            Customize your portfolio experience
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Responsive Tab Navigation */}
          <div className="glass-effect rounded-t-2xl border border-[var(--border)] p-2 sm:p-3 mb-0 animate-fade-in-up" style={{'--stagger-delay': '300ms'}}>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-base font-medium hover-scale ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                      : 'text-[var(--text)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]'
                  }`}
                  style={{'--stagger-delay': `${400 + index * 100}ms`}}
                >
                  <i className={`${tab.icon} mr-1 sm:mr-2 text-xs sm:text-sm`}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Tab Content */}
          <div className="glass-effect rounded-b-2xl border border-t-0 border-[var(--border)] p-4 sm:p-6 md:p-8 animate-fade-in-up" style={{'--stagger-delay': '500ms'}}>
            
            {/* Themes Tab */}
            {activeTab === 'themes' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Analytics Section */}
                <div className="animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                    <i className="fas fa-chart-line mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Session Analytics</span>
                  </h2>
                  <AnalyticsCard />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center animate-fade-in-right" style={{'--stagger-delay': '700ms'}}>
                    <i className="fas fa-swatchbook mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Predefined Themes</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(themes).map(([themeName, themeData], index) => (
                      <button
                        key={themeName}
                        onClick={() => handleThemeChange(themeName)}
                        onMouseEnter={() => previewTheme(themeData)}
                        onMouseLeave={resetPreview}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover-scale animate-stagger ${
                          JSON.stringify(theme) === JSON.stringify(themeData)
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                            : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                        }`}
                        style={{'--stagger-delay': `${800 + index * 100}ms`}}
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-[var(--text)] font-semibold capitalize text-sm sm:text-base truncate pr-2">
                            {themeName.replace(/([A-Z])/g, ' $1')}
                          </span>
                          {JSON.stringify(theme) === JSON.stringify(themeData) && (
                            <i className="fas fa-check text-[var(--accent)] text-sm sm:text-base flex-shrink-0"></i>
                          )}
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 justify-center mb-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgPrimary }}></div>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgSecondary }}></div>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accent }}></div>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accentSecondary }}></div>
                        </div>
                        <div className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">{themeName} theme</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Themes */}
                {Object.keys(savedCustomThemes).length > 0 && (
                  <div className="animate-fade-in-up" style={{'--stagger-delay': '800ms'}}>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                      <i className="fas fa-user-edit mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                      <span>Your Custom Themes</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {Object.entries(savedCustomThemes).map(([themeName, themeData], index) => (
                        <div key={themeName} className="relative group animate-stagger" style={{'--stagger-delay': `${900 + index * 100}ms`}}>
                          <button
                            onClick={() => loadCustomTheme(themeName)}
                            onMouseEnter={() => previewTheme(themeData)}
                            onMouseLeave={resetPreview}
                            className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover-scale ${
                              JSON.stringify(theme) === JSON.stringify(themeData)
                                ? 'border-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                                : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <span className="text-[var(--text)] font-semibold truncate pr-2 text-sm sm:text-base">{themeName}</span>
                              {JSON.stringify(theme) === JSON.stringify(themeData) && (
                                <i className="fas fa-check text-[var(--accent)] text-sm sm:text-base flex-shrink-0"></i>
                              )}
                            </div>
                            <div className="flex gap-1.5 sm:gap-2 justify-center mb-2">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgPrimary }}></div>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgSecondary }}></div>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accent }}></div>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accentSecondary }}></div>
                            </div>
                            <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Custom theme</div>
                          </button>
                          <button
                            onClick={() => deleteCustomTheme(themeName)}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 text-xs"
                            aria-label={`Delete ${themeName} theme`}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="animate-fade-in-up" style={{'--stagger-delay': '1000ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                    <i className="fas fa-paint-brush mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Custom Theme Editor</span>
                  </h2>
                  
                  {/* Save Custom Theme */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={customThemeName}
                        onChange={(e) => setCustomThemeName(e.target.value)}
                        placeholder="Enter theme name..."
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-[var(--bg-secondary)] text-[var(--text)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
                      />
                      <button
                        onClick={saveCustomTheme}
                        className="px-4 sm:px-6 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 font-semibold text-sm sm:text-base hover-lift whitespace-nowrap"
                      >
                        <i className="fas fa-save mr-1 sm:mr-2"></i>
                        <span className="hidden sm:inline">Save Theme</span>
                        <span className="sm:hidden">Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {Object.entries(customTheme).map(([key, value], index) => (
                      <div 
                        key={key} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover-lift animate-stagger"
                        style={{'--stagger-delay': `${1100 + index * 50}ms`}}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 border-white/20 flex-shrink-0" style={{ backgroundColor: value }}></div>
                          <label className="text-[var(--text)] font-medium capitalize text-sm sm:text-base">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                        </div>
                        <div className="flex items-center gap-2 ml-8 sm:ml-0">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                            className="w-16 sm:w-20 px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text)] border border-[var(--border)] rounded focus:border-[var(--accent)] focus:outline-none"
                          />
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                            className="w-8 h-6 sm:w-12 sm:h-8 rounded border-2 border-[var(--border)] cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                    <i className="fas fa-text-height mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Typography & Sizing</span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <label className="block text-[var(--text)] font-medium mb-3 text-sm sm:text-base">Font Size</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {[
                          { value: 'small', label: 'Small', scale: '0.9x' },
                          { value: 'medium', label: 'Medium', scale: '1.0x' },
                          { value: 'large', label: 'Large', scale: '1.1x' }
                        ].map((size, index) => (
                          <button
                            key={size.value}
                            onClick={() => handleSettingChange('fontSize', size.value)}
                            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-center hover-scale ${
                              settings.fontSize === size.value
                                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                            }`}
                            style={{'--stagger-delay': `${700 + index * 100}ms`}}
                          >
                            <div className="font-semibold text-sm sm:text-base">{size.label}</div>
                            <div className="text-xs opacity-70">{size.scale}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-[var(--bg-secondary)]/50 rounded text-center">
                        <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Preview: Sample text with current size</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <label className="block text-[var(--text)] font-medium mb-3 text-sm sm:text-base">Border Radius</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {[
                          { value: 'small', label: 'Sharp', scale: '0.5x' },
                          { value: 'medium', label: 'Normal', scale: '1.0x' },
                          { value: 'large', label: 'Rounded', scale: '1.5x' }
                        ].map((radius, index) => (
                          <button
                            key={radius.value}
                            onClick={() => handleSettingChange('borderRadius', radius.value)}
                            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300 text-center hover-scale ${
                              settings.borderRadius === radius.value
                                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                            }`}
                            style={{
                              borderRadius: radius.value === 'small' ? '4px' : 
                                           radius.value === 'large' ? '16px' : '8px',
                              '--stagger-delay': `${1000 + index * 100}ms`
                            }}
                          >
                            <div className="font-semibold text-sm sm:text-base">{radius.label}</div>
                            <div className="text-xs opacity-70">{radius.scale}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="h-6 sm:h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '2px'}}></div>
                        <div className="h-6 sm:h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '8px'}}></div>
                        <div className="h-6 sm:h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '16px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{'--stagger-delay': '800ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                    <i className="fas fa-layout mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Layout Options</span>
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <i className="fas fa-compress-alt text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0"></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-sm sm:text-base">Compact Mode</span>
                            <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Reduce spacing and padding for a more compact layout</span>
                          </div>
                        </div>
                        <div className="relative ml-8 sm:ml-0">
                          <input
                            type="checkbox"
                            checked={settings.compactMode}
                            onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors duration-300 ${
                            settings.compactMode ? 'bg-[var(--accent)]' : 'bg-[var(--bg-secondary)]'
                          }`}>
                            <div className={`w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full mt-1 transition-transform duration-300 shadow-md ${
                              settings.compactMode ? 'translate-x-7 sm:translate-x-7' : 'translate-x-1'
                            }`}></div>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3">Layout Preview</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-[var(--bg-secondary)]/50 rounded border-l-4 border-[var(--accent)]">
                          <div className="text-xs sm:text-sm text-[var(--text)] font-medium">Normal Layout</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">Standard spacing and padding</div>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-[var(--bg-secondary)]/50 rounded border-l-4 border-[var(--accent-secondary)]">
                          <div className="text-xs sm:text-sm text-[var(--text)] font-medium">Compact Layout</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">Reduced spacing</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={{'--stagger-delay': '1000ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center">
                    <i className="fas fa-eye mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                    <span>Visual Preferences</span>
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3">Current Theme Info</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Primary Color:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border" style={{backgroundColor: theme.bgPrimary}}></div>
                            <span className="text-[var(--text)] text-xs font-mono">{theme.bgPrimary}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Accent Color:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border" style={{backgroundColor: theme.accent}}></div>
                            <span className="text-[var(--text)] text-xs font-mono">{theme.accent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3">Settings Summary</h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Font Size:</span>
                          <span className="text-[var(--text)] capitalize">{settings.fontSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Border Radius:</span>
                          <span className="text-[var(--text)] capitalize">{settings.borderRadius}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Compact Mode:</span>
                          <span className={`${settings.compactMode ? 'text-green-400' : 'text-red-400'}`}>
                            {settings.compactMode ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Effects Tab - Updated */}
            {activeTab === 'animations' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-sparkles mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                  <span>Visual Effects & Animations</span>
                </h2>

                {/* Mouse & Cursor Effects Section */}
                <div className="animate-fade-in-up" style={{'--stagger-delay': '650ms'}}>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                    <i className="fas fa-mouse-pointer mr-2 text-[var(--accent)]"></i>
                    <span>Mouse & Cursor Effects</span>
                  </h3>
      
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {/* Mouse Effects Toggle */}
                    <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <i className="fas fa-mouse text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0"></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-sm sm:text-base">Mouse Effects</span>
                            <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Enable custom cursor and mouse interactions</span>
                          </div>
                        </div>
                        <div className="relative ml-8 sm:ml-0">
                          <input
                            type="checkbox"
                            checked={settings.mouseEffects}
                            onChange={(e) => handleSettingChange('mouseEffects', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                            settings.mouseEffects ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                          }`}>
                            <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md ${
                              settings.mouseEffects ? 'translate-x-8 sm:translate-x-8' : 'translate-x-1'
                            }`}>
                              <i className={`fas fa-mouse text-xs ${settings.mouseEffects ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Cursor Trail Toggle */}
                    <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <i className="fas fa-stream text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0"></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-sm sm:text-base">Cursor Trail</span>
                            <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Show trailing effect behind cursor</span>
                          </div>
                        </div>
                        <div className="relative ml-8 sm:ml-0">
                          <input
                            type="checkbox"
                            checked={settings.cursorTrail}
                            onChange={(e) => handleSettingChange('cursorTrail', e.target.checked)}
                            className="sr-only"
                            disabled={!settings.mouseEffects}
                          />
                          <div className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                            settings.cursorTrail && settings.mouseEffects ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                          } ${!settings.mouseEffects ? 'opacity-50' : ''}`}>
                            <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                              settings.cursorTrail && settings.mouseEffects ? 'translate-x-8 sm:translate-x-8' : 'translate-x-1'
                            }`}>
                              <i className={`fas fa-stream text-xs ${settings.cursorTrail && settings.mouseEffects ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Cursor Style Selection */}
                  {settings.mouseEffects && (
                    <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 mb-6">
                      <h4 className="text-base font-semibold text-[var(--text)] mb-4">Cursor Style</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                          { value: 'modern', label: 'Modern', icon: 'fas fa-circle', desc: 'Glass effect with blur' },
                          { value: 'classic', label: 'Classic', icon: 'fas fa-dot-circle', desc: 'Traditional solid cursor' },
                          { value: 'gaming', label: 'Gaming', icon: 'fas fa-crosshairs', desc: 'RGB gradient effect' },
                          { value: 'minimal', label: 'Minimal', icon: 'far fa-circle', desc: 'Simple outline only' },
                          { value: 'neon', label: 'Neon', icon: 'fas fa-sun', desc: 'Glowing neon effect' }
                        ].map((style, index) => (
                          <button
                            key={style.value}
                            onClick={() => handleSettingChange('cursorStyle', style.value)}
                            className={`p-3 rounded-lg transition-all duration-300 text-center hover-scale animate-stagger ${
                              settings.cursorStyle === style.value
                                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                            }`}
                            style={{'--stagger-delay': `${750 + index * 50}ms`}}
                          >
                            <i className={`${style.icon} text-lg mb-2 block`}></i>
                            <div className="font-semibold text-xs sm:text-sm">{style.label}</div>
                            <div className="text-xs opacity-70 mt-1">{style.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cursor Size and Color */}
                  {settings.mouseEffects && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      {/* Cursor Size */}
                      <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                        <h4 className="text-base font-semibold text-[var(--text)] mb-4">Cursor Size</h4>
                        <div className="flex gap-2">
                          {[
                            { value: 'small', label: 'S', size: '12px' },
                            { value: 'medium', label: 'M', size: '16px' },
                            { value: 'large', label: 'L', size: '24px' }
                          ].map((size) => (
                            <button
                              key={size.value}
                              onClick={() => handleSettingChange('cursorSize', size.value)}
                              className={`flex-1 px-3 py-3 rounded-lg transition-all duration-300 text-center hover-scale flex flex-col items-center gap-2 ${
                                settings.cursorSize === size.value
                                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                  : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                              }`}
                            >
                              <div 
                                className="rounded-full border-2 border-current"
                                style={{ width: size.size, height: size.size }}
                              ></div>
                              <span className="font-semibold text-sm">{size.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cursor Color */}
                      <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                        <h4 className="text-base font-semibold text-[var(--text)] mb-4">Cursor Color</h4>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {[
                            '#64ffda', '#bb86fc', '#ff6b6b', '#4ecdc4',
                            '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'
                          ].map((color) => (
                            <button
                              key={color}
                              onClick={() => handleSettingChange('cursorColor', color)}
                              className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover-scale ${
                                settings.cursorColor === color ? 'border-[var(--text)] scale-110' : 'border-[var(--border)]'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={settings.cursorColor}
                          onChange={(e) => handleSettingChange('cursorColor', e.target.value)}
                          className="w-full h-10 rounded-lg border-2 border-[var(--border)] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Particle Effects Toggle */}
                  {settings.mouseEffects && (
                    <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 mb-6">
                      <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <i className="fas fa-stars text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0"></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-sm sm:text-base">Particle Effects</span>
                            <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Add floating particles around cursor movement</span>
                          </div>
                        </div>
                        <div className="relative ml-8 sm:ml-0">
                          <input
                            type="checkbox"
                            checked={settings.particleEffects}
                            onChange={(e) => handleSettingChange('particleEffects', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                            settings.particleEffects ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                          }`}>
                            <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                              settings.particleEffects ? 'translate-x-8 sm:translate-x-8' : 'translate-x-1'
                            }`}>
                              <i className={`fas fa-stars text-xs ${settings.particleEffects ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Rest of existing effects settings... */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { 
                      key: 'animations', 
                      label: 'Animations & Transitions', 
                      description: 'Enable smooth transitions, hover effects, and page animations', 
                      icon: 'fas fa-play',
                      demo: 'hover:scale-105 transition-transform'
                    },
                    { 
                      key: 'glowEffects', 
                      label: 'Glow Effects', 
                      description: 'Add glowing effects to interactive elements and focused items', 
                      icon: 'fas fa-sun',
                      demo: settings.glowEffects ? 'glow-effect' : ''
                    },
                    { 
                      key: 'blurEffects', 
                      label: 'Glass Morphism & Blur', 
                      description: 'Enable backdrop blur effects and glass morphism styling', 
                      icon: 'fas fa-adjust',
                      demo: settings.blurEffects ? 'glass-effect backdrop-blur-md' : 'bg-[var(--bg-secondary)]/80'
                    },
                  ].map((setting, index) => (
                    <div 
                      key={setting.key} 
                      className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-stagger"
                      style={{'--stagger-delay': `${850 + index * 100}ms`}}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <i className={`${setting.icon} text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0`}></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-sm sm:text-base md:text-lg">{setting.label}</span>
                            <span className="text-[var(--text-secondary)] text-xs sm:text-sm">{setting.description}</span>
                          </div>
                        </div>
                        <div className="relative ml-8 sm:ml-0">
                          <input
                            type="checkbox"
                            checked={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                              settings[setting.key] ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                            }`}
                            onClick={() => handleSettingChange(setting.key, !settings[setting.key])}
                          >
                            <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                              settings[setting.key] ? 'translate-x-8 sm:translate-x-8' : 'translate-x-1'
                            }`}>
                              <i className={`${setting.icon} text-xs ${settings[setting.key] ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Live Preview */}
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-[var(--bg-secondary)]/50 rounded border border-[var(--border)]/50">
                        <div className="text-xs text-[var(--text-secondary)] mb-2">Live Preview:</div>
                        <div className={`p-2 sm:p-3 rounded text-center text-[var(--text)] transition-all duration-300 text-xs sm:text-sm ${setting.demo}`}>
                          {setting.key === 'animations' && 'Hover me to see animation'}
                          {setting.key === 'glowEffects' && 'This element has glow effect'}
                          {setting.key === 'blurEffects' && 'Glass morphism background'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 sm:p-6 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10 rounded-lg border border-[var(--accent)]/20 animate-fade-in-up" style={{'--stagger-delay': '1200ms'}}>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-2 sm:mb-3 flex items-center">
                    <i className="fas fa-info-circle mr-2 text-[var(--accent)]"></i>
                    <span>Performance Note</span>
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
                    Disabling effects can improve performance on older devices. Mouse effects work best on desktop devices. Changes are applied instantly and saved automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-universal-access mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                  <span>Accessibility Options</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-left" style={{'--stagger-delay': '700ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4">High Contrast Themes</h3>
                    <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-xs sm:text-sm">Choose themes optimized for better readability</p>
                    <button
                      onClick={() => handleThemeChange('default')}
                      className="w-full px-3 sm:px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 text-sm sm:text-base font-medium hover-lift"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      <span>Apply High Contrast</span>
                    </button>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-right" style={{'--stagger-delay': '800ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4">Reduced Motion</h3>
                    <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-xs sm:text-sm">Minimize animations for users sensitive to motion</p>
                    <button
                      onClick={() => handleSettingChange('animations', false)}
                      className="w-full px-3 sm:px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 text-sm sm:text-base font-medium hover-lift"
                    >
                      <i className="fas fa-pause mr-2"></i>
                      <span>Disable Animations</span>
                    </button>
                  </div>
                </div>

                {/* Additional Accessibility Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-fade-in-up" style={{'--stagger-delay': '900ms'}}>
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 flex items-center">
                      <i className="fas fa-text-height mr-2 text-[var(--accent)]"></i>
                      <span>Text Size</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3 text-xs sm:text-sm">Quick access to larger text sizes</p>
                    <button
                      onClick={() => handleSettingChange('fontSize', 'large')}
                      className={`w-full px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
                        settings.fontSize === 'large' 
                          ? 'bg-[var(--accent)] text-[var(--bg-primary)]' 
                          : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                      }`}
                    >
                      {settings.fontSize === 'large' ? 'Large Text Active' : 'Enable Large Text'}
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 flex items-center">
                      <i className="fas fa-keyboard mr-2 text-[var(--accent)]"></i>
                      <span>Navigation</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3 text-xs sm:text-sm">Keyboard navigation friendly interface</p>
                    <div className="text-xs text-[var(--text)] bg-[var(--bg-secondary)]/50 p-2 rounded">
                      <div>• Tab: Navigate elements</div>
                      <div>• Enter/Space: Activate buttons</div>
                      <div>• Esc: Close modals</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-4 sm:mb-6 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-cogs mr-2 sm:mr-3 text-[var(--accent)] text-base sm:text-lg md:text-xl"></i>
                  <span>Advanced Settings & Data Management</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-left" style={{'--stagger-delay': '700ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-download mr-2 text-[var(--accent)]"></i>
                      <span>Export Configuration</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-xs sm:text-sm">
                      Save your current theme, settings, and custom themes to a JSON file for backup or sharing.
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                        <div>• Current theme settings</div>
                        <div>• Display preferences</div>
                        <div>• Custom themes ({Object.keys(savedCustomThemes).length})</div>
                        <div>• Visual effect settings</div>
                      </div>
                      <button
                        onClick={exportSettings}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base hover-lift"
                      >
                        <i className="fas fa-download"></i>
                        <span className="hidden sm:inline">Export All Settings</span>
                        <span className="sm:hidden">Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-right" style={{'--stagger-delay': '800ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-upload mr-2 text-[var(--accent)]"></i>
                      <span>Import Configuration</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-xs sm:text-sm">
                      Load theme and settings from a previously exported configuration file.
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                        <div>• Supports JSON format only</div>
                        <div>• Will merge with existing settings</div>
                        <div>• Custom themes will be added</div>
                        <div>• Instant preview available</div>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="hidden"
                        id="import-settings"
                      />
                      <label
                        htmlFor="import-settings"
                        className="block w-full px-3 sm:px-4 py-2 sm:py-3 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 text-center cursor-pointer font-semibold text-sm sm:text-base hover-lift"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        <span className="hidden sm:inline">Import Settings File</span>
                        <span className="sm:hidden">Import</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-up" style={{'--stagger-delay': '900ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-database mr-2 text-[var(--accent)]"></i>
                      <span>Storage Information</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Theme Data:</span>
                        <span className="text-[var(--text)]">{JSON.stringify(theme).length} bytes</span>
                      </div>
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Settings Data:</span>
                        <span className="text-[var(--text)]">{JSON.stringify(settings).length} bytes</span>
                      </div>
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Custom Themes:</span>
                        <span className="text-[var(--text)]">{Object.keys(savedCustomThemes).length} saved</span>
                      </div>
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Total Storage:</span>
                        <span className="text-[var(--text)]">
                          {(JSON.stringify({theme, settings, customThemes: savedCustomThemes}).length / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-up" style={{'--stagger-delay': '1000ms'}}>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-tools mr-2 text-[var(--accent)]"></i>
                      <span>Quick Actions</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={() => {
                          localStorage.removeItem('customThemes');
                          setSavedCustomThemes({});
                          showNotification('Custom themes cleared', 'success');
                        }}
                        className="w-full px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 text-xs sm:text-sm font-medium hover-lift"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        <span>Clear Custom Themes</span>
                      </button>
                      <button
                        onClick={() => {
                          const allKeys = ['theme', 'settings', 'customThemes'];
                          allKeys.forEach(key => localStorage.removeItem(key));
                          showNotification('All data cleared from storage', 'success');
                        }}
                        className="w-full px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 text-xs sm:text-sm font-medium hover-lift"
                      >
                        <i className="fas fa-broom mr-2"></i>
                        <span>Clear All Storage</span>
                      </button>
                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        className="w-full px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-xs sm:text-sm font-medium hover-lift"
                      >
                        <i className="fas fa-refresh mr-2"></i>
                        <span>Reload Application</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg animate-fade-in-up" style={{'--stagger-delay': '1100ms'}}>
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <i className="fas fa-exclamation-triangle text-red-400 text-xl sm:text-2xl mt-1 flex-shrink-0"></i>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Reset All Settings</h3>
                      <p className="text-[var(--text-secondary)] mb-3 sm:mb-4 text-xs sm:text-sm">
                        This will permanently reset all your customizations including themes, display settings, 
                        custom themes, and preferences back to their default values. This action cannot be undone.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={resetToDefault}
                          className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold text-sm sm:text-base hover-lift"
                        >
                          <i className="fas fa-undo mr-2"></i>
                          <span className="hidden sm:inline">Reset to Default</span>
                          <span className="sm:hidden">Reset</span>
                        </button>
                        <button
                          onClick={() => showNotification('Tip: Export your settings first as backup!', 'info')}
                          className="px-4 sm:px-6 py-2 bg-[var(--bg-secondary)] text-[var(--text)] rounded-lg hover:bg-[var(--accent)]/20 transition-colors duration-300 text-sm sm:text-base"
                        >
                          <i className="fas fa-lightbulb mr-2"></i>
                          <span className="hidden sm:inline">Show Tip</span>
                          <span className="sm:hidden">Tip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;