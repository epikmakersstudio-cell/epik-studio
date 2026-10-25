import { useState, type ReactNode, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_REQUIRED } from "@/lib/auth";
import logo from "@/assets/New-logo-Epik-dark.png";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

// While the site is members-only, signed-out visitors get just the logo: every menu and footer
// link would only lead back to this page
const LockedHeader = () => (
  <header className="absolute top-0 left-0 right-0 py-4 md:py-6">
    <div className="container-luxury">
      <img src={logo} alt="Epikmakers Photography" className="h-10 md:h-12 w-auto" />
    </div>
  </header>
);

const LockedFooter = () => (
  <footer className="bg-secondary py-8">
    <div className="container-luxury flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
      <p className="tracking-wider">© {new Date().getFullYear()} Epikmakers. All rights reserved.</p>
      <p>Hanamkonda, Telangana</p>
    </div>
  </footer>
);

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) => {
  const { isSignedIn } = useAuth();
  const locked = LOGIN_REQUIRED && !isSignedIn;

  return (
  <main className="relative min-h-screen flex flex-col bg-background">
    {locked ? <LockedHeader /> : <Navigation />}

    <section className="flex-1 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-luxury">
        <ScrollReveal animation="fadeUp" className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">{eyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          <div className="bg-secondary surface-card p-6 sm:p-8">{children}</div>

          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        </ScrollReveal>
      </div>
    </section>

    {locked ? <LockedFooter /> : <Footer />}
  </main>
  );
};

export const PasswordInput = (props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className="field-luxury pr-12" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 px-4 text-muted-foreground hover:text-primary transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default AuthLayout;
