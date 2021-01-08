import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './Alert';
import Spinner from './Spinner';
import { closeSideBar } from '../actions/layoutActions';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const dispatch = useDispatch();

  const { sidebar } = useSelector((state) => state.layout);
  const { loading, error, categories } = useSelector(
    (state) => state.productCategoryList,
  );

  return (
    <aside className={sidebar ? 'open' : 'close'}>
      <ul className='categories'>
        <li>
          <strong>Categories</strong>
          <button
            className='close-sidebar'
            type='button'
            onClick={() => {
              dispatch(closeSideBar());
            }}
          >
            <i className='fa fa-times'></i>
          </button>
        </li>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          categories.map((cat) => (
            <li key={cat}>
              <Link
                to={{
                  pathname: '/search',
                  search: `category=${cat}`,
                }}
                onClick={() => dispatch(closeSideBar())}
              >
                {cat}
              </Link>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
