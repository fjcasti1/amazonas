import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { createReview, detailsProduct } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import {
  PRODUCT_DETAILS_RESET,
  PRODUCT_REVIEW_CREATE_RESET,
} from '../constants/productConstants';

const ProductPage = ({ history, match }) => {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = useSelector((state) => state.productReviewCreate);

  const productId = match.params.id; // ID inside the URL

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [qty, setQty] = useState(1);

  const addToCartHandler = () => {
    dispatch(addToCart(product, qty));
    history.push('/');
  };

  useEffect(() => {
    if (successReview) {
      setRating('');
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
    return () => {
      dispatch({ type: PRODUCT_DETAILS_RESET });
    };
  }, [dispatch, productId, successReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(createReview(productId, { rating, comment }));
    } else {
      alert('Please enter comment and rating');
    }
  };
  return (
    <div className='container'>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <div>
          <button type='button'>
            <Link to='/'>Go Back</Link>
          </button>
          <div className='row top'>
            <div className='col-2'>
              <img className='large' src={product.image} alt={product.name} />
            </div>
            <div className='col-1'>
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating rating={product.rating} numReviews={product.numReviews} />
                </li>
                <li>Price: ${product.price}</li>
                <li>
                  Description:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>
            <div className='col-1'>
              <div className='card card-body'>
                <ul>
                  <li>
                    <div className='row'>
                      <div>Price</div>
                      <div className='price'>${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div>Status</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className='success'>In Stock</span>
                        ) : (
                          <span className='danger'>Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <Fragment>
                      <li>
                        <div className='row'>
                          <div>Qty</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                            >
                              {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button onClick={addToCartHandler} className='primary block'>
                          Add to Cart
                        </button>
                      </li>
                    </Fragment>
                  )}
                </ul>
              </div>
              <div className='card card-body'>
                <ul>
                  <li className='row start'>
                    <h3 className='m-0 mb-1'>Seller Information</h3>
                  </li>
                  <li>
                    <Link to={`/seller/${product.seller._id}`}>
                      {product.seller.seller.name}
                    </Link>
                  </li>
                  <li>
                    <Rating
                      rating={product.seller.seller.rating}
                      numReviews={product.seller.seller.numReviews}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 id='reviews'>Reviews</h2>
          </div>
          {product.numReviews === 0 ? (
            <Alert variant='info'>No Reviews Posted</Alert>
          ) : (
            <ul>
              {product.reviews &&
                product.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption={` from ${review.userName}`} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
            </ul>
          )}
          {userInfo ? (
            <form className='form' onSubmit={submitHandler}>
              <div>
                <h2>Write a customer review</h2>
              </div>
              <div>
                {loadingReview && <Spinner />}
                {errorReview && <Alert>{errorReview}</Alert>}
              </div>
              <div>
                <label htmlFor='rating'>Rating</label>
                <select
                  id='rating'
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value=''>Select...</option>
                  <option value='1'>1 - Poor</option>
                  <option value='2'>2 - Fair</option>
                  <option value='3'>3 - Good</option>
                  <option value='4'>4 - Very Good</option>
                  <option value='5'>5 - Excelent</option>
                </select>
              </div>
              <div>
                <label htmlFor='comment'>Comment</label>
                <textarea
                  id='comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div>
                <label />
                <button className='primary' type='submit'>
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <Alert variant='info'>
              Please <Link to='/login'>Sign In</Link> to write a review
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
