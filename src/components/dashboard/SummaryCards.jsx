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
