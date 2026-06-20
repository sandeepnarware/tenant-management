export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Commercial',
  'Office',
  'Shop',
  'Land',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Maintenance',
  'Repair',
  'Utility',
  'Tax',
  'Insurance',
  'Cleaning',
  'Security',
  'Renovation',
  'Legal',
  'Other',
];

export const PAYMENT_MODES = [
  'Cash',
  'Cheque',
  'Bank Transfer',
  'UPI',
  'Online',
  'Other',
];

export const RENT_FREQUENCY = [
  'Monthly',
  'Quarterly',
  'Yearly',
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  LATE: 'late',
};

export const STORAGE_KEYS = {
  PROPERTIES: 'tm_properties',
  TENANTS: 'tm_tenants',
  ASSIGNMENTS: 'tm_assignments',
  RENT_PLANS: 'tm_rentPlans',
  RENT_RECORDS: 'tm_rentRecords',
  EXPENSES: 'tm_expenses',
  PAYMENT_DEMANDS: 'tm_paymentDemands',
};
