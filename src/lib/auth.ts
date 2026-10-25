// Client account API calls (sign in, sign up, session check, password reset).
import { API_ENABLED, apiRequest } from "@/lib/api";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

type Session = { user: AuthUser; token: string };

// The whole site is for signed-in clients only; signed-out visitors see just Sign In and Sign Up.
// The requirement switches on by itself once the API URL is set, so the site never locks
// visitors out while sign-in can't work. To keep the site public even with the API connected,
// change this line to `false`.
export const LOGIN_REQUIRED = API_ENABLED;

export const signIn = (input: SignInInput) => apiRequest<Session>("/auth/signin", { method: "POST", body: input });

export const signUp = (input: SignUpInput) => apiRequest<Session>("/auth/signup", { method: "POST", body: input });

export const fetchMe = (token: string) => apiRequest<{ user: AuthUser }>("/auth/me", { token });

export const requestPasswordReset = (email: string) =>
  apiRequest<void>("/auth/forgot-password", { method: "POST", body: { email } });

export const resetPassword = (token: string, password: string) =>
  apiRequest<void>("/auth/reset-password", { method: "POST", body: { token, password } });

// Where to send a signed-out visitor, remembering the page to return to afterwards
export const signInPath = (returnTo: string) =>
  returnTo === "/" ? "/signin" : `/signin?redirect=${encodeURIComponent(returnTo)}`;

// Only allows a return path inside this site, so the redirect can't be pointed elsewhere
export const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
