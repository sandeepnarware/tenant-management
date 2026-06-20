import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToFile, importFromFile, downloadSampleData } from '../utils/exportImport';

export default function Settings() {
  const { refreshData, storage } = useApp();
  const [importStatus, setImportStatus] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [importError, setImportError] = useState('');

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImportError('');
      await importFromFile(file);
      refreshData();
      setImportStatus('Data imported successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } catch (err) {
      setImportError(err.message);
    }
    e.target.value = '';
  };

  const handleClear = () => {
    storage.clearAllData();
    refreshData();
    setConfirmClear(false);
    setImportStatus('All data cleared!');
    setTimeout(() => setImportStatus(''), 3000);
  };

  return (
    <div className="page">
      <h2 className="page-title">Settings</h2>

      {importStatus && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle" /> {importStatus}
        </div>
      )}
      {importError && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle" /> {importError}
        </div>
      )}

      <div className="card">
        <h3>Data Management</h3>
        <div className="settings-section">
          <div className="setting-item">
            <div>
              <strong>Export Data</strong>
              <p className="text-muted">Download all your data as a JSON file for backup.</p>
            </div>
            <button className="btn btn-primary" onClick={exportToFile}>
              <i className="fas fa-download" /> Export
            </button>
          </div>

          <div className="setting-item">
            <div>
              <strong>Import Data</strong>
              <p className="text-muted">Restore data from a previously exported JSON file.</p>
            </div>
            <label className="btn btn-outline">
              <i className="fas fa-upload" /> Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="setting-item">
            <div>
              <strong>Download Sample Data</strong>
              <p className="text-muted">Download a sample JSON file to understand the data format.</p>
            </div>
            <button className="btn btn-outline" onClick={downloadSampleData}>
              <i className="fas fa-file-download" /> Sample
            </button>
          </div>

          <div className="setting-item">
            <div>
              <strong className="text-danger">Clear All Data</strong>
              <p className="text-muted">Permanently delete all data from local storage. Make sure to export first!</p>
            </div>
            {confirmClear ? (
              <div className="setting-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmClear(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleClear}>
                  <i className="fas fa-trash" /> Confirm Clear
                </button>
              </div>
            ) : (
              <button className="btn btn-danger" onClick={() => setConfirmClear(true)}>
                <i className="fas fa-trash" /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>About</h3>
        <p><strong>Tenant Management System</strong> v1.0.0</p>
        <p className="text-muted">A professional property and tenant management application. All data is stored locally in your browser's localStorage. Data persists across sessions but is browser-specific.</p>
      </div>
    </div>
  );
}
