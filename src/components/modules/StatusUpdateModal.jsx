import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { CHANNELS, CHANNEL_ICONS } from '../../utils/constants';

export const StatusUpdateModal = ({
    isOpen,
    onClose,
    onConfirm,
    newStatus,
    currentReason,
    currentFailures,
    currentChannels
}) => {
    const [reason, setReason] = useState('');
    const [failures, setFailures] = useState(0);
    const [selectedChannels, setSelectedChannels] = useState({});

    useEffect(() => {
        if (isOpen) {
            setReason(currentReason || '');
            setFailures(currentFailures || 0);

            // Initialize channels based on current state or default to all selected for 'Passed'
            // For other statuses, we might want to start with none selected or keep current
            // Let's default to current state, but if it's a string, convert to boolean based on status match
            const initialChannels = {};
            CHANNELS.forEach(channel => {
                const val = currentChannels[channel];
                // If we are setting to Passed, we might want to select all by default? 
                // Or just let user select. Let's stick to current state logic or reset.
                // User asked for checkboxes.

                // Logic: 
                // If channel value matches newStatus, it's checked.
                // If we are switching to 'Failed', we want to select which ones FAILED.
                // If we are switching to 'Passed', we want to select which ones PASSED.

                // Let's just default to unchecked for simplicity, or maybe pre-fill if they already match?
                // Actually, for better UX:
                // If status is 'Passed', default all to checked (assuming all passed).
                // If status is 'Failed', default all to unchecked (user picks what failed).

                if (newStatus === 'Passed') {
                    initialChannels[channel] = true;
                } else {
                    initialChannels[channel] = false;
                }
            });
            setSelectedChannels(initialChannels);
        }
    }, [isOpen, newStatus, currentReason, currentFailures, currentChannels]);

    const handleChannelChange = (channel) => {
        setSelectedChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

    const handleSubmit = () => {
        onConfirm({
            reason,
            failures,
            selectedChannels
        });
    };

    const footer = (
        <>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Update Status</button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Update Status to ${newStatus}`}
            footer={footer}
        >
            <div className="mb-3">
                <label className="form-label fw-bold">Reason (Optional)</label>
                <textarea
                    className="form-control"
                    rows="2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Why is this ${newStatus}?`}
                ></textarea>
            </div>

            {newStatus === 'Failed' && (
                <div className="mb-3">
                    <label className="form-label fw-bold">Failure Count</label>
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        value={failures}
                        onChange={(e) => setFailures(parseInt(e.target.value) || 0)}
                    />
                </div>
            )}

            <div className="mb-3">
                <label className="form-label fw-bold">
                    {newStatus === 'Passed' ? 'Select Passed Channels' :
                        newStatus === 'Failed' ? 'Select Failed Channels' :
                            `Select ${newStatus} Channels`}
                </label>
                <div className="d-flex flex-wrap gap-3">
                    {CHANNELS.map(channel => (
                        <div className="form-check" key={channel}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`check-${channel}`}
                                checked={selectedChannels[channel] || false}
                                onChange={() => handleChannelChange(channel)}
                            />
                            <label className="form-check-label" htmlFor={`check-${channel}`}>
                                <i className={`bi ${CHANNEL_ICONS[channel]} me-1`}></i>
                                {channel.charAt(0).toUpperCase() + channel.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="form-text small mt-1">
                    Selected channels will be marked as <strong>{newStatus}</strong>.
                    Unselected channels will remain unchanged.
                </div>
            </div>
        </Modal>
    );
};
