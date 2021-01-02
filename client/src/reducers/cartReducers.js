import {
  CART_ADD_ITEM,
  CART_CHANGE_ITEM_QTY,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
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

    default:
      return state;
  }
};
