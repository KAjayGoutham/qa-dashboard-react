# React Dashboard Components Reference - Part 2

## Module Components (Continued)

### src/components/modules/ModuleForm.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useModules } from '../../context/ModuleContext';

export const ModuleForm = ({ isOpen, onClose, module, onToast }) => {
  const { addModule, updateModule } = useModules();
  const [formData, setFormData] = useState({
    name: '',
    status: 'Passed',
    reason: '',
    failures: 0
  });

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name,
        status: module.status,
        reason: module.reason || '',
        failures: module.failures
      });
    } else {
      setFormData({
        name: '',
        status: 'Passed',
        reason: '',
        failures: 0
      });
    }
  }, [module, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      onToast('Module name is required', 'error');
      return;
    }

    if (module) {
      updateModule(module.id, formData);
      onToast('Module updated successfully', 'success');
    } else {
      addModule(formData);
      onToast('Module added successfully', 'success');
    }
    
    onClose();
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" form="moduleForm" className="btn btn-primary">
        {module ? 'Update' : 'Add'} Module
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={module ? 'Edit Module' : 'Add Module'}
      footer={footer}
    >
      <form id="moduleForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Module Name *</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            rows="2"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Failure Count</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={formData.failures}
            onChange={(e) => setFormData({ ...formData, failures: parseInt(e.target.value) || 0 })}
          />
        </div>
      </form>
    </Modal>
  );
};
```

### src/components/modules/ModuleRow.jsx
```jsx
import React from 'react';
import { useModules } from '../../context/ModuleContext';
import { ChannelPills } from './ChannelPills';
import { StatusDropdown } from './StatusDropdown';
import { CommentHistory } from '../comments/CommentHistory';
import { formatDate } from '../../utils/helpers';

export const ModuleRow = ({ module, onEdit, onDelete, onToast }) => {
  const { expandedModules, toggleExpansion } = useModules();
  const isExpanded = expandedModules.has(module.id);

  return (
    <>
      <tr>
        <td className="ps-4 fw-medium">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-link p-0 me-2 text-muted collapse-toggle"
              onClick={() => toggleExpansion(module.id)}
              title="Toggle comment history"
            >
              <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
            </button>
            <span>{module.name}</span>
          </div>
        </td>
        <td>
          <ChannelPills module={module} />
        </td>
        <td>
          <StatusDropdown module={module} onToast={onToast} />
        </td>
        <td className="text-muted small text-truncate" style={{ maxWidth: '200px' }} title={module.reason || ''}>
          {module.reason || '-'}
        </td>
        <td>{module.failures}</td>
        <td className="text-muted small">{formatDate(module.lastUpdated)}</td>
        <td className="text-end pe-4">
          <button
            className="btn btn-sm btn-light text-primary me-1"
            onClick={() => onEdit(module)}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-light text-danger"
            onClick={() => onDelete(module)}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="comment-history-row">
          <td colSpan="7" className="p-0">
            <div className="comment-history-container">
              <CommentHistory module={module} onToast={onToast} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
```

### src/components/modules/ModuleTable.jsx
```jsx
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
```

## Comment Components

### src/components/comments/CommentForm.jsx
```jsx
import React, { useState } from 'react';

export const CommentForm = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState('failure');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ type, text });
    setText('');
    setType('failure');
  };

  return (
    <div className="add-comment-form mb-3">
      <div className="card border-0 bg-light">
        <div className="card-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label small fw-bold">Comment Type</label>
              <select
                className="form-select form-select-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="failure">Failure Reason</option>
                <option value="fix">Fix Reason</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label small fw-bold">Comment</label>
              <textarea
                className="form-control form-control-sm"
                rows="2"
                placeholder="Enter your comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-sm btn-primary">
                <i className="bi bi-check-lg me-1"></i>Save
              </button>
              <button type="button" className="btn btn-sm btn-light" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
```

### src/components/comments/CommentCard.jsx
```jsx
import React, { useState } from 'react';
import { useModules } from '../../context/ModuleContext';
import { formatDate } from '../../utils/helpers';

export const CommentCard = ({ comment, moduleId, onToast }) => {
  const { updateModule, modules } = useModules();
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState(comment.type);
  const [editText, setEditText] = useState(comment.comment);

  const typeClass = comment.type === 'failure' ? 'comment-failure' : 'comment-fix';
  const typeIcon = comment.type === 'failure' ? 'bi-exclamation-circle' : 'bi-check-circle';
  const typeLabel = comment.type === 'failure' ? 'Failure' : 'Fix';

  const handleSaveEdit = () => {
    if (!editText.trim()) {
      onToast('Please enter a comment', 'error');
      return;
    }

    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const updatedHistory = module.commentHistory.map(c =>
      c.timestamp === comment.timestamp
        ? { ...c, type: editType, comment: editText }
        : c
    );

    updateModule(moduleId, { commentHistory: updatedHistory });
    onToast('Comment updated successfully', 'success');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const updatedHistory = module.commentHistory.filter(c => c.timestamp !== comment.timestamp);
    updateModule(moduleId, { commentHistory: updatedHistory });
    onToast('Comment deleted successfully', 'success');
  };

  return (
    <div className={`comment-card ${typeClass} mb-2`}>
      <div className="d-flex align-items-start">
        <i className={`bi ${typeIcon} me-2 mt-1`}></i>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div>
              <span className={`badge badge-sm ${comment.type === 'failure' ? 'bg-danger' : 'bg-success'}`}>
                {typeLabel}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">{formatDate(comment.timestamp)}</span>
              <div className="comment-actions">
                <button
                  className="btn btn-sm btn-link p-0 text-primary"
                  onClick={() => setIsEditing(true)}
                  title="Edit comment"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-sm btn-link p-0 text-danger ms-1"
                  onClick={handleDelete}
                  title="Delete comment"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          {!isEditing ? (
            <p className="mb-0 small">{comment.comment}</p>
          ) : (
            <div className="edit-comment-form mt-2">
              <div className="mb-2">
                <select
                  className="form-select form-select-sm"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                >
                  <option value="failure">Failure Reason</option>
                  <option value="fix">Fix Reason</option>
                </select>
              </div>
              <textarea
                className="form-control form-control-sm mb-2"
                rows="2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              ></textarea>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={handleSaveEdit}>
                  <i className="bi bi-check-lg me-1"></i>Save
                </button>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => {
                    setIsEditing(false);
                    setEditType(comment.type);
                    setEditText(comment.comment);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### src/components/comments/CommentList.jsx
```jsx
import React, { useState } from 'react';
import { CommentCard } from './CommentCard';

export const CommentList = ({ comments, moduleId, onToast }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (comments.length === 0) {
    return (
      <div className="text-center text-muted py-3">
        <i className="bi bi-inbox fs-4"></i>
        <p className="small mb-0 mt-2">No comments yet. Add one to track failures and fixes.</p>
      </div>
    );
  }

  const latestComments = comments.slice(-2).reverse();
  const allComments = [...comments].reverse();

  return (
    <>
      {!showAll ? (
        <div className="compact-view">
          {latestComments.map(comment => (
            <CommentCard
              key={comment.timestamp}
              comment={comment}
              moduleId={moduleId}
              onToast={onToast}
            />
          ))}
          {comments.length > 2 && (
            <div className="text-center mt-2">
              <button
                className="btn btn-sm btn-link text-muted"
                onClick={() => setShowAll(true)}
              >
                <i className="bi bi-chevron-down me-1"></i>
                Show {comments.length - 2} more comment{comments.length - 2 > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="full-view">
          {allComments.map(comment => (
            <CommentCard
              key={comment.timestamp}
              comment={comment}
              moduleId={moduleId}
              onToast={onToast}
            />
          ))}
          <div className="text-center mt-2">
            <button
              className="btn btn-sm btn-link text-muted"
              onClick={() => setShowAll(false)}
            >
              <i className="bi bi-chevron-up me-1"></i>Show less
            </button>
          </div>
        </div>
      )}
    </>
  );
};
```

### src/components/comments/CommentHistory.jsx
```jsx
import React, { useState } from 'react';
import { useModules } from '../../context/ModuleContext';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

export const CommentHistory = ({ module, onToast }) => {
  const { updateModule } = useModules();
  const [showForm, setShowForm] = useState(false);
  const history = module.commentHistory || [];

  const handleAddComment = ({ type, text }) => {
    const newComment = {
      type,
      comment: text,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...history, newComment];
    updateModule(module.id, { commentHistory: updatedHistory });
    onToast('Comment added successfully', 'success');
    setShowForm(false);
  };

  return (
    <div className="comment-history-content p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 fw-bold text-muted">
          <i className="bi bi-chat-left-text me-2"></i>Comment History
          {history.length > 0 && (
            <span className="badge bg-secondary ms-2">{history.length}</span>
          )}
        </h6>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus-lg me-1"></i>Add Comment
        </button>
      </div>

      {showForm && (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="comment-list">
        <CommentList
          comments={history}
          moduleId={module.id}
          onToast={onToast}
        />
      </div>
    </div>
  );
};
```

All components are now defined! Use these components by creating the respective files in the folder structure as indicated in the file paths.
