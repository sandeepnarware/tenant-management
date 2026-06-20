export function getRentCollectionSummary(assignments, rentRecords, rentPlans) {
  const totalRentDue = rentPlans.reduce((sum, plan) => {
    return sum + plan.months.reduce((s, m) => s + (m.rentAmount || 0), 0);
  }, 0);

  const totalRentCollected = rentRecords.reduce((sum, r) => sum + (r.amount || 0), 0);

  const pendingAmount = rentPlans.reduce((sum, plan) => {
    return sum + plan.months.filter(m => m.status === 'pending' || m.status === 'partial')
      .reduce((s, m) => s + ((m.rentAmount || 0) - (m.paidAmount || 0)), 0);
  }, 0);

  const lateCount = rentPlans.reduce((sum, plan) => {
    return sum + plan.months.filter(m => m.status === 'late').length;
  }, 0);

  const paidCount = rentPlans.reduce((sum, plan) => {
    return sum + plan.months.filter(m => m.status === 'paid').length;
  }, 0);

  return {
    totalRentDue,
    totalRentCollected,
    pendingAmount,
    collectionRate: totalRentDue > 0 ? ((totalRentCollected / totalRentDue) * 100).toFixed(1) : 0,
    lateCount,
    paidCount,
    totalMonths: rentPlans.reduce((sum, plan) => sum + plan.months.length, 0),
  };
}

export function getPropertyWiseReport(properties, assignments, rentRecords, rentPlans, expenses) {
  return properties.map(property => {
    const propAssignments = assignments.filter(a => a.propertyId === property.id);
    const propRentPlans = rentPlans.filter(p => propAssignments.some(a => a.id === p.assignmentId));
    const propRentRecords = rentRecords.filter(r => propAssignments.some(a => a.id === r.assignmentId));
    const propExpenses = expenses.filter(e => e.propertyId === property.id);

    const totalRentDue = propRentPlans.reduce((sum, plan) =>
      sum + plan.months.reduce((s, m) => s + (m.rentAmount || 0), 0), 0);
    const totalRentCollected = propRentRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalExpenses = propExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
      property,
      assignments: propAssignments,
      totalRentDue,
      totalRentCollected,
      pendingAmount: totalRentDue - totalRentCollected,
      totalExpenses,
      netIncome: totalRentCollected - totalExpenses,
    };
  });
}

export function getTenantWiseReport(tenants, assignments, rentPlans, rentRecords) {
  return tenants.map(tenant => {
    const tenantAssignments = assignments.filter(a => a.tenantId === tenant.id);
    const tenantRentPlans = rentPlans.filter(p => tenantAssignments.some(a => a.id === p.assignmentId));
    const tenantRentRecords = rentRecords.filter(r => tenantAssignments.some(a => a.id === r.assignmentId));

    const totalDue = tenantRentPlans.reduce((sum, plan) =>
      sum + plan.months.reduce((s, m) => s + (m.rentAmount || 0), 0), 0);
    const totalPaid = tenantRentRecords.reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
      tenant,
      assignments: tenantAssignments,
      totalRentDue: totalDue,
      totalRentPaid: totalPaid,
      balance: totalDue - totalPaid,
      paymentCount: tenantRentRecords.length,
      lastPaymentDate: tenantRentRecords.length > 0
        ? tenantRentRecords.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0].paymentDate
        : null,
    };
  });
}

export function getExpenseSummary(properties, expenses) {
  const byCategory = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    byCategory[cat] = { category: cat, total: 0, count: 0, properties: {} };
  });

  expenses.forEach(exp => {
    if (!byCategory[exp.category]) {
      byCategory[exp.category] = { category: exp.category, total: 0, count: 0, properties: {} };
    }
    byCategory[exp.category].total += exp.amount || 0;
    byCategory[exp.category].count += 1;
    byCategory[exp.category].properties[exp.propertyId] = (byCategory[exp.category].properties[exp.propertyId] || 0) + (exp.amount || 0);
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return {
    byCategory: Object.values(byCategory).filter(c => c.count > 0),
    totalExpenses,
    monthlyAverage: totalExpenses > 0 ? (totalExpenses / Math.max(1, getMonthCount(expenses))).toFixed(0) : 0,
  };
}

export function getIncomeVsExpense(assignments, rentRecords, expenses) {
  const monthlyData = {};

  rentRecords.forEach(r => {
    const date = new Date(r.paymentDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0, rent: 0 };
    monthlyData[key].income += r.amount || 0;
    monthlyData[key].rent += r.amount || 0;
  });

  expenses.forEach(e => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0, rent: 0 };
    monthlyData[key].expense += e.amount || 0;
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      ...data,
      net: data.income - data.expense,
    }));
}

export function getSecurityDepositReport(tenants, assignments) {
  return tenants.map(tenant => {
    const tenantAssignments = assignments.filter(a => a.tenantId === tenant.id && a.isActive);
    const totalDeposit = tenant.securityDeposit || 0;
    return {
      tenant,
      totalDeposit,
      activeAssignments: tenantAssignments.length,
    };
  });
}

export function getVacancyReport(properties, assignments) {
  return properties.map(property => {
    const activeAssignments = assignments.filter(a => a.propertyId === property.id && a.isActive);
    return {
      property,
      isVacant: activeAssignments.length === 0,
      currentTenants: activeAssignments.length,
    };
  });
}

export function getRentForecast(assignments, rentPlans) {
  const forecast = [];
  const currentYear = new Date().getFullYear();

  for (let y = currentYear; y <= currentYear + 1; y++) {
    for (let m = 0; m < 12; m++) {
      const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
      let projectedIncome = 0;

      assignments.filter(a => a.isActive).forEach(assignment => {
        const plan = rentPlans.find(p => p.assignmentId === assignment.id && p.year === y);
        if (plan) {
          const monthData = plan.months.find(mo => mo.monthIndex === m);
          if (monthData) {
            projectedIncome += monthData.rentAmount || 0;
          }
        } else if (assignment.rentAmount) {
          projectedIncome += assignment.rentAmount;
        }
      });

      forecast.push({ month: monthKey, projectedIncome });
    }
  }

  return forecast;
}

const EXPENSE_CATEGORIES = [
  'Maintenance', 'Repair', 'Utility', 'Tax', 'Insurance',
  'Cleaning', 'Security', 'Renovation', 'Legal', 'Other',
];

function getMonthCount(expenses) {
  if (expenses.length === 0) return 1;
  const dates = expenses.map(e => new Date(e.date));
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  return Math.max(1, (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth() + 1);
}
