import React from 'react';
import Rating from './Rating';

const Product = ({ product }) => {
  const { _id, name, image, price, rating, numReviews } = product;
  return (
    <div key={_id} className='card'>
      <a href={`/product/${_id}`}>
        <img className='medium' src={image} alt='product' />
      </a>
      <div className='card-body'>
        <a href={`/product/${_id}`}>
          <h2>{name}</h2>
        </a>
        <Rating rating={rating} numReviews={numReviews} />
        <div className='price'>${price}</div>
      </div>
    </div>
  );
};

export default Product;
