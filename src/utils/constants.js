// Storage key for localStorage
export const STORAGE_KEY = 'qa_dashboard_modules';
export const RELEASE_NAME_KEY = 'qa_dashboard_release_name';
export const DARK_MODE_KEY = 'darkMode';

// Environment options
export const ENVIRONMENTS = ['QA', 'Staging', 'Production'];

// Status options
export const STATUSES = ['Passed', 'Failed', 'In Progress', 'Blocked'];

// Channel types
export const CHANNELS = ['voice', 'sms', 'chat', 'email'];

// Comment types
export const COMMENT_TYPES = {
    FAILURE: 'failure',
    FIX: 'fix'
};

// Status classes for styling
export const STATUS_CLASSES = {
    'Passed': 'status-passed',
    'Failed': 'status-failed',
    'In Progress': 'status-inprogress',
    'Blocked': 'status-blocked'
};

// Channel icons
export const CHANNEL_ICONS = {
    voice: 'bi-mic',
    sms: 'bi-chat-left-text',
    chat: 'bi-chat-dots',
    email: 'bi-envelope'
};

// Toast types
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};
