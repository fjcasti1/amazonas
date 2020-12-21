import React from 'react';
import { Link } from 'react-router-dom';
import data from '../data';
import Rating from './Rating';

const ProductPage = ({ match }) => {
  const product = data.products.find((product) => product._id === match.params.id);

  if (!product) return <h2>Product Not Found</h2>;

  const {
    name,
    image,
    rating,
    numReviews,
    price,
    description,
    countInStock,
  } = product;

  return (
    <div>
      <Link to='/'>Go Back</Link>
      <div className='row top'>
        <div className='col-2'>
          <img className='large' src={image} alt={name} />
        </div>
        <div className='col-1'>
          <ul>
            <li>
              <h1>{name}</h1>
            </li>
            <li>
              <Rating rating={rating} numReviews={numReviews} />
            </li>
            <li>Price: ${price}</li>
            <li>
              Description:
              <p>{description}</p>
            </li>
          </ul>
        </div>
        <div className='col-1'>
          <div className='card card-body'>
            <ul>
              <li>
                <div className='row'>
                  <div>Price</div>
                  <div className='price'>${price}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Status</div>
                  <div>
                    {countInStock > 0 ? (
                      <span className='success'>In Stock</span>
                    ) : (
                      <span className='danger'>Out of Stock</span>
                    )}
                  </div>
                </div>
              </li>
              <li>
                <button className='primary block'>Add to Cart</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
