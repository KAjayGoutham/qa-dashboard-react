import React from 'react';

export const Controls = ({ searchText, onSearchChange, statusFilter, onStatusChange, sortBy, onSortChange }) => {
    return (
        <div className="row g-3 mb-3">
            <div className="col-md-4">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search modules..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-4">
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </div>
            <div className="col-md-4">
                <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="status">Status</option>
                    <option value="failures_desc">Failures (High to Low)</option>
                </select>
            </div>
        </div>
    );
};
