import React from 'react';

export const Badge = ({ children, variant = 'secondary', size = 'md', className = '' }) => {
    const sizeClass = size === 'sm' ? 'badge-sm' : '';
    return (
        <span className={`badge bg-${variant} ${sizeClass} ${className}`}>
            {children}
        </span>
    );
};
