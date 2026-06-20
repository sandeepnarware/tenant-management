import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [properties, setProperties] = useState(() => storage.getProperties());
  const [tenants, setTenants] = useState(() => storage.getTenants());
  const [assignments, setAssignments] = useState(() => storage.getAssignments());
  const [rentPlans, setRentPlans] = useState(() => storage.getRentPlans());
  const [rentRecords, setRentRecords] = useState(() => storage.getRentRecords());
  const [expenses, setExpenses] = useState(() => storage.getExpenses());
  const [paymentDemands, setPaymentDemands] = useState(() => storage.getPaymentDemands());

  const refreshData = useCallback(() => {
    setProperties(storage.getProperties());
    setTenants(storage.getTenants());
    setAssignments(storage.getAssignments());
    setRentPlans(storage.getRentPlans());
    setRentRecords(storage.getRentRecords());
    setExpenses(storage.getExpenses());
    setPaymentDemands(storage.getPaymentDemands());
  }, []);

  const value = {
    properties,
    tenants,
    assignments,
    rentPlans,
    rentRecords,
    expenses,
    paymentDemands,
    refreshData,
    storage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
