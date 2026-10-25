import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import AuthLayout, { PasswordInput } from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/auth";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(128, "Password too long")
      .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "Include at least one letter and one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type Fields = z.infer<typeof schema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [form, setForm] = useState<Fields>({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.errors) fieldErrors[issue.path[0] as keyof Fields] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(token, form.password);
      toast({ title: "Password updated", description: "Please sign in with your new password." });
      navigate("/signin", { replace: true });
    } catch (err) {
      toast({
        title: "Couldn't reset your password",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Choose a New Password | Epikmakers</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AuthLayout
        eyebrow="Account Help"
        title="New Password"
        subtitle="Choose a new password for your account"
        footer={
          <Link to="/signin" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        }
      >
        {!token ? (
          <p className="text-sm text-muted-foreground text-center">
            This link is incomplete. Please use the link from your email, or{" "}
            <Link to="/forgot-password" className="text-primary font-medium hover:underline">
              request a new one
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                New Password
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
                Confirm New Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Saving..." : "Save New Password"}
            </button>
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
