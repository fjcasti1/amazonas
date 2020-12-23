import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import CartPage from './components/CartPage';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';

const App = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

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
            <Link to='/signin'>Sign In</Link>
          </div>
        </header>
        <main>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/products/:id' component={ProductPage} />
          <Route exact path='/cart/:id?' component={CartPage} />
        </main>

        <footer className='row center'>All rights reserverd</footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
