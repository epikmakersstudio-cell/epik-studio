import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { services, type ServiceId } from "@/data/services";

import babyshower from "@/assets/portfolio-babyshower.jpg";
import maternity from "@/assets/portfolio-maternity.jpg";
import newborn from "@/assets/portfolio-newborn.jpg";
import prebirthday from "@/assets/portfolio-prebirthday.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const serviceName = (id: ServiceId) => services.find((s) => s.id === id)!.name;

// Only services with studio work to show are listed here, in the same order as the services menu
const categories = [
  {
    id: "baby-shower-maternity",
    title: serviceName("baby-shower-maternity"),
    subtitle: "The beauty of motherhood",
    description:
      "Celebrate the incredible journey of pregnancy and the joy of welcoming a new life. From ethereal maternity portraits to the heartfelt moments of your baby shower, we create timeless images of this transformative time.",
    coverImage: maternity,
    images: [maternity, babyshower, hero1, hero3],
  },
  {
    id: "pre-birthday-birthday",
    title: serviceName("pre-birthday-birthday"),
    subtitle: "Whimsical celebrations",
    description:
      "Mark your little one's milestone with magical, playful photography. From themed pre-birthday shoots to the birthday party itself, we create enchanting images that capture their unique personality.",
    coverImage: prebirthday,
    images: [prebirthday],
  },
  {
    id: "newborn",
    title: serviceName("newborn"),
    subtitle: "First precious moments",
    description:
      "Those tiny fingers, peaceful sleeps, and pure innocence—newborn photography preserves the fleeting beauty of your baby's earliest days in artistic, tender portraits.",
    coverImage: newborn,
    images: [newborn, hero2],
  },
];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-background">
        <div className="container-luxury text-center">
          <ScrollReveal animation="fadeUp">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Our Work
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              Portfolio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of life's most precious moments,
              captured with artistry and love
            </p>
            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          <div className="space-y-20 md:space-y-32">
            {categories.map((category, index) => (
              <ScrollReveal 
                key={category.id}
                animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
              >
                <div
                  id={category.id}
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center",
                    index % 2 === 1 && "lg:flex-row-reverse"
                  )}
                >
                  {/* Image */}
                  <div
                    className={cn(
                      "relative",
                      index % 2 === 1 && "lg:order-2"
                    )}
                  >
                    <motion.div 
                      className="image-reveal aspect-[4/3] rounded-sm overflow-hidden shadow-elevated"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={category.coverImage}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    {/* Decorative Elements */}
                    <div
                      className={cn(
                        "absolute -bottom-6 w-full h-full border-2 border-primary/20 rounded-sm -z-10",
                        index % 2 === 0 ? "-right-6" : "-left-6"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className={cn(index % 2 === 1 && "lg:order-1")}>
                    <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                      {category.subtitle}
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6">
                      {category.title}
                    </h2>
                    <div className="divider-elegant ml-0 mb-6" />
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {category.description}
                    </p>
                    
                    {/* Mini Gallery */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {category.images.slice(0, 2).map((img, i) => (
                        <motion.div
                          key={i}
                          className="image-reveal aspect-square rounded-sm overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={img}
                            alt={`${category.title} ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => setSelectedCategory(category.id)}
                      className="btn-outline-luxury text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Full Gallery
                    </motion.button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-espresso/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="max-w-4xl w-full"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories
                .find((c) => c.id === selectedCategory)
                ?.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
            <p className="text-cream text-center mt-6 text-sm">
              Click anywhere to close
            </p>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
};

export default Portfolio;
