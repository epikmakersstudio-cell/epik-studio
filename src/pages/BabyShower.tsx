import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Heart, Sparkles, Clock, Users, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import babyshower from "@/assets/portfolio-babyshower.jpg";

const features = [
  { icon: Camera, title: "Professional Setup", description: "Studio or on-location with premium equipment" },
  { icon: Heart, title: "Personalized Themes", description: "Custom decorations matching your celebration" },
  { icon: Sparkles, title: "Creative Direction", description: "Artistic poses and candid moments captured" },
  { icon: Clock, title: "2-3 Hour Session", description: "Ample time for all group and detail shots" },
  { icon: Users, title: "Guest Coverage", description: "Beautiful portraits of all your loved ones" },
  { icon: Star, title: "Premium Editing", description: "Professional retouching and color grading" },
];

const BabyShower = () => {
  return (
    <>
      <Helmet>
        <title>Baby Shower & Maternity Photography | Epikmakers</title>
        <meta
          name="description"
          content="Maternity portraits and baby shower photography in Hanamkonda. Celebrate your pregnancy and capture decorations, guest portraits and heartfelt moments of anticipation and joy."
        />
        <meta
          name="keywords"
          content="maternity photoshoot, maternity photography, pregnancy photos, baby shower photography, baby shower photographer, celebration photos"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://epikmakers.com/services/baby-shower" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Baby Shower & Maternity Photography | Epikmakers" />
        <meta property="og:description" content="Document your baby shower celebration with professional photography. Capture decorations, guests, and heartfelt moments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://epikmakers.com/services/baby-shower" />
        <meta property="og:site_name" content="Epikmakers" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baby Shower & Maternity Photography | Epikmakers" />
        <meta name="twitter:description" content="Document your baby shower celebration with professional photography." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Baby Shower & Maternity Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers",
              "url": "https://epikmakers.com"
            },
            "description": "Maternity portraits and baby shower photography, from styled pregnancy sessions to event coverage with guest portraits, decorations and candid celebration moments.",
            "areaServed": "Local Area",
            "serviceType": "Event Photography"
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
              src={babyshower}
              alt="Baby Shower Photography"
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
              Baby Shower & Maternity
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Celebrate the radiant beauty of motherhood and the joy of anticipation
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
                    Celebrating Motherhood
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Pregnancy is a once-in-a-lifetime journey. Our maternity portraits celebrate your
                      glow, your bump and the bond with your partner and family, in the studio or outdoors,
                      with styling guidance so you feel beautiful and at ease.
                    </p>
                    <p>
                      A baby shower is one of the most joyous celebrations—a gathering of love, laughter,
                      and anticipation. Our baby shower photography service ensures every precious moment
                      is beautifully preserved.
                    </p>
                    <p>
                      From the intricate decorations to the heartfelt gift-opening moments, we capture 
                      the essence of your celebration with an artistic eye. Our approach blends candid 
                      documentary-style photography with carefully composed portraits.
                    </p>
                    <p>
                      We work closely with you to understand your theme, color palette, and vision, 
                      ensuring the photos perfectly complement your celebration's aesthetic.
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
                      src={babyshower}
                      alt="Baby Shower session"
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
                Ready to Celebrate?
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Let's create beautiful memories of your baby shower celebration. 
                Contact us to discuss your vision and book your session.
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

export default BabyShower;
