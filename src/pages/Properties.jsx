import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import PropertyForm from '../components/PropertyForm';

export default function Properties() {
  const { properties, assignments, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = (data) => {
    storage.saveProperty({ ...data, id: editItem?.id });
    refreshData();
    setModalOpen(false);
    setEditItem(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      const hasAssignment = assignments.some(a => a.propertyId === deleteId && a.isActive);
      if (hasAssignment && !window.confirm('This property has active assignments. Delete anyway?')) return;
      storage.deleteProperty(deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Properties</h2>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <i className="fas fa-plus" /> Add Property
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted">No properties added yet</td></tr>
              ) : properties.map(p => {
                const activeRental = assignments.filter(a => a.propertyId === p.id && a.isActive).length;
                return (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge">{p.type}</span></td>
                    <td>{p.address || '-'}</td>
                    <td>{p.city || '-'}</td>
                    <td>{activeRental > 0 ? <span className="badge badge-success">Occupied</span> : <span className="badge badge-secondary">Vacant</span>}</td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(p)}><i className="fas fa-edit" /></button>
                      <button className="btn btn-sm btn-ghost text-danger" onClick={() => setDeleteId(p.id)}><i className="fas fa-trash" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Edit Property' : 'Add Property'}>
        <PropertyForm initial={editItem} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete this property?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
