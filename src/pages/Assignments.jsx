import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import AssignmentForm from '../components/AssignmentForm';

export default function Assignments() {
  const { properties, tenants, assignments, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || 'Unknown';
  const getTenantName = (id) => tenants.find(t => t.id === id)?.name || 'Unknown';

  const handleSave = (data) => {
    storage.saveAssignment({ ...data, id: editItem?.id });
    refreshData();
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      storage.deleteAssignment(deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Property-Tenant Assignments</h2>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <i className="fas fa-plus" /> New Assignment
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Tenant</th>
                <th>Rent</th>
                <th>Frequency</th>
                <th>Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted">No assignments yet</td></tr>
              ) : assignments.map(a => (
                <tr key={a.id}>
                  <td><strong>{getPropertyName(a.propertyId)}</strong></td>
                  <td>{getTenantName(a.tenantId)}</td>
                  <td>₹{(a.rentAmount || 0).toLocaleString()}</td>
                  <td>{a.rentFrequency}</td>
                  <td>{a.startDate ? new Date(a.startDate).toLocaleDateString() : '-'} - {a.endDate ? new Date(a.endDate).toLocaleDateString() : 'Ongoing'}</td>
                  <td>{a.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-secondary">Inactive</span>}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditItem(a); setModalOpen(true); }}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-ghost text-danger" onClick={() => setDeleteId(a.id)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Edit Assignment' : 'New Assignment'}>
        <AssignmentForm initial={editItem} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete this assignment?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
