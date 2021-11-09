import axios from "axios";
import {backendUrl} from '../../config'

const initialState = {
  authenticated: false,
  user: [],
};

const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "USERS_LOGOUT";

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { authenticated: true, user: action.user };
    case LOGIN_SUCCESS:
      return { authenticated: true, user: action.payload };
    case LOGIN_FAILURE:
      return { authenticated: false, user: [] };
    case LOGOUT:
      return { authenticated: false, user: [] };
    default:
      return state;
  }
}

export const login = (user, history) => async (dispatch) => {
  try {
    const res = await axios.post(`${backendUrl}/user/auth`, user, {
      withCredentials: true,
    });
    history.push("/home");
    await dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    return {message: 'success'}
  } catch {
    dispatch({
      type: LOGIN_FAILURE,
    });
    return {message: 'error'}
  }
};

export const logout = (history) => (dispatch) => {
  history.push("/");
  dispatch({
    type: LOGOUT,
  });
};
