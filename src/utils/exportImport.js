import { storage } from './storage';

export function exportToFile() {
  const data = storage.exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tenant-management-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        storage.importAllData(data);
        resolve(true);
    } catch {
      reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function downloadSampleData() {
  const sample = {
    tm_properties: [
      {
        id: 'sample-prop-1',
        name: 'Sunrise Apartments - Unit 101',
        type: 'Apartment',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        description: '2 BHK apartment with sea view',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    tm_tenants: [
      {
        id: 'sample-tenant-1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 9876543210',
        aadhar: '1234-5678-9012',
        permanentAddress: '456 Green Park Colony',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        securityDeposit: 50000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tenant-management-sample-data.json';
  a.click();
  URL.revokeObjectURL(url);
}
