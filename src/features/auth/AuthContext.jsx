import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '@/api/auth.api';
import { tokenStorage } from '@/shared/utils/tokenStorage';
import { rolName } from '@/shared/utils/format';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({
    accessToken: tokenStorage.get(),
    usuario: tokenStorage.getUser(),
  }));

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    tokenStorage.setSession(data);
    setSession({ accessToken: data.accessToken, usuario: data.usuario });
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setSession({ accessToken: null, usuario: null });
  }, []);

  // httpClient emite este evento cuando el backend responde 401.
  useEffect(() => {
    const onExpired = () => setSession({ accessToken: null, usuario: null });
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const value = useMemo(() => {
    const rol = rolName(session.usuario?.rol);
    return {
      usuario: session.usuario,
      rol,
      isSuper: rol === 'super_admin',
      isAuthenticated: Boolean(session.accessToken),
      login,
      logout,
    };
  }, [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
