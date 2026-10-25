import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/lib/auth";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255, "Email too long");

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setIsSubmitting(true);
    try {
      await requestPasswordReset(result.data);
      setSentTo(result.data);
    } catch (err) {
      toast({
        title: "Couldn't send the email",
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
        <title>Reset Password | Epikmakers</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <AuthLayout
        eyebrow="Account Help"
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a link to choose a new password"
        footer={
          <Link to="/signin" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        }
      >
        {sentTo ? (
          <div className="text-center space-y-3" role="status">
            <p className="font-serif text-xl">Check your email</p>
            <p className="text-sm text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, a reset link is on its
              way. It works for 1 hour. Don't forget to check your spam folder.
            </p>
          </div>
        ) : (
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(undefined);
                }}
                maxLength={255}
                className="field-luxury"
                placeholder="you@example.com"
                aria-invalid={!!error}
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
