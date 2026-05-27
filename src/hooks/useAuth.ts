import { useState, useEffect } from "react";
import func2url from "../../backend/func2url.json";

const AUTH_URL = func2url.auth;
const TOKEN_KEY = "xo_token";

export interface User {
  id: number;
  login: string;
  email: string;
  coins: number;
  elo: number;
  level: number;
  xp: number;
  rank: string;
  avatar_emoji: string;
  is_pro: boolean;
  wins: number;
  losses: number;
  draws: number;
  glory_points: number;
  madness_tickets: number;
  pve_energy: number;
  created_at: string;
}

async function authRequest(body: object, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(AUTH_URL, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    authRequest({ action: "me" }, token)
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const register = async (login: string, email: string, password: string) => {
    const data = await authRequest({ action: "register", login, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  };

  const login = async (email: string, password: string) => {
    const data = await authRequest({ action: "login", email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) await authRequest({ action: "logout" }, token).catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updated } : prev);
  };

  return { user, loading, register, login, logout, updateUser };
}
