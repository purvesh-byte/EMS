import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../services/api';
import EmployeeFormFields from './EmployeeFormFields';

const EmployeeForm = ({ employeeToEdit, departments, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    salary: '',
    departmentId: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName || '',
        lastName: employeeToEdit.lastName || '',
        email: employeeToEdit.email || '',
        phone: employeeToEdit.phone || '',
        salary: employeeToEdit.salary !== undefined ? employeeToEdit.salary.toString() : '',
        departmentId: employeeToEdit.departmentId || '',
        joiningDate: employeeToEdit.joiningDate
          ? new Date(employeeToEdit.joiningDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [employeeToEdit]);

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Invalid email format.';
    }
    const numSalary = parseFloat(formData.salary);
    if (formData.salary === '' || isNaN(numSalary) || numSalary < 0) {
      errors.salary = 'Salary must be a non-negative number.';
    }
    if (!formData.departmentId) errors.departmentId = 'Department is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFormErrors({});

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        salary: parseFloat(formData.salary),
        departmentId: parseInt(formData.departmentId, 10),
      };

      if (employeeToEdit) {
        await updateEmployee(employeeToEdit.employeeId, payload);
      } else {
        payload.joiningDate = formData.joiningDate
          ? new Date(formData.joiningDate).toISOString()
          : new Date().toISOString();
        await createEmployee(payload);
      }
      onSave();
    } catch (err) {
      if (err.status === 400) {
        const backendErrors = err.data?.errors || {};
        const newErrors = {};
        for (const key in backendErrors) {
          if (backendErrors[key]?.length > 0) {
            newErrors[key.charAt(0).toLowerCase() + key.slice(1)] = backendErrors[key][0];
          }
        }
        if (err.data?.message) newErrors.general = err.data.message;
        setFormErrors(newErrors);
      } else if (err.status === 409) {
        setFormErrors({ email: err.data?.message || 'Email already exists.' });
      } else {
        setFormErrors({ general: err.data?.message || err.message || 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formErrors.general && <div className="error-message">{formErrors.general}</div>}

      <EmployeeFormFields
        formData={formData}
        formErrors={formErrors}
        departments={departments}
        employeeToEdit={employeeToEdit}
        onChange={handleChange}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : employeeToEdit ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
