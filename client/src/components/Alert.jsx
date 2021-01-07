import React from 'react';

const Alert = ({ variant = 'danger', children }) => {
  return <div className={`alert alert-${variant}`}>{children}</div>;
};

export default Alert;
