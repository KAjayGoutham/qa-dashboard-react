import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../hooks/useTheme';
import { RELEASE_NAME_KEY } from '../../utils/constants';

export const Header = ({ onExport, onImport, onSimulate, currentEnvironment }) => {
    // Store release names as an object keyed by environment
    const [releaseNames, setReleaseNames] = useLocalStorage(RELEASE_NAME_KEY, {
        'QA': 'Release 1.0',
        'SAT': 'Release 1.0',
        'Prod': 'Release 1.0'
    });

    const currentReleaseName = releaseNames[currentEnvironment] || 'Release 1.0';
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(currentReleaseName);
    const { isDarkMode, toggleTheme } = useTheme();

    // Update edit value when environment changes
    React.useEffect(() => {
        setEditValue(releaseNames[currentEnvironment] || 'Release 1.0');
    }, [currentEnvironment, releaseNames]);

    const handleSaveRelease = () => {
        setReleaseNames(prev => ({
            ...prev,
            [currentEnvironment]: editValue
        }));
        setIsEditing(false);
    };

    return (
        <div className="navbar navbar-dark bg-dark sticky-top">
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
                            <span className="text-white" id="releaseNameDisplay">{currentReleaseName}</span>
                            <button
                                className="btn btn-sm btn-link text-white-50"
                                onClick={() => {
                                    setEditValue(currentReleaseName);
                                    setIsEditing(true);
                                }}
                            >
                                <i className="bi bi-pencil"></i>
                            </button>
                        </div>
                    )}
                </div>
                <div className="d-flex gap-2">
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
