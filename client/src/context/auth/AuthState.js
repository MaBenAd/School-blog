import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      console.log('Attempting to load user data...');
      const res = await axios.get('/api/auth');
      console.log('User data loaded successfully:', res.data);
      
      dispatch({ 
        type: USER_LOADED, 
        payload: res.data 
      });
    } catch (err) {
      console.error('Error loading user:', err.response?.data || err.message);
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Registering user...');
      const res = await axios.post('/api/auth/register', formData, config);
      console.log('Registration successful, token received');
      
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      // Must be called after the dispatch completes
      await loadUser();
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.msg || err.message);
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.msg || 'Registration failed'
      });
    }
  };

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Logging in user...');
      const res = await axios.post('/api/auth/login', formData, config);
      console.log('Login successful, token received');
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      // Must be called after the dispatch completes
      await loadUser();
    } catch (err) {
      console.error('Login failed:', err.response?.data?.msg || err.message);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.msg || 'Invalid credentials'
      });
    }
  };

  // Logout
  const logout = () => {
    console.log('Logging out user');
    dispatch({ type: LOGOUT });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState; 