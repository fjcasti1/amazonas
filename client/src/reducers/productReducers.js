import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
} from '../constants/productConstants';

export const productListReducer = (
  state = {
    loading: true,
    products: [],
  },
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };

    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: payload,
      };

    case PRODUCT_LIST_FAIL:
      return {
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = {
    loading: true,
    product: null,
  },
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: payload,
      };

    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };

    case PRODUCT_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        product: payload,
      };

    case PRODUCT_CREATE_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
