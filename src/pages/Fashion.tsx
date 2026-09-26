import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Palette, Shirt, Clock, Sparkles, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import fashion from "@/assets/portfolio-fashion.jpg";

const features = [
  { icon: Palette, title: "Concept Planning", description: "Mood boards and styling direction before the shoot" },
  { icon: Camera, title: "Studio & Outdoor", description: "Clean studio setups or striking outdoor locations" },
  { icon: Shirt, title: "Multiple Looks", description: "Outfit and look changes to build a varied portfolio" },
  { icon: Clock, title: "1-2 Hour Session", description: "Relaxed pace with posing and expression guidance" },
  { icon: Sparkles, title: "High-End Retouching", description: "Polished, magazine-quality skin and color work" },
  { icon: Star, title: "Portfolio Ready", description: "Images sized for print, social media and model cards" },
];

const Fashion = () => {
  return (
    <>
      <Helmet>
        <title>Fashion Photography | Epikmakers</title>
        <meta
          name="description"
          content="Editorial fashion photography in Hanamkonda. Portfolio shoots, model portfolios and styled personal shoots with concept planning, multiple looks and high-end retouching."
        />
        <meta
          name="keywords"
          content="fashion photography, fashion photoshoot, model portfolio, editorial photography, portfolio shoot, styled portraits"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://epikmakers.com/services/fashion" />

        {/* Open Graph */}
        <meta property="og:title" content="Fashion Photography | Epikmakers" />
        <meta property="og:description" content="Editorial fashion photography with concept planning, multiple looks and high-end retouching." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://epikmakers.com/services/fashion" />
        <meta property="og:site_name" content="Epikmakers" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fashion Photography | Epikmakers" />
        <meta name="twitter:description" content="Editorial fashion photography with concept planning and high-end retouching." />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Fashion Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers",
              "url": "https://epikmakers.com"
            },
            "description": "Editorial fashion and portfolio photography. 1-2 hour studio or outdoor sessions with concept planning, multiple looks and high-end retouching.",
            "areaServed": "Hanamkonda",
            "serviceType": "Photography"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="relative min-h-[70vh] min-h-[70svh] pt-28 pb-16 md:pt-32 flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={fashion}
              alt="Fashion Photography"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/40 to-background" />
          </motion.div>

          <div className="relative z-10 text-center px-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-primary text-sm tracking-[0.3em] uppercase mb-4"
            >
              Our Services
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream mb-6"
            >
              Fashion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Bold, editorial imagery that brings your style and personality to life
            </motion.p>
          </div>
        </section>

        {/* Description Section */}
        <section className="section-padding bg-background">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal animation="slideLeft">
                <div className="space-y-6">
                  <p className="text-primary text-sm tracking-[0.3em] uppercase">About This Service</p>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                    Your Style, In Focus
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Whether you're building a model portfolio, launching a clothing line or simply
                      want striking portraits that feel like a magazine spread, our fashion sessions
                      are designed around your look and your goals.
                    </p>
                    <p>
                      We start with a concept: mood, colors, locations and outfits. On the day, we guide
                      your posing and expressions so every frame feels confident and natural.
                    </p>
                    <p>
                      Every image is finished with careful, high-end retouching, ready for your
                      portfolio, social media or print.
                    </p>
                  </div>
                  <Link to="/contact">
                    <Button className="btn-luxury mt-4">Book Your Session</Button>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideRight">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-sm overflow-hidden">
                    <img
                      src={fashion}
                      alt="Fashion photography session"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary/30 rounded-sm" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-sm" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="section-padding bg-secondary/30">
          <div className="container-luxury">
            <ScrollReveal animation="fadeUp" className="text-center mb-16">
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">What's Included</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">Session Features</h2>
              <div className="divider-elegant" />
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <div className="card-luxury p-8 text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-espresso text-cream">
          <div className="container-luxury text-center">
            <ScrollReveal animation="fadeUp">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                Ready for Your Close-Up?
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Tell us about your look and your goals, and we'll plan a shoot that brings
                your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="btn-luxury hover:bg-primary/90">
                    Book Now
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="outline" className="bg-transparent border-cream/40 text-cream hover:bg-cream/10 hover:text-cream px-8 uppercase tracking-widest">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Fashion;
