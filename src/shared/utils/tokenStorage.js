const ACCESS = 'abanplay_access_token';
const REFRESH = 'abanplay_refresh_token';
const USER = 'abanplay_user';

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const tokenStorage = {
  get: () => read(ACCESS),
  getRefresh: () => read(REFRESH),
  getUser: () => {
    try {
      return JSON.parse(read(USER));
    } catch {
      return null;
    }
  },
  setSession: ({ accessToken, refreshToken, usuario }) => {
    localStorage.setItem(ACCESS, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
    if (usuario) localStorage.setItem(USER, JSON.stringify(usuario));
  },
  clear: () => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
  },
};
