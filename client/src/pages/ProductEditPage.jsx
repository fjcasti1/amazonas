import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct, updateProduct } from '../actions/productActions';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';

const ProductEditPage = ({ match, history }) => {
  const dispatch = useDispatch();
  const productId = match.params.id;

  const token = useSelector((state) => state.userAuth.userInfo.token);

  const { loading, error, product } = useSelector((state) => state.productDetails);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.productUpdate);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const [successUpload, setSuccessUpload] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push('/productlist');
    }

    if (!product || product._id !== productId || successUpdate) {
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      // setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }

    if (successUpload) {
      dispatch(
        updateProduct({
          _id: product._id,
          name,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        }),
        setSuccessUpload(false),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, history, product, productId, successUpdate, successUpload]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // Upload image and set successUpload to true
    // Inside useEffect, will disptach(updateProduct(product))
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    setLoadingUpload(true);
    try {
      const { data } = await axios.post(
        '/api/products/uploadimage',
        bodyFormData,
        config,
      );
      setImage(data); // image path
      setSuccessUpload(true);
    } catch (error) {
      setErrorUpload(error.message);
      setSuccessUpload(false);
    }
    setLoadingUpload(false);
  };

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {productId}</h1>
        </div>
        {loadingUpdate && <Spinner />}
        {errorUpdate && <Alert>{errorUpdate}</Alert>}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
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
              <label htmlFor='imageFile'>Upload Image</label>
              <input
                type='file'
                id='imageFile'
                placeholder='Choose image'
                onChange={(e) => setFile(e.target.files[0])}
              />
              {loadingUpload && <Spinner />}
              {errorUpload && <Alert>{errorUpload}</Alert>}
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
