import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className='row'>
      <Link className='brand' to='/'>
        amazonas
      </Link>
      <div>
        <Link to='/cart'>Cart</Link>
        {cartItems.length > 0 && <span className='badge'>{cartItems.length}</span>}
        {userInfo ? (
          <div className='dropdown'>
            <Link to='#'>
              {userInfo.name} <i className='fa fa-caret-down'></i>{' '}
            </Link>
            <ul className='dropdown-content'>
              <li>
                <Link to='/profile'>Edit Profile</Link>
              </li>
              <li>
                <Link to='/orderhistory'>My Orders</Link>
              </li>
              <li>
                <Link to='#logout' onClick={logoutHandler}>
                  Sign Out
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <Link to='/login'>Sign In</Link>
        )}
        {userInfo && userInfo.isAdmin && (
          <div className='dropdown'>
            <Link to='#'>
              Admin <i className='fa fa-caret-down'></i>{' '}
            </Link>
            <ul className='dropdown-content'>
              <li>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
              <li>
                <Link to='/productlist'>Products</Link>
              </li>
              <li>
                <Link to='/orderlist'>Orders</Link>
              </li>
              <li>
                <Link to='/userlist'>Users</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
