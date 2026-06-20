import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses() {
  const { properties, expenses, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterProperty, setFilterProperty] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || 'Unknown';

  const filtered = expenses.filter(e => {
    if (filterProperty && e.propertyId !== filterProperty) return false;
    if (filterCategory && e.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSave = (data) => {
    storage.saveExpense({ ...data, id: editItem?.id });
    refreshData();
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      storage.deleteExpense(deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  const totalFiltered = filtered.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Expenses</h2>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <i className="fas fa-plus" /> Add Expense
        </button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="form-group">
            <label>Property</label>
            <select value={filterProperty} onChange={e => setFilterProperty(e.target.value)}>
              <option value="">All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Total: <strong>₹{totalFiltered.toLocaleString()}</strong></label>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted">No expenses found</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td><strong>{getPropertyName(e.propertyId)}</strong></td>
                  <td><span className="badge">{e.category}</span></td>
                  <td><strong>₹{(e.amount || 0).toLocaleString()}</strong></td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.description || '-'}</td>
                  <td>{e.vendor || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setEditItem(e); setModalOpen(true); }}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-ghost text-danger" onClick={() => setDeleteId(e.id)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm initial={editItem} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete this expense?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
