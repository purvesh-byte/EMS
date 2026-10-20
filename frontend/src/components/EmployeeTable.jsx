import React from 'react';
import { formatSalary } from '../utils/formatters';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (employees.length === 0) {
    return <p>No employees found matching your criteria.</p>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Department</th>
            <th>Joining Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employeeId}>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.phone || 'N/A'}</td>
              <td>{formatSalary(employee.salary)}</td>
              <td>{employee.departmentName}</td>
              <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.9em' }}
                  onClick={() => onEdit(employee)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ marginLeft: '10px', padding: '6px 12px', fontSize: '0.9em' }}
                  onClick={() => onDelete(employee)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;