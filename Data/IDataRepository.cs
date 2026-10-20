using EmployeeManagementSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmployeeManagementSystem.Data
{
    public interface IDataRepository
    {
        // Employee Operations
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<int> AddEmployeeAsync(Employee employee);
        Task<bool> UpdateEmployeeAsync(Employee employee);
        Task<bool> DeleteEmployeeAsync(int id);
        Task<bool> EmployeeExistsAsync(int id);
        Task<bool> IsEmailDuplicateAsync(string email, int? employeeId = null);
        Task<bool> DepartmentExistsAsync(int departmentId);

        // Department Operations
        Task<IEnumerable<Department>> GetAllDepartmentsAsync();
        Task<int> AddDepartmentAsync(Department department);
        Task<bool> IsDepartmentNameDuplicateAsync(string departmentName);
        Task<bool> DeleteDepartmentAsync(int id);
        Task<bool> HasEmployeesInDepartmentAsync(int departmentId);
    }
}