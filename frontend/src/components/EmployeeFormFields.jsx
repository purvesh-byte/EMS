import React from 'react';
import FormField from './FormField';

export const EmployeeFormFields = ({
  formData,
  formErrors,
  departments,
  employeeToEdit,
  onChange,
}) => {
  return (
    <>
      <FormField label="First Name *" id="firstName" error={formErrors.firstName}>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className="form-control"
          value={formData.firstName}
          onChange={onChange}
          required
        />
      </FormField>

      <FormField label="Last Name *" id="lastName" error={formErrors.lastName}>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="form-control"
          value={formData.lastName}
          onChange={onChange}
          required
        />
      </FormField>

      <FormField label="Email *" id="email" error={formErrors.email}>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={onChange}
          required
        />
      </FormField>

      <FormField label="Phone" id="phone">
        <input
          type="text"
          id="phone"
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={onChange}
        />
      </FormField>

      <FormField label="Salary (₹) *" id="salary" error={formErrors.salary}>
        <input
          type="number"
          id="salary"
          name="salary"
          className="form-control"
          value={formData.salary}
          onChange={onChange}
          step="0.01"
          min="0"
          required
        />
      </FormField>

      <FormField label="Department *" id="departmentId" error={formErrors.departmentId}>
        <select
          id="departmentId"
          name="departmentId"
          className="form-control"
          value={formData.departmentId}
          onChange={onChange}
          required
        >
          <option value="">Select a Department</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentName}
            </option>
          ))}
        </select>
      </FormField>

      {!employeeToEdit && (
        <FormField label="Joining Date *" id="joiningDate">
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            className="form-control"
            value={formData.joiningDate}
            onChange={onChange}
            required
          />
        </FormField>
      )}
    </>
  );
};

export default EmployeeFormFields;