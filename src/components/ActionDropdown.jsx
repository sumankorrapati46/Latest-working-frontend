import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const ActionDropdown = ({ 
  item, 
  onEdit, 
  onDelete, 
  onView, 
  onKycUpdate,
  showDelete = false, 
  customActions = [] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  // Close dropdown when clicking outside and compute portal position
  useEffect(() => {
    const handleClickOutside = (event) => {
      const portal = document.getElementById('action-dropdown-portal-menu');
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target) &&
        (!portal || !portal.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };
    const updatePos = () => {
      if (!toggleRef.current) return;
      const rect = toggleRef.current.getBoundingClientRect();
      const width = 220;
      const top = rect.bottom + 10 + window.scrollY;
      const left = Math.min(
        rect.right - width + window.scrollX,
        window.innerWidth - width - 8
      );
      setMenuPos({ top, left });
    };
    if (isOpen) {
      updatePos();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePos, true);
      window.addEventListener('resize', updatePos);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [isOpen]);

  // Build actions array based on available props
  const actions = useMemo(() => {
    const actionList = [];

    // Add view action if available
    if (onView) {
      actionList.push({
        label: 'View',
        icon: '👁️',
        className: 'action-view',
        onClick: () => onView(item)
      });
    }

    // Add edit action if available
    if (onEdit) {
      actionList.push({
        label: 'Edit',
        icon: '✏️',
        className: 'action-edit',
        onClick: () => onEdit(item)
      });
    }

    // Add delete action if available and showDelete is true
    if (onDelete && showDelete) {
      actionList.push({
        label: 'Delete',
        icon: '🗑️',
        className: 'action-delete',
        onClick: () => onDelete(item)
      });
    }

    // Add KYC Update action last, to match requested order
    if (onKycUpdate) {
      actionList.push({
        label: 'KYC Update',
        icon: '📄',
        className: 'action-kyc-update',
        onClick: () => onKycUpdate(item)
      });
    }

    // Add custom actions (this is the primary way actions are currently used)
    if (customActions && Array.isArray(customActions)) {
      customActions.forEach(action => {
        actionList.push({
          ...action,
          onClick: () => action.onClick(item)
        });
      });
    }

    try {
      console.log('ActionDropdown: built actions for item', {
        hasView: !!onView,
        hasEdit: !!onEdit,
        hasDelete: !!onDelete && showDelete,
        hasKyc: !!onKycUpdate,
        customCount: Array.isArray(customActions) ? customActions.length : 0,
        total: actionList.length
      });
    } catch {}
    return actionList;
  }, [onEdit, onDelete, onView, showDelete, customActions, item]);

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  // Don't render if no actions available
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="action-dropdown-component" ref={dropdownRef}>
      <button
        className="action-dropdown-toggle"
        type="button"
        ref={toggleRef}
        onClick={(e) => {
          e.stopPropagation();
          const next = !isOpen;
          console.log('ActionDropdown: toggle clicked, next open =', next);
          setIsOpen(next);
        }}
        aria-label="Actions"
      >
        ⋯
      </button>

      {isOpen && createPortal(
        <div
          id="action-dropdown-portal-menu"
          className="action-dropdown-portal-menu open"
          style={{ position: 'absolute', top: menuPos.top, left: menuPos.left }}
        >
          {actions.map((action, index) => {
            if (action.showCondition && !action.showCondition(item)) {
              return null;
            }
            return (
              <button
                key={index}
                className={`action-dropdown-item ${action.className || ''}`}
                onClick={() => handleActionClick(action)}
              >
                {action.icon && <span className="action-dropdown-icon">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ActionDropdown; 