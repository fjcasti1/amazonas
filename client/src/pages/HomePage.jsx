import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

import { listProducts } from '../actions/productActions';

const HomePage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts({}));
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
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
