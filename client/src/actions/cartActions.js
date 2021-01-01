import {
  CART_ADD_ITEM,
  CART_CHANGE_ITEM_QTY,
  CART_REMOVE_ITEM,
} from '../constants/cartConstants';

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

export const changeProductQty = (productId, qty) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_CHANGE_ITEM_QTY,
      payload: { productId, qty },
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  } catch (err) {
    console.error(err);
  }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: productId,
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  } catch (err) {
    console.error(err);
  }
};
