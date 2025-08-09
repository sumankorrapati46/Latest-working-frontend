import React, { useMemo, useCallback } from 'react';
import ActionDropdown from './ActionDropdown';

const DataTable = React.memo(({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onView, 
  showDelete = false, 
  customActions = [],
  loading = false,
  emptyMessage = "No data available"
}) => {
  const getStatusClass = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'refer_back':
        return 'status-refer-back';
      case 'rejected':
        return 'status-rejected';
      case 'assigned':
        return 'status-assigned';
      case 'unassigned':
        return 'status-unassigned';
      case 'active':
        return 'status-approved';
      case 'inactive':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }, []);

  // Memoized safe render function
  const safeRender = useCallback((value, columnKey) => {
    try {
      // If value is an object, try to extract meaningful data
      if (value && typeof value === 'object') {
        // Handle common object types
        if (value.name) return value.name;
        if (value.title) return value.title;
        if (value.label) return value.label;
        if (value.id) return value.id;
        
        // For arrays, show count
        if (Array.isArray(value)) {
          return `${value.length} item${value.length !== 1 ? 's' : ''}`;
        }
        
        // For other objects, show a summary
        const keys = Object.keys(value);
        if (keys.length <= 3) {
          return keys.map(key => value[key]).join(', ');
        }
        
        return 'Object';
      }
      
      // If value is null or undefined, return 'N/A'
      if (value === null || value === undefined) {
        return 'N/A';
      }
      
      // If value is a string, number, or boolean, return it as string
      return String(value);
    } catch (error) {
      console.error(`DataTable: Error rendering value for column ${columnKey}:`, error);
      return 'Error';
    }
  }, []);

  // Memoized table data
  const tableData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data;
  }, [data]);

  // Memoized columns
  const tableColumns = useMemo(() => {
    if (!columns || !Array.isArray(columns)) return [];
    return columns;
  }, [columns]);

  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!tableData.length) {
    return (
      <div className="data-table-empty">
        <div className="empty-icon">📋</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {tableColumns.map((column) => (
              <th key={column.key} className={`table-header ${column.className || ''}`}>
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete || onView || customActions.length > 0) && (
              <th className="table-header actions-header">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.id || index} className="table-row">
              {tableColumns.map((column) => {
                const value = row[column.key];
                const cellContent = column.render 
                  ? column.render(value, row) 
                  : safeRender(value, column.key);
                
                return (
                  <td key={column.key} className={`table-cell ${column.className || ''}`}>
                    {column.type === 'status' ? (
                      <span className={`status-badge ${getStatusClass(value)}`}>
                        {cellContent}
                      </span>
                    ) : (
                      cellContent
                    )}
                  </td>
                );
              })}
              {(onEdit || onDelete || onView || customActions.length > 0) && (
                <td className="table-cell actions-cell">
                  <ActionDropdown
                    item={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    showDelete={showDelete}
                    customActions={customActions}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable; 