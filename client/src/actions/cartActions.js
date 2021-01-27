import {
  CART_ADD_ITEM,
  CART_CHANGE_ITEM_QTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PRICE,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const addToCart = (product, qty) => async (dispatch, getState) => {
  try {
    const { name, image, price, countInStock, seller, _id } = product;
    const cartItem = {
      name,
      image,
      price,
      qty,
      countInStock,
      seller,
      product: _id,
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

export const calculatePrices = (cartItems) => async (dispatch) => {
  const price = {};

  price.items = Number(
    cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0).toFixed(2),
  );
  price.shipping = Number((price.items > 100 ? 0 : 10).toFixed(2));
  price.tax = Number((0.15 * price.items).toFixed(2));
  price.total = Number((price.items + price.shipping + price.tax).toFixed(2));

  dispatch({
    type: CART_SAVE_PRICE,
    payload: price,
  });
  localStorage.setItem('price', JSON.stringify(price));
};
