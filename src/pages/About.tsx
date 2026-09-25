import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Camera, Heart, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import photographerImage from "@/assets/photographer.jpg";
import hero1 from "@/assets/hero-1.jpg";

const stats = [
  { icon: Camera, value: "1000+", label: "Sessions Completed" },
  { icon: Heart, value: "500+", label: "Happy Families" },
  { icon: Award, value: "15+", label: "Awards Won" },
  { icon: Users, value: "10+", label: "Years Experience" },
];

const About = () => {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-background">
        <div className="container-luxury text-center">
          <ScrollReveal animation="fadeUp">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              The Artist
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              About Me
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate about capturing life's most precious moments with
              artistry and emotion
            </p>
            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image Column */}
            <div className="space-y-8">
              <ScrollReveal animation="slideLeft">
                <div className="relative">
                  <motion.div 
                    className="aspect-[3/4] rounded-sm overflow-hidden shadow-elevated"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={photographerImage}
                      alt="Professional Photographer"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/30 rounded-sm -z-10" />
                </div>
              </ScrollReveal>

              {/* Behind the Scenes */}
              <ScrollReveal animation="fadeUp" delay={0.2}>
                <div className="aspect-video rounded-sm overflow-hidden shadow-soft">
                  <img
                    src={hero1}
                    alt="Behind the scenes"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column */}
            <div className="lg:sticky lg:top-32">
              <ScrollReveal animation="slideRight">
                <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">
                  Hello, I'm <span className="text-primary">Isabella Rose</span>
                </h2>
                <div className="divider-elegant ml-0 mb-8" />

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Photography found me at a pivotal moment in my life—when I was
                    expecting my first child. The desire to capture every precious
                    moment sparked a passion that has now spanned over a decade.
                  </p>
                  <p>
                    I believe that every family has a unique story worth telling.
                    My approach combines fine-art aesthetics with genuine emotion,
                    creating images that feel both timeless and deeply personal.
                    Whether it's the gentle curve of a mother's silhouette or the
                    tiny details of a newborn's fingers, I seek to preserve these
                    fleeting moments in their purest form.
                  </p>
                  <p>
                    My studio is a sanctuary—a warm, comfortable space designed to
                    put you at ease. Here, we create together, collaborate on
                    your vision, and craft imagery that you'll treasure for
                    generations.
                  </p>
                </div>
              </ScrollReveal>

              {/* Philosophy */}
              <ScrollReveal animation="fadeUp" delay={0.2}>
                <div className="mt-10 p-8 bg-secondary surface-card">
                  <h3 className="font-serif text-2xl mb-4">My Philosophy</h3>
                  <p className="text-muted-foreground italic">
                    "Every photograph should evoke emotion—a moment frozen in time
                    that speaks to the heart. I don't just take pictures; I create
                    art that tells your story with beauty, grace, and authenticity."
                  </p>
                </div>
              </ScrollReveal>

              {/* Awards */}
              <ScrollReveal animation="fadeUp" delay={0.3}>
                <div className="mt-10">
                  <h3 className="font-serif text-2xl mb-6">Recognition</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <Award size={18} className="text-primary" />
                      <span>Best Newborn Photographer 2023 - Photography Awards</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award size={18} className="text-primary" />
                      <span>Excellence in Maternity Photography - Fine Art Guild</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award size={18} className="text-primary" />
                      <span>Featured Artist - Modern Motherhood Magazine</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary">
        <div className="container-luxury">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" staggerDelay={0.1}>
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <stat.icon
                    size={32}
                    className="mx-auto mb-4 text-primary"
                  />
                  <motion.p 
                    className="font-serif text-4xl md:text-5xl font-medium mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-muted-foreground text-sm tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
