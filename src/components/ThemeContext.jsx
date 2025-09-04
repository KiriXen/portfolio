import React, { createContext, useState, useEffect } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage';

const themes = {
  spiderMan: {
    bgPrimary: '#0C0C0C',
    bgSecondary: '#1A0A0A',
    bgTertiary: '#2B1111',
    accent: '#E31E24',
    accentSecondary: '#FF4444',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textHover: '#FF6666',
    border: 'rgba(227, 30, 36, 0.2)',
  },
  milesElectric: {
    bgPrimary: '#050510',
    bgSecondary: '#0A0A20',
    bgTertiary: '#151530',
    accent: '#00D4FF',
    accentSecondary: '#0099CC',
    text: '#E6F7FF',
    textSecondary: '#99D6FF',
    textHover: '#33DDFF',
    border: 'rgba(0, 212, 255, 0.2)',
  },
  gwenStacy: {
    bgPrimary: '#0A0510',
    bgSecondary: '#1A0A20',
    bgTertiary: '#2A1530',
    accent: '#FF69B4',
    accentSecondary: '#FF1493',
    text: '#FFE6F7',
    textSecondary: '#FFCCEE',
    textHover: '#FF88CC',
    border: 'rgba(255, 105, 180, 0.2)',
  },
  spiderVerse: {
    bgPrimary: '#000000',
    bgSecondary: '#111111',
    bgTertiary: '#222222',
    accent: '#FF0066',
    accentSecondary: '#00FFFF',
    text: '#FFFFFF',
    textSecondary: '#DDDDDD',
    textHover: '#FF3399',
    border: 'rgba(255, 0, 102, 0.2)',
  },
  darkSpider: {
    bgPrimary: '#000000',
    bgSecondary: '#1A0000',
    bgTertiary: '#330000',
    accent: '#8B0000',
    accentSecondary: '#660000',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    textHover: '#FF0000',
    border: 'rgba(139, 0, 0, 0.3)',
  },
  venomBlack: {
    bgPrimary: '#000000',
    bgSecondary: '#0D0D0D',
    bgTertiary: '#1A1A1A',
    accent: '#FFFFFF',
    accentSecondary: '#CCCCCC',
    text: '#FFFFFF',
    textSecondary: '#999999',
    textHover: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = safeLocalStorage.getJSON('theme');
    return savedTheme || themes.spiderMan;
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = safeLocalStorage.getJSON('portfolioSettings');
    return savedSettings || {
      animations: true,
      glowEffects: true,
      blurEffects: true,
      fontSize: 'medium',
      borderRadius: 'medium',
      compactMode: false,
      spiderEffects: true,
      customCursor: null,
      cursorStyle: 'default',
      disableCustomCursor: false,
    };
  });

  useEffect(() => {
    safeLocalStorage.setJSON('theme', theme);
    safeLocalStorage.setJSON('portfolioSettings', settings);
    
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssVarName}`, value);
    });

    const body = document.body;
    body.classList.toggle('no-animations', !settings.animations);
    body.classList.toggle('no-glow', !settings.glowEffects);
    body.classList.toggle('no-blur', !settings.blurEffects);
    body.classList.toggle('compact-mode', settings.compactMode);
    
    document.documentElement.style.setProperty('--font-scale', 
      settings.fontSize === 'small' ? '0.9' : 
      settings.fontSize === 'large' ? '1.1' : '1'
    );
    
    document.documentElement.style.setProperty('--border-radius-scale',
      settings.borderRadius === 'small' ? '0.5' :
      settings.borderRadius === 'large' ? '1.5' : '1'
    );

    // Handle cursor styles
    const applyCursorStyle = () => {
      const style = document.getElementById('dynamic-cursor-style') || document.createElement('style');
      style.id = 'dynamic-cursor-style';
      
      let cursorCSS = '';
      
      // Arc browser detection (do this once at the beginning)
      const isArc = navigator.userAgent.includes('Arc') || navigator.vendor === 'Arc';
      
      // If custom cursors are disabled, remove all cursor styles
      if (settings.disableCustomCursor) {
        cursorCSS = '';
        style.textContent = cursorCSS;
        if (style.parentNode) {
          document.head.removeChild(style);
        }
        return;
      }
      
      if (settings.customCursor && settings.cursorStyle === 'custom') {
        // Handle both portfolio images and uploaded data URLs
        const cursorUrl = settings.customCursor.startsWith('/images/') 
          ? settings.customCursor 
          : settings.customCursor;
        
        if (isArc) {
          // Arc-specific cursor application with higher specificity
          cursorCSS = `
            html *, html *::before, html *::after { 
              cursor: url('${cursorUrl}') 16 16, auto !important; 
            }
            html a, html button, html input[type="submit"], html input[type="button"], 
            html select, html [role="button"], html .cursor-pointer {
              cursor: url('${cursorUrl}') 16 16, pointer !important;
            }
            html input[type="text"], html input[type="email"], html input[type="password"], 
            html textarea, html [contenteditable] {
              cursor: url('${cursorUrl}') 16 16, text !important;
            }
            /* Force Arc to respect cursor changes */
            html body { cursor: inherit !important; }
          `;
        } else {
          // Standard cursor application for other browsers
          cursorCSS = `
            *, *::before, *::after { cursor: url('${cursorUrl}') 16 16, auto !important; }
            a, button, input[type="submit"], input[type="button"], select, [role="button"], .cursor-pointer {
              cursor: url('${cursorUrl}') 16 16, pointer !important;
            }
            input[type="text"], input[type="email"], input[type="password"], textarea, [contenteditable] {
              cursor: url('${cursorUrl}') 16 16, text !important;
            }
          `;
        }
      } else {
        // Helper function to create Arc-compatible cursor data URIs
        const createCursorDataUri = (svgContent) => {
          // Encode SVG content for Arc browser compatibility
          const encodedSvg = encodeURIComponent(svgContent);
          return `url('data:image/svg+xml;charset=utf-8,${encodedSvg}') 16 16`;
        };
        
        // Fallback cursor files for Arc browser
        const arcFallbackCursors = {
          normal: "url('/cursors/spider-classic.cur') 16 16",
          pointer: "url('/cursors/spider-classic.cur') 16 16", 
          text: "url('/cursors/spider-classic.cur') 16 16"
        };

        const cursorStyles = {
          default: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#e31e24"/><circle cx="16" cy="16" r="6" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.6"/></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="#ff69b4"/><circle cx="16" cy="16" r="8" fill="none" stroke="#00d4ff" stroke-width="1.5" opacity="0.8"/><path d="M8 16 L24 16 M16 8 L16 24" stroke="#e31e24" stroke-width="1" opacity="0.7"/></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="26" stroke="#00d4ff" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#ff69b4"/></svg>')
          },
          miles: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="#00d4ff"/><path d="M8 16 L24 16 M16 8 L16 24 M12 12 L20 20 M20 12 L12 20" stroke="#ffff00" stroke-width="1.5" opacity="0.8"/></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="#00d4ff"/><path d="M8 16 L24 16 M16 8 L16 24" stroke="#ffff00" stroke-width="2" opacity="0.9"/></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="26" stroke="#00d4ff" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#ffff00"/></svg>')
          },
          gwen: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="#ff69b4"/><circle cx="16" cy="16" r="8" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7"/></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="#ff69b4"/><circle cx="16" cy="16" r="9" fill="none" stroke="#ffffff" stroke-width="2"/></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="26" stroke="#ff69b4" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#ffffff"/></svg>')
          },
          venom: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="#000000"/><circle cx="16" cy="16" r="8" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.8"/><circle cx="16" cy="16" r="3" fill="#ff0000"/></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="7" fill="#000000"/><circle cx="16" cy="16" r="9" fill="none" stroke="#ffffff" stroke-width="1.5"/><circle cx="16" cy="16" r="4" fill="#ff0000"/></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="26" stroke="#ffffff" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#ff0000"/></svg>')
          },
          web: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="2" fill="#e31e24"/><g stroke="#00d4ff" stroke-width="0.5" fill="none"><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="10"/><line x1="6" y1="16" x2="26" y2="16"/><line x1="16" y1="6" x2="16" y2="26"/><line x1="10.3" y1="10.3" x2="21.7" y2="21.7"/><line x1="21.7" y1="10.3" x2="10.3" y2="21.7"/></g></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="#e31e24"/><g stroke="#00d4ff" stroke-width="1" fill="none"><circle cx="16" cy="16" r="8"/><line x1="8" y1="16" x2="24" y2="16"/><line x1="16" y1="8" x2="16" y2="24"/></g></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="26" stroke="#00d4ff" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#e31e24"/></svg>')
          },
          minimal: {
            normal: isArc ? arcFallbackCursors.normal : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="#ff69b4"/></svg>'),
            pointer: isArc ? arcFallbackCursors.pointer : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#ff69b4"/></svg>'),
            text: isArc ? arcFallbackCursors.text : createCursorDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="8" x2="16" y2="24" stroke="#ff69b4" stroke-width="2"/></svg>')
          }
        };
        
        const selectedStyle = cursorStyles[settings.cursorStyle] || cursorStyles.default;
        
        if (isArc) {
          // Arc-specific cursor application with higher specificity
          cursorCSS = `
            html *, html *::before, html *::after { 
              cursor: ${selectedStyle.normal}, auto !important; 
            }
            html a, html button, html input[type="submit"], html input[type="button"], 
            html select, html [role="button"], html .cursor-pointer {
              cursor: ${selectedStyle.pointer}, pointer !important;
            }
            html input[type="text"], html input[type="email"], html input[type="password"], 
            html textarea, html [contenteditable] {
              cursor: ${selectedStyle.text}, text !important;
            }
            /* Force Arc to respect cursor changes */
            html body { cursor: inherit !important; }
          `;
        } else {
          // Standard cursor application for other browsers
          cursorCSS = `
            *, *::before, *::after { cursor: ${selectedStyle.normal}, auto !important; }
            a, button, input[type="submit"], input[type="button"], select, [role="button"], .cursor-pointer {
              cursor: ${selectedStyle.pointer}, pointer !important;
            }
            input[type="text"], input[type="email"], input[type="password"], textarea, [contenteditable] {
              cursor: ${selectedStyle.text}, text !important;
            }
          `;
        }
      }
      
      style.textContent = cursorCSS;
      if (!style.parentNode) {
        document.head.appendChild(style);
      }
      
      // Force a browser refresh of cursor styles for Arc compatibility
      if (isArc) {
        // Arc browser requires more aggressive cursor refresh
        document.body.style.pointerEvents = 'none';
        document.documentElement.style.cursor = 'none';
        
        // Force reflow
        document.body.offsetHeight;
        
        requestAnimationFrame(() => {
          document.body.style.pointerEvents = '';
          document.documentElement.style.cursor = '';
          
          // Additional Arc-specific refresh
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            el.style.cursor = computedStyle.cursor;
            requestAnimationFrame(() => {
              el.style.cursor = '';
            });
          });
        });
      } else {
        // Standard browser refresh
        document.body.style.pointerEvents = 'none';
        requestAnimationFrame(() => {
          document.body.style.pointerEvents = '';
        });
      }
    };
    
    applyCursorStyle();
  }, [theme, settings]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themes,
      settings,
      updateTheme,
      updateSettings
    }}>
      {children}
    </ThemeContext.Provider>
  );
};