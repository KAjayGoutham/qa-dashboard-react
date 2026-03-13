import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

// Custom hook for server-based storage (replaces useLocalStorage)
export const useServerStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data from server on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await api.getData();
                
                // Extract the specific key from server data
                // Use ?? instead of || to properly handle empty arrays
                if (key === 'qa_dashboard_modules') {
                    setStoredValue(data.modules !== undefined ? data.modules : initialValue);
                } else if (key === 'qa_dashboard_issues') {
                    setStoredValue(data.issues !== undefined ? data.issues : initialValue);
                } else if (key === 'qa_dashboard_current_env') {
                    setStoredValue(data.currentEnvironment ?? initialValue);
                } else if (key === 'qa_dashboard_release_names') {
                    setStoredValue(data.releaseNames ?? initialValue);
                } else {
                    setStoredValue(initialValue);
                }
                
                setError(null);
            } catch (err) {
                console.error('Failed to load data from server:', err);
                setError(err.message);
                // Fallback to localStorage if server is unavailable
                try {
                    const item = window.localStorage.getItem(key);
                    setStoredValue(item ? JSON.parse(item) : initialValue);
                } catch (e) {
                    setStoredValue(initialValue);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]); // Only depend on key, not initialValue

    // Save data to server
    const setValue = useCallback(async (value) => {
        try {
            // Update local state immediately
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            // Save to server
            const data = await api.getData();
            
            if (key === 'qa_dashboard_modules') {
                data.modules = valueToStore;
            } else if (key === 'qa_dashboard_issues') {
                data.issues = valueToStore;
            } else if (key === 'qa_dashboard_current_env') {
                data.currentEnvironment = valueToStore;
            } else if (key === 'qa_dashboard_release_names') {
                data.releaseNames = valueToStore;
            }

            await api.saveData(data);

            // Also save to localStorage as backup
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
            console.error('Failed to save data to server:', err);
            setError(err.message);
            // Still save to localStorage as fallback
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setValue, { isLoading, error }];
};
