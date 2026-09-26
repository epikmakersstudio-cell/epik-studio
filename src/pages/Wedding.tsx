import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Heart, Users, Clock, Sparkles, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import wedding from "@/assets/portfolio-wedding.jpg";

const features = [
  { icon: Heart, title: "Pre-Wedding Consultation", description: "Planning your timeline, must-have shots and style" },
  { icon: Clock, title: "Full-Day Coverage", description: "From getting ready through the ceremony and reception" },
  { icon: Camera, title: "Candid & Posed", description: "Natural moments alongside timeless portraits" },
  { icon: Users, title: "Family & Guests", description: "Group portraits of everyone who matters to you" },
  { icon: Sparkles, title: "Couple Portraits", description: "A dedicated session for just the two of you" },
  { icon: Star, title: "Premium Editing", description: "Careful color grading and retouching throughout" },
];

const Wedding = () => {
  return (
    <>
      <Helmet>
        <title>Wedding Photography | Epikmakers</title>
        <meta
          name="description"
          content="Wedding photography in Hanamkonda. Full-day coverage of your ceremony and reception with candid moments, couple portraits and family photos, beautifully edited."
        />
        <meta
          name="keywords"
          content="wedding photography, wedding photographer, candid wedding photos, couple portraits, reception photography, wedding album"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://epikmakers.com/services/wedding" />

        {/* Open Graph */}
        <meta property="og:title" content="Wedding Photography | Epikmakers" />
        <meta property="og:description" content="Full-day wedding coverage with candid moments, couple portraits and family photos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://epikmakers.com/services/wedding" />
        <meta property="og:site_name" content="Epikmakers" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wedding Photography | Epikmakers" />
        <meta name="twitter:description" content="Full-day wedding coverage with candid moments and couple portraits." />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Wedding Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers",
              "url": "https://epikmakers.com"
            },
            "description": "Full-day wedding photography covering the ceremony and reception, with candid moments, couple portraits, family photos and premium editing.",
            "areaServed": "Hanamkonda",
            "serviceType": "Wedding Photography"
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
              src={wedding}
              alt="Wedding Photography"
              className="w-full h-full object-cover"
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
              Wedding
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Timeless storytelling of your love, from the vows to the last dance
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
                    Your Day, Beautifully Told
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Your wedding day passes in a blur of emotion. We make sure every glance, every
                      ritual and every celebration is preserved so you can relive it for years to come.
                    </p>
                    <p>
                      Our approach blends unobtrusive candid photography with carefully composed
                      portraits of the two of you, your families and your guests.
                    </p>
                    <p>
                      Before the day, we sit down together to plan your timeline and the moments that
                      matter most, so on the day you can simply enjoy it.
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
                      src={wedding}
                      alt="Wedding photography session"
                      className="w-full h-full object-cover"
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
                Saying "I Do" Soon?
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Wedding dates fill up quickly. Get in touch to check availability and plan
                the coverage that's right for your celebration.
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

export default Wedding;
