import Axios from 'axios';
import { CART_CLEAR } from '../constants/cartConstants';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from '../constants/userConstants';

export const register = (name, email, password) => async (dispatch) => {
  const body = { name, email, password };
  dispatch({
    type: USER_REGISTER_REQUEST,
    payload: body,
  });
  try {
    const { data } = await Axios.post('/api/users/register', body);
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const body = { email, password };
  dispatch({
    type: USER_LOGIN_REQUEST,
    payload: body,
  });
  try {
    const { data } = await Axios.post('/api/users/login', body);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('userInfo');
  dispatch({ type: CART_CLEAR });
  dispatch({ type: USER_LOGOUT });
};
