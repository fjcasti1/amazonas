import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Product from './Product';
import Spinner from './Spinner';
import Alert from './Alert';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        setLoading(false);
        setProducts(res.data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert variant='danger'>{error}</Alert>
      ) : (
        <div className='row center'>
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default HomePage;
