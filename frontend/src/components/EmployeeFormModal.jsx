import React, { useState } from 'react';
import Modal from '../components/Modal';

const EmployeeFormModal = ({ type, data, departments, onClose, onSave }) => {
  const [form, setForm] = useState(data || { 
    firstName: '', lastName: '', email: '', phone: '', 
    departmentId: '', salary: '', 
    joiningDate: new Date().toISOString().split('T')[0] 
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'Required';
    if (!form.lastName) newErrors.lastName = 'Required';
    if (!form.email) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.departmentId) newErrors.departmentId = 'Required';
    if (!form.salary || form.salary <= 0) newErrors.salary = 'Must be > 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <Modal 
      title={type === 'add' ? 'Add Employee' : 'Edit Employee'} 
      onClose={onClose} 
      footer={(
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Employee</button>
        </>
      )}
    >
      <div className="form-grid">
        <div className="form-section-title">Personal Information</div>
        <div className="form-group">
          <label className="form-label">First Name <span className="required">*</span></label>
          <input className={`form-control ${errors.firstName ? 'has-error' : ''}`} value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          {errors.firstName && <span className="field-error-text">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Last Name <span className="required">*</span></label>
          <input className={`form-control ${errors.lastName ? 'has-error' : ''}`} value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Email <span className="required">*</span></label>
          <input className={`form-control ${errors.email ? 'has-error' : ''}`} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div className="form-section-title">Employment Information</div>
        <div className="form-group">
          <label className="form-label">Department <span className="required">*</span></label>
          <select className={`form-control ${errors.departmentId ? 'has-error' : ''}`} value={form.departmentId} onChange={e => setForm({...form, departmentId: parseInt(e.target.value)})}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Salary (₹) <span className="required">*</span></label>
          <input type="number" className={`form-control ${errors.salary ? 'has-error' : ''}`} value={form.salary} onChange={e => setForm({...form, salary: parseFloat(e.target.value)})} />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Joining Date</label>
          <input type="date" className="form-control" value={form.joiningDate?.split('T')[0]} onChange={e => setForm({...form, joiningDate: e.target.value})} />
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeFormModal;
