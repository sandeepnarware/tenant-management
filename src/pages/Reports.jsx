import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  getRentCollectionSummary,
  getPropertyWiseReport,
  getTenantWiseReport,
  getExpenseSummary,
  getIncomeVsExpense,
  getSecurityDepositReport,
  getVacancyReport,
  getRentForecast,
} from '../utils/reports';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
  { id: 'property', label: 'Property Wise', icon: 'fa-building' },
  { id: 'tenant', label: 'Tenant Wise', icon: 'fa-users' },
  { id: 'income-expense', label: 'Income vs Expense', icon: 'fa-chart-line' },
  { id: 'expense-category', label: 'Expense Categories', icon: 'fa-receipt' },
  { id: 'deposits', label: 'Security Deposits', icon: 'fa-shield-alt' },
  { id: 'vacancy', label: 'Vacancy', icon: 'fa-door-open' },
  { id: 'forecast', label: 'Forecast', icon: 'fa-calendar-check' },
];

export default function Reports() {
  const { properties, tenants, assignments, rentRecords, rentPlans, expenses } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const summary = useMemo(() => getRentCollectionSummary(assignments, rentRecords, rentPlans), [assignments, rentRecords, rentPlans]);
  const propertyReport = useMemo(() => getPropertyWiseReport(properties, assignments, rentRecords, rentPlans, expenses), [properties, assignments, rentRecords, rentPlans, expenses]);
  const tenantReport = useMemo(() => getTenantWiseReport(tenants, assignments, rentPlans, rentRecords), [tenants, assignments, rentPlans, rentRecords]);
  const expenseSummary = useMemo(() => getExpenseSummary(properties, expenses), [properties, expenses]);
  const incomeExpense = useMemo(() => getIncomeVsExpense(assignments, rentRecords, expenses), [assignments, rentRecords, expenses]);
  const depositReport = useMemo(() => getSecurityDepositReport(tenants, assignments), [tenants, assignments]);
  const vacancyReport = useMemo(() => getVacancyReport(properties, assignments), [properties, assignments]);
  const forecast = useMemo(() => getRentForecast(assignments, rentPlans), [assignments, rentPlans]);

  const totalIncome = incomeExpense.reduce((s, r) => s + r.income, 0);
  const totalExp = incomeExpense.reduce((s, r) => s + r.expense, 0);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-info"><span className="stat-value">₹{summary.totalRentDue.toLocaleString()}</span><span className="stat-label">Total Rent Due</span></div></div>
              <div className="stat-card"><div className="stat-info"><span className="stat-value">₹{summary.totalRentCollected.toLocaleString()}</span><span className="stat-label">Total Collected</span></div></div>
              <div className="stat-card"><div className="stat-info"><span className="stat-value">₹{summary.pendingAmount.toLocaleString()}</span><span className="stat-label">Pending</span></div></div>
              <div className="stat-card"><div className="stat-info"><span className="stat-value">{summary.collectionRate}%</span><span className="stat-label">Collection Rate</span></div></div>
              <div className="stat-card"><div className="stat-info"><span className="stat-value">{summary.paidCount}/{summary.totalMonths}</span><span className="stat-label">Months Paid</span></div></div>
              <div className="stat-card"><div className="stat-info"><span className="stat-value">{summary.lateCount}</span><span className="stat-label">Late Payments</span></div></div>
            </div>
            <div className="card"><h3>Income vs Expense Summary</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-info"><span className="stat-value text-success">₹{totalIncome.toLocaleString()}</span><span className="stat-label">Total Income</span></div></div>
                <div className="stat-card"><div className="stat-info"><span className="stat-value text-danger">₹{totalExp.toLocaleString()}</span><span className="stat-label">Total Expenses</span></div></div>
                <div className="stat-card"><div className="stat-info"><span className="stat-value">₹{(totalIncome - totalExp).toLocaleString()}</span><span className="stat-label">Net Profit</span></div></div>
              </div>
            </div>
          </>
        );

      case 'property':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Property</th><th>Assignments</th><th>Rent Due</th><th>Collected</th><th>Pending</th><th>Expenses</th><th>Net</th></tr></thead>
            <tbody>{propertyReport.length === 0 ? <tr><td colSpan={7} className="text-muted text-center">No data</td></tr> :
              propertyReport.map(r => <tr key={r.property.id}>
                <td><strong>{r.property.name}</strong></td><td>{r.assignments.length}</td>
                <td>₹{r.totalRentDue.toLocaleString()}</td><td>₹{r.totalRentCollected.toLocaleString()}</td>
                <td className="text-danger">₹{r.pendingAmount.toLocaleString()}</td>
                <td>₹{r.totalExpenses.toLocaleString()}</td>
                <td className={r.netIncome >= 0 ? 'text-success' : 'text-danger'}>₹{r.netIncome.toLocaleString()}</td>
              </tr>)}</tbody></table></div></div>
        );

      case 'tenant':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Tenant</th><th>Properties</th><th>Rent Due</th><th>Paid</th><th>Balance</th><th>Payments</th><th>Last Payment</th></tr></thead>
            <tbody>{tenantReport.length === 0 ? <tr><td colSpan={7} className="text-muted text-center">No data</td></tr> :
              tenantReport.map(r => <tr key={r.tenant.id}>
                <td><strong>{r.tenant.name}</strong></td><td>{r.assignments.length}</td>
                <td>₹{r.totalRentDue.toLocaleString()}</td><td>₹{r.totalRentPaid.toLocaleString()}</td>
                <td className={r.balance > 0 ? 'text-danger' : 'text-success'}>₹{r.balance.toLocaleString()}</td>
                <td>{r.paymentCount}</td>
                <td>{r.lastPaymentDate ? new Date(r.lastPaymentDate).toLocaleDateString() : '-'}</td>
              </tr>)}</tbody></table></div></div>
        );

      case 'income-expense':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Month</th><th>Rent Collected</th><th>Expenses</th><th>Net</th></tr></thead>
            <tbody>{incomeExpense.length === 0 ? <tr><td colSpan={4} className="text-muted text-center">No data</td></tr> :
              incomeExpense.map(r => <tr key={r.month}>
                <td>{r.month}</td><td>₹{r.rent.toLocaleString()}</td><td>₹{r.expense.toLocaleString()}</td>
                <td className={r.net >= 0 ? 'text-success' : 'text-danger'}>₹{r.net.toLocaleString()}</td>
              </tr>)}</tbody></table></div></div>
        );

      case 'expense-category':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Category</th><th>Total</th><th>Count</th><th>% of Total</th></tr></thead>
            <tbody>{expenseSummary.byCategory.length === 0 ? <tr><td colSpan={4} className="text-muted text-center">No expenses</td></tr> :
              expenseSummary.byCategory.map(c => <tr key={c.category}>
                <td><strong>{c.category}</strong></td>
                <td>₹{c.total.toLocaleString()}</td><td>{c.count}</td>
                <td>{expenseSummary.totalExpenses > 0 ? ((c.total / expenseSummary.totalExpenses) * 100).toFixed(1) : 0}%</td>
              </tr>)}
              <tr className="table-total"><td><strong>Total</strong></td><td><strong>₹{expenseSummary.totalExpenses.toLocaleString()}</strong></td><td>{expenses.length}</td><td>100%</td></tr>
            </tbody></table></div></div>
        );

      case 'deposits':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Tenant</th><th>Phone</th><th>Security Deposit</th><th>Active Rentals</th></tr></thead>
            <tbody>{depositReport.length === 0 ? <tr><td colSpan={4} className="text-muted text-center">No tenants</td></tr> :
              depositReport.map(r => <tr key={r.tenant.id}>
                <td><strong>{r.tenant.name}</strong></td><td>{r.tenant.phone}</td>
                <td>₹{(r.totalDeposit || 0).toLocaleString()}</td><td>{r.activeAssignments}</td>
              </tr>)}
            </tbody></table></div></div>
        );

      case 'vacancy':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Property</th><th>Type</th><th>Status</th><th>Current Tenants</th></tr></thead>
            <tbody>{vacancyReport.length === 0 ? <tr><td colSpan={4} className="text-muted text-center">No properties</td></tr> :
              vacancyReport.map(r => <tr key={r.property.id}>
                <td><strong>{r.property.name}</strong></td><td>{r.property.type}</td>
                <td>{r.isVacant ? <span className="badge badge-secondary">Vacant</span> : <span className="badge badge-success">Occupied</span>}</td>
                <td>{r.currentTenants}</td>
              </tr>)}
            </tbody></table></div></div>
        );

      case 'forecast':
        return (
          <div className="card"><div className="table-wrapper"><table className="table"><thead><tr><th>Month</th><th>Projected Rent</th></tr></thead>
            <tbody>{forecast.length === 0 ? <tr><td colSpan={2} className="text-muted text-center">No active assignments for forecast</td></tr> :
              forecast.map(f => <tr key={f.month}>
                <td>{f.month}</td><td><strong>₹{f.projectedIncome.toLocaleString()}</strong></td>
              </tr>)}
              <tr className="table-total"><td><strong>Projected Annual Total</strong></td><td><strong>₹{forecast.reduce((s, f) => s + f.projectedIncome, 0).toLocaleString()}</strong></td></tr>
            </tbody></table></div></div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Reports</h2>
      <div className="tabs">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <i className={`fas ${tab.icon}`} /> {tab.label}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}
