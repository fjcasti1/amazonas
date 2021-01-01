import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.userLogin.userInfo);

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
              <Link to='#'>{userInfo.name}</Link>
            ) : (
              <Link to='/login'>Sign In</Link>
            )}
          </div>
        </header>
        <main>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/products/:id' component={ProductPage} />
          <Route exact path='/cart/:id?' component={CartPage} />
          <Route exact path='/login' component={LoginPage} />
        </main>

        <footer className='row center'>All rights reserverd</footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
