import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const CartPage = ({ match, location }) => {
  const dispatch = useDispatch();

  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);
  return (
    <div>
      <h1>Cart Page</h1>
      <p>ADD TO CART: ProductID: {productId}</p>
      <p>ADD TO CART: Qty: {qty}</p>
    </div>
  );
};

export default CartPage;
