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
    currentChannels,
    currentResults
}) => {
    const [reason, setReason] = useState('');
    const [failures, setFailures] = useState(0);
    const [selectedChannels, setSelectedChannels] = useState({});
    const [channelResults, setChannelResults] = useState({});

    useEffect(() => {
        if (isOpen) {
            setReason(currentReason || '');
            setFailures(currentFailures || 0);

            // Initialize channels based on current state or default to all selected for 'Passed'
            const initialChannels = {};
            CHANNELS.forEach(channel => {
                if (newStatus === 'Passed') {
                    initialChannels[channel] = true;
                } else {
                    initialChannels[channel] = false;
                }
            });
            setSelectedChannels(initialChannels);

            // Initialize results
            const initialResults = {};
            CHANNELS.forEach(channel => {
                initialResults[channel] = currentResults?.[channel] || '';
            });
            setChannelResults(initialResults);
        }
    }, [isOpen, newStatus, currentReason, currentFailures, currentChannels, currentResults]);

    const handleChannelChange = (channel) => {
        setSelectedChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

    const handleSelectAll = (selectAll) => {
        const newChannels = {};
        CHANNELS.forEach(channel => {
            newChannels[channel] = selectAll;
        });
        setSelectedChannels(newChannels);
    };

    const handleResultChange = (channel, value) => {
        setChannelResults(prev => ({
            ...prev,
            [channel]: value
        }));
    };

    const allSelected = CHANNELS.every(channel => selectedChannels[channel]);
    const noneSelected = CHANNELS.every(channel => !selectedChannels[channel]);

    const handleSubmit = () => {
        onConfirm({
            reason,
            failures,
            selectedChannels,
            results: channelResults
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

                <div className="form-check mb-2 border-bottom pb-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="select-all-channels"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="select-all-channels">
                        Select All
                    </label>
                </div>

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

            <div className="mb-3">
                <label className="form-label fw-bold">
                    <i className="bi bi-link-45deg me-2"></i>
                    Channel Results (Optional)
                </label>
                <div className="form-text small mb-2">
                    Add result URLs or notes for each channel. URLs will be automatically converted to clickable links.
                </div>
                {CHANNELS.map(channel => (
                    <div className="mb-2" key={`result-${channel}`}>
                        <label className="form-label small text-capitalize">
                            <i className={`bi ${CHANNEL_ICONS[channel]} me-1`}></i>
                            {channel}
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={`Enter result URL or note for ${channel}...`}
                            value={channelResults[channel] || ''}
                            onChange={(e) => handleResultChange(channel, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
};
