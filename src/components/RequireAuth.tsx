import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_REQUIRED, signInPath } from "@/lib/auth";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  if (LOGIN_REQUIRED && !isSignedIn) {
    return <Navigate to={signInPath(location.pathname + location.search)} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
