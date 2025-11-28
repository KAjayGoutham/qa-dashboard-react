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

        if (newStatus === 'Failed' || newStatus === 'Blocked') {
            const input = prompt(`Enter reason for ${newStatus} (optional):`, reason);
            if (input !== null) {
                reason = input;
            }

            if (newStatus === 'Failed') {
                const failInput = prompt("Update failure count?", failures + 1);
                if (failInput !== null) {
                    failures = parseInt(failInput) || failures;
                }
            }
        }

        updateModule(module.id, { status: newStatus, reason, failures });
        onToast(`Status updated to ${newStatus}`, 'success');
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
