import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import type { Admin } from "./adminApi";

// The admin session is kept apart from client sign-ins (its own storage key and token type).
type AdminSession = { admin: Admin; token: string };

const STORAGE_KEY = "epikmakers.admin";

function loadSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

type AdminAuthValue = {
  admin: Admin | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  token: string | undefined;
  // Calls the API as the admin; an expired session signs out instead of failing silently
  request: <T>(path: string, options?: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown }) => Promise<T>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AdminSession | null>(loadSession);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await apiRequest<AdminSession>("/admin/auth/signin", { method: "POST", body: { email, password } });
    setSession(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Signed in for this visit only
    }
  }, []);

  const token = session?.token;
  const request = useCallback<AdminAuthValue["request"]>(
    async (path, options = {}) => {
      try {
        return await apiRequest(path, { ...options, token });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) signOut();
        throw err;
      }
    },
    [token, signOut],
  );

  // Confirm a remembered admin session is still valid when the dashboard opens
  useEffect(() => {
    if (!token) return;
    apiRequest("/admin/auth/me", { token }).catch((err) => {
      if (err instanceof ApiError && err.status === 401) signOut();
    });
  }, [token, signOut]);

  const value = useMemo(() => ({ admin: session?.admin ?? null, signIn, signOut, token, request }), [session, signIn, signOut, token, request]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return context;
};
