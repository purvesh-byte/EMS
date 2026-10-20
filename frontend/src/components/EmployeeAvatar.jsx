import React from 'react';

const EmployeeAvatar = ({ firstName, lastName, size = 34 }) => {
  const getInitials = () => {
    const f = firstName ? firstName.charAt(0) : '';
    const l = lastName ? lastName.charAt(0) : '';
    return (f + l).toUpperCase() || '?';
  };

  return (
    <div 
      className="avatar-circle" 
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {getInitials()}
    </div>
  );
};

export default EmployeeAvatar;
