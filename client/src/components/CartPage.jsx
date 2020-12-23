import React from 'react';

const CartPage = ({ match, location }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  return (
    <div>
      <h1>Cart Page</h1>
      <p>ADD TO CART: ProductID: {productId}</p>
      <p>ADD TO CART: Qty: {qty}</p>
    </div>
  );
};

export default CartPage;
