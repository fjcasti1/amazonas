import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { listUsers } from '../actions/userActions';

const UserListPage = ({ history }) => {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.userList);

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const deleteHandler = (productId) => {
    console.log('delete');
  };

  return (
    <div>
      <div className='row'>
        <h1>Users</h1>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert variant='danger'>{error}</Alert>
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
