import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_MODES } from '../utils/constants';
import Modal from '../components/Modal';

const emptyForm = {
  assignmentId: '', month: new Date().getMonth(), year: new Date().getFullYear(),
  amount: 0, paymentDate: new Date().toISOString().split('T')[0],
  dueDate: '', paymentMode: 'UPI', transactionRef: '', notes: '',
};

export default function RentRecords() {
  const { properties, tenants, assignments, rentRecords, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [filterAssignment, setFilterAssignment] = useState('');

  const activeAssignments = assignments.filter(a => a.isActive);
  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || 'Unknown';
  const getTenantName = (id) => tenants.find(t => t.id === id)?.name || 'Unknown';
  const getAssignmentLabel = (a) => `${getPropertyName(a.propertyId)} → ${getTenantName(a.tenantId)}`;

  const filtered = filterAssignment
    ? rentRecords.filter(r => r.assignmentId === filterAssignment)
    : rentRecords;

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.assignmentId || !form.amount) return;
    storage.saveRentRecord({ ...form, id: editItem?.id, amount: Number(form.amount) });
    refreshData();
    setModalOpen(false);
    setEditItem(null);
    setForm({ ...emptyForm });
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditItem(record);
    setForm({ ...record });
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      storage.deleteRentRecord(deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Rent Records</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus" /> Add Rent Record
        </button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="form-group">
            <label>Filter by Assignment</label>
            <select value={filterAssignment} onChange={e => setFilterAssignment(e.target.value)}>
              <option value="">All Records</option>
              {activeAssignments.map(a => (
                <option key={a.id} value={a.id}>{getAssignmentLabel(a)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Tenant</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Mode</th>
                <th>Ref</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-muted">No rent records found</td></tr>
              ) : filtered.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).map(r => {
                const assignment = assignments.find(a => a.id === r.assignmentId);
                return (
                  <tr key={r.id}>
                    <td>{assignment ? getPropertyName(assignment.propertyId) : '-'}</td>
                    <td>{assignment ? getTenantName(assignment.tenantId) : '-'}</td>
                    <td>{MONTHS[r.month]} {r.year}</td>
                    <td><strong>₹{(r.amount || 0).toLocaleString()}</strong></td>
                    <td>{new Date(r.paymentDate).toLocaleDateString()}</td>
                    <td><span className="badge">{r.paymentMode}</span></td>
                    <td>{r.transactionRef || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}><i className="fas fa-edit" /></button>
                      <button className="btn btn-sm btn-ghost text-danger" onClick={() => setDeleteId(r.id)}><i className="fas fa-trash" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Edit Rent Record' : 'Add Rent Record'}>
        <form onSubmit={handleSave} className="form">
          <div className="form-group">
            <label>Assignment *</label>
            <select value={form.assignmentId} onChange={e => setForm({ ...form, assignmentId: e.target.value })} required>
              <option value="">Select Assignment</option>
              {activeAssignments.map(a => (
                <option key={a.id} value={a.id}>{getAssignmentLabel(a)}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select value={form.month} onChange={e => setForm({ ...form, month: Number(e.target.value) })}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Payment Date</label>
              <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Transaction Reference</label>
            <input value={form.transactionRef} onChange={e => setForm({ ...form, transactionRef: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { setModalOpen(false); setEditItem(null); }}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete this rent record?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
