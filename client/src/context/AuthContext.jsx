import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist token to localStorage on change
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      // Store user info too
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedUser) {
      dispatch({
        type: 'LOGIN',
        payload: { user: JSON.parse(savedUser), token: savedToken },
      });
    }
  }, []);

  const login = (userData) => {
    dispatch({
      type: 'LOGIN',
      payload: { user: userData, token: userData.token },
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
