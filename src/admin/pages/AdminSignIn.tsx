import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PasswordInput } from "@/components/AuthLayout";
import { API_ENABLED } from "@/lib/api";
import logo from "@/assets/New-logo-Epik-dark.png";
import { useAdminAuth } from "../useAdminAuth";

const AdminSignIn = () => {
  const { admin, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;
  const returnTo = from?.startsWith("/admin") ? from : "/admin";
  if (admin) return <Navigate to={returnTo} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      await signIn(email.trim(), password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Admin Sign In | Epikmakers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-sm">
        <img src={logo} alt="Epikmakers Photography" className="h-12 w-auto mx-auto mb-8" />
        <div className="bg-secondary surface-card p-6 sm:p-8">
          <h1 className="font-serif text-3xl mb-1">Studio Admin</h1>
          <p className="text-sm text-muted-foreground mb-6">Sign in to manage photos, reviews, messages and bookings.</p>
          {!API_ENABLED ? (
            <p className="text-sm text-muted-foreground" role="status">
              The dashboard needs the API. Set <code className="text-foreground">VITE_API_URL</code> and restart the site.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-luxury"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <PasswordInput
                  id="admin-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-destructive text-sm" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full btn-luxury disabled:opacity-50">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminSignIn;
