import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import AuthLayout, { PasswordInput } from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { signIn, safeRedirect } from "@/lib/auth";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255, "Email too long"),
  password: z.string().min(1, "Enter your password"),
});

type FormState = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { toast } = useToast();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  // Keeps the return page when switching between Sign In and Sign Up
  const redirectQuery = searchParams.get("redirect") ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signInSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.errors) {
        fieldErrors[issue.path[0] as keyof FormState] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await signIn({ email: form.email.trim(), password: form.password });
      setSession(session);
      toast({ title: "Welcome back!", description: "You're signed in." });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: "Couldn't sign you in",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Epikmakers</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AuthLayout
        eyebrow="Welcome Back"
        title="Sign In"
        subtitle="Sign in to manage your bookings and view your galleries"
        footer={
          <>
            Don't have an account?{" "}
            <Link to={`/signup${redirectQuery}`} className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              maxLength={255}
              className="field-luxury"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default SignIn;
