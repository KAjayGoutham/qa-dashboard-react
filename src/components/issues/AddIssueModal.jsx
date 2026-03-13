import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const AddIssueModal = ({ isOpen, onClose, onSubmit, editingIssue, channel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'medium',
        traceInfo: '',
        channel: channel
    });

    useEffect(() => {
        if (editingIssue) {
            setFormData({
                title: editingIssue.title || '',
                description: editingIssue.description || '',
                severity: editingIssue.severity || 'medium',
                traceInfo: editingIssue.traceInfo || '',
                channel: editingIssue.channel || channel
            });
        } else {
            setFormData({
                title: '',
                description: '',
                severity: 'medium',
                traceInfo: '',
                channel: channel
            });
        }
    }, [editingIssue, channel, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            alert('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            severity: 'medium',
            traceInfo: '',
            channel: channel
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={editingIssue ? 'Edit Issue' : 'Add New Issue'}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Channel <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={channel.toUpperCase()}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Title <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter issue title"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the issue"
                        rows="3"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Severity <span className="text-danger">*</span>
                    </label>
                    <select
                        className="form-select"
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Trace Information
                    </label>
                    <textarea
                        className="form-control font-monospace"
                        name="traceInfo"
                        value={formData.traceInfo}
                        onChange={handleChange}
                        placeholder="Paste trace logs, stack traces, or debugging information here"
                        rows="6"
                        style={{ fontSize: '0.85rem' }}
                    />
                    <small className="text-muted">
                        Optional: Add stack traces, error logs, or debugging information
                    </small>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-check-lg me-1"></i>
                        {editingIssue ? 'Update Issue' : 'Add Issue'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
