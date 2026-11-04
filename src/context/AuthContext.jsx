import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const USER_ROLES = ['regular', 'admin'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password, role = 'regular') => {
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !password) {
      throw new Error('Username and password are required');
    }

    if (!USER_ROLES.includes(role)) {
      throw new Error('Role must be regular or admin');
    }

    setUser({ username: normalizedUsername, role });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Keep the hook alongside its provider; this export is intentionally not a component.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
