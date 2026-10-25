import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import AuthLayout, { PasswordInput } from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { signUp, safeRedirect } from "@/lib/auth";

const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your name").max(100, "Name too long"),
    email: z.string().trim().email("Enter a valid email address").max(255, "Email too long"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number too long")
      .refine((v) => v === "" || /^[+\d][\d\s-]{6,}$/.test(v), "Enter a valid phone number"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128, "Password too long")
      .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "Include at least one letter and one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormState = z.infer<typeof signUpSchema>;

const emptyForm: FormState = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

const SignUp = () => {
  const { toast } = useToast();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  // Keeps the return page when switching between Sign In and Sign Up
  const redirectQuery = searchParams.get("redirect") ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(form);
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
      const { name, email, phone, password } = result.data;
      const session = await signUp({ name, email, phone: phone || undefined, password });
      setSession(session);
      toast({ title: "Account created!", description: "Welcome to Epikmakers." });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: "Couldn't create your account",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (
    name: "name" | "email" | "phone",
    label: string,
    type: string,
    autoComplete: string,
    placeholder: string,
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={handleChange}
        className="field-luxury"
        placeholder={placeholder}
        aria-invalid={!!errors[name]}
      />
      {errors[name] && <p className="text-destructive text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Sign Up | Epikmakers</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AuthLayout
        eyebrow="Join Us"
        title="Create Account"
        subtitle="Create an account to book sessions and access your galleries"
        footer={
          <>
            Already have an account?{" "}
            <Link to={`/signin${redirectQuery}`} className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {field("name", "Full Name", "text", "name", "Your name")}
          {field("email", "Email Address", "email", "email", "you@example.com")}
          {field("phone", "Phone Number (optional)", "tel", "tel", "+91 98765 43210")}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default SignUp;
