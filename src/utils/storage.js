import { STORAGE_KEYS } from './constants';

function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const storage = {
  // Properties
  getProperties: () => getData(STORAGE_KEYS.PROPERTIES),
  saveProperty: (property) => {
    const properties = getData(STORAGE_KEYS.PROPERTIES);
    if (property.id) {
      const idx = properties.findIndex(p => p.id === property.id);
      if (idx >= 0) {
        properties[idx] = { ...properties[idx], ...property, updatedAt: new Date().toISOString() };
      }
    } else {
      property.id = generateId();
      property.createdAt = new Date().toISOString();
      property.updatedAt = property.createdAt;
      properties.push(property);
    }
    setData(STORAGE_KEYS.PROPERTIES, properties);
    return property;
  },
  deleteProperty: (id) => {
    setData(STORAGE_KEYS.PROPERTIES, getData(STORAGE_KEYS.PROPERTIES).filter(p => p.id !== id));
  },
  getProperty: (id) => getData(STORAGE_KEYS.PROPERTIES).find(p => p.id === id),

  // Tenants
  getTenants: () => getData(STORAGE_KEYS.TENANTS),
  saveTenant: (tenant) => {
    const tenants = getData(STORAGE_KEYS.TENANTS);
    if (tenant.id) {
      const idx = tenants.findIndex(t => t.id === tenant.id);
      if (idx >= 0) {
        tenants[idx] = { ...tenants[idx], ...tenant, updatedAt: new Date().toISOString() };
      }
    } else {
      tenant.id = generateId();
      tenant.createdAt = new Date().toISOString();
      tenant.updatedAt = tenant.createdAt;
      tenants.push(tenant);
    }
    setData(STORAGE_KEYS.TENANTS, tenants);
    return tenant;
  },
  deleteTenant: (id) => {
    setData(STORAGE_KEYS.TENANTS, getData(STORAGE_KEYS.TENANTS).filter(t => t.id !== id));
  },
  getTenant: (id) => getData(STORAGE_KEYS.TENANTS).find(t => t.id === id),

  // Assignments
  getAssignments: () => getData(STORAGE_KEYS.ASSIGNMENTS),
  saveAssignment: (assignment) => {
    const assignments = getData(STORAGE_KEYS.ASSIGNMENTS);
    if (assignment.id) {
      const idx = assignments.findIndex(a => a.id === assignment.id);
      if (idx >= 0) {
        assignments[idx] = { ...assignments[idx], ...assignment, updatedAt: new Date().toISOString() };
      }
    } else {
      assignment.id = generateId();
      assignment.createdAt = new Date().toISOString();
      assignment.updatedAt = assignment.createdAt;
      assignments.push(assignment);
    }
    setData(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignment;
  },
  deleteAssignment: (id) => {
    setData(STORAGE_KEYS.ASSIGNMENTS, getData(STORAGE_KEYS.ASSIGNMENTS).filter(a => a.id !== id));
  },
  getAssignment: (id) => getData(STORAGE_KEYS.ASSIGNMENTS).find(a => a.id === id),

  // Rent Plans
  getRentPlans: () => getData(STORAGE_KEYS.RENT_PLANS),
  saveRentPlan: (plan) => {
    const plans = getData(STORAGE_KEYS.RENT_PLANS);
    if (plan.id) {
      const idx = plans.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        plans[idx] = { ...plans[idx], ...plan, updatedAt: new Date().toISOString() };
      }
    } else {
      plan.id = generateId();
      plan.createdAt = new Date().toISOString();
      plan.updatedAt = plan.createdAt;
      plans.push(plan);
    }
    setData(STORAGE_KEYS.RENT_PLANS, plans);
    return plan;
  },
  deleteRentPlan: (id) => {
    setData(STORAGE_KEYS.RENT_PLANS, getData(STORAGE_KEYS.RENT_PLANS).filter(p => p.id !== id));
  },
  getRentPlan: (id) => getData(STORAGE_KEYS.RENT_PLANS).find(p => p.id === id),

  // Rent Records
  getRentRecords: () => getData(STORAGE_KEYS.RENT_RECORDS),
  saveRentRecord: (record) => {
    const records = getData(STORAGE_KEYS.RENT_RECORDS);
    if (record.id) {
      const idx = records.findIndex(r => r.id === record.id);
      if (idx >= 0) {
        records[idx] = { ...records[idx], ...record, updatedAt: new Date().toISOString() };
      }
    } else {
      record.id = generateId();
      record.createdAt = new Date().toISOString();
      records.push(record);
    }
    setData(STORAGE_KEYS.RENT_RECORDS, records);
    return record;
  },
  deleteRentRecord: (id) => {
    setData(STORAGE_KEYS.RENT_RECORDS, getData(STORAGE_KEYS.RENT_RECORDS).filter(r => r.id !== id));
  },

  // Expenses
  getExpenses: () => getData(STORAGE_KEYS.EXPENSES),
  saveExpense: (expense) => {
    const expenses = getData(STORAGE_KEYS.EXPENSES);
    if (expense.id) {
      const idx = expenses.findIndex(e => e.id === expense.id);
      if (idx >= 0) {
        expenses[idx] = { ...expenses[idx], ...expense, updatedAt: new Date().toISOString() };
      }
    } else {
      expense.id = generateId();
      expense.createdAt = new Date().toISOString();
      expenses.push(expense);
    }
    setData(STORAGE_KEYS.EXPENSES, expenses);
    return expense;
  },
  deleteExpense: (id) => {
    setData(STORAGE_KEYS.EXPENSES, getData(STORAGE_KEYS.EXPENSES).filter(e => e.id !== id));
  },

  // Payment Demands
  getPaymentDemands: () => getData(STORAGE_KEYS.PAYMENT_DEMANDS),
  savePaymentDemand: (demand) => {
    const demands = getData(STORAGE_KEYS.PAYMENT_DEMANDS);
    if (demand.id) {
      const idx = demands.findIndex(d => d.id === demand.id);
      if (idx >= 0) {
        demands[idx] = { ...demands[idx], ...demand, updatedAt: new Date().toISOString() };
      }
    } else {
      demand.id = generateId();
      demand.createdAt = new Date().toISOString();
      demands.push(demand);
    }
    setData(STORAGE_KEYS.PAYMENT_DEMANDS, demands);
    return demand;
  },
  deletePaymentDemand: (id) => {
    setData(STORAGE_KEYS.PAYMENT_DEMANDS, getData(STORAGE_KEYS.PAYMENT_DEMANDS).filter(d => d.id !== id));
  },

  // Import/Export
  exportAllData: () => {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = getData(key);
    });
    return data;
  },

  importAllData: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key)) {
        setData(key, Array.isArray(value) ? value : []);
      }
    });
  },

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
