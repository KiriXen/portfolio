import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

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
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const previewTheme = (themeData) => {
    // Temporarily apply theme for preview
    Object.entries(themeData).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssVarName}`, value);
    });
  };

  const resetPreview = () => {
    // Reset to current theme
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
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slide-up ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {notification.message}
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-[var(--accent)] rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[var(--accent-secondary)] rounded-full blur-3xl animate-bounce-subtle" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text)] mb-4">
            <span className="gradient-text">Settings</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-[var(--text-secondary)]">Customize your portfolio experience</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="glass-effect rounded-t-2xl border border-[var(--border)] p-2 mb-0">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                      : 'text-[var(--text)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="glass-effect rounded-b-2xl border border-t-0 border-[var(--border)] p-8">
            
            {/* Themes Tab */}
            {activeTab === 'themes' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                    <i className="fas fa-swatchbook mr-3 text-[var(--accent)]"></i>
                    Predefined Themes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(themes).map(([themeName, themeData]) => (
                      <button
                        key={themeName}
                        onClick={() => handleThemeChange(themeName)}
                        onMouseEnter={() => previewTheme(themeData)}
                        onMouseLeave={resetPreview}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          JSON.stringify(theme) === JSON.stringify(themeData)
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                            : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[var(--text)] font-semibold capitalize">{themeName.replace(/([A-Z])/g, ' $1')}</span>
                          {JSON.stringify(theme) === JSON.stringify(themeData) && (
                            <i className="fas fa-check text-[var(--accent)]"></i>
                          )}
                        </div>
                        <div className="flex gap-2 justify-center mb-2">
                          <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgPrimary }}></div>
                          <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgSecondary }}></div>
                          <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accent }}></div>
                          <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accentSecondary }}></div>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">{themeName} theme</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Themes */}
                {Object.keys(savedCustomThemes).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                      <i className="fas fa-user-edit mr-3 text-[var(--accent)]"></i>
                      Your Custom Themes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(savedCustomThemes).map(([themeName, themeData]) => (
                        <div key={themeName} className="relative group">
                          <button
                            onClick={() => loadCustomTheme(themeName)}
                            onMouseEnter={() => previewTheme(themeData)}
                            onMouseLeave={resetPreview}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                              JSON.stringify(theme) === JSON.stringify(themeData)
                                ? 'border-[var(--accent)] bg-[var(--accent)]/10 glow-effect'
                                : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[var(--text)] font-semibold truncate">{themeName}</span>
                              {JSON.stringify(theme) === JSON.stringify(themeData) && (
                                <i className="fas fa-check text-[var(--accent)]"></i>
                              )}
                            </div>
                            <div className="flex gap-2 justify-center mb-2">
                              <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgPrimary }}></div>
                              <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.bgSecondary }}></div>
                              <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accent }}></div>
                              <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ backgroundColor: themeData.accentSecondary }}></div>
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">Custom theme</div>
                          </button>
                          <button
                            onClick={() => deleteCustomTheme(themeName)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                    <i className="fas fa-paint-brush mr-3 text-[var(--accent)]"></i>
                    Custom Theme Editor
                  </h2>
                  
                  {/* Save Custom Theme */}
                  <div className="mb-6 p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={customThemeName}
                        onChange={(e) => setCustomThemeName(e.target.value)}
                        placeholder="Enter theme name..."
                        className="flex-1 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text)] border border-[var(--border)] rounded-lg focus:border-[var(--accent)] focus:outline-none"
                      />
                      <button
                        onClick={saveCustomTheme}
                        className="px-6 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 font-semibold"
                      >
                        <i className="fas fa-save mr-2"></i>Save Theme
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(customTheme).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg border-2 border-white/20" style={{ backgroundColor: value }}></div>
                          <label className="text-[var(--text)] font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                            className="w-20 px-2 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text)] border border-[var(--border)] rounded"
                          />
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                            className="w-12 h-8 rounded border-2 border-[var(--border)] cursor-pointer"
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
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                    <i className="fas fa-text-height mr-3 text-[var(--accent)]"></i>
                    Typography & Sizing
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <label className="block text-[var(--text)] font-medium mb-3">Font Size</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'small', label: 'Small', scale: '0.9x' },
                          { value: 'medium', label: 'Medium', scale: '1.0x' },
                          { value: 'large', label: 'Large', scale: '1.1x' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => handleSettingChange('fontSize', size.value)}
                            className={`flex-1 px-4 py-3 rounded-lg transition-all duration-300 text-center ${
                              settings.fontSize === size.value
                                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                            }`}
                          >
                            <div className="font-semibold">{size.label}</div>
                            <div className="text-xs opacity-70">{size.scale}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-[var(--bg-secondary)]/50 rounded text-center">
                        <span className="text-[var(--text-secondary)] text-sm">Preview: Sample text with current size</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <label className="block text-[var(--text)] font-medium mb-3">Border Radius</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'small', label: 'Sharp', scale: '0.5x' },
                          { value: 'medium', label: 'Normal', scale: '1.0x' },
                          { value: 'large', label: 'Rounded', scale: '1.5x' }
                        ].map((radius) => (
                          <button
                            key={radius.value}
                            onClick={() => handleSettingChange('borderRadius', radius.value)}
                            className={`flex-1 px-4 py-3 transition-all duration-300 text-center ${
                              settings.borderRadius === radius.value
                                ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg'
                                : 'bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-[var(--accent)]/20'
                            }`}
                            style={{
                              borderRadius: radius.value === 'small' ? '4px' : 
                                           radius.value === 'large' ? '16px' : '8px'
                            }}
                          >
                            <div className="font-semibold">{radius.label}</div>
                            <div className="text-xs opacity-70">{radius.scale}</div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '2px'}}></div>
                        <div className="h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '8px'}}></div>
                        <div className="h-8 bg-[var(--accent)]/20 rounded" style={{borderRadius: '16px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                    <i className="fas fa-layout mr-3 text-[var(--accent)]"></i>
                    Layout Options
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-compress-alt text-[var(--accent)]"></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block">Compact Mode</span>
                            <span className="text-[var(--text-secondary)] text-sm">Reduce spacing and padding for a more compact layout</span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings.compactMode}
                            onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${
                            settings.compactMode ? 'bg-[var(--accent)]' : 'bg-[var(--bg-secondary)]'
                          }`}>
                            <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-transform duration-300 shadow-md ${
                              settings.compactMode ? 'translate-x-7' : 'translate-x-1'
                            }`}></div>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Layout Preview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[var(--bg-secondary)]/50 rounded border-l-4 border-[var(--accent)]">
                          <div className="text-sm text-[var(--text)] font-medium">Normal Layout</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">Standard spacing and padding</div>
                        </div>
                        <div className="p-2 bg-[var(--bg-secondary)]/50 rounded border-l-4 border-[var(--accent-secondary)]">
                          <div className="text-sm text-[var(--text)] font-medium">Compact Layout</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">Reduced spacing</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                    <i className="fas fa-eye mr-3 text-[var(--accent)]"></i>
                    Visual Preferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Current Theme Info</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Primary Color:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border" style={{backgroundColor: theme.bgPrimary}}></div>
                            <span className="text-[var(--text)] text-sm font-mono">{theme.bgPrimary}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Accent Color:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border" style={{backgroundColor: theme.accent}}></div>
                            <span className="text-[var(--text)] text-sm font-mono">{theme.accent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Settings Summary</h3>
                      <div className="space-y-2 text-sm">
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

            {/* Effects Tab */}
            {activeTab === 'animations' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                  <i className="fas fa-sparkles mr-3 text-[var(--accent)]"></i>
                  Visual Effects & Animations
                </h2>
                <div className="space-y-4">
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
                  ].map((setting) => (
                    <div key={setting.key} className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <i className={`${setting.icon} text-[var(--accent)] text-xl`}></i>
                          <div>
                            <span className="text-[var(--text)] font-medium block text-lg">{setting.label}</span>
                            <span className="text-[var(--text-secondary)] text-sm">{setting.description}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings[setting.key]}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`w-16 h-9 rounded-full transition-all duration-300 cursor-pointer ${
                              settings[setting.key] ? 'bg-[var(--accent)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                            }`}
                            onClick={() => handleSettingChange(setting.key, !settings[setting.key])}
                          >
                            <div className={`w-7 h-7 bg-white rounded-full mt-1 transition-all duration-300 shadow-md flex items-center justify-center ${
                              settings[setting.key] ? 'translate-x-8' : 'translate-x-1'
                            }`}>
                              <i className={`${setting.icon} text-xs ${settings[setting.key] ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Live Preview */}
                      <div className="mt-4 p-3 bg-[var(--bg-secondary)]/50 rounded border border-[var(--border)]/50">
                        <div className="text-xs text-[var(--text-secondary)] mb-2">Live Preview:</div>
                        <div className={`p-3 rounded text-center text-[var(--text)] transition-all duration-300 ${setting.demo}`}>
                          {setting.key === 'animations' && 'Hover me to see animation'}
                          {setting.key === 'glowEffects' && 'This element has glow effect'}
                          {setting.key === 'blurEffects' && 'Glass morphism background'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10 rounded-lg border border-[var(--accent)]/20">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center">
                    <i className="fas fa-info-circle mr-2 text-[var(--accent)]"></i>
                    Performance Note
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Disabling effects can improve performance on older devices. Changes are applied instantly and saved automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                  <i className="fas fa-universal-access mr-3 text-[var(--accent)]"></i>
                  Accessibility Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">High Contrast Themes</h3>
                    <p className="text-[var(--text-secondary)] mb-4">Choose themes optimized for better readability</p>
                    <button
                      onClick={() => handleThemeChange('default')}
                      className="w-full px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300"
                    >
                      Apply High Contrast
                    </button>
                  </div>
                  
                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Reduced Motion</h3>
                    <p className="text-[var(--text-secondary)] mb-4">Minimize animations for users sensitive to motion</p>
                    <button
                      onClick={() => handleSettingChange('animations', false)}
                      className="w-full px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300"
                    >
                      Disable Animations
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-6 flex items-center">
                  <i className="fas fa-cogs mr-3 text-[var(--accent)]"></i>
                  Advanced Settings & Data Management
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:glow-effect transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                      <i className="fas fa-download mr-2 text-[var(--accent)]"></i>
                      Export Configuration
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                      Save your current theme, settings, and custom themes to a JSON file for backup or sharing.
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-[var(--text-secondary)]">
                        <div>• Current theme settings</div>
                        <div>• Display preferences</div>
                        <div>• Custom themes ({Object.keys(savedCustomThemes).length})</div>
                        <div>• Visual effect settings</div>
                      </div>
                      <button
                        onClick={exportSettings}
                        className="w-full px-4 py-3 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-download"></i>
                        Export All Settings
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)] hover:glow-effect transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                      <i className="fas fa-upload mr-2 text-[var(--accent)]"></i>
                      Import Configuration
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4">
                      Load theme and settings from a previously exported configuration file.
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-[var(--text-secondary)]">
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
                        className="block w-full px-4 py-3 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 text-center cursor-pointer font-semibold"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        Import Settings File
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                      <i className="fas fa-database mr-2 text-[var(--accent)]"></i>
                      Storage Information
                    </h3>
                    <div className="space-y-3 text-sm">
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

                  <div className="p-6 bg-[var(--bg-secondary)]/30 rounded-lg border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center">
                      <i className="fas fa-tools mr-2 text-[var(--accent)]"></i>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          localStorage.removeItem('customThemes');
                          setSavedCustomThemes({});
                          showNotification('Custom themes cleared', 'success');
                        }}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 text-sm"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Clear Custom Themes
                      </button>
                      <button
                        onClick={() => {
                          const allKeys = ['theme', 'settings', 'customThemes'];
                          allKeys.forEach(key => localStorage.removeItem(key));
                          showNotification('All data cleared from storage', 'success');
                        }}
                        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm"
                      >
                        <i className="fas fa-broom mr-2"></i>
                        Clear All Storage
                      </button>
                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm"
                      >
                        <i className="fas fa-refresh mr-2"></i>
                        Reload Application
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-4">
                    <i className="fas fa-exclamation-triangle text-red-400 text-2xl mt-1"></i>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Reset All Settings</h3>
                      <p className="text-[var(--text-secondary)] mb-4 text-sm">
                        This will permanently reset all your customizations including themes, display settings, 
                        custom themes, and preferences back to their default values. This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={resetToDefault}
                          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold"
                        >
                          <i className="fas fa-undo mr-2"></i>
                          Reset to Default
                        </button>
                        <button
                          onClick={() => showNotification('Tip: Export your settings first as backup!', 'info')}
                          className="px-6 py-2 bg-[var(--bg-secondary)] text-[var(--text)] rounded-lg hover:bg-[var(--accent)]/20 transition-colors duration-300"
                        >
                          <i className="fas fa-lightbulb mr-2"></i>
                          Show Tip
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