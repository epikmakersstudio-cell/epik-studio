import { useCallback, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { services, type ServiceId } from "@/data/services";
import PortfolioGallery from "@/components/PortfolioGallery";

import fashion from "@/assets/portfolio-fashion.jpg";
import fashion2 from "@/assets/portfolio-fashion-2.jpg";
import heroFashion from "@/assets/hero-fashion.jpg";
import wedding from "@/assets/portfolio-wedding.jpg";
import wedding2 from "@/assets/portfolio-wedding-2.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";
import babyshower from "@/assets/portfolio-babyshower.jpg";
import maternity from "@/assets/portfolio-maternity.jpg";
import couple1 from "@/assets/couple (1).jpeg";
import couple2 from "@/assets/couple (2).jpeg";
import couple4 from "@/assets/couple (4).jpeg";
import hero1 from "@/assets/hero-1.jpg";
import hero3 from "@/assets/hero-3.jpg";
import birthday from "@/assets/portfolio-prebirthday-1.jpg";
import birthday2 from "@/assets/portfolio-birthday-2.jpg";
import heroBirthday from "@/assets/hero-birthday.jpg";
import newborn from "@/assets/portfolio-newborn.jpg";
import newbornWrap from "@/assets/portfolio-prebirthday.jpg";
import baby1 from "@/assets/baby (1).jpeg";
import baby3 from "@/assets/baby (3).jpeg";
import hero2 from "@/assets/hero-2.jpg";
import hero22 from "@/assets/hero-22.jpg";
import family from "@/assets/portfolio-family.jpg";
import family2 from "@/assets/portfolio-family-2.jpg";
import heroFamily from "@/assets/hero-family.jpg";

type CategoryDetails = {
  subtitle: string;
  description: string;
  coverImage: string;
  images: string[];
};

const categoryDetails: Record<ServiceId, CategoryDetails> = {
  fashion: {
    subtitle: "Editorial style",
    description:
      "Bold, confident imagery for portfolios, brands and personal style shoots. We plan every look, guide every pose and finish each frame with magazine-quality retouching.",
    coverImage: heroFashion,
    images: [fashion, fashion2, heroFashion],
  },
  wedding: {
    subtitle: "Love stories",
    description:
      "From the first look to the last dance, we tell the story of your wedding day with candid moments, heartfelt rituals and timeless portraits of the two of you.",
    coverImage: heroWedding,
    images: [wedding, wedding2, heroWedding],
  },
  "baby-shower-maternity": {
    subtitle: "The beauty of motherhood",
    description:
      "Celebrate the incredible journey of pregnancy and the joy of welcoming a new life. From ethereal maternity portraits to the heartfelt moments of your baby shower, we create timeless images of this transformative time.",
    coverImage: maternity,
    images: [couple2, couple4, couple1, maternity, babyshower, hero1, hero2, hero3],
  },
  "pre-birthday-birthday": {
    subtitle: "Whimsical celebrations",
    description:
      "Mark your little one's milestone with magical, playful photography. From themed pre-birthday shoots to the birthday party itself, we create enchanting images that capture their unique personality.",
    coverImage: heroBirthday,
    images: [birthday, birthday2, heroBirthday],
  },
  newborn: {
    subtitle: "First precious moments",
    description:
      "Those tiny fingers, peaceful sleeps, and pure innocence—newborn photography preserves the fleeting beauty of your baby's earliest days in artistic, tender portraits.",
    coverImage: newborn,
    images: [baby1, newbornWrap, baby3, newborn, hero22],
  },
  "family-portraits": {
    subtitle: "Generations together",
    description:
      "Timeless portraits that celebrate the bonds between parents, children and grandparents—relaxed, natural sessions in the studio or outdoors that let your family's personality shine.",
    coverImage: heroFamily,
    images: [family2, family, heroFamily],
  },
};

// Every service gets a portfolio section, in the same order as the services menu
const categories = services.map((service) => ({
  id: service.id,
  title: service.name,
  ...categoryDetails[service.id],
}));

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number] | null>(null);
  const closeGallery = useCallback(() => setSelectedCategory(null), []);

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
                      onClick={() => setSelectedCategory(category)}
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

      {/* Full gallery: photos uploaded through the API, each linked to its Instagram post */}
      {selectedCategory && (
        <PortfolioGallery category={selectedCategory} onClose={closeGallery} />
      )}

      <Footer />
    </main>
  );
};

export default Portfolio;
