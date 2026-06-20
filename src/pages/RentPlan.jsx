import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MONTHS } from '../utils/constants';
import Modal from '../components/Modal';

export default function RentPlan() {
  const { properties, tenants, assignments, rentPlans, rentRecords, storage, refreshData } = useApp();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [editingMonth, setEditingMonth] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [yearModalOpen, setYearModalOpen] = useState(false);

  const activeAssignments = assignments.filter(a => a.isActive);
  const getPropertyName = (id) => properties.find(p => p.id === id)?.name || 'Unknown';
  const getTenantName = (id) => tenants.find(t => t.id === id)?.name || 'Unknown';

  const filteredPlans = useMemo(() => {
    if (!selectedAssignment) return [];
    return rentPlans.filter(p => p.assignmentId === selectedAssignment && p.year === selectedYear);
  }, [rentPlans, selectedAssignment, selectedYear]);

  const currentPlan = filteredPlans[0];

  const getMonthData = (monthIndex) => {
    if (currentPlan?.months) {
      return currentPlan.months.find(m => m.monthIndex === monthIndex);
    }
    return null;
  };

  const generatePlan = () => {
    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (!assignment) return;

    const months = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      rentAmount: assignment.rentAmount || 0,
      status: 'pending',
      paidAmount: 0,
      dueDate: `${selectedYear}-${String(i + 1).padStart(2, '0')}-10`,
      notes: '',
    }));

    const plan = {
      assignmentId: selectedAssignment,
      year: selectedYear,
      months,
    };

    storage.saveRentPlan(plan);
    refreshData();
  };

  const updateMonth = (monthIndex, data) => {
    if (!currentPlan) return;
    const months = currentPlan.months.map(m =>
      m.monthIndex === monthIndex ? { ...m, ...data } : m
    );
    storage.saveRentPlan({ ...currentPlan, months });

    if ((data.status === 'paid' || data.status === 'partial') && (data.paidAmount || data.rentAmount)) {
      const amount = data.paidAmount || data.rentAmount;
      const existing = rentRecords.find(
        r => r.assignmentId === currentPlan.assignmentId && r.month === monthIndex && r.year === currentPlan.year
      );
      if (!existing) {
        storage.saveRentRecord({
          assignmentId: currentPlan.assignmentId,
          month: monthIndex,
          year: currentPlan.year,
          amount: Number(amount),
          paymentDate: new Date().toISOString().split('T')[0],
          dueDate: data.dueDate || `${currentPlan.year}-${String(monthIndex + 1).padStart(2, '0')}-10`,
          paymentMode: 'UPI',
          notes: `Auto-created from rent plan (${data.status})`,
        });
      }
    }

    refreshData();
    setEditingMonth(null);
    setEditingPlan(null);
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Rent Payment Plan</h2>
      </div>

      <div className="card">
        <div className="filters">
          <div className="form-group">
            <label>Assignment</label>
            <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)}>
              <option value="">Select Assignment</option>
              {activeAssignments.map(a => (
                <option key={a.id} value={a.id}>
                  {getPropertyName(a.propertyId)} → {getTenantName(a.tenantId)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <div className="year-selector">
              <button className="btn btn-sm btn-ghost" onClick={() => setSelectedYear(y => y - 1)}><i className="fas fa-chevron-left" /></button>
              <button className="btn btn-sm btn-outline" onClick={() => setYearModalOpen(true)}>{selectedYear}</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelectedYear(y => y + 1)}><i className="fas fa-chevron-right" /></button>
            </div>
          </div>
        </div>
      </div>

      {selectedAssignment && (
        <>
          {!currentPlan ? (
            <div className="card text-center" style={{ padding: '2rem' }}>
              <p className="text-muted">No rent plan generated for this assignment in {selectedYear}.</p>
              <button className="btn btn-primary" onClick={generatePlan}>
                <i className="fas fa-magic" /> Generate Plan
              </button>
            </div>
          ) : (
            <div className="rent-plan-grid">
              {MONTHS.map((monthName, idx) => {
                const md = getMonthData(idx);
                const status = md?.status || 'pending';
                const statusColors = {
                  pending: '#ff9800',
                  paid: '#4caf50',
                  partial: '#2196f3',
                  late: '#f44336',
                };
                return (
                  <div key={idx} className={`plan-month-card ${status}`} onClick={() => {
                    setEditingPlan({ ...md, monthIndex: idx });
                    setEditingMonth(idx);
                  }}>
                    <div className="plan-month-header">
                      <span className="plan-month-name">{monthName}</span>
                      <span className="plan-status-dot" style={{ background: statusColors[status] }} />
                    </div>
                    <div className="plan-month-amount">₹{(md?.rentAmount || 0).toLocaleString()}</div>
                    <div className="plan-month-status">{status.toUpperCase()}</div>
                    {md?.paidAmount > 0 && <div className="plan-month-paid">Paid: ₹{md.paidAmount.toLocaleString()}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal isOpen={editingMonth !== null} onClose={() => { setEditingMonth(null); setEditingPlan(null); }} title="Update Month">
        {editingPlan && (
          <div className="form">
            <div className="form-group">
              <label>Month</label>
              <input value={MONTHS[editingPlan.monthIndex]} disabled />
            </div>
            <div className="form-group">
              <label>Rent Amount (₹)</label>
              <input type="number" value={editingPlan.rentAmount} onChange={e => setEditingPlan({ ...editingPlan, rentAmount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={editingPlan.status} onChange={e => setEditingPlan({ ...editingPlan, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="form-group">
              <label>Paid Amount (₹)</label>
              <input type="number" value={editingPlan.paidAmount} onChange={e => setEditingPlan({ ...editingPlan, paidAmount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={editingPlan.dueDate || ''} onChange={e => setEditingPlan({ ...editingPlan, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={editingPlan.notes || ''} onChange={e => setEditingPlan({ ...editingPlan, notes: e.target.value })} rows={2} />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => { setEditingMonth(null); setEditingPlan(null); }}>Cancel</button>
              <button className="btn btn-primary" onClick={() => updateMonth(editingPlan.monthIndex, editingPlan)}>Save</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={yearModalOpen} onClose={() => setYearModalOpen(false)} title="Select Year" size="sm">
        <div className="year-grid">
          {years.map(y => (
            <button key={y} className={`btn ${y === selectedYear ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setSelectedYear(y); setYearModalOpen(false); }}>
              {y}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
