import React from 'react';

const Alert = ({ message, type }) => {
  const alertClasses = `alert alert-${type}`; // Dynamic class based on type

  return (
    <div className={alertClasses} role="alert">
      {message}
    </div>
  );
};

export default Alert;