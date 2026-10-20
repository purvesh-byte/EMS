import React, { useState, useEffect } from 'react';
import { getEmployees, getDepartments, deleteEmployee } from '../services/api';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';
import FilterBar from './FilterBar';
import Modal from './Modal';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empData, deptData] = await Promise.all([getEmployees(), getDepartments()]);
      setEmployees(empData);
      setDepartments(deptData);
    } catch (err) {
      setError(err.data?.message || err.message || 'Error loading employee data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEmployeeToEdit(null);
    setShowFormModal(true);
    setSuccessMessage(null);
  };

  const handleEditClick = (employee) => {
    setEmployeeToEdit(employee);
    setShowFormModal(true);
    setSuccessMessage(null);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
    setSuccessMessage(null);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete.employeeId);
      setSuccessMessage(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} deleted successfully.`);
      fetchData();
    } catch (err) {
      setError(err.data?.message || err.message || 'Error deleting employee.');
    } finally {
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  const handleFormSave = () => {
    setShowFormModal(false);
    setSuccessMessage(employeeToEdit ? 'Employee updated successfully!' : 'Employee added successfully!');
    setEmployeeToEdit(null);
    fetchData();
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(searchLower) || emp.email.toLowerCase().includes(searchLower);
    const matchesDept = filterDepartment === '' || emp.departmentId === parseInt(filterDepartment, 10);
    return matchesSearch && matchesDept;
  });

  if (loading) return <div className="loading-message">Loading employee data...</div>;

  return (
    <div>
      <h2 className="text-center" style={{ marginBottom: '20px' }}>Employee Management</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        departments={departments}
        onAddClick={handleAddClick}
      />

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 className="card-title">Employees ({filteredEmployees.length})</h3>
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {showFormModal && (
        <Modal
          title={employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
          onClose={() => setShowFormModal(false)}
        >
          <EmployeeForm
            employeeToEdit={employeeToEdit}
            departments={departments}
            onSave={handleFormSave}
            onCancel={() => setShowFormModal(false)}
          />
        </Modal>
      )}

      {showDeleteConfirm && employeeToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setShowDeleteConfirm(false)}>
          <p>
            Are you sure you want to delete employee{' '}
            <strong>{employeeToDelete.firstName} {employeeToDelete.lastName}</strong> ({employeeToDelete.email})?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>
              Delete Employee
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default EmployeeManagement;