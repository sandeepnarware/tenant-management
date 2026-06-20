import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MONTHS } from '../utils/constants';
import Modal from '../components/Modal';

export default function Demands() {
  const { properties, tenants, assignments, paymentDemands, rentPlans, storage, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [sentVia, setSentVia] = useState('email');

  const activeAssignments = assignments.filter(a => a.isActive);
  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || 'Unknown';
  const getTenantName = (id) => tenants.find(t => t.id === id)?.name || 'Unknown';
  const getAssignmentLabel = (a) => `${getPropertyName(a.propertyId)} → ${getTenantName(a.tenantId)}`;

  const generateDemand = () => {
    if (!selectedAssignment || !amount) return;

    const assignment = assignments.find(a => a.id === selectedAssignment);
    const tenant = tenants.find(t => t.id === assignment?.tenantId);

    const demand = {
      assignmentId: selectedAssignment,
      month: selectedMonth,
      year: selectedYear,
      amount: Number(amount),
      dueDate: dueDate || `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-10`,
      generatedDate: new Date().toISOString(),
      sentVia,
      status: 'generated',
      tenantName: tenant?.name || '',
      tenantEmail: tenant?.email || '',
      tenantPhone: tenant?.phone || '',
      propertyName: assignment ? getPropertyName(assignment.propertyId) : '',
    };

    storage.savePaymentDemand(demand);
    refreshData();

    const message = `Dear ${demand.tenantName},\n\nRent Demand for ${MONTHS[demand.month]} ${demand.year}\nProperty: ${demand.propertyName}\nAmount: ₹${demand.amount.toLocaleString()}\nDue Date: ${new Date(demand.dueDate).toLocaleDateString()}\n\nPlease make the payment at the earliest.\n\n- Tenant Management System`;

    if (sentVia === 'email' && demand.tenantEmail) {
      window.open(`mailto:${demand.tenantEmail}?subject=Rent Demand - ${MONTHS[demand.month]} ${demand.year}&body=${encodeURIComponent(message)}`);
    } else if (sentVia === 'whatsapp' && demand.tenantPhone) {
      const phone = demand.tenantPhone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }

    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedAssignment('');
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
    setAmount(0);
    setDueDate('');
    setSentVia('email');
  };

  const onAssignmentChange = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setAmount(assignment.rentAmount || 0);
      const plan = rentPlans.find(p => p.assignmentId === assignmentId && p.year === selectedYear);
      if (plan) {
        const monthData = plan.months.find(m => m.monthIndex === selectedMonth);
        if (monthData) setAmount(monthData.rentAmount || assignment.rentAmount || 0);
      }
    }
  };

  const demands = [...paymentDemands].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Payment Demands</h2>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <i className="fas fa-file-invoice" /> Generate Demand
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Sent Via</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demands.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-muted">No demands generated yet</td></tr>
              ) : demands.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.tenantName}</strong></td>
                  <td>{d.propertyName}</td>
                  <td>{MONTHS[d.month]} {d.year}</td>
                  <td>₹{(d.amount || 0).toLocaleString()}</td>
                  <td>{new Date(d.dueDate).toLocaleDateString()}</td>
                  <td><span className="badge">{d.sentVia === 'email' ? <><i className="fas fa-envelope" /> Email</> : <><i className="fab fa-whatsapp" /> WhatsApp</>}</span></td>
                  <td>{new Date(d.generatedDate).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => {
                      const msg = `Rent Demand - ${MONTHS[d.month]} ${d.year}\nAmount: ₹${d.amount.toLocaleString()}`;
                      window.open(`mailto:${d.tenantEmail}?subject=Rent Demand ${MONTHS[d.month]} ${d.year}&body=${encodeURIComponent(msg)}`);
                    }}><i className="fas fa-envelope" /></button>
                    <button className="btn btn-sm btn-ghost" onClick={() => {
                      const phone = d.tenantPhone.replace(/[^0-9]/g, '');
                      const msg = `Rent Demand - ${MONTHS[d.month]} ${d.year}\nAmount: ₹${d.amount.toLocaleString()}`;
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}><i className="fab fa-whatsapp" /></button>
                    <button className="btn btn-sm btn-ghost text-danger" onClick={() => {
                      storage.deletePaymentDemand(d.id);
                      refreshData();
                    }}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title="Generate Payment Demand">
        <div className="form">
          <div className="form-group">
            <label>Assignment *</label>
            <select value={selectedAssignment} onChange={e => onAssignmentChange(e.target.value)} required>
              <option value="">Select Assignment</option>
              {activeAssignments.map(a => (
                <option key={a.id} value={a.id}>{getAssignmentLabel(a)}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select value={selectedMonth} onChange={e => {
                setSelectedMonth(Number(e.target.value));
                if (selectedAssignment) onAssignmentChange(selectedAssignment);
              }}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input type="number" min="0" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Send Via</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" value="email" checked={sentVia === 'email'} onChange={e => setSentVia(e.target.value)} />
                <i className="fas fa-envelope" /> Email
              </label>
              <label className="radio-label">
                <input type="radio" value="whatsapp" checked={sentVia === 'whatsapp'} onChange={e => setSentVia(e.target.value)} />
                <i className="fab fa-whatsapp" /> WhatsApp
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</button>
            <button className="btn btn-primary" onClick={generateDemand}>
              <i className="fas fa-paper-plane" /> Generate & Send
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
