import { useState } from 'react';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { useApp } from '../context/AppContext';

const emptyForm = {
  propertyId: '', category: 'Maintenance', amount: 0, date: new Date().toISOString().split('T')[0],
  description: '', vendor: '',
};

export default function ExpenseForm({ initial, onSave, onCancel }) {
  const { properties } = useApp();
  const [form, setForm] = useState(initial || { ...emptyForm });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.propertyId || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>Property *</label>
          <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} required>
            <option value="">Select Property</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹) *</label>
          <input type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
      </div>
      <div className="form-group">
        <label>Vendor</label>
        <input value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
