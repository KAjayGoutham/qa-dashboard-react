const API_BASE_URL = 'http://localhost:3001/api';

// API service for communicating with backend
export const api = {
    // Get all data from server
    async getData() {
        try {
            const response = await fetch(`${API_BASE_URL}/data`);
            if (!response.ok) throw new Error('Failed to fetch data');
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    // Save all data to server
    async saveData(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save data');
            return await response.json();
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    // Get modules only
    async getModules() {
        try {
            const response = await fetch(`${API_BASE_URL}/modules`);
            if (!response.ok) throw new Error('Failed to fetch modules');
            return await response.json();
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }
    },

    // Save modules only
    async saveModules(modules) {
        try {
            const response = await fetch(`${API_BASE_URL}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modules),
            });
            if (!response.ok) throw new Error('Failed to save modules');
            return await response.json();
        } catch (error) {
            console.error('Error saving modules:', error);
            throw error;
        }
    },

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (!response.ok) throw new Error('Server not responding');
            return await response.json();
        } catch (error) {
            console.error('Server health check failed:', error);
            return { status: 'error', error: error.message };
        }
    }
};
