import React from 'react';
import { CHANNELS, CHANNEL_ICONS, STATUS_CLASSES } from '../../utils/constants';

export const ChannelPills = ({ module }) => {
    return (
        <div className="d-flex gap-1">
            {CHANNELS.map(channel => {
                const value = module.channels?.[channel];
                let statusKey = 'Failed'; // Default

                if (value === true || value === 'Passed') statusKey = 'Passed';
                else if (value === false) statusKey = 'Failed';
                else if (typeof value === 'string') statusKey = value;

                const colorClass = STATUS_CLASSES[statusKey] || 'status-failed';
                const icon = CHANNEL_ICONS[channel];

                return (
                    <span
                        key={channel}
                        className={`badge badge-status ${colorClass}`}
                        title={`${channel} status: ${statusKey}`}
                        style={{ userSelect: 'none' }}
                    >
                        <i className={`bi ${icon}`}></i> {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </span>
                );
            })}
        </div>
    );
};
