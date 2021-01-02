import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { logout } from './actions/userActions';
import ShippingAddressPage from './pages/ShippingAddressPage';

const App = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <BrowserRouter>
      <div className='grid-container'>
        <header className='row'>
          <Link className='brand' to='/'>
            amazonas
          </Link>
          <div>
            <Link to='/cart'>Cart</Link>
            {cartItems.length > 0 && (
              <span className='badge'>{cartItems.length}</span>
            )}
            {userInfo ? (
              <div className='dropdown'>
                <Link to='#'>
                  {userInfo.name} <i className='fa fa-caret-down'></i>{' '}
                </Link>
                <ul className='dropdown-content'>
                  <Link to='#logout' onClick={logoutHandler}>
                    Sign Out
                  </Link>
                </ul>
              </div>
            ) : (
              <Link to='/login'>Sign In</Link>
            )}
          </div>
        </header>
        <main>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/products/:id' component={ProductPage} />
          <Route exact path='/cart/:id?' component={CartPage} />
          <Route exact path='/shipping' component={ShippingAddressPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </main>

        <footer className='row center'>All rights reserverd</footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
