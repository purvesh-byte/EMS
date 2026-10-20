using EmployeeManagementSystem.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace EmployeeManagementSystem.Data
{
    public class SqlDataRepository : IDataRepository
    {
        private readonly string _connectionString;

        public SqlDataRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private async Task<SqlConnection> GetOpenConnectionAsync()
        {
            var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            var employees = new List<Employee>();
            using var connection = await GetOpenConnectionAsync();
            var sql = @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.Phone, e.Salary, e.DepartmentId, e.JoiningDate, d.DepartmentName 
                        FROM Employees e 
                        INNER JOIN Departments d ON e.DepartmentId = d.DepartmentId";
            using var command = new SqlCommand(sql, connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                employees.Add(MapToEmployee(reader));
            }
            return employees;
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.Email, e.Phone, e.Salary, e.DepartmentId, e.JoiningDate, d.DepartmentName 
                        FROM Employees e 
                        INNER JOIN Departments d ON e.DepartmentId = d.DepartmentId 
                        WHERE e.EmployeeId = @EmployeeId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@EmployeeId", id);
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToEmployee(reader);
            }
            return null;
        }

        public async Task<int> AddEmployeeAsync(Employee employee)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = @"INSERT INTO Employees (FirstName, LastName, Email, Phone, Salary, DepartmentId, JoiningDate) 
                        VALUES (@FirstName, @LastName, @Email, @Phone, @Salary, @DepartmentId, @JoiningDate); 
                        SELECT SCOPE_IDENTITY();";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@FirstName", employee.FirstName);
            command.Parameters.AddWithValue("@LastName", employee.LastName);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@Phone", (object?)employee.Phone ?? DBNull.Value);
            command.Parameters.AddWithValue("@Salary", employee.Salary);
            command.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);
            command.Parameters.AddWithValue("@JoiningDate", employee.JoiningDate == default ? DateTime.Today : employee.JoiningDate);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateEmployeeAsync(Employee employee)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = @"UPDATE Employees 
                        SET FirstName = @FirstName, 
                            LastName = @LastName, 
                            Email = @Email, 
                            Phone = @Phone, 
                            Salary = @Salary, 
                            DepartmentId = @DepartmentId 
                        WHERE EmployeeId = @EmployeeId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@FirstName", employee.FirstName);
            command.Parameters.AddWithValue("@LastName", employee.LastName);
            command.Parameters.AddWithValue("@Email", employee.Email);
            command.Parameters.AddWithValue("@Phone", (object?)employee.Phone ?? DBNull.Value);
            command.Parameters.AddWithValue("@Salary", employee.Salary);
            command.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);
            command.Parameters.AddWithValue("@EmployeeId", employee.EmployeeId);
            int rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "DELETE FROM Employees WHERE EmployeeId = @EmployeeId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@EmployeeId", id);
            int rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> EmployeeExistsAsync(int id)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT COUNT(1) FROM Employees WHERE EmployeeId = @EmployeeId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@EmployeeId", id);
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<bool> IsEmailDuplicateAsync(string email, int? employeeId = null)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT COUNT(1) FROM Employees WHERE Email = @Email" + (employeeId.HasValue ? " AND EmployeeId <> @EmployeeId" : "");
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Email", email);
            if (employeeId.HasValue)
            {
                command.Parameters.AddWithValue("@EmployeeId", employeeId.Value);
            }
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<bool> DepartmentExistsAsync(int departmentId)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT COUNT(1) FROM Departments WHERE DepartmentId = @DepartmentId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DepartmentId", departmentId);
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
        {
            var departments = new List<Department>();
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT DepartmentId, DepartmentName FROM Departments ORDER BY DepartmentId";
            using var command = new SqlCommand(sql, connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                departments.Add(MapToDepartment(reader));
            }
            return departments;
        }

        public async Task<int> AddDepartmentAsync(Department department)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = @"INSERT INTO Departments (DepartmentName) 
                        VALUES (@DepartmentName); 
                        SELECT SCOPE_IDENTITY();";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> IsDepartmentNameDuplicateAsync(string departmentName)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT COUNT(1) FROM Departments WHERE DepartmentName = @DepartmentName";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DepartmentName", departmentName);
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "DELETE FROM Departments WHERE DepartmentId = @DepartmentId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DepartmentId", id);
            return await command.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> HasEmployeesInDepartmentAsync(int departmentId)
        {
            using var connection = await GetOpenConnectionAsync();
            var sql = "SELECT COUNT(1) FROM Employees WHERE DepartmentId = @DepartmentId";
            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@DepartmentId", departmentId);
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        private static Employee MapToEmployee(SqlDataReader reader)
        {
            return new Employee
            {
                EmployeeId = reader.GetInt32(reader.GetOrdinal("EmployeeId")),
                FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                LastName = reader.GetString(reader.GetOrdinal("LastName")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? null : reader.GetString(reader.GetOrdinal("Phone")),
                Salary = reader.GetDecimal(reader.GetOrdinal("Salary")),
                DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                JoiningDate = reader.GetDateTime(reader.GetOrdinal("JoiningDate")),
                DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName"))
            };
        }

        private static Department MapToDepartment(SqlDataReader reader)
        {
            return new Department
            {
                DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName"))
            };
        }
    }
}
