import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment } from '../services/api';

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError(err.data?.message || err.message || "An error occurred while fetching departments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!newDepartmentName.trim()) {
      setFormError("Department name cannot be empty.");
      return;
    }

    try {
      await createDepartment({ departmentName: newDepartmentName.trim() });
      setSuccessMessage("Department added successfully!");
      setNewDepartmentName('');
      fetchDepartments(); // Refresh list
    } catch (err) {
      console.error("Failed to create department:", err);
      if (err.status === 409) {
        setFormError(err.data?.message || "A department with this name already exists.");
      } else if (err.status === 400) {
        // Handle validation errors from backend if any, though our DTO is simple
        setFormError(err.data?.errors?.DepartmentName?.[0] || err.data?.message || "Invalid department data.");
      } else {
        setFormError(err.data?.message || err.message || "An unexpected error occurred.");
      }
    }
  };

  if (loading) return <div className="loading-message">Loading departments...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-center">Department Management</h2>

      <div className="card">
        <h3 className="card-title">Add New Department</h3>
        <form onSubmit={handleAddDepartment}>
          <div className="form-group">
            <label htmlFor="newDepartmentName">Department Name</label>
            <input
              type="text"
              id="newDepartmentName"
              className="form-control"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              required
            />
          </div>
          {formError && <div className="error-message">{formError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <button type="submit" className="btn btn-primary">Add Department</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3 className="card-title">All Departments</h3>
        {departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.departmentId}>
                    <td>{dept.departmentId}</td>
                    <td>{dept.departmentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentManagement;