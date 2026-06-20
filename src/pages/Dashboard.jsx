import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getRentCollectionSummary, getIncomeVsExpense } from '../utils/reports';

export default function Dashboard() {
  const { properties, tenants, assignments, rentRecords, rentPlans, expenses } = useApp();

  const summary = useMemo(() => getRentCollectionSummary(assignments, rentRecords, rentPlans), [assignments, rentRecords, rentPlans]);
  const incomeExpense = useMemo(() => getIncomeVsExpense(assignments, rentRecords, expenses), [assignments, rentRecords, expenses]);

  const activeAssignments = assignments.filter(a => a.isActive);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalCollected = rentRecords.reduce((s, r) => s + (r.amount || 0), 0);
  const ie = incomeExpense.slice(-6);

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}><i className="fas fa-building" style={{ color: '#1976d2' }} /></div>
          <div className="stat-info">
            <span className="stat-value">{properties.length}</span>
            <span className="stat-label">Properties</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}><i className="fas fa-users" style={{ color: '#388e3c' }} /></div>
          <div className="stat-info">
            <span className="stat-value">{tenants.length}</span>
            <span className="stat-label">Tenants</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}><i className="fas fa-handshake" style={{ color: '#f57c00' }} /></div>
          <div className="stat-info">
            <span className="stat-value">{activeAssignments.length}</span>
            <span className="stat-label">Active Rentals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce4ec' }}><i className="fas fa-rupee-sign" style={{ color: '#c62828' }} /></div>
          <div className="stat-info">
            <span className="stat-value">₹{totalCollected.toLocaleString()}</span>
            <span className="stat-label">Total Collected</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}><i className="fas fa-receipt" style={{ color: '#7b1fa2' }} /></div>
          <div className="stat-info">
            <span className="stat-value">₹{totalExpenses.toLocaleString()}</span>
            <span className="stat-label">Total Expenses</span>
          </div>
        </div>
        {summary && (
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2f1' }}><i className="fas fa-percent" style={{ color: '#00695c' }} /></div>
            <div className="stat-info">
              <span className="stat-value">{summary.collectionRate}%</span>
              <span className="stat-label">Collection Rate</span>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Recent Income vs Expense</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rent Collected</th>
                <th>Expenses</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {ie.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted">No data yet</td></tr>
              ) : ie.map(row => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>₹{row.rent.toLocaleString()}</td>
                  <td>₹{row.expense.toLocaleString()}</td>
                  <td className={row.net >= 0 ? 'text-success' : 'text-danger'}>₹{row.net.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {summary && summary.pendingAmount > 0 && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle" />
          <span>Pending rent amount: <strong>₹{summary.pendingAmount.toLocaleString()}</strong> across {summary.totalMonths - summary.paidCount} months</span>
        </div>
      )}
    </div>
  );
}
