import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  const { _id, name, image, price, rating, numReviews, seller } = product;
  return (
    <div key={_id} className='card'>
      <Link to={`/products/${_id}`}>
        <img className='medium' src={image} alt='product' />
      </Link>
      <div className='card-body'>
        <Link to={`/products/${_id}`}>
          <h2>{name}</h2>
        </Link>
        <Rating rating={rating} numReviews={numReviews} />
        <div className='row'>
          <div className='price'>${price}</div>
          <div>
            <Link to={`/seller/${seller._id}`}>{seller.seller.name}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
