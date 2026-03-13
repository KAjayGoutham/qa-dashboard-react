import React, { useState } from 'react';

export const IssueCard = ({ issue, onDelete, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            onDelete(issue.id);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'danger',
            high: 'warning',
            medium: 'info',
            low: 'secondary'
        };
        return colors[severity] || 'secondary';
    };

    return (
        <div className="card border-0 shadow-sm mb-3 hover-shadow">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className={`badge bg-${getSeverityColor(issue.severity)} text-uppercase`}>
                                {issue.severity}
                            </span>
                            <span className="badge bg-light text-dark">
                                <i className="bi bi-hash"></i>{issue.id.slice(0, 8)}
                            </span>
                        </div>
                        <h6 className="mb-2 fw-bold">{issue.title}</h6>
                        <p className="text-muted small mb-2">{issue.description}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(issue)}
                            title="Edit Issue"
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                            title="Delete Issue"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>

                {issue.traceInfo && (
                    <div className="mb-2">
                        <button
                            className="btn btn-sm btn-link p-0 text-decoration-none"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
                            Trace Information
                        </button>
                        {isExpanded && (
                            <div className="mt-2 p-3 bg-light rounded">
                                <pre className="mb-0 small text-wrap" style={{ whiteSpace: 'pre-wrap' }}>
                                    {issue.traceInfo}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(issue.createdAt)}
                    </small>
                    {issue.updatedAt !== issue.createdAt && (
                        <small className="text-muted">
                            <i className="bi bi-pencil-square me-1"></i>
                            Updated {formatDate(issue.updatedAt)}
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};
