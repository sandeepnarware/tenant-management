import { useState } from 'react';
import { RENT_FREQUENCY } from '../utils/constants';
import { useApp } from '../context/AppContext';

const emptyForm = {
  propertyId: '', tenantId: '', rentAmount: 0, rentFrequency: 'Monthly',
  securityDeposit: 0, startDate: '', endDate: '', isActive: true,
};

export default function AssignmentForm({ initial, onSave, onCancel }) {
  const { properties, tenants } = useApp();
  const [form, setForm] = useState(initial || { ...emptyForm });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.propertyId || !form.tenantId || !form.rentAmount) return;
    onSave({
      ...form,
      rentAmount: Number(form.rentAmount),
      securityDeposit: Number(form.securityDeposit) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>Property *</label>
          <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })} required>
            <option value="">Select Property</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name} - {p.city}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tenant *</label>
          <select value={form.tenantId} onChange={e => setForm({ ...form, tenantId: e.target.value })} required>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.phone})</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Rent Amount (₹) *</label>
          <input type="number" min="0" value={form.rentAmount} onChange={e => setForm({ ...form, rentAmount: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Rent Frequency</label>
          <select value={form.rentFrequency} onChange={e => setForm({ ...form, rentFrequency: e.target.value })}>
            {RENT_FREQUENCY.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Security Deposit (₹)</label>
          <input type="number" min="0" value={form.securityDeposit} onChange={e => setForm({ ...form, securityDeposit: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
          Active Assignment
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
