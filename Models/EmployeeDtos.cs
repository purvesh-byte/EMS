using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.Models
{
    public class CreateEmployeeDto
    {
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters.")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Salary is required.")]
        [Range(0, 99999999.99, ErrorMessage = "Salary must be non-negative and fit within DECIMAL(10,2).")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "DepartmentId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "DepartmentId must be a valid positive integer.")]
        public int DepartmentId { get; set; }

        public DateTime? JoiningDate { get; set; }
    }

    public class UpdateEmployeeDto
    {
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters.")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Salary is required.")]
        [Range(0, 99999999.99, ErrorMessage = "Salary must be non-negative and fit within DECIMAL(10,2).")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "DepartmentId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "DepartmentId must be a valid positive integer.")]
        public int DepartmentId { get; set; }
    }
}
