import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Edit2, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { getEmployees, getDepartments, deleteEmployee, createEmployee, updateEmployee } from '../services/api';
import EmployeeAvatar from '../components/EmployeeAvatar';
import Badge from '../components/Badge';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { formatSalary, formatDate } from '../utils/formatters';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', deptId: '' });
  const [modal, setModal] = useState({ show: false, type: 'add', data: null }); const [viewModal, setViewModal] = useState({ show: false, employee: null });

  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [e, d] = await Promise.all([getEmployees(), getDepartments()]);
      setEmployees(e || []); setDepartments(d || []);
    } catch (err) { showToast('error', 'Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('peoplecore_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rowsPerPage) setRowsPerPage(Number(parsed.rowsPerPage));
        if (parsed.tableDensity) {
          document.body.classList.remove('table-density-compact', 'table-density-comfortable');
          document.body.classList.add(`table-density-${parsed.tableDensity}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      showToast('success', 'Employee deleted successfully');
      fetchAll();
    } catch (err) { showToast('error', err.data?.message || 'Delete failed'); }
  };

  const handleSave = async (formData) => {
    try {
      if (modal.type === 'edit') {
        await updateEmployee(modal.data.employeeId, formData);
        showToast('success', 'Employee updated successfully');
      } else {
        await createEmployee(formData);
        showToast('success', 'Employee added successfully');
      }
      setModal({ show: false, type: 'add', data: null });
      fetchAll();
    } catch (err) { showToast('error', err.data?.message || 'Save failed'); }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
    const filtered = employees.filter(e => {
    const matchSearch = (e.firstName + ' ' + e.lastName + ' ' + e.email).toLowerCase().includes(filters.search.toLowerCase());
    const matchDept = !filters.deptId || e.departmentId === parseInt(filters.deptId);
    return matchSearch && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginatedEmployees = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Employees</h1><p className="page-subtitle">Manage organizational employee records.</p></div>
        <button className="btn btn-primary" onClick={() => setModal({ show: true, type: 'add', data: null })}><Plus size={18}/> Add Employee</button>
      </div>

      {toast && <div className={`toast-banner ${toast.type}`}>{toast.msg}</div>}

      <div className="toolbar-controls">
        <div className="filter-input-wrap">
          <Search className="header-search-icon" size={16} />
          <input 
            className="filter-input" 
            placeholder="Search by name or email..." 
            value={filters.search} 
            onChange={e => handleFilterChange({...filters, search: e.target.value})} 
          />
        </div>
        <select className="filter-select" value={filters.deptId} onChange={e => handleFilterChange({...filters, deptId: e.target.value})}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={() => handleFilterChange({search: '', deptId: ''})}><Filter size={16}/> Clear Filter</button>
        <button className="btn btn-secondary" onClick={fetchAll}><RefreshCw size={16}/></button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>Email</th><th>Department</th><th>Salary</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {paginatedEmployees.map(e => (
              <tr key={e.employeeId}>
                <td>
                  <div className="employee-cell">
                    <EmployeeAvatar firstName={e.firstName} lastName={e.lastName} />
                    <span className="employee-name">{e.firstName} {e.lastName}</span>
                  </div>
                </td>
                <td><span className="employee-email">{e.email}</span></td>
                <td><Badge variant="blue">{e.departmentName}</Badge></td>
                <td>{formatSalary(e.salary)}</td>
                <td>{formatDate(e.joiningDate)}</td>
                <td>
                  <div style={{display: 'flex', gap: '4px'}}>
                    <button className="btn-icon" title="Edit" onClick={() => setModal({ show: true, type: 'edit', data: e })}><Edit2 size={16}/></button>
                    <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(e.employeeId)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && <div className="empty-state">No employees found matching filters.</div>}
      </div>

      {filtered.length > 0 && (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '13px'}}>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} employees
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <button className="btn btn-secondary" style={{height: '32px', padding: '0 10px'}} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}><ChevronLeft size={16} /> Previous</button>
            <span style={{fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)'}}>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-secondary" style={{height: '32px', padding: '0 10px'}} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next <ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {modal.show && (
        <EmployeeFormModal 
          type={modal.type} data={modal.data} departments={departments} 
          onClose={() => setModal({ show: false, type: 'add', data: null })} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default EmployeeDirectory;

