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
