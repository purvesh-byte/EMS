import React, { useState, useEffect } from 'react';
import { Users, Building2, UserPlus, Calendar, ArrowRight, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import EmployeeAvatar from '../components/EmployeeAvatar';
import Badge from '../components/Badge';
import { getEmployees, getDepartments } from '../services/api';
import { Link } from 'react-router-dom';

const Overview = () => {
  const [data, setData] = useState({ employees: [], departments: [], loading: true });

  useEffect(() => {
    Promise.all([getEmployees(), getDepartments()])
      .then(([emp, dept]) => setData({ employees: emp || [], departments: dept || [], loading: false }))
      .catch(() => setData(s => ({ ...s, loading: false })));
  }, []);

  if (data.loading) return <div className="spinner-container"><div className="spinner"></div><span>Loading...</span></div>;

  const { employees, departments } = data;
  const deptStats = departments.map(d => ({ ...d, count: employees.filter(e => e.departmentId === d.departmentId).length }))
    .map(d => ({ ...d, percentage: employees.length > 0 ? (d.count / employees.length) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);

  const recentJoiners = [...employees].sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Overview</h1><p className="page-subtitle">Monitor employee records and organizational info.</p></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Total Employees" value={employees.length} icon={Users} subtext="Active members" variant="blue" />
        <StatCard label="Total Departments" value={departments.length} icon={Building2} subtext="Operational units" variant="violet" />
        <StatCard label="Avg Dept Size" value={departments.length > 0 ? (employees.length / departments.length).toFixed(1) : 0} icon={Briefcase} subtext="Emps per dept" variant="green" />
        <StatCard label="New Joiners" value={employees.filter(e => new Date(e.joiningDate) > new Date(Date.now() - 30 * 86400000)).length} icon={TrendingUp} subtext="Last 30 days" variant="navy" />
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><h2 className="card-title">Recent Joiners</h2><Link to="/employees" className="btn btn-secondary" style={{height:'30px'}}>View All</Link></div>
          <div className="table-container"><table className="data-table">
            <thead><tr><th>Employee</th><th>Email</th><th>Department</th><th>Joining Date</th><th>Action</th></tr></thead>
            <tbody>{recentJoiners.map(e => (
              <tr key={e.employeeId}>
                <td><div className="employee-cell"><EmployeeAvatar firstName={e.firstName} lastName={e.lastName} /><span className="employee-name">{e.firstName} {e.lastName}</span></div></td>
                <td><span className="employee-email">{e.email}</span></td>
                <td><Badge variant="blue">{e.departmentName}</Badge></td>
                <td>{new Date(e.joiningDate).toLocaleDateString()}</td>
                <td><Link to="/employees" className="btn-icon"><ArrowRight size={16} /></Link></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
        <div className="right-column">
          <div className="card"><div className="card-header"><h2 className="card-title">Quick Actions</h2></div>
            <div className="quick-actions-grid">
              <Link to="/employees" className="quick-action-item"><div style={{display:'flex',alignItems:'center',gap:'10px'}}><UserPlus size={18}/><span>Add Employee</span></div><ChevronRight size={16}/></Link>
              <Link to="/departments" className="quick-action-item"><div style={{display:'flex',alignItems:'center',gap:'10px'}}><Building2 size={18}/><span>Manage Depts</span></div><ChevronRight size={16}/></Link>
            </div>
          </div>
          <div className="card"><div className="card-header"><h2 className="card-title">Dept Distribution</h2></div>
            <div className="dept-bar-container">{deptStats.map(d => (
              <div className="dept-bar-row" key={d.departmentId}>
                <div className="dept-bar-header">
                  <span className="dept-bar-name">{d.departmentName}</span>
                  <span className="dept-bar-count">{d.count} {d.count === 1 ? 'employee' : 'employees'}</span>
                </div>
                <div className="dept-bar-track">
                  <div className="dept-bar-fill" style={{width:`${d.percentage}%`}}></div>
                </div>
              </div>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Overview;
