import React, { useState } from 'react';

export const CommentForm = ({ onSubmit, onCancel }) => {
    const [type, setType] = useState('failure');
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ type, text });
        setText('');
        setType('failure');
    };

    return (
        <div className="add-comment-form mb-3">
            <div className="card border-0 bg-light">
                <div className="card-body p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label small fw-bold">Comment Type</label>
                            <select
                                className="form-select form-select-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="failure">Failure Reason</option>
                                <option value="fix">Fix Reason</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label small fw-bold">Comment</label>
                            <textarea
                                className="form-control form-control-sm"
                                rows="2"
                                placeholder="Enter your comment..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-sm btn-primary">
                                <i className="bi bi-check-lg me-1"></i>Save
                            </button>
                            <button type="button" className="btn btn-sm btn-light" onClick={onCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
