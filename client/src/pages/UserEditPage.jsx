import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/userActions';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditPage = ({ match, history }) => {
  const dispatch = useDispatch();

  const userId = match.params.id;
  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dispatch(getUserDetails(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/userlist');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsSeller(user.isSeller);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, history, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        isSeller,
        isAdmin,
      }),
    );
  };

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>Edit User {name}</h1>
        </div>
        {successUpdate && <Alert variant='success'>User Updated Successfully</Alert>}
        {errorUpdate && <Alert>{errorUpdate}</Alert>}
        {loadingUpdate && <Spinner />}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <Fragment>
            <div>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                placeholder='Enter name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                placeholder='Enter email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type='checkbox'
                id='isSeller'
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
              <label htmlFor='isSeller'>Is Seller</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='isAdmin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor='isSeller'>Is Admin</label>
            </div>

            <div>
              <label />
              <button className='primary' type='submit' onClick={submitHandler}>
                Update
              </button>
            </div>
          </Fragment>
        )}
      </form>
    </div>
  );
};

export default UserEditPage;
