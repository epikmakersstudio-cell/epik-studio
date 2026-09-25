import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Gallery", path: "/gallery" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/about" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact", path: "/contact" },
];

const serviceLinks = [
  { name: "Fashion", path: "/services/fashion" },
  { name: "Wedding", path: "/services/wedding" },
  { name: "Baby Shower & Maternity", path: "/services/baby-shower" },
  { name: "Pre-Birthday &  Birthday", path: "/services/pre-birthday" },
  { name: "Newborn", path: "/services/newborn" },
  { name: "Family Portraits", path: "/services/family-portraits" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isServicePage = location.pathname.startsWith("/services");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-4" : "py-6",
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
          isScrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav className="container-luxury flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl md:text-3xl tracking-wide text-foreground"
        >
          <span className="font-light">Little</span>
          <span className="text-primary font-medium"> Nest</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8">
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

        {/* Book Now Button - Desktop */}
        <Link
          to="/contact"
          className="hidden lg:block btn-luxury text-xs"
        >
          Book a Session
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden glass-panel-strong rounded-none border-0 shadow-none fixed inset-0 top-[72px] transition-all duration-500 overflow-y-auto",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
      >
        <ul className="flex flex-col items-center gap-6 pt-16 pb-8">
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
