using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [Required]
        [Range(0, 99999999.99)]
        public decimal Salary { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public DateTime JoiningDate { get; set; }

        // Navigation / joined property for Department name
        public string? DepartmentName { get; set; }
    }
}
