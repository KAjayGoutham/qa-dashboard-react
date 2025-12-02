import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ENVIRONMENTS } from '../../utils/constants';

export const SyncModal = ({ isOpen, onClose, onConfirm, currentEnvironment, modules = [] }) => {
    const [selectedEnvs, setSelectedEnvs] = useState({});
    const [selectedModules, setSelectedModules] = useState({});

    // Reset selection when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedEnvs({});
            setSelectedModules({});
        }
    }, [isOpen]);

    const handleEnvChange = (env) => {
        setSelectedEnvs(prev => ({
            ...prev,
            [env]: !prev[env]
        }));
    };

    const handleModuleChange = (moduleId) => {
        setSelectedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const handleSelectAllModules = (e) => {
        const isChecked = e.target.checked;
        const newSelection = {};
        if (isChecked) {
            modules.forEach(m => {
                newSelection[m.id] = true;
            });
        }
        setSelectedModules(newSelection);
    };

    const handleSubmit = () => {
        const targets = Object.keys(selectedEnvs).filter(env => selectedEnvs[env]);
        const moduleIds = Object.keys(selectedModules).filter(id => selectedModules[id]);
        onConfirm(targets, moduleIds);
    };

    const isAnyEnvSelected = Object.keys(selectedEnvs).filter(e => selectedEnvs[e]).length > 0;
    const isAnyModuleSelected = Object.keys(selectedModules).filter(id => selectedModules[id]).length > 0;
    const areAllModulesSelected = modules.length > 0 && modules.every(m => selectedModules[m.id]);

    const footer = (
        <>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
                className="btn btn-info text-white"
                onClick={handleSubmit}
                disabled={!isAnyEnvSelected || !isAnyModuleSelected}
            >
                Sync Selected
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Sync Modules to Environments"
            footer={footer}
        >
            <div className="mb-3">
                <label className="form-label fw-bold">1. Select Target Environments</label>
                <div className="d-flex gap-3">
                    {ENVIRONMENTS.filter(env => env !== currentEnvironment).map(env => (
                        <div className="form-check" key={env}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`sync-env-${env}`}
                                checked={selectedEnvs[env] || false}
                                onChange={() => handleEnvChange(env)}
                            />
                            <label className="form-check-label" htmlFor={`sync-env-${env}`}>
                                {env}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">2. Select Modules to Sync</label>
                <div className="border rounded p-2 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {modules.length === 0 ? (
                        <p className="text-muted text-center my-3 small">No modules available to sync.</p>
                    ) : (
                        <>
                            <div className="form-check mb-2 border-bottom pb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="selectAllSync"
                                    checked={areAllModulesSelected}
                                    onChange={handleSelectAllModules}
                                />
                                <label className="form-check-label fw-bold" htmlFor="selectAllSync">
                                    Select All
                                </label>
                            </div>
                            {modules.map(module => (
                                <div className="form-check" key={module.id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`sync-module-${module.id}`}
                                        checked={selectedModules[module.id] || false}
                                        onChange={() => handleModuleChange(module.id)}
                                    />
                                    <label className="form-check-label w-100" htmlFor={`sync-module-${module.id}`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{module.name}</span>
                                            <span className={`badge ${module.status === 'Passed' ? 'bg-success' : module.status === 'Failed' ? 'bg-danger' : 'bg-secondary'} ms-2`} style={{ fontSize: '0.7em' }}>
                                                {module.status}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="alert alert-info mt-3 mb-0 small">
                <i className="bi bi-info-circle me-2"></i>
                Selected modules will be copied to the target environments. Existing modules with the same name will be skipped.
            </div>
        </Modal>
    );
};
