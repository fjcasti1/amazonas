import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { deleteUser, listUsers } from '../actions/userActions';

const UserListPage = ({ history }) => {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.userList);
  const { userInfo } = useSelector((state) => state.userAuth);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.userDelete);

  // Initial load useEffect
  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  // Actions useEffect
  useEffect(() => {
    if (successDelete) {
      dispatch(listUsers());
    }
  }, [dispatch, successDelete]);

  const deleteHandler = (userId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <h1>Users</h1>
      </div>
      {errorDelete && <Alert>{errorDelete}</Alert>}
      {successDelete && <Alert variant='success'>User Deleted Successfully</Alert>}
      {loading || loadingDelete ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? 'YES' : 'NO'}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <button
                    type='button'
                    className='small'
                    onClick={() => history.push(`/users/${user._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='small'
                    disabled={user._id === userInfo._id}
                    onClick={() => deleteHandler(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserListPage;
