import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import TenantForm from '../components/TenantForm';

export default function Tenants() {
  const { tenants, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = tenants.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.phone?.includes(search) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    storage.saveTenant({ ...data, id: editItem?.id });
    refreshData();
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      storage.deleteTenant(deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Tenants</h2>
        <div className="page-actions">
          <input className="search-input" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
            <i className="fas fa-plus" /> Add Tenant
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Aadhar</th>
                <th>Deposit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted">No tenants found</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.phone}</td>
                  <td>{t.email || '-'}</td>
                  <td>{t.aadhar || '-'}</td>
                  <td>₹{(t.securityDeposit || 0).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditItem(t); setModalOpen(true); }}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-ghost text-danger" onClick={() => setDeleteId(t.id)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Edit Tenant' : 'Add Tenant'}>
        <TenantForm initial={editItem} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete this tenant?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
