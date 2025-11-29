import React, { useState } from 'react';
import { useModules } from '../../context/ModuleContext';
import { getStatusClass } from '../../utils/helpers';
import { STATUSES } from '../../utils/constants';
import { StatusUpdateModal } from './StatusUpdateModal';

export const StatusDropdown = ({ module, onToast }) => {
    const { updateModule } = useModules();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const handleStatusClick = (status) => {
        if (module.status === status) return;
        setPendingStatus(status);
        setIsModalOpen(true);
    };

    const handleConfirmUpdate = ({ reason, failures, selectedChannels }) => {
        const updatedChannels = { ...module.channels };
        let channelsUpdated = false;

        // Update channels based on selection
        Object.keys(selectedChannels).forEach(channel => {
            if (selectedChannels[channel]) {
                updatedChannels[channel] = pendingStatus;
                channelsUpdated = true;
            }
        });

        const updates = {
            status: pendingStatus,
            reason: reason || module.reason, // Keep old reason if empty? Or overwrite? User asked for optional. Let's overwrite if they typed something, or if they cleared it?
            // Actually, if they leave it empty, maybe they mean "no reason". 
            // But usually optional means "keep existing" or "don't add one".
            // Let's use the value from modal directly.
            reason: reason,
            failures: pendingStatus === 'Failed' ? failures : module.failures
        };

        if (channelsUpdated) {
            updates.channels = updatedChannels;
        }

        updateModule(module.id, updates);
        onToast(`Status updated to ${pendingStatus}`, 'success');
        setIsModalOpen(false);
        setPendingStatus(null);
    };

    return (
        <>
            <div className="dropdown">
                <button
                    className="btn btn-sm p-0 border-0"
                    type="button"
                    data-bs-toggle="dropdown"
                >
                    <span className={`badge badge-status ${getStatusClass(module.status)}`}>
                        {module.status} <i className="bi bi-chevron-down ms-1" style={{ fontSize: '0.8em' }}></i>
                    </span>
                </button>
                <ul className="dropdown-menu">
                    {STATUSES.map(status => (
                        <li key={status}>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleStatusClick(status);
                                }}
                            >
                                Set to {status}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {pendingStatus && (
                <StatusUpdateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmUpdate}
                    newStatus={pendingStatus}
                    currentReason={module.reason}
                    currentFailures={module.failures}
                    currentChannels={module.channels}
                />
            )}
        </>
    );
};
