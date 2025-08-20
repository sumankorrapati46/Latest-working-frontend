import React, { useMemo, useCallback } from 'react';
import ActionDropdown from './ActionDropdown';

const DataTable = React.memo(({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onView, 
  onKycUpdate,
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

  // Memoized safe render function with enhanced field mapping
  const safeRender = useCallback((value, columnKey, row) => {
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
      
      // If value is null or undefined, try alternative field names
      if (value === null || value === undefined) {
        // Try common alternative field names for the same data
        const alternativeFields = {
          'name': ['fullName', 'userName', 'firstName', 'lastName'],
          'email': ['emailAddress', 'userEmail'],
          'phoneNumber': ['phone', 'mobile', 'contactNumber', 'mobileNumber'],
          'role': ['userRole', 'type', 'userType'],
          'status': ['registrationStatus', 'approvalStatus', 'kycStatus']
        };
        
        if (alternativeFields[columnKey] && row) {
          for (const altField of alternativeFields[columnKey]) {
            if (row[altField] !== undefined && row[altField] !== null) {
              return String(row[altField]);
            }
          }
        }
        
        return 'N/A';
      }
      
      // If value is a string, number, or boolean, return it as string
      return String(value);
    } catch (error) {
      console.error(`DataTable: Error rendering value for column ${columnKey}:`, error);
      return 'Error';
    }
  }, []);

  // Memoized table data with debugging
  const tableData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Debug: Log the first few records to understand the data structure
    if (data.length > 0) {
      console.log('🔍 DataTable: Sample data structure:', {
        firstRecord: data[0],
        totalRecords: data.length,
        availableFields: Object.keys(data[0] || {})
      });
    }
    
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
        <colgroup>
          {tableColumns.map((column) => (
            <col key={column.key} className={column.className || ''} />
          ))}
          {(onEdit || onDelete || onView || customActions.length > 0) && (
            <col className="col-actions" />
          )}
        </colgroup>
        <thead>
          <tr>
            {tableColumns.map((column) => (
              <th key={column.key} className={`data-table-header ${column.className || ''}`}>
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete || onView || customActions.length > 0) && (
              <th className="data-table-header actions-header col-actions">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.id || index} className="data-table-row">
              {tableColumns.map((column) => {
                const value = row[column.key];
                const cellContent = column.render 
                  ? column.render(value, row) 
                  : safeRender(value, column.key, row);
                
                const normalizedStatus = typeof value === 'string' ? value.toLowerCase() : '';
                return (
                  <td key={column.key} className={`data-table-cell ${column.className || ''}`}>
                    {column.type === 'status' ? (
                      <span className={`status-badge ${getStatusClass(value)} ${normalizedStatus}`}>
                        {cellContent}
                      </span>
                    ) : (
                      cellContent
                    )}
                  </td>
                );
              })}
              {(onEdit || onDelete || onView || customActions.length > 0) && (
                <td className="data-table-cell actions-cell col-actions">
                  <ActionDropdown
                    item={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onKycUpdate={onKycUpdate}
                    showDelete={showDelete}
                    customActions={customActions || []}
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