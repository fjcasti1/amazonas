import React, { useState } from 'react';

const SearchBox = ({ history }) => {
  const [name, setName] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    history.push(`/search/name/${name}`);
    setName('');
  };

  return (
    <form className='search' onSubmit={submitHandler}>
      <div className='row'>
        <input
          type='text'
          name='q'
          id='q'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className='primary' type='submit'>
          <i className='fa fa-search'></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
