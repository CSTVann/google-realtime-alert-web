"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, loginUser, registerUser } from "@/lib/api";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
  type AuthResponse,
  type AuthUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(response: AuthResponse, setUser: (user: AuthUser | null) => void, setToken: (token: string | null) => void) {
  saveAuthSession(response);
  setUser(response.user);
  setToken(response.access_token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = getAccessToken();
      const storedUser = getStoredUser();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      try {
        const freshUser = await fetchCurrentUser();
        setUser(freshUser);
      } catch {
        clearAuthSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    applySession(response, setUser, setToken);
  }, []);

  const register = useCallback(
    async (payload: { first_name: string; last_name: string; email: string; password: string }) => {
      const response = await registerUser(payload);
      applySession(response, setUser, setToken);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
