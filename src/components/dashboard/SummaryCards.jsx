import React from 'react';
import { calculatePassRate } from '../../utils/helpers';

export const SummaryCards = ({ modules }) => {
    const totalFlows = modules.length;
    const channelsPerFlow = 4; // voice, sms, chat, email
    const totalModules = totalFlows * channelsPerFlow;
    
    // Count failed channels (modules)
    let failedModules = 0;
    modules.forEach(module => {
        if (module.channels) {
            Object.values(module.channels).forEach(channelStatus => {
                if (channelStatus === 'Failed' || channelStatus === false || channelStatus === 'Blocked') {
                    failedModules++;
                }
            });
        }
    });
    
    const passedModules = totalModules - failedModules;
    const passRate = calculatePassRate(modules);

    // Flow-based metrics
    const passedFlows = modules.filter(m => m.status === 'Passed').length;
    const failedFlows = modules.filter(m => m.status === 'Failed').length;
    const inProgressFlows = modules.filter(m => m.status === 'In Progress').length;
    const blockedFlows = modules.filter(m => m.status === 'Blocked').length;
    const flowPassRate = totalFlows > 0 ? Math.round((passedFlows / totalFlows) * 100) : 0;

    return (
        <>
        <div className="row g-3 mb-3" id="summarySection">
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3 kpi-total" style={{backgroundColor: '#e7f1ff'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-layers text-primary"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Total Channels</p>
                            <h3 className="fw-bold mb-0">{totalModules}</h3>
                            <small className="text-muted">{totalFlows} flows × 4 channels</small>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3 kpi-passed" style={{backgroundColor: '#d1e7dd'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-check-circle text-success"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Passed Channels</p>
                            <h3 className="fw-bold mb-0">{passedModules}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3 kpi-failed" style={{backgroundColor: '#f8d7da'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-x-circle text-danger"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Failed Channels</p>
                            <h3 className="fw-bold mb-0">{failedModules}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3 kpi-rate" style={{backgroundColor: '#cfe2ff'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-pie-chart text-info"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Pass Rate</p>
                            <h3 className="fw-bold mb-0">{passRate}%</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row g-3 mb-4">
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3" style={{backgroundColor: '#f8f9fa'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-diagram-3"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Total Flows</p>
                            <h3 className="fw-bold mb-0">{totalFlows}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3" style={{backgroundColor: '#d1e7dd'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-check-circle-fill text-success"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Passed Flows</p>
                            <h3 className="fw-bold mb-0">{passedFlows}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3" style={{backgroundColor: '#f8d7da'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-x-circle-fill text-danger"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Failed Flows</p>
                            <h3 className="fw-bold mb-0">{failedFlows}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6">
                <div className="card summary-card border-0 h-100 p-3" style={{backgroundColor: '#cfe2ff'}}>
                    <div className="d-flex align-items-center">
                        <div className="kpi-icon me-3">
                            <i className="bi bi-graph-up text-info"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small text-uppercase fw-bold">Flow Pass Rate</p>
                            <h3 className="fw-bold mb-0">{flowPassRate}%</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
