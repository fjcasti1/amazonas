import axios from 'axios';
import { CART_ADD_ITEM } from '../constants/cartConstants';

export const addToCart = (productId, qty) => async (dispatch, getState) => {
  try {
    const res = await axios.get(`/api/products/${productId}`);
    const { name, image, price, countInStock, _id } = res.data;
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        name,
        image,
        price,
        countInStock,
        product: _id,
        qty,
      },
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
  } catch (err) {
    // dispatch({
    //   type: PRODUCT_LIST_FAIL,
    //   payload: err.message,
    // });
  }
};
