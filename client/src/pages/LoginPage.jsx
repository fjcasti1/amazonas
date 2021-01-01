import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../actions/userActions';

const LoginPage = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        <div>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            placeholder='Enter email'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label />
          <button className='primary' type='submit'>
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            New customer? {'  '} <Link to='/register'>Create an aacount</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
