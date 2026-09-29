import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";
import { TOKEN_STORAGE_KEY } from "../services/api.js";

export const AuthContext = createContext(null);

/** Keep the current account and its token available throughout the client. */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((authResponse) => {
    const { token: nextToken, user: nextUser } = authResponse.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    return authResponse;
  }, []);

  const register = useCallback(async (account) => {
    const response = await authService.register(account);
    return saveSession(response);
  }, [saveSession]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    return saveSession(response);
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (active) {
          setToken(storedToken);
          setUser(response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        if (active && error.response?.status === 401) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ user, token, loading, register, login, logout }), [
    user, token, loading, register, login, logout,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
