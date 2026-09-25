import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import babyshower from "@/assets/portfolio-babyshower.jpg";
import maternity from "@/assets/portfolio-maternity.jpg";
import newborn from "@/assets/portfolio-newborn.jpg";
import prebirthday from "@/assets/portfolio-prebirthday.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

import newimage1 from "@/assets/baby (1).jpeg";
import newimage2 from "@/assets/couple (1).jpeg";
import newimage3 from "@/assets/photographer.jpg";
import newimage4 from "@/assets/hero-3.jpg";

const categories = ["All", "Maternity", "Newborn", "Baby Shower", "Pre-Birthday"];

const images = [
  { src: hero1, category: "Maternity", title: "Golden Hour Dreams" },
  { src: hero2, category: "Newborn", title: "Peaceful Slumber" },
  { src: hero3, category: "Baby Shower", title: "Celebration of Love" },
  { src: maternity, category: "Maternity", title: "Garden Radiance" },
  { src: newborn, category: "Newborn", title: "Tender Embrace" },
  { src: babyshower, category: "Baby Shower", title: "Joyful Anticipation" },
  { src: prebirthday, category: "Pre-Birthday", title: "Little Star" },
  { src: newimage1, category: "Baby Shower", title: "Little Star 1" },
  { src: newimage2, category: "Maternity", title: "Celebration of Love 1" },
  { src: newimage3, category: "Maternity", title: "Celebration of Love 1" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-background">
        <div className="container-luxury text-center">
          <ScrollReveal animation="fadeUp">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Visual Stories
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              Gallery
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A curated collection of our finest work, showcasing the art of
              capturing life's most beautiful moments
            </p>
            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-8 md:pb-12 bg-background">
        <div className="container-luxury">
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    "chip-luxury px-6 uppercase",
                    activeCategory === category && "is-active"
                  )}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.src + image.category}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="image-reveal aspect-[4/5] rounded-sm overflow-hidden shadow-soft relative">
                    <motion.img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7 }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/60 transition-all duration-500 flex items-end p-6">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-cream text-xs tracking-wider uppercase mb-1">
                          {image.category}
                        </p>
                        <p className="text-cream font-serif text-xl">
                          {image.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 right-6 text-cream p-2.5 rounded-full border border-cream/20 bg-cream/10 backdrop-blur-md hover:bg-cream/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </motion.button>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-5xl max-h-[90vh] w-full"
            >
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                className="w-full h-full object-contain rounded-lg"
              />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-6"
              >
                <p className="text-cream/60 text-xs tracking-wider uppercase mb-1">
                  {filteredImages[selectedImage].category}
                </p>
                <p className="text-cream font-serif text-2xl">
                  {filteredImages[selectedImage].title}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default Gallery;
