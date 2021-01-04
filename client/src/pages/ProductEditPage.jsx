import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct } from '../actions/productActions';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ProductEditPage = ({ match }) => {
  const dispatch = useDispatch();
  const productId = match.params.id;

  const { loading, error, product } = useSelector((state) => state.productDetails);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }
  }, [dispatch, product, productId]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {productId}</h1>
        </div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert variant='danger'>{error}</Alert>
        ) : (
          <Fragment>
            <div>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                placeholder='Enter name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='price'>Price</label>
              <input
                type='text'
                id='price'
                placeholder='Enter price'
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='image'>Image</label>
              <input
                type='text'
                id='image'
                placeholder='Enter image'
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='category'>Category</label>
              <input
                type='text'
                id='category'
                placeholder='Enter category'
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='countInStock'>Count In Stock</label>
              <input
                type='text'
                id='countInStock'
                placeholder='Enter countInStock'
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='brand'>Brand</label>
              <input
                type='text'
                id='brand'
                placeholder='Enter brand'
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='description'>Description</label>
              <textarea
                type='text'
                id='description'
                placeholder='Enter description'
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label />
              <button className='primary' type='submit'>
                Update
              </button>
            </div>
          </Fragment>
        )}
      </form>
    </div>
  );
};

export default ProductEditPage;
