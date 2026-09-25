import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import photographerImage from "@/assets/photographer.jpg";
import ScrollReveal from "./ScrollReveal";

const AboutPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["15%", "-5%"]);

  return (
    <section ref={sectionRef} className="section-padding bg-background overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with Parallax */}
          <ScrollReveal animation="slideLeft" className="relative order-2 lg:order-1">
            <div ref={imageRef} className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-sm">
              <motion.img
                style={{ y: imageY }}
                src={photographerImage}
                alt="Professional Photographer"
                className="w-[110%] h-[120%] object-cover shadow-elevated absolute -top-[10%] left-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Decorative Frame with Parallax */}
            <motion.div 
              style={{ y: frameY }}
              className="absolute -bottom-6 -right-6 w-full max-w-md h-full border-2 border-primary/30 rounded-sm -z-10 pointer-events-none" 
            />
            {/* Experience Badge */}
            <motion.div 
              className="absolute -bottom-4 -left-4 lg:left-auto lg:-right-8 lg:bottom-12 bg-primary text-primary-foreground p-6 rounded-lg shadow-elevated"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            >
              <p className="font-serif text-3xl md:text-4xl font-medium">10+</p>
              <p className="text-xs tracking-wider uppercase">Years of Artistry</p>
            </motion.div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal animation="slideRight" delay={0.2} className="order-1 lg:order-2">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Meet the Artist
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 leading-tight">
              Crafting Timeless
              <br />
              <span className="text-primary">Memories</span>
            </h2>
            <div className="divider-elegant ml-0 mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              With over a decade of experience in lifestyle and portrait
              photography, I specialize in capturing life's most intimate
              moments with grace and authenticity. My approach blends
              fine-art aesthetics with genuine emotion, creating images that
              feel both timeless and deeply personal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every session is a collaboration—a journey we take together to
              tell your unique story. From the gentle curves of maternity to
              the pure innocence of newborns, I'm honored to document these
              fleeting, precious chapters of your life.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-foreground font-medium tracking-wider uppercase text-sm group"
            >
              <span>Discover My Story</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;