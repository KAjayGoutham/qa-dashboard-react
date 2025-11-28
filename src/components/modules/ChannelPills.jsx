import React from 'react';
import { CHANNELS, CHANNEL_ICONS } from '../../utils/constants';
import { useModules } from '../../context/ModuleContext';

export const ChannelPills = ({ module }) => {
    const { updateModule } = useModules();

    const toggleChannel = (channel) => {
        const newChannels = {
            ...module.channels,
            [channel]: !module.channels[channel]
        };
        updateModule(module.id, { channels: newChannels });
    };

    return (
        <div className="d-flex gap-1">
            {CHANNELS.map(channel => {
                const isActive = module.channels?.[channel];
                const colorClass = isActive ? 'status-passed' : 'status-failed';
                const icon = CHANNEL_ICONS[channel];

                return (
                    <span
                        key={channel}
                        className={`badge badge-status ${colorClass} cursor-pointer`}
                        onClick={() => toggleChannel(channel)}
                        title={`Toggle ${channel} status`}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <i className={`bi ${icon}`}></i> {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </span>
                );
            })}
        </div>
    );
};
