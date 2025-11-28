import React from 'react';

export const Toast = ({ toasts, onClose }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast show toast-${toast.type}`}
                    role="alert"
                >
                    <div className="toast-body d-flex justify-content-between align-items-center">
                        <span>{toast.message}</span>
                        <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => onClose(toast.id)}
                        ></button>
                    </div>
                </div>
            ))}
        </div>
    );
};
