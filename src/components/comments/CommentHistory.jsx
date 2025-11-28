import React, { useState } from 'react';
import { useModules } from '../../context/ModuleContext';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

export const CommentHistory = ({ module, onToast }) => {
    const { updateModule } = useModules();
    const [showForm, setShowForm] = useState(false);
    const history = module.commentHistory || [];

    const handleAddComment = ({ type, text }) => {
        const newComment = {
            type,
            comment: text,
            timestamp: new Date().toISOString()
        };

        const updatedHistory = [...history, newComment];
        updateModule(module.id, { commentHistory: updatedHistory });
        onToast('Comment added successfully', 'success');
        setShowForm(false);
    };

    return (
        <div className="comment-history-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold text-muted">
                    <i className="bi bi-chat-left-text me-2"></i>Comment History
                    {history.length > 0 && (
                        <span className="badge bg-secondary ms-2">{history.length}</span>
                    )}
                </h6>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add Comment
                </button>
            </div>

            {showForm && (
                <CommentForm
                    onSubmit={handleAddComment}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="comment-list">
                <CommentList
                    comments={history}
                    moduleId={module.id}
                    onToast={onToast}
                />
            </div>
        </div>
    );
};
