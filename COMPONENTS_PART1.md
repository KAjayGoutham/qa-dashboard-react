# React Dashboard Components Reference

This file contains all the React components for the QA Dashboard. Each component should be created in its respective folder as indicated.

## Common Components

### src/components/common/Toast.jsx
```jsx
import React from 'react';

export const Toast = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast show toast-${toast.type}`}
          role="alert"
        >
          <div className="toast-body d-flex justify-content-between align-items-center">
            <span>{toast.message}</span>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              onClick={() => onClose(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### src/components/common/Modal.jsx
```jsx
import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className={`modal-dialog modal-${size}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
```

### src/components/common/Badge.jsx
```jsx
import React from 'react';

export const Badge = ({ children, variant = 'secondary', size = 'md', className = '' }) => {
  const sizeClass = size === 'sm' ? 'badge-sm' : '';
  return (
    <span className={`badge bg-${variant} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};
```

## Layout Components

### src/components/layout/Header.jsx
```jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../hooks/useTheme';
import { RELEASE_NAME_KEY } from '../../utils/constants';

export const Header = ({ onAddModule, onExport, onImport, onSimulate }) => {
  const [releaseName, setReleaseName] = useLocalStorage(RELEASE_NAME_KEY, 'Release 1.0');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(releaseName);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSaveRelease = () => {
    setReleaseName(editValue);
    setIsEditing(false);
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <i className="bi bi-speedometer2 fs-4 me-2"></i>
          <span className="navbar-brand mb-0 h1">QA Dashboard</span>
          <span className="text-white-50 ms-3">|</span>
          {isEditing ? (
            <div className="d-flex align-items-center ms-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={{ width: '200px' }}
              />
              <button className="btn btn-sm btn-success ms-2" onClick={handleSaveRelease}>
                <i className="bi bi-check-lg"></i>
              </button>
              <button className="btn btn-sm btn-secondary ms-1" onClick={() => setIsEditing(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center ms-3">
              <span className="text-white" id="releaseNameDisplay">{releaseName}</span>
              <button
                className="btn btn-sm btn-link text-white-50"
                onClick={() => {
                  setEditValue(releaseName);
                  setIsEditing(true);
                }}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm" onClick={onAddModule}>
            <i className="bi bi-plus-lg me-1"></i>Add Module
          </button>
          <button className="btn btn-outline-light btn-sm" onClick={onExport}>
            <i className="bi bi-download me-1"></i>Export
          </button>
          <label className="btn btn-outline-light btn-sm mb-0">
            <i className="bi bi-upload me-1"></i>Import
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn btn-outline-warning btn-sm" onClick={onSimulate}>
            <i className="bi bi-play-fill me-1"></i>Simulate
          </button>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
              id="darkModeToggle"
            />
            <label className="form-check-label text-white" htmlFor="darkModeToggle">
              <i className="bi bi-moon-stars"></i>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### src/components/layout/EnvironmentTabs.jsx
```jsx
import React from 'react';
import { useModules } from '../../context/ModuleContext';
import { ENVIRONMENTS } from '../../utils/constants';

export const EnvironmentTabs = () => {
  const { currentEnvironment, setCurrentEnvironment } = useModules();

  return (
    <ul className="nav nav-pills mb-4" id="envTabs">
      {ENVIRONMENTS.map(env => (
        <li className="nav-item" key={env}>
          <button
            className={`nav-link ${currentEnvironment === env ? 'active' : ''}`}
            onClick={() => setCurrentEnvironment(env)}
          >
            {env}
          </button>
        </li>
      ))}
    </ul>
  );
};
```

## Dashboard Components

### src/components/dashboard/SummaryCards.jsx
```jsx
import React from 'react';
import { calculatePassRate } from '../../utils/helpers';

export const SummaryCards = ({ modules }) => {
  const total = modules.length;
  const passed = modules.filter(m => m.status === 'Passed').length;
  const failed = modules.filter(m => m.status === 'Failed').length;
  const passRate = calculatePassRate(modules);

  return (
    <div className="row g-3 mb-4" id="summarySection">
      <div className="col-md-3 col-sm-6">
        <div className="card summary-card border-0 h-100 p-3 kpi-total">
          <div className="d-flex align-items-center">
            <div className="kpi-icon me-3">
              <i className="bi bi-layers"></i>
            </div>
            <div>
              <p className="text-muted mb-0 small text-uppercase fw-bold">Total Modules</p>
              <h3 className="fw-bold mb-0">{total}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card summary-card border-0 h-100 p-3 kpi-passed">
          <div className="d-flex align-items-center">
            <div className="kpi-icon me-3">
              <i className="bi bi-check-circle"></i>
            </div>
            <div>
              <p className="text-muted mb-0 small text-uppercase fw-bold">Passed</p>
              <h3 className="fw-bold mb-0">{passed}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card summary-card border-0 h-100 p-3 kpi-failed">
          <div className="d-flex align-items-center">
            <div className="kpi-icon me-3">
              <i className="bi bi-x-circle"></i>
            </div>
            <div>
              <p className="text-muted mb-0 small text-uppercase fw-bold">Failed</p>
              <h3 className="fw-bold mb-0">{failed}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="card summary-card border-0 h-100 p-3 kpi-rate">
          <div className="d-flex align-items-center">
            <div className="kpi-icon me-3">
              <i className="bi bi-pie-chart"></i>
            </div>
            <div>
              <p className="text-muted mb-0 small text-uppercase fw-bold">Pass Rate</p>
              <h3 className="fw-bold mb-0">{passRate}%</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### src/components/dashboard/StatusChart.jsx
```jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StatusChart = ({ modules }) => {
  const passed = modules.filter(m => m.status === 'Passed').length;
  const failed = modules.filter(m => m.status === 'Failed').length;
  const inProgress = modules.filter(m => m.status === 'In Progress').length;
  const blocked = modules.filter(m => m.status === 'Blocked').length;

  const data = {
    labels: ['Passed', 'Failed', 'In Progress', 'Blocked'],
    datasets: [{
      data: [passed, failed, inProgress, blocked],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#6b7280'],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          usePointStyle: true
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
```

### src/components/dashboard/Controls.jsx
```jsx
import React from 'react';

export const Controls = ({ searchText, onSearchChange, statusFilter, onStatusChange, sortBy, onSortChange }) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-md-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search modules..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="col-md-4">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>
      <div className="col-md-4">
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="status">Status</option>
          <option value="failures_desc">Failures (High to Low)</option>
        </select>
      </div>
    </div>
  );
};
```

## Module Components

### src/components/modules/ChannelPills.jsx
```jsx
import React from 'react';
import { CHANNELS, CHANNEL_ICONS } from '../../utils/constants';
import { useModules } from '../../context/ModuleContext';

export const ChannelPills = ({ module }) => {
  const { updateModule } = useModules();

  const toggleChannel = (channel) => {
    const newChannels = {
      ...module.channels,
      [channel]: !module.channels[channel]
    };
    updateModule(module.id, { channels: newChannels });
  };

  return (
    <div className="d-flex gap-1">
      {CHANNELS.map(channel => {
        const isActive = module.channels?.[channel];
        const colorClass = isActive ? 'status-passed' : 'status-failed';
        const icon = CHANNEL_ICONS[channel];
        
        return (
          <span
            key={channel}
            className={`badge badge-status ${colorClass} cursor-pointer`}
            onClick={() => toggleChannel(channel)}
            title={`Toggle ${channel} status`}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <i className={`bi ${icon}`}></i> {channel.charAt(0).toUpperCase() + channel.slice(1)}
          </span>
        );
      })}
    </div>
  );
};
```

### src/components/modules/StatusDropdown.jsx
```jsx
import React from 'react';
import { useModules } from '../../context/ModuleContext';
import { getStatusClass } from '../../utils/helpers';
import { STATUSES } from '../../utils/constants';

export const StatusDropdown = ({ module, onToast }) => {
  const { updateModule } = useModules();

  const handleStatusChange = (newStatus) => {
    if (module.status === newStatus) return;

    let reason = module.reason;
    let failures = module.failures;

    if (newStatus === 'Failed' || newStatus === 'Blocked') {
      const input = prompt(`Enter reason for ${newStatus} (optional):`, reason);
      if (input !== null) {
        reason = input;
      }

      if (newStatus === 'Failed') {
        const failInput = prompt("Update failure count?", failures + 1);
        if (failInput !== null) {
          failures = parseInt(failInput) || failures;
        }
      }
    }

    updateModule(module.id, { status: newStatus, reason, failures });
    onToast(`Status updated to ${newStatus}`, 'success');
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm p-0 border-0"
        type="button"
        data-bs-toggle="dropdown"
      >
        <span className={`badge badge-status ${getStatusClass(module.status)}`}>
          {module.status} <i className="bi bi-chevron-down ms-1" style={{ fontSize: '0.8em' }}></i>
        </span>
      </button>
      <ul className="dropdown-menu">
        {STATUSES.map(status => (
          <li key={status}>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleStatusChange(status);
              }}
            >
              Set to {status}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

This is part 1 of the components. The file is getting long, so I'll create a second reference file for the remaining components.
