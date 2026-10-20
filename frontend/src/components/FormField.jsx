import React from 'react';

const FormField = ({ label, id, error, children }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    {children}
    {error && <div className="error-message">{error}</div>}
  </div>
);

export default FormField;