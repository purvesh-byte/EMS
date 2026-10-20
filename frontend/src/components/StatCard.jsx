import React from 'react';

const StatCard = ({ label, value, icon: Icon, subtext, variant = 'blue' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon-wrapper ${variant}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
};

export default StatCard;
