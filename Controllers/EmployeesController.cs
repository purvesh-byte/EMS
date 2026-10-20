using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IDataRepository _repository;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IDataRepository repository, ILogger<EmployeesController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var employees = await _repository.GetAllEmployeesAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employees.");
                return StatusCode(500, new { message = "An error occurred while retrieving employees." });
            }
        }

        // GET: api/employees/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var employee = await _repository.GetEmployeeByIdAsync(id);
                if (employee == null)
                {
                    return NotFound(new { message = $"Employee with ID {id} was not found." });
                }
                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee {EmployeeId}.", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the employee." });
            }
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var deptExists = await _repository.DepartmentExistsAsync(dto.DepartmentId);
                if (!deptExists)
                {
                    return BadRequest(new { message = $"Department with ID {dto.DepartmentId} does not exist." });
                }

                var isEmailTaken = await _repository.IsEmailDuplicateAsync(dto.Email);
                if (isEmailTaken)
                {
                    return Conflict(new { message = $"An employee with email '{dto.Email}' already exists." });
                }

                var employee = new Employee
                {
                    FirstName = dto.FirstName.Trim(),
                    LastName = dto.LastName.Trim(),
                    Email = dto.Email.Trim(),
                    Phone = dto.Phone?.Trim(),
                    Salary = dto.Salary,
                    DepartmentId = dto.DepartmentId,
                    JoiningDate = dto.JoiningDate ?? DateTime.Today
                };

                int newId = await _repository.AddEmployeeAsync(employee);
                var createdEmployee = await _repository.GetEmployeeByIdAsync(newId);

                return CreatedAtAction(nameof(GetById), new { id = newId }, createdEmployee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee.");
                return StatusCode(500, new { message = "An error occurred while creating the employee." });
            }
        }

        // PUT: api/employees/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var exists = await _repository.EmployeeExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Employee with ID {id} was not found." });
                }

                var deptExists = await _repository.DepartmentExistsAsync(dto.DepartmentId);
                if (!deptExists)
                {
                    return BadRequest(new { message = $"Department with ID {dto.DepartmentId} does not exist." });
                }

                var isEmailTaken = await _repository.IsEmailDuplicateAsync(dto.Email, id);
                if (isEmailTaken)
                {
                    return Conflict(new { message = $"An employee with email '{dto.Email}' already exists." });
                }

                var employee = new Employee
                {
                    EmployeeId = id,
                    FirstName = dto.FirstName.Trim(),
                    LastName = dto.LastName.Trim(),
                    Email = dto.Email.Trim(),
                    Phone = dto.Phone?.Trim(),
                    Salary = dto.Salary,
                    DepartmentId = dto.DepartmentId
                };

                var updated = await _repository.UpdateEmployeeAsync(employee);
                if (!updated)
                {
                    return StatusCode(500, new { message = "Failed to update the employee." });
                }

                var updatedEmployee = await _repository.GetEmployeeByIdAsync(id);
                return Ok(updatedEmployee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee {EmployeeId}.", id);
                return StatusCode(500, new { message = "An error occurred while updating the employee." });
            }
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var exists = await _repository.EmployeeExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Employee with ID {id} was not found." });
                }

                var deleted = await _repository.DeleteEmployeeAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete the employee." });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee {EmployeeId}.", id);
                return StatusCode(500, new { message = "An error occurred while deleting the employee." });
            }
        }
    }
}
