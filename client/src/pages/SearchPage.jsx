import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Alert from '../components/Alert';
import Product from '../components/Product';
import Spinner from '../components/Spinner';

const SearchPage = () => {
  const dispatch = useDispatch();
  // const name = match.params.name || 'all';
  const { name = '' } = useParams();

  const { loading, error, products } = useSelector((state) => state.productList);

  useEffect(() => {
    dispatch(listProducts({ name }));
  }, [dispatch, name]);

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert>{error}</Alert>
  ) : (
    <Fragment>
      <div className='row top'>
        <div className='col-1'>
          <div>{products.length} Results</div>
          <h3>Department</h3>
          <ul>
            <li>Category 1</li>
          </ul>
        </div>
        <div className='col-3'>
          <div className='row center'>
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchPage;
