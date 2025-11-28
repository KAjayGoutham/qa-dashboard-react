import React, { useState } from 'react';
import { useModules } from '../../context/ModuleContext';
import { formatDate } from '../../utils/helpers';

export const CommentCard = ({ comment, moduleId, onToast }) => {
    const { updateModule, modules } = useModules();
    const [isEditing, setIsEditing] = useState(false);
    const [editType, setEditType] = useState(comment.type);
    const [editText, setEditText] = useState(comment.comment);

    const typeClass = comment.type === 'failure' ? 'comment-failure' : 'comment-fix';
    const typeIcon = comment.type === 'failure' ? 'bi-exclamation-circle' : 'bi-check-circle';
    const typeLabel = comment.type === 'failure' ? 'Failure' : 'Fix';

    const handleSaveEdit = () => {
        if (!editText.trim()) {
            onToast('Please enter a comment', 'error');
            return;
        }

        const module = modules.find(m => m.id === moduleId);
        if (!module) return;

        const updatedHistory = module.commentHistory.map(c =>
            c.timestamp === comment.timestamp
                ? { ...c, type: editType, comment: editText }
                : c
        );

        updateModule(moduleId, { commentHistory: updatedHistory });
        onToast('Comment updated successfully', 'success');
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        const module = modules.find(m => m.id === moduleId);
        if (!module) return;

        const updatedHistory = module.commentHistory.filter(c => c.timestamp !== comment.timestamp);
        updateModule(moduleId, { commentHistory: updatedHistory });
        onToast('Comment deleted successfully', 'success');
    };

    return (
        <div className={`comment-card ${typeClass} mb-2`}>
            <div className="d-flex align-items-start">
                <i className={`bi ${typeIcon} me-2 mt-1`}></i>
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <span className={`badge badge-sm ${comment.type === 'failure' ? 'bg-danger' : 'bg-success'}`}>
                                {typeLabel}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted small">{formatDate(comment.timestamp)}</span>
                            <div className="comment-actions">
                                <button
                                    className="btn btn-sm btn-link p-0 text-primary"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit comment"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-link p-0 text-danger ms-1"
                                    onClick={handleDelete}
                                    title="Delete comment"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isEditing ? (
                        <p className="mb-0 small">{comment.comment}</p>
                    ) : (
                        <div className="edit-comment-form mt-2">
                            <div className="mb-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={editType}
                                    onChange={(e) => setEditType(e.target.value)}
                                >
                                    <option value="failure">Failure Reason</option>
                                    <option value="fix">Fix Reason</option>
                                </select>
                            </div>
                            <textarea
                                className="form-control form-control-sm mb-2"
                                rows="2"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            ></textarea>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-primary" onClick={handleSaveEdit}>
                                    <i className="bi bi-check-lg me-1"></i>Save
                                </button>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditType(comment.type);
                                        setEditText(comment.comment);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
