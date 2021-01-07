import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

const ProductListPage = ({ match, history }) => {
  const sellerMode = match.path.indexOf('/seller') >= 0;

  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.productList);

  const userId = useSelector((state) => state.userAuth.userInfo._id);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((state) => state.productCreate);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.productDelete);

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push(`/products/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
      dispatch({ type: PRODUCT_CREATE_RESET });
    }
    dispatch(listProducts({ seller: sellerMode ? userId : '' }));
  }, [
    dispatch,
    history,
    successCreate,
    createdProduct,
    successDelete,
    sellerMode,
    userId,
  ]);

  const deleteHandler = (productId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(productId));
    }
  };

  return (
    <div>
      <div className='row'>
        <h1>Products</h1>
        <button className='primary' onClick={() => dispatch(createProduct())}>
          Create Product
        </button>
      </div>
      {loadingCreate || (loadingDelete && <Spinner />)}
      {errorCreate && <Alert>{errorCreate}</Alert>}
      {errorDelete && <Alert>{errorDelete}</Alert>}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type='button'
                    className='small'
                    onClick={() => history.push(`/products/${product._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='small'
                    onClick={() => deleteHandler(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListPage;
