import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LayoutDashboard, Images, Star, Mail, CalendarDays, Clock, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/New-logo-Epik-dark.png";
import { useAdminAuth } from "./useAdminAuth";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/photos", label: "Photos", icon: Images },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/availability", label: "Availability", icon: Clock },
];

const AdminLayout = () => {
  const { admin, signOut } = useAdminAuth();
  const location = useLocation();
  if (!admin) return <Navigate to="/admin/signin" replace state={{ from: location.pathname }} />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors whitespace-nowrap",
      isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
    );

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Helmet>
        <title>Admin | Epikmakers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="lg:w-64 lg:shrink-0 lg:border-r border-b lg:border-b-0 border-border bg-secondary/40 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
          <img src={logo} alt="Epikmakers Photography" className="h-9 w-auto" />
          <button type="button" onClick={signOut} className="lg:hidden text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5">
            <LogOut size={16} /> Sign out
          </button>
        </div>
        <nav aria-label="Admin" className="flex lg:flex-col gap-1 overflow-x-auto px-3 pb-3 lg:px-3 lg:pb-0 lg:flex-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block border-t border-border p-4 space-y-3 text-sm">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ExternalLink size={16} /> View website
          </a>
          <div>
            <p className="font-medium truncate">{admin.name}</p>
            <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
          </div>
          <button type="button" onClick={signOut} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
