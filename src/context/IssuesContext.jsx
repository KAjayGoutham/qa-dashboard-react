import React, { createContext, useContext, useState, useCallback } from 'react';
import { useServerStorage } from '../hooks/useServerStorage';
import { generateId } from '../utils/helpers';

const IssuesContext = createContext();

export const useIssues = () => {
    const context = useContext(IssuesContext);
    if (!context) {
        throw new Error('useIssues must be used within IssuesProvider');
    }
    return context;
};

export const IssuesProvider = ({ children }) => {
    const [issuesData, setIssues, { isLoading, error }] = useServerStorage('qa_dashboard_issues', []);
    const [activeChannel, setActiveChannel] = useState('sms');

    // Ensure issues is always an array
    const issues = Array.isArray(issuesData) ? issuesData : [];

    const addIssue = useCallback((issueData) => {
        const newIssue = {
            ...issueData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setIssues(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [...prevArray, newIssue];
        });
        return newIssue;
    }, [setIssues]);

    const updateIssue = useCallback((id, updates) => {
        setIssues(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return prevArray.map(issue =>
                issue.id === id
                    ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
                    : issue
            );
        });
    }, [setIssues]);

    const deleteIssue = useCallback((id) => {
        setIssues(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return prevArray.filter(issue => issue.id !== id);
        });
    }, [setIssues]);

    const getIssuesByChannel = useCallback((channel) => {
        if (!Array.isArray(issues)) return [];
        return issues.filter(issue => issue.channel === channel);
    }, [issues]);

    const value = {
        issues,
        activeChannel,
        setActiveChannel,
        addIssue,
        updateIssue,
        deleteIssue,
        getIssuesByChannel,
        isLoading,
        error
    };

    return (
        <IssuesContext.Provider value={value}>
            {children}
        </IssuesContext.Provider>
    );
};
