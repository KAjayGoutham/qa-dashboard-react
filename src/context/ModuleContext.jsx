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

    const [currentEnvironment, setCurrentEnvironment] = useLocalStorage('qa_dashboard_current_env', 'QA');
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

    // Delete module (strictly environment-scoped to prevent cross-environment deletion)
    const deleteModule = useCallback((id) => {
        setModules(prev => {
            // Find the module to verify it exists in current environment
            const moduleToDelete = prev.find(m => m.id === id);

            if (!moduleToDelete) {
                console.warn('Module not found:', id);
                return prev;
            }

            if (moduleToDelete.environment !== currentEnvironment) {
                console.warn('Attempting to delete module from different environment:', {
                    moduleEnv: moduleToDelete.environment,
                    currentEnv: currentEnvironment
                });
                return prev;
            }

            // Only delete if module belongs to current environment
            return prev.filter(m => m.id !== id);
        });

        setExpandedModules(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, [currentEnvironment, setModules]);

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

    // Sync modules to another environment (prevents duplicates, returns count, supports selective sync)
    const syncModules = useCallback((targetEnv, selectedModuleIds = null) => {
        let count = 0;

        setModules(prev => {
            // 1. Get modules from current environment (source)
            let sourceModules = prev.filter(m => m.environment === currentEnvironment);

            // Filter by selected IDs if provided
            if (selectedModuleIds && Array.isArray(selectedModuleIds)) {
                sourceModules = sourceModules.filter(m => selectedModuleIds.includes(m.id));
            }

            // 2. Get existing modules in target environment
            const targetEnvModules = prev.filter(m => m.environment === targetEnv);
            const targetModuleNames = new Set(targetEnvModules.map(m => m.name));

            // 3. Identify which flows to add (only those that don't exist in target)
            const flowsToAdd = sourceModules.filter(m => !targetModuleNames.has(m.name));
            count = flowsToAdd.length;

            // 4. Create new modules ONLY for flows that don't exist in target
            const newModules = flowsToAdd.map(m => ({
                id: generateId(), // Unique ID for this environment
                name: m.name, // Flow name (universal identifier)
                environment: targetEnv,
                status: 'In Progress',
                reason: '',
                failures: 0,
                channels: { voice: true, sms: true, chat: true, email: true },
                commentHistory: [],
                lastUpdated: new Date().toISOString()
            }));

            // 5. Return all existing modules + new ones (no duplicates)
            return [...prev, ...newModules];
        });

        return count;
    }, [currentEnvironment, setModules]);

    const value = {
        modules,
        currentEnvironment,
        expandedModules,
        setCurrentEnvironment,
        addModule,
        updateModule,
        deleteModule,
        toggleExpansion,
        importModules,
        syncModules
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
};
