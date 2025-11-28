import React from 'react';
import { useModules } from '../../context/ModuleContext';
import { ChannelPills } from './ChannelPills';
import { StatusDropdown } from './StatusDropdown';
import { CommentHistory } from '../comments/CommentHistory';
import { formatDate } from '../../utils/helpers';

export const ModuleRow = ({ module, onEdit, onDelete, onToast }) => {
    const { expandedModules, toggleExpansion } = useModules();
    const isExpanded = expandedModules.has(module.id);

    return (
        <>
            <tr>
                <td className="ps-4 fw-medium">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-sm btn-link p-0 me-2 text-muted collapse-toggle"
                            onClick={() => toggleExpansion(module.id)}
                            title="Toggle comment history"
                        >
                            <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                        </button>
                        <span>{module.name}</span>
                    </div>
                </td>
                <td>
                    <ChannelPills module={module} />
                </td>
                <td>
                    <StatusDropdown module={module} onToast={onToast} />
                </td>
                <td className="text-muted small text-truncate" style={{ maxWidth: '200px' }} title={module.reason || ''}>
                    {module.reason || '-'}
                </td>
                <td>{module.failures}</td>
                <td className="text-muted small">{formatDate(module.lastUpdated)}</td>
                <td className="text-end pe-4">
                    <button
                        className="btn btn-sm btn-light text-primary me-1"
                        onClick={() => onEdit(module)}
                        title="Edit"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => onDelete(module)}
                        title="Delete"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr className="comment-history-row">
                    <td colSpan="7" className="p-0">
                        <div className="comment-history-container">
                            <CommentHistory module={module} onToast={onToast} />
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
