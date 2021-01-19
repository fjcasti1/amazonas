import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { listProducts } from '../actions/productActions';
import { listTopSellers } from '../actions/userActions';

const HomePage = ({ history }) => {
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.productList);
  const { loading: loadingSellers, error: errorSellers, users: sellers } = useSelector(
    (state) => state.userTopSellersList,
  );

  useEffect(() => {
    dispatch(listProducts({}));
    dispatch(listTopSellers());
  }, [dispatch]);

  return (
    <Fragment>
      <h2>Top Sellers</h2>
      {loadingSellers ? (
        <Spinner />
      ) : errorSellers ? (
        <Alert>{errorSellers}</Alert>
      ) : sellers.length === 0 ? (
        <Alert variant='info'>No Sellers Found</Alert>
      ) : (
        <Carousel showArrows autoPlay infiniteLoop showThumbs={false}>
          {sellers.map((seller) => (
            <img key={seller._id} src={seller.seller.logo} alt={seller.seller.name} />
          ))}
        </Carousel>
      )}
      <h2>Featured Products</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : products.length === 0 ? (
        <Alert variant='info'>No Sellers Found</Alert>
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
