import React from 'react';

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  departments,
  onAddClick,
}) => (
  <div className="card">
    <h3 className="card-title">Search & Filter</h3>
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
        <label htmlFor="search">Search Name / Email</label>
        <input
          type="text"
          id="search"
          className="form-control"
          placeholder="e.g. John or john@example.com"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
        <label htmlFor="filterDept">Department</label>
        <select
          id="filterDept"
          className="form-control"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginBottom: 0 }}
        onClick={onAddClick}
      >
        + Add Employee
      </button>
    </div>
  </div>
);

export default FilterBar;