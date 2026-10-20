import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Overview from './pages/Overview';
import EmployeeDirectory from './pages/EmployeeDirectory';
import DepartmentDirectory from './pages/DepartmentDirectory';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/departments" element={<DepartmentDirectory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
