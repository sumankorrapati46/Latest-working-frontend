import React, { useEffect, useState } from 'react';
import '../styles/NotificationToast.css';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`notification-toast ${type} ${position} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="progress-bar" 
          style={{ 
            animationDuration: `${duration}ms`,
            animationDelay: '300ms'
          }}
        />
      </div>
    </div>
  );
};

export default NotificationToast; 