import { CART_ADD_ITEM } from '../constants/cartConstants';

export const addToCart = (product, qty) => async (dispatch, getState) => {
  try {
    const { name, image, price, countInStock, _id } = product;
    const cartItem = {
      name,
      image,
      price,
      countInStock,
      product: _id,
      qty,
    };
    dispatch({
      type: CART_ADD_ITEM,
      payload: cartItem,
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  } catch (err) {
    console.error(err);
  }
};
