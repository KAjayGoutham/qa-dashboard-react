import React from 'react';

export const TextWithLinks = ({ text }) => {
    if (!text) return '-';
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
        <>
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a 
                            key={index} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </>
    );
};
