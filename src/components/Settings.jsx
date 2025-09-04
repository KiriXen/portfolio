import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

const Settings = () => {
  const { theme, themes, settings, updateTheme, updateSettings } = useContext(ThemeContext);
  const [customTheme, setCustomTheme] = useState(theme);
  const [activeTab, setActiveTab] = useState('themes');
  const [notification, setNotification] = useState(null);
  const [customThemeName, setCustomThemeName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCustomThemes, setSavedCustomThemes] = useState(() => {
    const saved = localStorage.getItem('customThemes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    setCustomTheme(theme);
  }, [theme]);

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const handleThemeChange = (themeName) => {
    updateTheme(themes[themeName]);
    setCustomTheme(themes[themeName]);
    showNotification(`✨ Theme changed to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`, 'success');
  };

  const handleCustomColorChange = (key, value) => {
    const newTheme = { ...customTheme, [key]: value };
    setCustomTheme(newTheme);
    updateTheme(newTheme);
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
    const settingNames = {
      animations: 'Animations',
      glowEffects: 'Glow Effects',
      blurEffects: 'Blur Effects',
      fontSize: 'Font Size',
      borderRadius: 'Border Radius',
      compactMode: 'Compact Mode',
      spiderEffects: 'Spider Effects',
      disableCustomCursor: 'Custom Cursor',
      cursorStyle: 'Cursor Style'
    };
    const friendlyName = settingNames[key] || key;
    const status = typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : `set to ${value}`;
    showNotification(`⚙️ ${friendlyName} ${status}`, 'success');
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
    updateTheme(themes.spiderMan);
    setCustomTheme(themes.spiderMan);
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
    { id: 'cursor', label: 'Cursor', icon: 'fas fa-mouse-pointer' },
    { id: 'animations', label: 'Effects', icon: 'fas fa-magic' },
    { id: 'advanced', label: 'Advanced', icon: 'fas fa-cogs' },
  ];

  return (
    <div className="page-container">
      
      {notification && (
        <div className={`fixed top-20 right-4 z-[9999] px-6 py-3 rounded-xl shadow-2xl animate-slide-up max-w-sm backdrop-blur-sm border ${
          notification.type === 'success' 
            ? 'bg-green-500/90 text-white border-green-400/50' 
            : notification.type === 'error'
            ? 'bg-red-500/90 text-white border-red-400/50'
            : 'bg-blue-500/90 text-white border-blue-400/50'
        }`}>
          <div className="flex items-center gap-3 text-sm font-medium">
            <i className={`text-lg ${
              notification.type === 'success' ? 'fa-check-circle' : 
              notification.type === 'error' ? 'fa-exclamation-circle' : 
              'fa-info-circle'
            } fas`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-[var(--accent)] rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--accent-secondary)] rounded-full blur-2xl sm:blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="page-content">{/* Applied page-content class for proper spacing */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-3 sm:mb-4 animate-scale-in">
            <span className="gradient-text">Settings</span>
          </h1>
          <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-3 sm:mb-4 rounded-full animate-fade-in"></div>
          <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] animate-fade-in-up" style={{'--stagger-delay': '200ms'}}>
            Customize your portfolio experience
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Enhanced Tab Navigation */}
          <div className="glass-effect rounded-2xl border border-[var(--border)] p-1 mb-6 animate-fade-in-up backdrop-blur-xl" style={{'--stagger-delay': '300ms'}}>
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group overflow-hidden ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/50 hover:text-[var(--accent)]'
                  }`}
                  style={{'--stagger-delay': `${400 + index * 100}ms`}}
                >
                  {/* Background Effect */}
                  {activeTab !== tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 mr-2 transition-transform duration-300 ${
                    activeTab === tab.id ? 'text-white' : 'group-hover:scale-110'
                  }`}>
                    <i className={`${tab.icon} text-base`}></i>
                  </div>
                  
                  {/* Label */}
                  <span className="relative z-10 hidden sm:inline font-semibold">
                    {tab.label}
                  </span>
                  <span className="relative z-10 sm:hidden font-semibold">
                    {tab.label.split(' ')[0]}
                  </span>
                  
                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/50 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Content Container */}
          <div className="glass-effect rounded-2xl border border-[var(--border)] p-6 md:p-8 animate-fade-in-up backdrop-blur-xl shadow-2xl" style={{'--stagger-delay': '500ms'}}>
            
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border)]/50">
              <div className="flex items-center gap-2">
                <i className="fas fa-bolt text-[var(--accent)]"></i>
                <span className="text-sm font-medium text-[var(--text)]">Quick Actions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateTheme(themes.spiderMan);
                    setCustomTheme(themes.spiderMan);
                    updateSettings({
                      animations: true,
                      glowEffects: true,
                      blurEffects: true,
                      fontSize: 'medium',
                      borderRadius: 'medium',
                      compactMode: false,
                    });
                    showNotification('🔄 All settings reset to default', 'info');
                  }}
                  className="px-3 py-1.5 text-xs bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                >
                  <i className="fas fa-undo mr-1"></i>
                  Reset All
                </button>
                <button
                  onClick={exportSettings}
                  className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                >
                  <i className="fas fa-download mr-1"></i>
                  Export
                </button>
              </div>
            </div>
            
            {activeTab === 'themes' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center animate-fade-in-right" style={{'--stagger-delay': '600ms'}}>
                    <i className="fas fa-swatchbook mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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

                {Object.keys(savedCustomThemes).length > 0 && (
                  <div className="animate-fade-in-up" style={{'--stagger-delay': '800ms'}}>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-user-edit mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-paint-brush mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
                    <span>Custom Theme Editor</span>
                  </h2>
                  
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

            {activeTab === 'display' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-text-height mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-layout mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-eye mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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

            {activeTab === 'animations' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-sparkles mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
                  <span>Visual Effects & Animations</span>
                </h2>

                <div className="animate-fade-in-up" style={{'--stagger-delay': '650ms'}}>
                  {/* Spider Effects */}
                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 mb-6">
                    <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-3 sm:gap-0">
                      <div className="flex items-start sm:items-center gap-3">
                        <i className="fas fa-spider text-[var(--accent)] text-lg sm:text-xl mt-1 sm:mt-0"></i>
                        <div>
                          <span className="text-[var(--text)] font-medium block text-sm sm:text-base">Spider Effects</span>
                          <span className="text-[var(--text-secondary)] text-xs sm:text-sm">Animated spiders and webs across the site</span>
                        </div>
                      </div>
                      <div className="relative ml-8 sm:ml-0">
                        <input
                          type="checkbox"
                          checked={settings.spiderEffects}
                          onChange={(e) => handleSettingChange('spiderEffects', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                          settings.spiderEffects ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                        }`}>
                          <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                            settings.spiderEffects ? 'translate-x-8 sm:translate-x-8' : 'translate-x-1'
                          }`}>
                            <i className={`fas fa-spider text-xs ${settings.spiderEffects ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

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

            {activeTab === 'cursor' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-mouse-pointer mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
                  <span>Cursor Customization</span>
                </h2>

                {/* Cursor Toggle */}
                <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-up" style={{'--stagger-delay': '620ms'}}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-1 sm:mb-2 flex items-center">
                        <i className="fas fa-toggle-on mr-2 text-[var(--accent)]"></i>
                        <span>Enable Custom Cursors</span>
                      </h3>
                      <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
                        Toggle this off if you're experiencing cursor issues in your browser (Arc, Firefox, etc.)
                      </p>
                    </div>
                    <div 
                      className={`w-14 h-7 sm:w-16 sm:h-9 rounded-full transition-all duration-300 cursor-pointer hover-scale ${
                        !settings.disableCustomCursor
                          ? 'bg-[var(--accent)] glow-effect' 
                          : 'bg-[var(--bg-tertiary)] border border-[var(--border)]'
                      }`}
                      onClick={() => handleSettingChange('disableCustomCursor', !settings.disableCustomCursor)}
                    >
                      <div className={`w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full transition-all duration-300 ${
                        !settings.disableCustomCursor 
                          ? 'translate-x-8 sm:translate-x-9' 
                          : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {!settings.disableCustomCursor && (
                  <>
                    {/* Current Cursor Preview */}
                    <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300 animate-fade-in-up" style={{'--stagger-delay': '650ms'}}>
                      <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                        <i className="fas fa-eye mr-2 text-[var(--accent)]"></i>
                        <span>Current Cursor Preview</span>
                      </h3>
                      <div className="p-8 sm:p-12 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border)]/50 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-secondary)]/20"></div>
                        </div>
                        <div className="relative z-10">
                          <p className="text-[var(--text-secondary)] mb-4 text-sm sm:text-base">Move your cursor around this area to test</p>
                          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                            <div className="p-3 bg-[var(--bg-primary)]/30 rounded cursor-pointer hover:bg-[var(--accent)]/10 transition-colors">
                              <span className="text-[var(--text)]">Hover me!</span>
                            </div>
                            <div className="p-3 bg-[var(--bg-primary)]/30 rounded">
                              <input type="text" placeholder="Type here..." className="w-full bg-transparent text-[var(--text)] text-xs outline-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                {/* Predefined Cursor Styles */}
                <div className="animate-fade-in-up" style={{'--stagger-delay': '700ms'}}>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-list mr-2 text-[var(--accent)]"></i>
                    <span>Spider-Verse Cursor Styles</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { 
                        id: 'default', 
                        name: 'Spider-Man Classic', 
                        description: 'Red spider with cyan glow',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="%23e31e24"/><circle cx="16" cy="16" r="6" fill="none" stroke="%2300d4ff" stroke-width="1" opacity="0.6"/></svg>'
                      },
                      { 
                        id: 'miles', 
                        name: 'Miles Morales', 
                        description: 'Electric blue with lightning',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="%2300d4ff"/><path d="M8 16 L24 16 M16 8 L16 24 M12 12 L20 20 M20 12 L12 20" stroke="%23ffff00" stroke-width="1.5" opacity="0.8"/></svg>'
                      },
                      { 
                        id: 'gwen', 
                        name: 'Spider-Gwen', 
                        description: 'Pink and white style',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="%23ff69b4"/><circle cx="16" cy="16" r="8" fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.7"/></svg>'
                      },
                      { 
                        id: 'venom', 
                        name: 'Venom Style', 
                        description: 'Dark symbiote theme',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="%23000000"/><circle cx="16" cy="16" r="8" fill="none" stroke="%23ffffff" stroke-width="1" opacity="0.8"/><circle cx="16" cy="16" r="3" fill="%23ff0000"/></svg>'
                      },
                      { 
                        id: 'web', 
                        name: 'Web Shooter', 
                        description: 'Spider web pattern',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="2" fill="%23e31e24"/><g stroke="%2300d4ff" stroke-width="0.5" fill="none"><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="10"/><line x1="6" y1="16" x2="26" y2="16"/><line x1="16" y1="6" x2="16" y2="26"/><line x1="10.3" y1="10.3" x2="21.7" y2="21.7"/><line x1="21.7" y1="10.3" x2="10.3" y2="21.7"/></g></svg>'
                      },
                      { 
                        id: 'minimal', 
                        name: 'Minimal Spider', 
                        description: 'Simple dot cursor',
                        preview: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="%23ff69b4"/></svg>'
                      }
                    ].map((style, index) => (
                      <div
                        key={style.id}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover-scale animate-stagger ${
                          settings.cursorStyle === style.id
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                            : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                        }`}
                        style={{'--stagger-delay': `${800 + index * 100}ms`}}
                        onClick={() => handleSettingChange('cursorStyle', style.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center bg-[var(--bg-secondary)]">
                            <div 
                              className="w-4 h-4 rounded-full bg-center bg-no-repeat bg-contain" 
                              style={{backgroundImage: `url("${style.preview}")`}}
                            ></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[var(--text)] font-medium text-sm truncate">{style.name}</h4>
                            <p className="text-[var(--text-secondary)] text-xs">{style.description}</p>
                          </div>
                          {settings.cursorStyle === style.id && (
                            <i className="fas fa-check text-[var(--accent)] flex-shrink-0"></i>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Custom Cursor Upload */}
                <div className="animate-fade-in-up" style={{'--stagger-delay': '750ms'}}>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-upload mr-2 text-[var(--accent)]"></i>
                    <span>Custom Cursor Options</span>
                  </h3>
                  
                  {/* Browser Compatibility Warning */}
                  <div className="mb-6 p-4 sm:p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30 hover-glow transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-exclamation-triangle text-yellow-400 text-lg mt-0.5"></i>
                      <div>
                        <h4 className="text-[var(--text)] font-medium mb-1 text-sm">Browser Compatibility Notice</h4>
                        <p className="text-[var(--text-secondary)] text-xs">Custom cursors may not work in all browsers. Some browsers like Firefox or Arc may have limited support or ignore custom cursor settings.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">                    {/* Current Custom Cursor Display */}
                    {settings.customCursor && (
                      <div className="mb-4 p-3 bg-[var(--bg-secondary)]/50 rounded border border-[var(--border)]/50">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border border-[var(--border)] flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden">
                              {settings.customCursor.startsWith('/images/') ? (
                                <img 
                                  src={settings.customCursor} 
                                  alt="Custom cursor"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div 
                                  className="w-6 h-6 bg-center bg-no-repeat bg-contain" 
                                  style={{backgroundImage: `url("${settings.customCursor}")`}}
                                ></div>
                              )}
                            </div>
                            <div>
                              <p className="text-[var(--text)] text-sm font-medium">Custom cursor active</p>
                              <p className="text-[var(--text-secondary)] text-xs">
                                {settings.customCursor.startsWith('/images/') ? 'Portfolio image' : 'Uploaded image'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleSettingChange('customCursor', null);
                              handleSettingChange('cursorStyle', 'default');
                              showNotification('Custom cursor removed', 'success');
                            }}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors duration-300 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-sm text-[var(--text-secondary)]">
                        <h4 className="font-medium text-[var(--text)] mb-2">Upload Custom Image:</h4>
                        <ul className="space-y-1 text-xs">
                          <li>• Supported formats: PNG, JPG, SVG, ICO, CUR</li>
                          <li>• Recommended size: 32x32 pixels or smaller</li>
                          <li>• File size limit: 500KB (reduced for better performance)</li>
                          <li>• For best results, use PNG with transparency</li>
                          <li>• Square images work best as cursors</li>
                        </ul>
                      </div>
                      
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.ico,.cur"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 512 * 1024) { // 512KB limit
                              showNotification('File size must be less than 512KB', 'error');
                              return;
                            }
                            
                            // Create a canvas to resize the image
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const img = new Image();
                            
                            img.onload = () => {
                              // Resize to 32x32 for optimal cursor performance
                              canvas.width = 32;
                              canvas.height = 32;
                              ctx.imageSmoothingEnabled = true;
                              ctx.imageSmoothingQuality = 'high';
                              ctx.drawImage(img, 0, 0, 32, 32);
                              
                              const resizedDataUrl = canvas.toDataURL('image/png');
                              handleSettingChange('customCursor', resizedDataUrl);
                              handleSettingChange('cursorStyle', 'custom');
                              showNotification('Custom cursor uploaded and resized!', 'success');
                            };
                            
                            img.onerror = () => {
                              showNotification('Failed to load image. Please try a different file.', 'error');
                            };
                            
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              img.src = event.target.result;
                            };
                            reader.onerror = () => {
                              showNotification('Failed to read file. Please try again.', 'error');
                            };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="cursor-upload"
                      />
                      <label
                        htmlFor="cursor-upload"
                        className="block w-full px-4 py-6 border-2 border-dashed border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-colors duration-300 cursor-pointer text-center group"
                      >
                        <div className="space-y-2">
                          <i className="fas fa-cloud-upload-alt text-2xl text-[var(--accent)] group-hover:text-[var(--accent-secondary)] transition-colors"></i>
                          <p className="text-[var(--text)] font-medium">Click to upload cursor image</p>
                          <p className="text-[var(--text-secondary)] text-sm">Image will be automatically resized to 32x32px</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cursor Settings */}
                <div className="animate-fade-in-up" style={{'--stagger-delay': '800ms'}}>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center">
                    <i className="fas fa-sliders-h mr-2 text-[var(--accent)]"></i>
                    <span>Cursor Behavior</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <h4 className="text-[var(--text)] font-medium mb-2 text-sm">Reset to Default</h4>
                      <p className="text-[var(--text-secondary)] text-xs mb-3">Restore the original Spider-Man cursor</p>
                      <button
                        onClick={() => {
                          handleSettingChange('customCursor', null);
                          handleSettingChange('cursorStyle', 'default');
                          showNotification('Cursor reset to default', 'success');
                        }}
                        className="w-full px-3 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 text-sm font-medium"
                      >
                        <i className="fas fa-undo mr-2"></i>
                        Reset Cursor
                      </button>
                    </div>
                    
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover-glow transition-all duration-300">
                      <h4 className="text-[var(--text)] font-medium mb-2 text-sm">Export Cursor</h4>
                      <p className="text-[var(--text-secondary)] text-xs mb-3">Download your custom cursor</p>
                      <button
                        onClick={() => {
                          if (settings.customCursor) {
                            const link = document.createElement('a');
                            link.href = settings.customCursor;
                            link.download = 'custom-cursor.png';
                            link.click();
                            showNotification('Cursor exported successfully', 'success');
                          } else {
                            showNotification('No custom cursor to export', 'error');
                          }
                        }}
                        disabled={!settings.customCursor}
                        className={`w-full px-3 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
                          settings.customCursor
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed'
                        }`}
                      >
                        <i className="fas fa-download mr-2"></i>
                        Export Cursor
                      </button>
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)] mb-3 sm:mb-4 flex items-center animate-fade-in-up" style={{'--stagger-delay': '600ms'}}>
                  <i className="fas fa-cogs mr-2 sm:mr-3 text-[var(--accent)] text-sm sm:text-base md:text-lg"></i>
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
                        <span className="text-[var(--text)]">{theme ? JSON.stringify(theme).length : 0} bytes</span>
                      </div>
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Settings Data:</span>
                        <span className="text-[var(--text)]">{settings ? JSON.stringify(settings).length : 0} bytes</span>
                      </div>
                      <div className="flex justify-between p-2 bg-[var(--bg-secondary)]/50 rounded">
                        <span className="text-[var(--text-secondary)]">Custom Themes:</span>
                        <span className="text-[var(--text)]">{savedCustomThemes ? Object.keys(savedCustomThemes).length : 0} saved</span>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;