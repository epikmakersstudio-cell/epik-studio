import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const decorY1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Gradient with Parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 -top-[20%] -bottom-[20%] bg-gradient-to-br from-primary/10 via-rose-gold-light/20 to-champagne" 
      />
      
      {/* Decorative Elements with Parallax */}
      <motion.div 
        style={{ y: decorY1 }}
        className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        style={{ y: decorY2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.8, 0.5, 0.8]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-luxury relative z-10">
        <ScrollReveal animation="scaleIn" className="max-w-3xl mx-auto text-center">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-6">
            Begin Your Journey
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-8 leading-tight">
            Let's Create Something
            <br />
            <span className="italic">Beautiful Together</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-light mb-10 max-w-xl mx-auto">
            Ready to capture your special moments? Book a consultation and let's
            discuss how we can tell your unique story through timeless imagery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-luxury">
              Book Your Session
            </Link>
            <Link
              to="/portfolio"
              className="btn-outline-luxury inline-flex items-center justify-center gap-2"
            >
              <span>View Portfolio</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;