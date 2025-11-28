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
import {
  filterByEnvironment,
  filterByStatus,
  searchModules,
  sortModules,
  exportToJSON
} from './utils/helpers';

function DashboardContent() {
  const { modules, currentEnvironment, deleteModule, importModules } = useModules();
  const { toasts, showToast, removeToast } = useToast();

  // UI State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

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
    const filename = `qa_dashboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
    exportToJSON(modules, filename);
    showToast('Data exported successfully', 'success');
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

  return (
    <div className="min-vh-100">
      <Header
        onAddModule={handleAddModule}
        onExport={handleExport}
        onImport={handleImport}
        onSimulate={handleSimulate}
      />

      <div className="container-fluid py-4">
        <EnvironmentTabs />

        <div className="row g-4">
          <div className="col-lg-8">
            <SummaryCards modules={filteredModules} />
          </div>
          <div className="col-lg-4">
            <div className="card border-0 p-3">
              <h6 className="fw-bold mb-3">Status Distribution</h6>
              <StatusChart modules={filteredModules} />
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
