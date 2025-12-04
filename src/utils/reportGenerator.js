import { calculatePassRate, formatDate } from './helpers';
import { CHANNELS, STATUS_CLASSES } from './constants';

export const generateReportHTML = (modules, environment, releaseName) => {
    const envModules = modules.filter(m => m.environment === environment);
    const totalModules = envModules.length;
    const passedModules = envModules.filter(m => m.status === 'Passed').length;
    const failedModules = envModules.filter(m => m.status === 'Failed').length;
    const passRate = calculatePassRate(envModules);
    const date = new Date().toLocaleString();

    // Generate rows for the table
    const rows = envModules.map(module => {
        const statusClass = module.status === 'Passed' ? 'bg-success' :
            module.status === 'Failed' ? 'bg-danger' :
                module.status === 'Blocked' ? 'bg-dark' : 'bg-warning text-dark';

        const channels = CHANNELS.map(channel => {
            const value = module.channels?.[channel];
            let statusKey = 'Failed'; // Default to Failed if undefined/false

            if (value === true || value === 'Passed') statusKey = 'Passed';
            else if (value === false) statusKey = 'Failed';
            else if (typeof value === 'string') statusKey = value;

            const colorClass = STATUS_CLASSES[statusKey] || 'status-failed';
            // Capitalize first letter
            const label = channel.charAt(0).toUpperCase() + channel.slice(1);

            return `<span class="badge ${colorClass} me-1">${label}</span>`;
        }).join('');

        return `
            <tr>
                <td>${module.name}</td>
                <td><span class="badge ${statusClass}">${module.status}</span></td>
                <td>${channels}</td>
                <td>${module.failures}</td>
                <td>${formatDate(module.lastUpdated)}</td>
                <td>${module.reason || '-'}</td>
            </tr>
        `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QA Dashboard Report - ${environment}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; padding: 20px; }
        .card { border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .header { background-color: #212529; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .stat-card { text-align: center; padding: 20px; }
        .stat-value { font-size: 2rem; font-weight: bold; }
        .status-passed { background-color: #198754; }
        .status-failed { background-color: #dc3545; }
        .status-inprogress { background-color: #ffc107; color: #000; }
        .status-blocked { background-color: #212529; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header d-flex justify-content-between align-items-center">
            <div>
                <h1 class="h3 mb-0">QA Dashboard Report</h1>
                <p class="mb-0 text-white-50">${releaseName} | ${environment} Environment</p>
            </div>
            <div class="text-end">
                <small class="d-block">Generated on</small>
                <strong>${date}</strong>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="text-muted mb-2">TOTAL FLOWS</div>
                    <div class="stat-value text-primary">${totalModules}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="text-muted mb-2">PASSED</div>
                    <div class="stat-value text-success">${passedModules}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="text-muted mb-2">FAILED</div>
                    <div class="stat-value text-danger">${failedModules}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="text-muted mb-2">PASS RATE</div>
                    <div class="stat-value text-info">${passRate}%</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h5 class="card-title mb-4">Module Details</h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Flow Name</th>
                                <th>Status</th>
                                <th>Channels</th>
                                <th>Failures</th>
                                <th>Last Updated</th>
                                <th>Reason/Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <footer class="text-center text-muted mt-5 small">
            <p>Generated by QA Dashboard</p>
        </footer>
    </div>
</body>
</html>`;
};
