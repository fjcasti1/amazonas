import React from 'react';

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <div className='row center checkout-steps'>
      <div className={step1 ? 'active' : ''}>Sign In</div>
      <div className={step2 ? 'active' : ''}>Shipping Address</div>
      <div className={step3 ? 'active' : ''}>Pay & Order</div>
    </div>
  );
};

export default CheckoutSteps;
