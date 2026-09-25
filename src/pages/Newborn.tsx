import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Heart, Sparkles, Clock, Shield, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import newborn from "@/assets/portfolio-newborn.jpg";

const features = [
  { icon: Camera, title: "Posed & Lifestyle", description: "Classic posed portraits and natural lifestyle shots" },
  { icon: Heart, title: "Family Inclusion", description: "Beautiful parent and sibling portraits included" },
  { icon: Shield, title: "Safety First", description: "Trained in newborn posing and handling" },
  { icon: Clock, title: "2-4 Hour Session", description: "Patient sessions allowing for feeding and comfort" },
  { icon: Sparkles, title: "Props & Wraps", description: "Curated collection of organic props and textiles" },
  { icon: Star, title: "Artistic Composites", description: "Safe composite editing for creative poses" },
];

const Newborn = () => {
  return (
    <>
      <Helmet>
        <title>Newborn Photography | Epikmakers Photography</title>
        <meta
          name="description"
          content="Capture your baby's precious first moments with professional newborn photography. Safe, patient sessions within 5-14 days of birth. Includes family and sibling portraits."
        />
        <meta
          name="keywords"
          content="newborn photography, baby photos, infant portraits, first photos baby, newborn session, baby photographer"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://littlenest.com/services/newborn" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Newborn Photography | Epikmakers Photography" />
        <meta property="og:description" content="Capture your baby's precious first moments with professional newborn photography. Safe, patient sessions with family portraits included." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://littlenest.com/services/newborn" />
        <meta property="og:site_name" content="Epikmakers Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Newborn Photography | Epikmakers Photography" />
        <meta name="twitter:description" content="Capture your baby's precious first moments with professional newborn photography." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Newborn Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers Photography",
              "url": "https://littlenest.com"
            },
            "description": "Professional newborn photography sessions capturing precious first moments. 2-4 hour patient sessions with safety-first posing and family portraits included.",
            "areaServed": "Local Area",
            "serviceType": "Photography"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={newborn}
              alt="Newborn Photography"
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
              Newborn Photography
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Tender, intimate portraits of your newest family member
            </motion.p>
          </div>
        </section>

        {/* Description Section */}
        <section className="section-padding bg-background">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal animation="slideLeft">
                <div className="space-y-6">
                  <p className="text-primary text-sm tracking-[0.3em] uppercase">About This Service</p>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                    Precious First Moments
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Those first few weeks of life are fleeting and precious. Newborn photography 
                      captures the tiny details—delicate fingers, peaceful expressions, and the pure 
                      innocence of your baby's earliest days.
                    </p>
                    <p>
                      Our newborn sessions are conducted with the utmost care and patience. We maintain 
                      a warm, comfortable studio environment and never rush the process. Your baby's 
                      safety and comfort are our absolute priorities.
                    </p>
                    <p>
                      We recommend booking your newborn session during pregnancy to ensure availability. 
                      The ideal time for portraits is within the first 5-14 days when babies are 
                      naturally sleepy and curly.
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
                      src={newborn}
                      alt="Newborn session"
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

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                Welcome Your Little One
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Book during your pregnancy to secure your preferred date. 
                We'll schedule the exact session date once your baby arrives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="btn-luxury bg-cream text-espresso hover:bg-cream/90">
                    Book Now
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="outline" className="bg-transparent border-cream/40 text-cream hover:bg-cream/10 hover:text-cream px-8 uppercase tracking-widest">
                    View Gallery
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

export default Newborn;
