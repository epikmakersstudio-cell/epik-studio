import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Heart, Sparkles, Clock, Users, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import photographer from "@/assets/photographer.jpg";

const features = [
  { icon: Camera, title: "Studio & Outdoor", description: "Flexible location options to suit your style" },
  { icon: Heart, title: "Genuine Connections", description: "Capturing authentic family bonds and love" },
  { icon: Users, title: "All Sizes Welcome", description: "From couples to extended family gatherings" },
  { icon: Clock, title: "1-2 Hour Session", description: "Comfortable pace for natural expressions" },
  { icon: Sparkles, title: "Wardrobe Coordination", description: "Color palette and styling guidance" },
  { icon: Star, title: "Timeless Editing", description: "Classic, elegant post-processing" },
];

const FamilyPortraits = () => {
  return (
    <>
      <Helmet>
        <title>Family Portrait Photography | Epikmakers</title>
        <meta
          name="description"
          content="Create timeless family portraits that celebrate your unique story. Professional family photography for couples, parents with children, and extended family gatherings."
        />
        <meta
          name="keywords"
          content="family photography, family portraits, family photos, generational portraits, couple photography, children photography"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://epikmakers.com/services/family-portraits" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Family Portrait Photography | Epikmakers" />
        <meta property="og:description" content="Create timeless family portraits that celebrate your unique story. Professional photography for all family sizes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://epikmakers.com/services/family-portraits" />
        <meta property="og:site_name" content="Epikmakers" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Family Portrait Photography | Epikmakers" />
        <meta name="twitter:description" content="Create timeless family portraits that celebrate your unique story." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Family Portrait Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers",
              "url": "https://epikmakers.com"
            },
            "description": "Professional family portrait photography capturing authentic connections and timeless moments. 1-2 hour sessions with wardrobe coordination and classic editing.",
            "areaServed": "Local Area",
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
              src={photographer}
              alt="Family Portraits Photography"
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
              Family Portraits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Timeless portraits celebrating your family's unique story and connections
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
                    Your Family's Legacy
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Family portraits are more than just photographs—they're heirlooms that capture 
                      your family at this moment in time. As children grow and families evolve, these 
                      images become treasured connections to the past.
                    </p>
                    <p>
                      Our family sessions focus on genuine interactions and authentic emotions. We 
                      guide you through natural poses while leaving room for spontaneous moments of 
                      laughter, hugs, and connection.
                    </p>
                    <p>
                      Whether you're a couple expecting your first child, parents with young children, 
                      or planning a multi-generational portrait session, we create a relaxed environment 
                      where your family's personality can shine through.
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
                      src={photographer}
                      alt="Family portrait session"
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
                Create Lasting Memories
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Schedule your family portrait session today. 
                These moments are fleeting—let's preserve them beautifully.
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

export default FamilyPortraits;
