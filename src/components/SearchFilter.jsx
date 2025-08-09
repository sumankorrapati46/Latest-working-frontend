import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/SearchFilter.css';

const SearchFilter = ({ 
  onSearch, 
  onFilter, 
  filters = [], 
  placeholder = "Search...",
  showAdvancedFilters = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value
    };
    
    // Remove empty filters
    if (!value || value === '') {
      delete newFilters[filterKey];
    }
    
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  }, [activeFilters, onFilter]);

  // Handle search submission
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm('');
    onFilter?.({});
    onSearch?.('');
  }, [onFilter, onSearch]);

  // Get active filters count
  const activeFiltersCount = Object.keys(activeFilters).length + (searchTerm ? 1 : 0);

  return (
    <div className={`search-filter-container ${className}`}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>
        
        {/* Filter Toggle */}
        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        )}
      </form>

      {/* Advanced Filters */}
      {showFilters && filters.length > 0 && (
        <div className="filters-panel">
          <div className="filters-grid">
            {filters.map((filter) => (
              <div key={filter.key} className="filter-group">
                <label className="filter-label">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="filter-input"
                  />
                ) : (
                  <input
                    type="text"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={`Filter by ${filter.label}`}
                    className="filter-input"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Filter Actions */}
          <div className="filter-actions">
            <button
              type="button"
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 