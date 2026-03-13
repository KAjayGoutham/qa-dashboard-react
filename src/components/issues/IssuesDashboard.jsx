import React, { useState, useMemo } from 'react';
import { useIssues } from '../../context/IssuesContext';
import { IssueCard } from './IssueCard';
import { AddIssueModal } from './AddIssueModal';

export const IssuesDashboard = () => {
    const { 
        issues, 
        activeChannel, 
        setActiveChannel, 
        addIssue, 
        updateIssue, 
        deleteIssue, 
        getIssuesByChannel,
        isLoading 
    } = useIssues();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState(null);

    const channels = [
        { id: 'sms', label: 'SMS', icon: 'bi-chat-dots' },
        { id: 'chat', label: 'Chat', icon: 'bi-chat-left-text' },
        { id: 'email', label: 'Email', icon: 'bi-envelope' },
        { id: 'voice', label: 'Voice', icon: 'bi-telephone' }
    ];

    const channelIssues = useMemo(() => {
        return getIssuesByChannel(activeChannel);
    }, [activeChannel, getIssuesByChannel]);

    const getChannelStats = (channel) => {
        const channelIssues = getIssuesByChannel(channel);
        return {
            total: channelIssues.length,
            critical: channelIssues.filter(i => i.severity === 'critical').length,
            high: channelIssues.filter(i => i.severity === 'high').length
        };
    };

    const handleAddIssue = () => {
        setEditingIssue(null);
        setIsModalOpen(true);
    };

    const handleEditIssue = (issue) => {
        setEditingIssue(issue);
        setIsModalOpen(true);
    };

    const handleSubmitIssue = (formData) => {
        if (editingIssue) {
            updateIssue(editingIssue.id, formData);
        } else {
            addIssue(formData);
        }
        setEditingIssue(null);
    };

    const handleDeleteIssue = (id) => {
        deleteIssue(id);
    };

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">
                                <i className="bi bi-bug me-2"></i>
                                Issues Dashboard
                            </h2>
                            <p className="text-muted mb-0">Track and manage channel-specific issues</p>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={handleAddIssue}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add Issue
                        </button>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <ul className="nav nav-tabs border-0" role="tablist">
                        {channels.map(channel => {
                            const stats = getChannelStats(channel.id);
                            return (
                                <li className="nav-item" key={channel.id} role="presentation">
                                    <button
                                        className={`nav-link ${activeChannel === channel.id ? 'active' : ''}`}
                                        onClick={() => setActiveChannel(channel.id)}
                                        type="button"
                                        role="tab"
                                    >
                                        <i className={`${channel.icon} me-2`}></i>
                                        {channel.label}
                                        {stats.total > 0 && (
                                            <span className="badge bg-primary ms-2">{stats.total}</span>
                                        )}
                                        {stats.critical > 0 && (
                                            <span className="badge bg-danger ms-1" title="Critical issues">
                                                {stats.critical}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    {channels.find(c => c.id === activeChannel)?.label} Issues
                                </h5>
                                <span className="badge bg-light text-dark">
                                    {channelIssues.length} {channelIssues.length === 1 ? 'Issue' : 'Issues'}
                                </span>
                            </div>
                        </div>
                        <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : channelIssues.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox display-1 text-muted"></i>
                                    <h5 className="mt-3 text-muted">No issues found</h5>
                                    <p className="text-muted">
                                        Click "Add Issue" to create a new issue for this channel
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {channelIssues.map(issue => (
                                        <IssueCard
                                            key={issue.id}
                                            issue={issue}
                                            onDelete={handleDeleteIssue}
                                            onEdit={handleEditIssue}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-bar-chart me-2"></i>
                                Statistics
                            </h6>
                            <div className="d-flex flex-column gap-3">
                                {channels.map(channel => {
                                    const stats = getChannelStats(channel.id);
                                    return (
                                        <div key={channel.id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className={`${channel.icon} me-2`}></i>
                                                {channel.label}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <span className="badge bg-light text-dark">{stats.total}</span>
                                                {stats.critical > 0 && (
                                                    <span className="badge bg-danger">{stats.critical}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-info-circle me-2"></i>
                                Quick Actions
                            </h6>
                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={handleAddIssue}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add New Issue
                                </button>
                                <button 
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                        const critical = issues.filter(i => i.severity === 'critical');
                                        if (critical.length > 0) {
                                            alert(`${critical.length} critical issues need attention!`);
                                        } else {
                                            alert('No critical issues at the moment.');
                                        }
                                    }}
                                >
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    View Critical Issues
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddIssueModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingIssue(null);
                }}
                onSubmit={handleSubmitIssue}
                editingIssue={editingIssue}
                channel={activeChannel}
            />
        </div>
    );
};
