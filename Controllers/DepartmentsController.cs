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
    public class DepartmentsController : ControllerBase
    {
        private readonly IDataRepository _repository;
        private readonly ILogger<DepartmentsController> _logger;

        public DepartmentsController(IDataRepository repository, ILogger<DepartmentsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/departments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var departments = await _repository.GetAllDepartmentsAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving departments.");
                return StatusCode(500, new { message = "An error occurred while retrieving departments." });
            }
        }

        // POST: api/departments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var trimmedName = dto.DepartmentName.Trim();

                var isTaken = await _repository.IsDepartmentNameDuplicateAsync(trimmedName);
                if (isTaken)
                {
                    return Conflict(new { message = $"A department named '{trimmedName}' already exists." });
                }

                var dept = new Department
                {
                    DepartmentName = trimmedName
                };

                int newId = await _repository.AddDepartmentAsync(dept);
                dept.DepartmentId = newId;

                return StatusCode(201, dept);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating department.");
                return StatusCode(500, new { message = "An error occurred while creating the department." });
            }
        }

        // DELETE: api/departments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var departmentExists = await _repository.DepartmentExistsAsync(id);
                if (!departmentExists)
                {
                    return NotFound(new { message = $"Department with ID {id} not found." });
                }

                var hasEmployees = await _repository.HasEmployeesInDepartmentAsync(id);
                if (hasEmployees)
                {
                    return Conflict(new { message = "Cannot delete department with assigned employees." });
                }

                var deleted = await _repository.DeleteDepartmentAsync(id);
                if (!deleted)
                {
                    // This case might be hit if DepartmentExistsAsync returned true but DeleteDepartmentAsync somehow failed
                    return StatusCode(500, new { message = $"Failed to delete department with ID {id}." });
                }

                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting department with ID {id}.");
                return StatusCode(500, new { message = $"An error occurred while deleting department with ID {id}." });
            }
        }
    }
}
