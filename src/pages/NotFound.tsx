import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
            Page Not Found
          </p>
          <h1 className="font-serif text-8xl md:text-9xl font-medium text-foreground/10 mb-4">
            404
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get
            you back to capturing beautiful moments.
          </p>
          <Link to="/" className="btn-luxury">
            Return Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NotFound;
