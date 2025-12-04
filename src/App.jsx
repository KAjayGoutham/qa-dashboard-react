import React, { useState, useMemo } from 'react';
import { ModuleProvider, useModules } from './context/ModuleContext';
import { useToast } from './hooks/useToast';
import { Header } from './components/layout/Header';
import { EnvironmentTabs } from './components/layout/EnvironmentTabs';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { StatusChart } from './components/dashboard/StatusChart';
import { Controls } from './components/dashboard/Controls';
import { ModuleTable } from './components/modules/ModuleTable';
import { ModuleForm } from './components/modules/ModuleForm';
import { Toast } from './components/common/Toast';
import { Modal } from './components/common/Modal';
import { SyncModal } from './components/modules/SyncModal';
import { generateReportHTML } from './utils/reportGenerator';
import { RELEASE_NAME_KEY } from './utils/constants';
import {
  filterByEnvironment,
  filterByStatus,
  searchModules,
  sortModules,
  exportToJSON
} from './utils/helpers';

function DashboardContent() {
  const { modules, currentEnvironment, deleteModule, importModules, syncModules } = useModules();
  const { toasts, showToast, removeToast } = useToast();

  // UI State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Filtered modules
  const filteredModules = useMemo(() => {
    let result = filterByEnvironment(modules, currentEnvironment);
    result = filterByStatus(result, statusFilter);
    result = searchModules(result, searchText);
    result = sortModules(result, sortBy);
    return result;
  }, [modules, currentEnvironment, statusFilter, searchText, sortBy]);

  // Handlers
  const handleAddModule = () => {
    setEditingModule(null);
    setIsFormOpen(true);
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const handleDeleteModule = (module) => {
    setDeleteConfirm(module);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteModule(deleteConfirm.id);
      showToast('Module deleted successfully', 'success');
      setDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    exportToJSON(modules, `qa_dashboard_export_${new Date().toISOString().split('T')[0]}.json`);
    showToast('Data exported successfully', 'success');
  };

  const handleExportReport = () => {
    try {
      // Get release name from local storage
      const storedReleaseNames = localStorage.getItem(RELEASE_NAME_KEY);
      let releaseName = 'Release 1.0';

      if (storedReleaseNames) {
        const parsed = JSON.parse(storedReleaseNames);
        // Handle both old string format and new object format
        if (typeof parsed === 'string') {
          releaseName = parsed;
        } else if (typeof parsed === 'object') {
          releaseName = parsed[currentEnvironment] || 'Release 1.0';
        }
      }

      const htmlContent = generateReportHTML(modules, currentEnvironment, releaseName);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QA_Report_${currentEnvironment}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Report generated successfully', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Failed to generate report', 'error');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          importModules(imported);
          showToast('Data imported successfully!', 'success');
        } else {
          showToast('Invalid data format', 'error');
        }
      } catch (err) {
        showToast('Error parsing JSON file', 'error');
      }
      event.target.value = ''; // Reset input
    };
    reader.readAsText(file);
  };

  const handleSimulate = () => {
    if (isSimulating) {
      setIsSimulating(false);
      showToast('Simulation stopped', 'info');
    } else {
      setIsSimulating(true);
      showToast('Simulation started', 'info');
      // Simulation logic can be added here
    }
  };

  const handleSync = () => {
    setIsSyncModalOpen(true);
  };

  const handleSyncConfirm = (targetEnvs, selectedModuleIds) => {
    console.log('handleSyncConfirm called with:', { targetEnvs, selectedModuleIds });

    if (!targetEnvs || targetEnvs.length === 0) {
      showToast('Please select at least one environment', 'warning');
      return;
    }

    if (!selectedModuleIds || selectedModuleIds.length === 0) {
      showToast('Please select at least one module to sync', 'warning');
      return;
    }

    let totalSynced = 0;
    targetEnvs.forEach(env => {
      console.log('Calling syncModules for env:', env);
      const result = syncModules(env, selectedModuleIds);
      if (result) totalSynced += result;
    });

    if (totalSynced > 0) {
      showToast(`Successfully synced ${totalSynced} modules to ${targetEnvs.join(', ')}. Switch to those environments to view them.`, 'success');
    } else {
      showToast(`No new modules to sync. Selected modules already exist in ${targetEnvs.join(', ')}.`, 'info');
    }
    setIsSyncModalOpen(false);
  };

  return (
    <div className="min-vh-100">
      <Header
        onExport={handleExport}
        onExportReport={handleExportReport}
        onImport={handleImport}
        onSimulate={handleSimulate}
        currentEnvironment={currentEnvironment}
      />

      <div className="container-fluid py-4">
        <EnvironmentTabs />

        <div className="row g-4">
          <div className="col-lg-9">
            <SummaryCards modules={filteredModules} />
          </div>
          <div className="col-lg-3">
            <div className="card border-0 p-3 mb-3">
              <h6 className="fw-bold mb-3">Status Distribution</h6>
              <StatusChart modules={filteredModules} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm flex-fill" onClick={handleAddModule}>
                <i className="bi bi-plus-lg me-1"></i>Add Module
              </button>
              <button className="btn btn-info btn-sm flex-fill text-white" onClick={handleSync}>
                <i className="bi bi-arrow-repeat me-1"></i>Sync
              </button>
            </div>
          </div>
        </div>

        <div className="card border-0 mt-4 p-4">
          <Controls
            searchText={searchText}
            onSearchChange={setSearchText}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <ModuleTable
            modules={filteredModules}
            onEdit={handleEditModule}
            onDelete={handleDeleteModule}
            onToast={showToast}
          />
        </div>
      </div>

      <ModuleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        module={editingModule}
        onToast={showToast}
      />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
        <p className="text-muted small">This action cannot be undone.</p>
      </Modal>

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleSyncConfirm}
        currentEnvironment={currentEnvironment}
        modules={filteredModules}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

function App() {
  return (
    <ModuleProvider>
      <DashboardContent />
    </ModuleProvider>
  );
}

export default App;
