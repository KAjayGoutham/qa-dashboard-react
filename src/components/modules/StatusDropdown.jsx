import React from 'react';
import { useModules } from '../../context/ModuleContext';
import { getStatusClass } from '../../utils/helpers';
import { STATUSES } from '../../utils/constants';

export const StatusDropdown = ({ module, onToast }) => {
    const { updateModule } = useModules();

    const handleStatusChange = (newStatus) => {
        if (module.status === newStatus) return;

        let reason = module.reason;
        let failures = module.failures;
        let updatedChannels = { ...module.channels };
        let channelsUpdated = false;

        // 1. Reason Prompt
        if (['Failed', 'Blocked', 'In Progress'].includes(newStatus)) {
            const input = prompt(`Enter reason for ${newStatus} (optional):`, reason);
            if (input !== null) {
                reason = input;
            }
        } else if (newStatus === 'Passed') {
            reason = ''; // Clear reason when passed
        }

        // 2. Failure Count (Only for Failed)
        if (newStatus === 'Failed') {
            const failInput = prompt("Update failure count?", failures + 1);
            if (failInput !== null) {
                failures = parseInt(failInput) || failures;
            }
        }

        // 3. Channel Prompt (For all statuses)
        let promptMsg = "";
        let targetState = newStatus; // Use the status string directly

        switch (newStatus) {
            case 'Passed':
                promptMsg = "Enter passed channels (voice, sms, chat, email) or 'all':";
                break;
            case 'Failed':
                promptMsg = "Enter failed channels (voice, sms, chat, email):";
                break;
            case 'Blocked':
                promptMsg = "Enter blocked channels (voice, sms, chat, email):";
                break;
            case 'In Progress':
                promptMsg = "Enter in-progress channels (voice, sms, chat, email):";
                break;
        }

        const channelInput = prompt(promptMsg);
        if (channelInput) {
            if (newStatus === 'Passed' && channelInput.toLowerCase() === 'all') {
                Object.keys(updatedChannels).forEach(key => {
                    updatedChannels[key] = 'Passed';
                });
                channelsUpdated = true;
            } else {
                const selectedChannels = channelInput.toLowerCase().split(',').map(c => c.trim());
                selectedChannels.forEach(channel => {
                    if (updatedChannels.hasOwnProperty(channel)) {
                        updatedChannels[channel] = targetState;
                        channelsUpdated = true;
                    }
                });
            }
        }

        const updates = { status: newStatus, reason, failures };
        if (channelsUpdated) {
            updates.channels = updatedChannels;
        }

        updateModule(module.id, updates);
        onToast(`Status updated to ${newStatus}${channelsUpdated ? ' and channels updated' : ''}`, 'success');
    };

    return (
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
                                handleStatusChange(status);
                            }}
                        >
                            Set to {status}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
