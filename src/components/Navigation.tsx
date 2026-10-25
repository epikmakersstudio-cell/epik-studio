import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, UserRound, LogOut, CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LOGIN_REQUIRED, signInPath } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logo from "@/assets/New-logo-Epik-dark.png";
import { services } from "@/data/services";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/about" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact", path: "/contact" },
];

const serviceLinks = services;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The header's height changes with scroll and breakpoint; the mobile menu sits right below it
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Keep the page behind the open mobile menu from scrolling
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Close the mobile menu when the viewport grows into the desktop layout
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const handleChange = (e: MediaQueryListEvent) => e.matches && setIsOpen(false);
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  const isServicePage = location.pathname.startsWith("/services");
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  const { isSignedIn, user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleSignOut = () => {
    signOut();
    toast({ title: "Signed out", description: "See you again soon." });
    // Every page is members-only, so signing out ends on the sign-in page
    if (LOGIN_REQUIRED) navigate("/signin", { replace: true });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || isOpen ? "py-3 md:py-4" : "py-4 md:py-6",
      )}
    >
      {/*
        The glass lives on its own layer: a backdrop-filter on <header> itself would become the
        backdrop root for the services dropdown and stop it from blurring the page below.
      */}
      <div
        aria-hidden
        className={cn(
          "glass-header pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500",
          // Below xl the header always keeps its glass so the logo and menu icon stay legible over hero images
          isScrolled || isOpen ? "opacity-100" : "opacity-100 xl:opacity-0",
        )}
      />
      <nav className="container-luxury flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Epikmakers Photography"
            className={cn(
              "w-auto transition-all duration-500",
              isScrolled || isOpen ? "h-9 md:h-10" : "h-10 md:h-12",
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex items-center gap-4 2xl:gap-8 [&_.nav-link]:whitespace-nowrap">
          {navLinks.slice(0, 1).map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "nav-link",
                  location.pathname === link.path &&
                    "text-primary after:w-full",
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Services Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={cn(
                "nav-link flex items-center gap-1",
                isServicePage && "text-primary after:w-full",
              )}
            >
              Services
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-300",
                  servicesOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300",
                servicesOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2",
              )}
            >
              <div className="glass-panel p-2 w-[260px]">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "glass-item",
                      location.pathname === link.path && "is-active",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {navLinks.slice(1).map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={cn(
                  "nav-link",
                  location.pathname === link.path &&
                    "text-primary after:w-full",
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Account + Book Now - Desktop */}
        <div className="hidden xl:flex shrink-0 items-center gap-4 2xl:gap-5">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "nav-link whitespace-nowrap inline-flex items-center gap-1.5 focus-visible:outline-none",
                  location.pathname === "/my-bookings" && "text-primary",
                )}
                aria-label={`Account menu for ${user?.name}`}
              >
                <UserRound size={16} />
                <span className="max-w-[7rem] truncate">{user?.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-bookings" className="cursor-pointer">
                    <CalendarDays size={16} className="mr-2" /> My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                  <LogOut size={16} className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to={signInPath(location.pathname)}
              className={cn(
                "nav-link whitespace-nowrap inline-flex items-center gap-1.5",
                isAuthPage && "text-primary after:w-full",
              )}
            >
              <UserRound size={16} />
              Sign In
            </Link>
          )}
          <Link
            to="/contact"
            className="whitespace-nowrap btn-luxury text-xs px-6"
          >
            Book a Session
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden -mr-2 p-2 text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "xl:hidden glass-panel-strong rounded-none border-0 shadow-none fixed inset-x-0 bottom-0 transition-all duration-500 overflow-y-auto overscroll-contain",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        style={{ top: headerHeight }}
      >
        <ul className="flex flex-col items-center gap-5 sm:gap-6 pt-8 sm:pt-12 pb-10">
          <li
            className={cn(
              "opacity-0 translate-y-4",
              isOpen && "animate-fade-up",
            )}
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-2xl font-serif tracking-wide",
                location.pathname === "/" ? "text-primary" : "text-foreground",
              )}
            >
              Home
            </Link>
          </li>

          {/* Mobile Services Accordion */}
          <li
            className={cn(
              "opacity-0 translate-y-4 w-full text-center",
              isOpen && "animate-fade-up",
            )}
            style={{ animationDelay: "100ms" }}
          >
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={cn(
                "text-2xl font-serif tracking-wide flex items-center gap-2 mx-auto",
                isServicePage ? "text-primary" : "text-foreground",
              )}
            >
              Services
              <ChevronDown
                size={20}
                className={cn(
                  "transition-transform duration-300",
                  mobileServicesOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                mobileServicesOpen ? "max-h-[420px] mt-4" : "max-h-0",
              )}
            >
              <div className="glass-panel mx-6 flex flex-col gap-1 p-2">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "glass-item text-center text-base",
                      location.pathname === link.path && "is-active",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {navLinks.slice(1).map((link, index) => (
            <li
              key={link.path}
              className={cn(
                "opacity-0 translate-y-4",
                isOpen && "animate-fade-up",
              )}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-2xl font-serif tracking-wide",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="text-center">
            {isSignedIn ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">Signed in as {user?.name}</p>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-serif tracking-wide inline-flex items-center gap-2 mb-4",
                    location.pathname === "/my-bookings" ? "text-primary" : "text-foreground",
                  )}
                >
                  <CalendarDays size={22} />
                  My Bookings
                </Link>
                <br />
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="text-2xl font-serif tracking-wide inline-flex items-center gap-2 text-foreground"
                >
                  <LogOut size={22} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to={signInPath(location.pathname)}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-2xl font-serif tracking-wide inline-flex items-center gap-2",
                  isAuthPage ? "text-primary" : "text-foreground",
                )}
              >
                <UserRound size={22} />
                Sign In
              </Link>
            )}
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="btn-luxury text-xs mt-4"
            >
              Book a Session
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
