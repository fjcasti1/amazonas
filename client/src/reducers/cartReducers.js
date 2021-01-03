import {
  CART_ADD_ITEM,
  CART_CHANGE_ITEM_QTY,
  CART_CLEAR,
  CART_EMPTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'PayPal',
};

export const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ADD_ITEM:
      const newItem = payload;
      const existItem = state.cartItems.find((x) => x.product === newItem.product);
      if (existItem) {
        newItem.qty = newItem.qty + existItem.qty;
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? newItem : x,
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
        };
      }
    case CART_CHANGE_ITEM_QTY:
      const productId = payload.productId;
      const newQty = payload.qty;
      const item = state.cartItems.find((x) => x.product === productId);
      item.qty = newQty;
      return {
        ...state,
        cartItems: state.cartItems.map((x) => (x.product === productId ? item : x)),
      };
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== payload),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: payload,
      };
    case CART_CLEAR:
      return initialState;
    case CART_EMPTY:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};
