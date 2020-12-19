import React from 'react';
import data from './data';
import Product from './Product';

const App = () => {
  return (
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
        <div className='row center'>
          {data.products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </main>

      <footer className='row center'>All rights reserverd</footer>
    </div>
  );
};

export default App;
