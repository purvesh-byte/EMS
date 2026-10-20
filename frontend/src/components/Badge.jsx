import React from 'react';

const Badge = ({ children, variant = 'gray' }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'blue': return 'badge-blue';
      case 'violet': return 'badge-violet';
      case 'green': return 'badge-green';
      default: return 'badge-gray';
    }
  };

  return (
    <span className={`badge ${getVariantClass()}`}>
      {children}
    </span>
  );
};

export default Badge;
