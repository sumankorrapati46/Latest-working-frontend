import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const THEMES = {
  MODERN_CLEAN: 'modern-clean',
  TRADITIONAL_CORPORATE: 'traditional-corporate',
  MODERN_MINIMALIST: 'modern-minimalist'
};

export const THEME_LABELS = {
  [THEMES.MODERN_CLEAN]: 'Modern Clean',
  [THEMES.TRADITIONAL_CORPORATE]: 'Traditional Corporate',
  [THEMES.MODERN_MINIMALIST]: 'Modern Minimalist'
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage('selectedTheme', THEMES.MODERN_CLEAN);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  const changeTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      setCurrentTheme(theme);
    }
  };

  const getThemeLabel = (theme = currentTheme) => {
    return THEME_LABELS[theme] || 'Unknown Theme';
  };

  const getAllThemes = () => {
    return Object.entries(THEME_LABELS).map(([value, label]) => ({
      value,
      label
    }));
  };

  const value = {
    currentTheme,
    changeTheme,
    getThemeLabel,
    getAllThemes,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;