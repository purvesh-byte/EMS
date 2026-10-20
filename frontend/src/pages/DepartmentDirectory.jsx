import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, Building2 } from 'lucide-react';
import { getEmployees, getDepartments, createDepartment, deleteDepartment } from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const DepartmentDirectory = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [newDept, setNewDept] = useState('');
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, e] = await Promise.all([getDepartments(), getEmployees()]);
      setDepartments(d || []); setEmployees(e || []);
    } catch (err) { showToast('error', 'Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!newDept) return;
    try {
      await createDepartment({ departmentName: newDept });
      showToast('success', 'Department added');
      setModal(false);
      setNewDept('');
      fetchAll();
    } catch (err) { showToast('error', err.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      showToast('success', 'Department deleted successfully');
      fetchAll(); // Refresh departments and employee counts
    } catch (err) {
      showToast('error', err.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Departments</h1><p className="page-subtitle">Manage organizational departments.</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={18}/> Add Department</button>
      </div>

      {toast && <div className={`toast-banner ${toast.type}`}>{toast.msg}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Department Name</th><th>Employee Count</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.departmentId}>
                  <td>{d.departmentId}</td>
                  <td><div className="employee-cell"><Building2 size={16} className="text-secondary" /> {d.departmentName}</div></td>
                  <td><Badge variant="blue">{employees.filter(e => e.departmentId === d.departmentId).length} Employees</Badge></td>
                  <td><button className="btn-icon danger" onClick={() => handleDelete(d.departmentId)}><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Add Department" onClose={() => setModal(false)} footer={(
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Department</button>
          </>
        )}>
          <div className="form-group">
            <label className="form-label">Department Name</label>
            <input className="form-control" value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="e.g. Engineering" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentDirectory;
