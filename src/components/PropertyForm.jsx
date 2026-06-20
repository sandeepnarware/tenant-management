import { useState } from 'react';
import { PROPERTY_TYPES } from '../utils/constants';

const emptyForm = {
  name: '', type: 'Apartment', address: '', city: '', state: '', pincode: '', description: '',
};

export default function PropertyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { ...emptyForm });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>Property Name *</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Address</label>
        <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="form-group">
          <label>State</label>
          <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Pincode</label>
          <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
