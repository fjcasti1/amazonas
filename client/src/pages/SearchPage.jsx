import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Alert from '../components/Alert';
import Product from '../components/Product';
import Spinner from '../components/Spinner';
import { getSearchQuery } from '../utils/functions';
import { prices } from '../utils/priceLevels';
import queryString from 'query-string';
import { ratings } from '../utils/ratingLevels';
import Rating from '../components/Rating';

const SearchPage = ({ history, location }) => {
  const dispatch = useDispatch();

  const searchParams = queryString.parse(location.search);
  const { name, category, min, max, rating, order } = searchParams;

  const { loading, error, products } = useSelector((state) => state.productList);
  const { loading: loadingCategory, error: errorCategory, categories } = useSelector(
    (state) => state.productCategoryList,
  );

  useEffect(() => {
    dispatch(listProducts({ name, category, min, max, rating, order }));
  }, [dispatch, name, category, min, max, rating, order]);

  const selectMenuHandler = (order) => {
    const searchQuery = getSearchQuery({ order }, searchParams);
    history.push(`/search?${searchQuery}`);
  };

  return (
    <div className='filter-menu'>
      <div className='row'>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <Fragment>
            {products && products.length === 0 && (
              <Alert variant='info'>No Products Found</Alert>
            )}
            {products && products.length !== 0 && (
              <h1 className='m-0'>
                {products.length} Result{products.length > 1 && <span>s</span>}
              </h1>
            )}
          </Fragment>
        )}
        <div>
          Sort by{' '}
          <select value={order} onChange={(e) => selectMenuHandler(e.target.value)}>
            <option value='newest'>Newest Arrivals</option>
            <option value='lowest'>Price: Low to High</option>
            <option value='highest'>Price: High to Low</option>
            <option value='rating'>Avg. Customer Review</option>
          </select>
        </div>
      </div>
      <div className='row top'>
        <div className='col-1'>
          <div>
            <h1 className='m-0'>Department</h1>
            {loadingCategory ? (
              <Spinner />
            ) : errorCategory ? (
              <Alert>{errorCategory}</Alert>
            ) : (
              <ul>
                <li className='filter-option'>
                  <Link
                    className={'any' === category ? 'active' : ''}
                    to={{
                      pathname: '/search',
                      search: getSearchQuery({ category: 'any' }, searchParams),
                    }}
                  >
                    Any
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat} className='filter-option'>
                    <Link
                      className={cat === category ? 'active' : ''}
                      to={{
                        pathname: '/search',
                        search: getSearchQuery({ category: cat }, searchParams),
                      }}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h1 className='m-0'>Price</h1>
            <ul>
              {prices.map((price) => (
                <li key={price.range} className='filter-option'>
                  <Link
                    to={{
                      pathname: '/search',
                      search: getSearchQuery(
                        { min: price.min, max: price.max },
                        searchParams,
                      ),
                    }}
                    className={
                      `${price.min}-${price.max}` === `${min}-${max}` ? 'active' : ''
                    }
                  >
                    {price.range}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className='m-0'>Avg. Customer Review </h1>
            <ul>
              {ratings.map((rat) => (
                <li key={rat.rating}>
                  <Link
                    to={{
                      pathname: '/search',
                      search: getSearchQuery({ rating: rat.rating }, searchParams),
                    }}
                    className={`${rat.rating}` === `${rating}` ? 'active' : ''}
                  >
                    <Rating rating={rat.rating} caption={' & Up'} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='col-3'>
          {error && <Alert>{error}</Alert>}
          <div className='row center'>
            {products && products.length === 0 && (
              <img src='/img/noProductFound.png' alt='no product' />
            )}
            {products &&
              products.map((product) => <Product key={product._id} product={product} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchPage;
