import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Camera, Heart, Sparkles, Clock, Cake, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import prebirthday from "@/assets/portfolio-prebirthday.jpg";

const features = [
  { icon: Camera, title: "Theme Sessions", description: "Custom setups matching your chosen theme" },
  { icon: Heart, title: "Personality Capture", description: "Showcasing your child's unique character" },
  { icon: Cake, title: "Cake Smash Option", description: "Fun, messy cake smash photos included" },
  { icon: Clock, title: "1.5-2 Hour Session", description: "Relaxed pace for genuine expressions" },
  { icon: Sparkles, title: "Props & Decor", description: "Age-appropriate props and backdrops" },
  { icon: Star, title: "Vibrant Editing", description: "Colorful, joyful post-processing style" },
];

const PreBirthday = () => {
  return (
    <>
      <Helmet>
        <title>Pre-Birthday Photography | Epikmakers Photography</title>
        <meta
          name="description"
          content="Celebrate your child's milestone birthday with themed pre-birthday photography. Includes cake smash option, custom props, and vibrant editing for joyful portraits."
        />
        <meta
          name="keywords"
          content="pre-birthday photography, cake smash photos, first birthday shoot, birthday portraits, milestone photography, toddler photos"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://littlenest.com/services/pre-birthday" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Pre-Birthday Photography | Epikmakers Photography" />
        <meta property="og:description" content="Celebrate your child's milestone birthday with themed pre-birthday photography. Includes cake smash option and custom props." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://littlenest.com/services/pre-birthday" />
        <meta property="og:site_name" content="Epikmakers Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pre-Birthday Photography | Epikmakers Photography" />
        <meta name="twitter:description" content="Celebrate your child's milestone birthday with themed pre-birthday photography." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Pre-Birthday Photography",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers Photography",
              "url": "https://littlenest.com"
            },
            "description": "Themed pre-birthday photography sessions celebrating childhood milestones. 1.5-2 hour sessions with cake smash option, custom props, and vibrant editing.",
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
              src={prebirthday}
              alt="Pre-Birthday Photography"
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
              Pre-Birthday Shoot
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Whimsical celebrations capturing the magic of growing up
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
                    Celebrating Milestones
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Every birthday marks another wonderful year of growth, discovery, and joy. 
                      Our pre-birthday photography sessions capture your child's personality at 
                      this special age before their big celebration.
                    </p>
                    <p>
                      Whether it's a first birthday cake smash, a whimsical themed session, or 
                      candid portraits that showcase their emerging personality, we create images 
                      that you'll cherish as they continue to grow.
                    </p>
                    <p>
                      We work with you to design a session that reflects your child's interests 
                      and your family's style. From balloon garlands to custom backdrops, every 
                      detail is thoughtfully curated.
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
                      src={prebirthday}
                      alt="Pre-Birthday session"
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
                Mark This Special Milestone
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Book 2-4 weeks before your child's birthday to allow time for 
                photo delivery before the celebration.
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

export default PreBirthday;
