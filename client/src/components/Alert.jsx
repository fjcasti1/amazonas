import React from 'react';

const Alert = ({ variant, children }) => {
  return <div className={`alert alert-${variant || 'info'}`}>{children}</div>;
};

export default Alert;
