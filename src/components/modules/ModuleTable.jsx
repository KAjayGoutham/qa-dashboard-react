import React from 'react';
import { ModuleRow } from './ModuleRow';

export const ModuleTable = ({ modules, onEdit, onDelete, onToast }) => {
    if (modules.length === 0) {
        return (
            <div className="text-center py-5" id="emptyState">
                <i className="bi bi-inbox fs-1 text-muted"></i>
                <p className="text-muted mt-3">No modules found. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="ps-4">Flow Name</th>
                        <th>Modules</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Failures</th>
                        <th>Last Updated</th>
                        <th className="text-end pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {modules.map(module => (
                        <ModuleRow
                            key={module.id}
                            module={module}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToast={onToast}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
