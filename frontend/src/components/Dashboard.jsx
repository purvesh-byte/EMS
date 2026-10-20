import React, { useState, useEffect } from 'react';
import { getEmployees, getDepartments } from '../services/api';

function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employees = await getEmployees();
        setTotalEmployees(employees.length);
        // Sort employees by JoiningDate in descending order and take the first 5
        const sortedEmployees = employees.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
        setRecentEmployees(sortedEmployees.slice(0, 5));

        const departments = await getDepartments();
        setTotalDepartments(departments.length);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.data?.message || err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-message">Loading dashboard...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-center">Dashboard</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        <div className="card" style={{ width: '45%', textAlign: 'center' }}>
          <h3 className="card-title">Total Employees</h3>
          <h2>{totalEmployees}</h2>
        </div>
        <div className="card" style={{ width: '45%', textAlign: 'center' }}>
          <h3 className="card-title">Total Departments</h3>
          <h2>{totalDepartments}</h2>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Employees</h3>
        {recentEmployees.length === 0 ? (
          <p>No recent employees found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map(employee => (
                  <tr key={employee.employeeId}>
                    <td>{employee.firstName} {employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.departmentName}</td>
                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
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

export default Dashboard;