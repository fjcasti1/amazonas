import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from '../constants/userConstants';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

export const userAuthReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_REGISTER_REQUEST:
    case USER_LOGIN_REQUEST:
      return {
        loading: true,
      };
    case USER_REGISTER_SUCCESS:
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: payload,
      };
    case USER_REGISTER_FAIL:
    case USER_LOGIN_FAIL:
      return {
        loadgin: false,
        error: payload,
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
