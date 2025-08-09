import React from 'react';

const StatsCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`stats-card-component ${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard; 