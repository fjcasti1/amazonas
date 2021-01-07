import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { getUserDetails } from '../actions/userActions';
import Alert from '../components/Alert';
import Product from '../components/Product';
import Rating from '../components/Rating';
import Spinner from '../components/Spinner';

const SellerPage = ({ match }) => {
  const dispatch = useDispatch();

  const sellerId = match.params.id;

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: loadingProducts, error: errorProducts, products } = useSelector(
    (state) => state.productList,
  );

  useEffect(() => {
    dispatch(getUserDetails(sellerId));
    dispatch(listProducts({ seller: sellerId }));
  }, [dispatch, sellerId]);

  return (
    <div className='row top'>
      <div className='col-1'>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert variant='danger'>{error}</Alert>
        ) : (
          <ul className='card card-body'>
            <li>
              <div className='row start'>
                <img
                  className='small p-1'
                  src={user.seller.logo}
                  alt={user.seller.name}
                />
                <h1 className='p-1'>{user.seller.name}</h1>
              </div>
            </li>
            <li>
              <Rating rating={user.seller.rating} numReviews={user.seller.numReviews} />
            </li>
            <li>
              <a href={`mailto:${user.email}`}>Contact Seller</a>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      <div className='col-3'>
        {loadingProducts ? (
          <Spinner />
        ) : errorProducts ? (
          <Alert variant='danger'>{errorProducts}</Alert>
        ) : products.length === 0 ? (
          <Alert variant='info'>No Products Found</Alert>
        ) : (
          <div className='row center'>
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;
