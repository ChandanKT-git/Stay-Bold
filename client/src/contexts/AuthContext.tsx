import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isHost?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // Verify token is still valid on app load
      verifyToken();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const verifyToken = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // We could add a verify endpoint, for now we'll assume valid if exists
      if (state.token) {
        // In a real app, you'd verify the token with the server
        // For now, we'll just check if it exists and is not expired
        const tokenPayload = JSON.parse(atob(state.token.split('.')[1]));
        if (tokenPayload.exp * 1000 > Date.now()) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: {
                id: tokenPayload.userId,
                email: tokenPayload.email,
                name: tokenPayload.name || 'User',
                isHost: tokenPayload.isHost,
              },
              token: state.token,
            },
          });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string, isHost = false) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        name,
        isHost,
      });
      
      if (response.data.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};