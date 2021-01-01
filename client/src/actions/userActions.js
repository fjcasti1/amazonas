import Axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from '../constants/userConstants';

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
