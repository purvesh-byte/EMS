export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5207';

export const fetchData = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData = { message: `HTTP error! status: ${response.status}` };
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch (e) {
      console.error("Error parsing error response:", e);
    }
    throw { status: response.status, data: errorData };
  }

  if (response.status === 204) {
    return null;
  }
  return await response.json();
};

// Specific API functions
export const getEmployees = () => fetchData('/api/employees');
export const getEmployeeById = (id) => fetchData(`/api/employees/${id}`);
export const createEmployee = (employee) => fetchData('/api/employees', { method: 'POST', body: JSON.stringify(employee) });
export const updateEmployee = (id, employee) => fetchData(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(employee) });
export const deleteEmployee = (id) => fetchData(`/api/employees/${id}`, { method: 'DELETE' });

export const getDepartments = () => fetchData('/api/departments');
export const createDepartment = (department) => fetchData('/api/departments', { method: 'POST', body: JSON.stringify(department) });
export const deleteDepartment = (id) => fetchData(`/api/departments/${id}`, { method: 'DELETE' });