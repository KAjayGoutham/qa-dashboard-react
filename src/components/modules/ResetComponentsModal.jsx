import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const ResetComponentsModal = ({ isOpen, onClose, onConfirm, currentEnvironment }) => {
    const [selectedStatus, setSelectedStatus] = useState('In Progress');

    useEffect(() => {
        if (isOpen) {
            setSelectedStatus('In Progress');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm(selectedStatus);
        onClose();
    };

    const getWarningMessage = () => {
        if (selectedStatus === 'In Progress') {
            return (
                <>
                    <div className="alert alert-warning d-flex align-items-start mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                        <div>
                            <strong>Warning!</strong> This action will reset ALL modules in the <strong>{currentEnvironment}</strong> environment.
                        </div>
                    </div>
                    <p className="mb-2">This will:</p>
                    <ul className="mb-3">
                        <li>Enable all channels (Voice, SMS, Chat, Email) for all modules</li>
                        <li>Change all module statuses to "In Progress"</li>
                        <li>Clear all failure reasons</li>
                        <li>Reset failure counts to 0</li>
                        <li>Preserve all comments and history</li>
                    </ul>
                    <p className="text-danger fw-bold mb-0">
                        <i className="bi bi-info-circle me-1"></i>
                        This action cannot be undone. Use this feature at the start of a new release cycle.
                    </p>
                </>
            );
        } else {
            return (
                <>
                    <div className="alert alert-success d-flex align-items-start mb-3">
                        <i className="bi bi-check-circle-fill me-2 fs-4"></i>
                        <div>
                            <strong>Confirmation Required!</strong> This action will reset ALL modules in the <strong>{currentEnvironment}</strong> environment.
                        </div>
                    </div>
                    <p className="mb-2">This will:</p>
                    <ul className="mb-3">
                        <li>Enable all channels (Voice, SMS, Chat, Email) for all modules</li>
                        <li>Change all module statuses to "Passed"</li>
                        <li>Clear all failure reasons</li>
                        <li>Reset failure counts to 0</li>
                        <li>Preserve all comments and history</li>
                    </ul>
                    <p className="text-warning fw-bold mb-0">
                        <i className="bi bi-info-circle me-1"></i>
                        This action cannot be undone. Use this carefully.
                    </p>
                </>
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Reset Modules"
            size="lg"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className={`btn ${selectedStatus === 'In Progress' ? 'btn-warning' : 'btn-success'}`}
                        onClick={handleConfirm}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Reset to {selectedStatus}
                    </button>
                </>
            }
        >
            <div className="mb-4">
                <label className="form-label fw-bold">
                    <i className="bi bi-gear-fill me-2"></i>
                    Select Target Status
                </label>
                <div className="btn-group w-100" role="group">
                    <button
                        type="button"
                        className={`btn ${selectedStatus === 'In Progress' ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setSelectedStatus('In Progress')}
                    >
                        <i className="bi bi-hourglass-split me-1"></i>
                        In Progress
                    </button>
                    <button
                        type="button"
                        className={`btn ${selectedStatus === 'Passed' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setSelectedStatus('Passed')}
                    >
                        <i className="bi bi-check-circle me-1"></i>
                        Passed
                    </button>
                </div>
            </div>

            {getWarningMessage()}
        </Modal>
    );
};
