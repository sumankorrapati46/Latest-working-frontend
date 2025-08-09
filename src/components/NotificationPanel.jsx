import React, { useState, useEffect } from 'react';
import { employeesAPI } from '../api/apiService';

const NotificationPanel = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await employeesAPI.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await employeesAPI.markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Call parent handler
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return '📋';
      case 'PENDING_KYC':
        return '⏳';
      case 'REFER_BACK':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return 'bg-blue-100 border-blue-300';
      case 'PENDING_KYC':
        return 'bg-yellow-100 border-yellow-300';
      case 'REFER_BACK':
        return 'bg-orange-100 border-orange-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="notification-panel-component">
      {/* Notification Bell */}
      <div className="notification-panel-bell" onClick={() => setIsOpen(!isOpen)}>
        <div className="notification-panel-bell-icon">🔔</div>
        {unreadCount > 0 && (
          <div className="notification-panel-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-panel-dropdown">
          <div className="notification-panel-header">
            <h3>Notifications</h3>
            <button 
              className="notification-panel-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="notification-panel-list">
            {notifications.length === 0 ? (
              <div className="notification-panel-no-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`notification-panel-item ${!notification.read ? 'unread' : ''} ${getNotificationColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-panel-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-panel-content">
                    <p className="notification-panel-message">{notification.message}</p>
                    <p className="notification-panel-date">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="notification-panel-unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="notification-panel-footer">
              <button 
                className="notification-panel-mark-all-read-btn"
                onClick={() => {
                  notifications.forEach(n => handleNotificationClick(n));
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 