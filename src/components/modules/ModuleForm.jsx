import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useModules } from '../../context/ModuleContext';

export const ModuleForm = ({ isOpen, onClose, module, onToast }) => {
    const { addModule, updateModule } = useModules();
    const [formData, setFormData] = useState({
        name: '',
        status: 'Passed',
        reason: '',
        failures: 0
    });

    useEffect(() => {
        if (module) {
            setFormData({
                name: module.name,
                status: module.status,
                reason: module.reason || '',
                failures: module.failures
            });
        } else {
            setFormData({
                name: '',
                status: 'Passed',
                reason: '',
                failures: 0
            });
        }
    }, [module, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            onToast('Module name is required', 'error');
            return;
        }

        if (module) {
            updateModule(module.id, formData);
            onToast('Module updated successfully', 'success');
        } else {
            addModule(formData);
            onToast('Module added successfully', 'success');
        }

        onClose();
    };

    const footer = (
        <>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
            </button>
            <button type="submit" form="moduleForm" className="btn btn-primary">
                {module ? 'Update' : 'Add'} Module
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={module ? 'Edit Module' : 'Add Module'}
            footer={footer}
        >
            <form id="moduleForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Module Name *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Blocked">Blocked</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Failure Count</label>
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={formData.failures}
                        onChange={(e) => setFormData({ ...formData, failures: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </form>
        </Modal>
    );
};
