import React from 'react';

const Spacer = ({ text = 'or' }) => {
  return (
    <div className='spacer'>
      <hr className='spacer-hr' />
      <p className='normal spacer-text text-muted'>{text}</p>
      <hr className='spacer-hr' />
    </div>
  );
};

export default Spacer;
