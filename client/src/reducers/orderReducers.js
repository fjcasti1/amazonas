import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_RESET,
  ORDER_DELETE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_RESET,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_RESET,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_MY_LIST_FAIL,
  ORDER_MY_LIST_REQUEST,
  ORDER_MY_LIST_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
} from '../constants/orderConstants';

const orderCreateInitialState = {};

export const orderCreateReducer = (state = orderCreateInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case ORDER_CREATE_RESET:
      return orderCreateInitialState;
    default:
      return state;
  }
};

const orderDetailsInitialState = {
  loading: true,
};

export const orderDetailsReducer = (state = orderDetailsInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case ORDER_DETAILS_RESET:
      return {
        loading: true,
      };
    default:
      return state;
  }
};

const orderPayInitialState = {};

export const orderPayReducer = (state = orderPayInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_PAY_REQUEST:
      return { loading: true };
    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_PAY_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case ORDER_PAY_RESET:
      return orderPayInitialState;
    default:
      return state;
  }
};

const orderMyListInitialState = { orders: [] };

export const orderMyListReducer = (state = orderMyListInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_MY_LIST_REQUEST:
      return { loading: true };
    case ORDER_MY_LIST_SUCCESS:
      return {
        loading: false,
        orders: payload,
      };
    case ORDER_MY_LIST_FAIL:
      return {
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_LIST_REQUEST:
      return { ...state, loading: true };
    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: payload,
      };
    case ORDER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const orderDeleteReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_DELETE_REQUEST:
      return { loading: true };
    case ORDER_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_DELETE_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case ORDER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliverReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case ORDER_DELIVER_REQUEST:
      return { loading: true };
    case ORDER_DELIVER_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_DELIVER_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case ORDER_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};
