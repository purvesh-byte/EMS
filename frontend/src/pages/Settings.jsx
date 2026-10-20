import React, { useState, useEffect } from 'react';
import { Globe, LayoutList, Sun, Server, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getDepartments } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('peoplecore_settings');
    if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    return { currency: 'INR', dateFormat: 'DD/MM/YYYY', rowsPerPage: '10', tableDensity: 'comfortable', theme: 'light' };
  });
  const [toast, setToast] = useState(null);
  const [apiStatus, setApiStatus] = useState({ loading: false, success: null, message: '' });

  useEffect(() => {
    localStorage.setItem('peoplecore_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [settings]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const checkApiConnection = async () => {
    setApiStatus({ loading: true, success: null, message: 'Testing connection...' });
    try {
      const data = await getDepartments();
      setApiStatus({ loading: false, success: true, message: `Connected. Retrieved ${data?.length || 0} departments.` });
    } catch (err) {
      setApiStatus({ loading: false, success: false, message: `Connection failed.` });
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage regional, directory, and system preferences.</p>
      </div>

      {toast && <div className={`toast-banner ${toast.type}`}>{toast.msg}</div>}

      <div className="settings-card">
        <h2><Globe size={18} /> Regional Preferences</h2>
        <div className="settings-grid">
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date Format</label>
            <select className="form-select" value={settings.dateFormat} onChange={e => setSettings({...settings, dateFormat: e.target.value})}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h2><LayoutList size={18} /> Directory Preferences</h2>
        <div className="settings-grid">
          <div className="form-group">
            <label className="form-label">Rows Per Page</label>
            <select className="form-select" value={settings.rowsPerPage} onChange={e => setSettings({...settings, rowsPerPage: e.target.value})}>
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Table Density</label>
            <select className="form-select" value={settings.tableDensity} onChange={e => setSettings({...settings, tableDensity: e.target.value})}>
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h2><Sun size={18} /> Appearance</h2>
        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label className="form-label">Interface Theme</label>
          <select className="form-select" value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      <div className="settings-card">
        <h2><Server size={18} /> System Information</h2>
        <div className="api-card">
          <div className="api-status-info">
            {apiStatus.success === true ? <CheckCircle className="text-success" size={20}/> : apiStatus.success === false ? <AlertCircle className="text-danger" size={20}/> : <Server size={20}/>}
            {apiStatus.message || 'Check connection to backend server.'}
          </div>
          <button className="btn-primary" onClick={checkApiConnection}>
            {apiStatus.loading ? <RefreshCw className="spin" size={16}/> : <RefreshCw size={16}/>}
            {apiStatus.loading ? 'Connecting...' : 'Test Connection'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;