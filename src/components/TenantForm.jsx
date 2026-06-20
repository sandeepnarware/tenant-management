import { useState } from 'react';

const emptyForm = {
  name: '', email: '', phone: '', aadhar: '',
  permanentAddress: '', city: '', state: '', pincode: '',
  securityDeposit: 0,
};

export default function TenantForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { ...emptyForm });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave({ ...form, securityDeposit: Number(form.securityDeposit) || 0 });
  };

  const onChange = (field, value) => setForm({ ...form, [field]: value });

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input value={form.name} onChange={e => onChange('name', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => onChange('email', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone *</label>
          <input value={form.phone} onChange={e => onChange('phone', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Aadhar Number</label>
          <input value={form.aadhar} onChange={e => onChange('aadhar', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Permanent Address</label>
        <textarea value={form.permanentAddress} onChange={e => onChange('permanentAddress', e.target.value)} rows={2} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input value={form.city} onChange={e => onChange('city', e.target.value)} />
        </div>
        <div className="form-group">
          <label>State</label>
          <input value={form.state} onChange={e => onChange('state', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Pincode</label>
          <input value={form.pincode} onChange={e => onChange('pincode', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Security Deposit (₹)</label>
        <input type="number" min="0" value={form.securityDeposit} onChange={e => onChange('securityDeposit', e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
