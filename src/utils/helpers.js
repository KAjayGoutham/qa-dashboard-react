import { STATUS_CLASSES } from './constants';

// Format date to readable string
export const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Get status class for styling
export const getStatusClass = (status) => {
    return STATUS_CLASSES[status] || 'bg-secondary text-white';
};

// Generate unique ID
export const generateId = () => {
    return Date.now().toString();
};

// Calculate pass rate
export const calculatePassRate = (modules) => {
    const total = modules.length;
    if (total === 0) return 0;
    const passed = modules.filter(m => m.status === 'Passed').length;
    return Math.round((passed / total) * 100);
};

// Filter modules by environment
export const filterByEnvironment = (modules, environment) => {
    return modules.filter(m => m.environment === environment);
};

// Filter modules by status
export const filterByStatus = (modules, status) => {
    if (status === 'All') return modules;
    return modules.filter(m => m.status === status);
};

// Search modules by name
export const searchModules = (modules, searchText) => {
    if (!searchText) return modules;
    return modules.filter(m =>
        m.name.toLowerCase().includes(searchText.toLowerCase())
    );
};

// Sort modules
export const sortModules = (modules, sortBy) => {
    const sorted = [...modules];

    switch (sortBy) {
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'status':
            return sorted.sort((a, b) => a.status.localeCompare(b.status));
        case 'failures_desc':
            return sorted.sort((a, b) => b.failures - a.failures);
        default:
            return sorted;
    }
};

// Export data as JSON
export const exportToJSON = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Migrate module data (ensure all required fields exist)
export const migrateModule = (module) => {
    return {
        ...module,
        environment: module.environment || 'QA',
        channels: module.channels || { voice: true, sms: true, chat: true, email: true },
        commentHistory: module.commentHistory || []
    };
};
