import React, { createContext, useState, useEffect } from 'react';
import safeLocalStorage from '../utils/safeLocalStorage';

const themes = {
  default: {
    bgPrimary: '#0F0F23',
    bgSecondary: '#1A1A2E',
    bgTertiary: '#16213E',
    accent: '#64FFDA',
    accentSecondary: '#BB86FC',
    text: '#E0E6ED',
    textSecondary: '#8892B0',
    textHover: '#64FFDA',
    border: 'rgba(100, 255, 218, 0.1)',
  },
  darkBlue: {
    bgPrimary: '#0A0E27',
    bgSecondary: '#1E3A8A',
    bgTertiary: '#3B82F6',
    accent: '#60A5FA',
    accentSecondary: '#8B5CF6',
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    textHover: '#F3F4F6',
    border: 'rgba(96, 165, 250, 0.1)',
  },
  emerald: {
    bgPrimary: '#022C22',
    bgSecondary: '#064E3B',
    bgTertiary: '#059669',
    accent: '#34D399',
    accentSecondary: '#10B981',
    text: '#D1FAE5',
    textSecondary: '#A7F3D0',
    textHover: '#ECFDF5',
    border: 'rgba(52, 211, 153, 0.1)',
  },
  cyberpunk: {
    bgPrimary: '#0D0208',
    bgSecondary: '#003566',
    bgTertiary: '#001D3D',
    accent: '#FFD60A',
    accentSecondary: '#FF006E',
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    textHover: '#FFD60A',
    border: 'rgba(255, 214, 10, 0.1)',
  },
  sunset: {
    bgPrimary: '#1A0B2E',
    bgSecondary: '#7209B7',
    bgTertiary: '#A663CC',
    accent: '#F79071',
    accentSecondary: '#FA7268',
    text: '#F8F9FA',
    textSecondary: '#DEE2E6',
    textHover: '#F79071',
    border: 'rgba(247, 144, 113, 0.1)',
  },
  ocean: {
    bgPrimary: '#001845',
    bgSecondary: '#023047',
    bgTertiary: '#219EBC',
    accent: '#8ECAE6',
    accentSecondary: '#FFB703',
    text: '#F1FAEE',
    textSecondary: '#A8DADC',
    textHover: '#8ECAE6',
    border: 'rgba(142, 202, 230, 0.1)',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = safeLocalStorage.getJSON('theme');
    return savedTheme || themes.default;
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
      mouseEffects: true,
      cursorStyle: 'modern',
      cursorTrail: true,
      cursorSize: 'medium',
      cursorColor: '#64ffda',
      particleEffects: true,
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
    body.classList.toggle('no-mouse-effects', !settings.mouseEffects);
    
    document.documentElement.style.setProperty('--font-scale', 
      settings.fontSize === 'small' ? '0.9' : 
      settings.fontSize === 'large' ? '1.1' : '1'
    );
    
    document.documentElement.style.setProperty('--border-radius-scale',
      settings.borderRadius === 'small' ? '0.5' :
      settings.borderRadius === 'large' ? '1.5' : '1'
    );

    document.documentElement.style.setProperty('--cursor-color', settings.cursorColor);
    document.documentElement.style.setProperty('--cursor-size', 
      settings.cursorSize === 'small' ? '12px' : 
      settings.cursorSize === 'large' ? '28px' : '20px'
    );
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