import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
// import ProductPage from './components/ProductPage';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className='grid-container'>
          <header className='row'>
            <a className='brand' href='/'>
              amazonas
            </a>
            <div>
              <a href='/cart'>Cart</a>
              <a href='/signin'>Sign In</a>
            </div>
          </header>
          <main>
            <Route exact path='/' component={HomePage} />
            {/* <Route exact path='/product/:id' component={ProductPage} /> */}
          </main>

          <footer className='row center'>All rights reserverd</footer>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
