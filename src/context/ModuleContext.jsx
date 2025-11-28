import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEY } from '../utils/constants';
import { SAMPLE_DATA } from '../utils/sampleData';
import { migrateModule, generateId } from '../utils/helpers';

const ModuleContext = createContext();

export const useModules = () => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error('useModules must be used within ModuleProvider');
    }
    return context;
};

export const ModuleProvider = ({ children }) => {
    const [modules, setModules] = useLocalStorage(STORAGE_KEY,
        SAMPLE_DATA.map(m => ({ ...m, environment: 'QA' }))
    );

    const [currentEnvironment, setCurrentEnvironment] = useState('QA');
    const [expandedModules, setExpandedModules] = useState(new Set());

    // Migrate modules on load
    useEffect(() => {
        const migratedModules = modules.map(migrateModule);
        setModules(migratedModules);
    }, []); // Only run once on mount

    // Add module
    const addModule = useCallback((moduleData) => {
        const newModule = {
            ...moduleData,
            id: generateId(),
            environment: currentEnvironment,
            lastUpdated: new Date().toISOString(),
            channels: { voice: true, sms: true, chat: true, email: true },
            commentHistory: []
        };
        setModules(prev => [...prev, newModule]);
    }, [currentEnvironment, setModules]);

    // Update module
    const updateModule = useCallback((id, updates) => {
        setModules(prev => prev.map(m =>
            m.id === id
                ? { ...m, ...updates, lastUpdated: new Date().toISOString() }
                : m
        ));
    }, [setModules]);

    // Delete module
    const deleteModule = useCallback((id) => {
        setModules(prev => prev.filter(m => m.id !== id));
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, [setModules]);

    // Toggle expansion
    const toggleExpansion = useCallback((id) => {
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    // Import modules
    const importModules = useCallback((importedModules) => {
        if (Array.isArray(importedModules)) {
            const migratedModules = importedModules.map(migrateModule);
            setModules(migratedModules);
        }
    }, [setModules]);

    const value = {
        modules,
        currentEnvironment,
        expandedModules,
        setCurrentEnvironment,
        addModule,
        updateModule,
        deleteModule,
        toggleExpansion,
        importModules
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
};
