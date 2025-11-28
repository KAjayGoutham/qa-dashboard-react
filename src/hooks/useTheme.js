import { useLocalStorage } from './useLocalStorage';
import { DARK_MODE_KEY } from '../utils/constants';
import { useEffect } from 'react';

// Custom hook for theme management
export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useLocalStorage(DARK_MODE_KEY, false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return { isDarkMode, toggleTheme };
};
