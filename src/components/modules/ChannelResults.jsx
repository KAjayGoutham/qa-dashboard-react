import React from 'react';
import { CHANNELS, CHANNEL_ICONS } from '../../utils/constants';

export const ChannelResults = ({ results }) => {
    if (!results) return '-';

    const channelsWithResults = CHANNELS.filter(channel => results[channel] && results[channel].trim() !== '');
    
    if (channelsWithResults.length === 0) return '-';

    const handleChannelSelect = (e) => {
        const selectedChannel = e.target.value;
        if (selectedChannel && results[selectedChannel]) {
            const result = results[selectedChannel];
            // Check if it's a URL
            if (result.match(/^https?:\/\//)) {
                window.open(result, '_blank', 'noopener,noreferrer');
            }
        }
        // Reset dropdown to default
        e.target.value = '';
    };

    return (
        <select 
            className="form-select form-select-sm" 
            onChange={handleChannelSelect}
            defaultValue=""
            style={{ width: '150px', cursor: 'pointer' }}
        >
            <option value="" disabled>View Results ({channelsWithResults.length})</option>
            {channelsWithResults.map(channel => (
                <option key={channel} value={channel}>
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </option>
            ))}
        </select>
    );
};
