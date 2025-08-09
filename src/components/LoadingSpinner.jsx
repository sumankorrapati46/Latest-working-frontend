import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'spinner', 
  color = 'primary',
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClass = `spinner-${size}`;
  const typeClass = `spinner-${type}`;
  const colorClass = `spinner-${color}`;

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`loading-container ${sizeClass} ${typeClass} ${colorClass}`}>
          {type === 'spinner' && <div className="spinner"></div>}
          {type === 'dots' && (
            <div className="dots-container">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          {type === 'pulse' && <div className="pulse"></div>}
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-container ${sizeClass} ${typeClass} ${colorClass}`}>
      {type === 'spinner' && <div className="spinner"></div>}
      {type === 'dots' && (
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {type === 'pulse' && <div className="pulse"></div>}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 