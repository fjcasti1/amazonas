import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Alert from '../components/Alert';
import Product from '../components/Product';
import Spinner from '../components/Spinner';

const SearchPage = () => {
  const dispatch = useDispatch();
  const { name = '', category = '' } = useParams();

  const { loading, error, products } = useSelector((state) => state.productList);
  const { loading: loadingCategory, error: errorCategory, categories } = useSelector(
    (state) => state.productCategoryList,
  );

  useEffect(() => {
    dispatch(listProducts({ name, category }));
  }, [dispatch, name, category]);

  const getFilterUrl = (filter) => {
    console.log(filter);
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}`;
  };

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
          {loadingCategory ? (
            <Spinner />
          ) : errorCategory ? (
            <Alert>{errorCategory}</Alert>
          ) : (
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    className={cat === category ? 'active' : ''}
                    to={getFilterUrl({ category: cat })}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
