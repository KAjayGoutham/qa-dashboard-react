// Sample data for initial load
export const SAMPLE_DATA = [
    {
        id: '1',
        name: 'Authentication Service',
        status: 'Passed',
        reason: '',
        failures: 0,
        lastUpdated: new Date().toISOString(),
        channels: { voice: true, sms: true, chat: true, email: true },
        commentHistory: []
    },
    {
        id: '2',
        name: 'Payment Gateway',
        status: 'Failed',
        reason: 'Timeout on API response',
        failures: 5,
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        channels: { voice: true, sms: false, chat: true, email: true },
        commentHistory: [
            {
                type: 'failure',
                comment: 'API timeout after 30 seconds',
                timestamp: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    },
    {
        id: '3',
        name: 'User Profile',
        status: 'In Progress',
        reason: 'Pending UI tests',
        failures: 0,
        lastUpdated: new Date(Date.now() - 3600000).toISOString(),
        channels: { voice: true, sms: true, chat: true, email: true },
        commentHistory: []
    },
    {
        id: '4',
        name: 'Search Engine',
        status: 'Passed',
        reason: '',
        failures: 1,
        lastUpdated: new Date().toISOString(),
        channels: { voice: true, sms: true, chat: true, email: true },
        commentHistory: [
            {
                type: 'fix',
                comment: 'Fixed indexing issue',
                timestamp: new Date().toISOString()
            }
        ]
    },
    {
        id: '5',
        name: 'Notifications',
        status: 'Blocked',
        reason: 'Waiting for backend fix',
        failures: 0,
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
        channels: { voice: false, sms: false, chat: false, email: false },
        commentHistory: []
    },
    {
        id: '6',
        name: 'Reporting Module',
        status: 'Failed',
        reason: 'Calculation error in totals',
        failures: 3,
        lastUpdated: new Date().toISOString(),
        channels: { voice: true, sms: true, chat: false, email: true },
        commentHistory: []
    }
];
