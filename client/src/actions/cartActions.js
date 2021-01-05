import {
  CART_ADD_ITEM,
  CART_CHANGE_ITEM_QTY,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
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

export const saveShippingAddress = (shippingData) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: shippingData,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
};

export const savePaymentMethod = (paymentMethod) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: paymentMethod,
  });
  localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
};
