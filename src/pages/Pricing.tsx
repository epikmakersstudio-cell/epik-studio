import { motion } from "framer-motion";
import { Check, MessageCircle, Camera, Heart, Sparkles, Users, Baby, Cake } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "919876543210"; // Replace with actual WhatsApp number
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const packages = [
  {
    name: "Maternity",
    icon: Heart,
    description: "Celebrate the beauty of pregnancy",
    features: [
      "1.5-2 hour session",
      "Studio or outdoor location",
      "2 outfit changes",
      "Partner/sibling inclusion",
      "Styling guidance",
      "20+ edited digital images",
      "Online gallery access",
      "Print release included",
    ],
    popular: false,
    whatsappMessage: "Hi! I'm interested in the Maternity Photography package. Could you please share the pricing details?",
  },
  {
    name: "Newborn",
    icon: Baby,
    description: "Capture precious first moments",
    features: [
      "2-4 hour patient session",
      "Best within 5-14 days",
      "Family & sibling photos",
      "Organic props & wraps",
      "Safety-first posing",
      "30+ edited digital images",
      "Online gallery access",
      "Print release included",
    ],
    popular: true,
    whatsappMessage: "Hi! I'm interested in the Newborn Photography package. Could you please share the pricing details?",
  },
  {
    name: "Baby Shower",
    icon: Sparkles,
    description: "Document your celebration",
    features: [
      "2-3 hour event coverage",
      "Venue or studio setup",
      "Guest & group portraits",
      "Detail & decoration shots",
      "Candid moment capture",
      "50+ edited digital images",
      "Online gallery access",
      "Print release included",
    ],
    popular: false,
    whatsappMessage: "Hi! I'm interested in the Baby Shower Photography package. Could you please share the pricing details?",
  },
  {
    name: "Pre-Birthday",
    icon: Cake,
    description: "Celebrate milestones in style",
    features: [
      "1.5-2 hour themed session",
      "Custom setup & decor",
      "Cake smash option",
      "Multiple outfit changes",
      "Age-appropriate props",
      "25+ edited digital images",
      "Online gallery access",
      "Print release included",
    ],
    popular: false,
    whatsappMessage: "Hi! I'm interested in the Pre-Birthday Photography package. Could you please share the pricing details?",
  },
  {
    name: "Family Portraits",
    icon: Users,
    description: "Timeless family memories",
    features: [
      "1-2 hour session",
      "Studio or outdoor location",
      "All family sizes welcome",
      "Wardrobe coordination tips",
      "Natural & posed shots",
      "20+ edited digital images",
      "Online gallery access",
      "Print release included",
    ],
    popular: false,
    whatsappMessage: "Hi! I'm interested in the Family Portraits package. Could you please share the pricing details?",
  },
];

const addOns = [
  { name: "Additional edited images", description: "Per 10 images" },
  { name: "Premium album", description: "Handcrafted 20-page album" },
  { name: "Canvas prints", description: "Gallery-quality wall art" },
  { name: "Video highlight", description: "60-second session recap" },
  { name: "Rush delivery", description: "48-hour turnaround" },
  { name: "Extended session", description: "Additional hour coverage" },
];

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Photography Packages & Pricing | Epikmakers Photography</title>
        <meta
          name="description"
          content="Explore Epikmakers Photography packages for maternity, newborn, baby shower, pre-birthday, and family portrait sessions. Contact us on WhatsApp for personalized pricing."
        />
        <meta
          name="keywords"
          content="photography pricing, maternity package, newborn photography cost, baby shower photographer, family portrait pricing, pre-birthday photo session"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://littlenest.com/pricing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Photography Packages & Pricing | Epikmakers Photography" />
        <meta property="og:description" content="Explore our photography packages for maternity, newborn, baby shower, pre-birthday, and family portraits. Contact us for personalized pricing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://littlenest.com/pricing" />
        <meta property="og:site_name" content="Epikmakers Photography" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Photography Packages & Pricing | Epikmakers Photography" />
        <meta name="twitter:description" content="Explore our photography packages for maternity, newborn, baby shower, pre-birthday, and family portraits." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Epikmakers Photography Services",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Epikmakers Photography",
              "url": "https://littlenest.com"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Photography Packages",
              "itemListElement": packages.map((pkg, index) => ({
                "@type": "Offer",
                "position": index + 1,
                "itemOffered": {
                  "@type": "Service",
                  "name": `${pkg.name} Photography`,
                  "description": pkg.description
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl" />
          </div>
          
          <div className="container-luxury relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                Investment
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
                Photography Packages
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                Each session is thoughtfully crafted to capture your family's unique story. 
                Contact us on WhatsApp for personalized pricing and package details.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="section-padding bg-background">
          <div className="container-luxury">
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div 
                    className={`card-luxury overflow-visible p-8 h-full flex flex-col relative ${
                      pkg.popular ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-full font-medium tracking-wide">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <pkg.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-2xl mb-2">{pkg.name}</h3>
                      <p className="text-muted-foreground text-sm">{pkg.description}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a
                      href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(pkg.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        className={`w-full gap-2 ${
                          pkg.popular 
                            ? "btn-luxury" 
                            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Get Pricing on WhatsApp
                      </Button>
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Add-Ons Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-luxury">
            <ScrollReveal animation="fadeUp" className="text-center mb-12">
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                Enhance Your Experience
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                Optional Add-Ons
              </h2>
              <div className="divider-elegant" />
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <ScrollReveal key={addon.name} animation="fadeUp" delay={index * 0.1}>
                  <div className="bg-background surface-card p-6 text-center">
                    <h4 className="font-serif text-lg mb-2">{addon.name}</h4>
                    <p className="text-muted-foreground text-sm">{addon.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ-style Info */}
        <section className="section-padding bg-background">
          <div className="container-luxury max-w-4xl">
            <ScrollReveal animation="fadeUp" className="text-center mb-12">
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                What to Expect
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                The Experience
              </h2>
              <div className="divider-elegant" />
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal animation="slideLeft">
                <div className="space-y-6">
                  <div className="card-luxury p-6">
                    <h4 className="font-serif text-lg mb-2">Booking Process</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      After our initial WhatsApp consultation, we'll discuss your vision, 
                      schedule your session, and finalize all details. A booking fee secures your date.
                    </p>
                  </div>
                  <div className="card-luxury p-6">
                    <h4 className="font-serif text-lg mb-2">Session Day</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Arrive relaxed and ready! We'll guide you through poses, capture candid 
                      moments, and ensure everyone feels comfortable throughout the session.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal animation="slideRight">
                <div className="space-y-6">
                  <div className="card-luxury p-6">
                    <h4 className="font-serif text-lg mb-2">Editing & Delivery</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Your images are carefully edited within 2-3 weeks. You'll receive a 
                      private online gallery to view, share, and download your photographs.
                    </p>
                  </div>
                  <div className="card-luxury p-6">
                    <h4 className="font-serif text-lg mb-2">Prints & Products</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Choose from premium prints, albums, and wall art. We partner with 
                      professional labs to ensure museum-quality products that last generations.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-espresso text-cream">
          <div className="container-luxury text-center">
            <ScrollReveal animation="fadeUp">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                Ready to Book Your Session?
              </h2>
              <p className="text-cream/80 max-w-2xl mx-auto mb-8">
                Let's discuss your vision and create something beautiful together. 
                Reach out on WhatsApp for personalized pricing and availability.
              </p>
              <a
                href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent("Hi! I'm interested in booking a photography session. Could you please share more details about your packages?")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="btn-luxury bg-cream text-espresso hover:bg-cream/90 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
