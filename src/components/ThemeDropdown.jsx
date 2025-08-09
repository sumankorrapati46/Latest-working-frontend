import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemeDropdown.css';

const ThemeDropdown = ({ className = '' }) => {
  const { currentTheme, changeTheme, getThemeLabel, getAllThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (themeValue) => {
    changeTheme(themeValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`theme-dropdown ${className}`} ref={dropdownRef}>
      <button 
        className="theme-selector-btn"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="theme-label">Theme: {getThemeLabel()}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="dropdown-header">
            <span className="dropdown-title">Choose Theme</span>
          </div>
          
          {getAllThemes().map((theme) => (
            <button
              key={theme.value}
              className={`theme-option ${currentTheme === theme.value ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(theme.value)}
            >
              <div className="theme-preview">
                <div className={`theme-preview-colors ${theme.value}`}>
                  <div className="color-dot primary"></div>
                  <div className="color-dot secondary"></div>
                  <div className="color-dot accent"></div>
                </div>
              </div>
              
              <div className="theme-info">
                <span className="theme-name">{theme.label}</span>
                <span className="theme-description">
                  {theme.value === 'modern-clean' && 'Clean and modern design with green accents'}
                  {theme.value === 'traditional-corporate' && 'Professional corporate style with blue tones'}
                  {theme.value === 'modern-minimalist' && 'Minimal design with subtle colors'}
                </span>
              </div>
              
              {currentTheme === theme.value && (
                <div className="selected-indicator">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;