import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchMe, type AuthUser } from "@/lib/auth";
import { API_ENABLED, ApiError } from "@/lib/api";

type Session = { user: AuthUser; token: string };

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isSignedIn: boolean;
  setSession: (session: Session) => void;
  signOut: () => void;
};

const STORAGE_KEY = "epikmakers.session";

// Keeps the visitor signed in across visits; storage can be unavailable (private mode), so never throw
function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<Session | null>(loadSession);

  const setSession = useCallback((next: Session) => {
    setSessionState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Signed in for this visit only
    }
  }, []);

  const signOut = useCallback(() => {
    setSessionState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored
    }
  }, []);

  // Once per visit, confirm a remembered sign-in is still valid (and pick up name/email changes);
  // an expired or revoked one signs the visitor out. A network hiccup keeps them signed in.
  const storedToken = session?.token;
  useEffect(() => {
    if (!storedToken || !API_ENABLED) return;
    let cancelled = false;
    fetchMe(storedToken)
      .then(({ user }) => !cancelled && setSession({ user, token: storedToken }))
      .catch((err) => {
        if (!cancelled && err instanceof ApiError && err.status === 401) signOut();
      });
    return () => {
      cancelled = true;
    };
    // Only when the token itself changes, not on every user update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isSignedIn: !!session,
      setSession,
      signOut,
    }),
    [session, setSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
};
