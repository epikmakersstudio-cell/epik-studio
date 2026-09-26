import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/New-logo-Epik-dark.png";

const Footer = () => {
  return (
    <footer className="bg-secondary py-16 md:py-20">
      <div className="container-luxury">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Epikmakers Photography"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Where tiny miracles meet timeless artistry. Capturing your
              family's most precious beginnings with warmth and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Explore</h4>
            <ul className="space-y-3">
              {["Portfolio", "About", "Reviews", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg mb-6">Services</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>Baby Shower Photography</li>
              <li>Maternity Photoshoot</li>
              <li>Newborn Photography</li>
              <li>Pre-Birthday Shoot</li>
              <li>Family Portraits</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-serif text-lg mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <a
                  href="https://www.google.com/maps/place/epikmakers_littlenest+Newborn+studio/@17.9936444,79.5674227,17z/data=!4m6!3m5!1s0x648ad22b341ded05:0xdf3014d3743df8b3!8m2!3d17.9936444!4d79.5674227!16s%2Fg%2F11n3pj3z2r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  7-1-364/A/1, Beside Sri Ram Nagar Colony Arch,
                  <br />
                  Padmakshi Temple Road, Meerpet,
                  <br />
                  Hanamkonda, Telangana 506001
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors"
                >
                  +91 9848255845
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a
                  href="mailto:epiclittlenest@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  epiclittlenest@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs tracking-wider">
              © {new Date().getFullYear()} Epikmakers. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
