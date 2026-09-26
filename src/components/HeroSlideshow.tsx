import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Maternity",
    subtitle: "Celebrating the beauty of new beginnings",
  },
  {
    image: hero2,
    title: "Newborn",
    subtitle: "Capturing those precious first moments",
  },
  {
    image: hero3,
    title: "Baby Shower",
    subtitle: "Celebrating the joy of anticipation",
  },
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Swipe between slides on touch screens, where the arrow buttons are hidden
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX < 0) nextSlide();
    else prevSlide();
  };

  return (
    <section
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen h-[100svh] min-h-[560px] overflow-hidden"
    >
      {/* Background Slides with Parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out",
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
            {/* On narrow screens the text spans the whole image, so give its lower half a stronger wash */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background/90 via-background/70 to-transparent md:hidden" />
          </div>
        ))}
      </motion.div>

      {/* Content with Fade on Scroll */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 sm:pb-32 md:pb-40 container-luxury"
      >
        <div className="max-w-2xl">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4 animate-fade-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            {slides[currentSlide].subtitle}
          </p>
          <h1
            key={currentSlide}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-foreground mb-6 animate-fade-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]"
          >
            {slides[currentSlide].title}
          </h1>
          <p className="text-foreground/80 text-base sm:text-lg md:text-xl font-light mb-8 max-w-lg animate-fade-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
            Timeless photography that tells your unique story with elegance and
            artistry
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
            <Link to="/portfolio" className="btn-luxury">
              View Portfolio
            </Link>
            <Link to="/contact" className="btn-outline-luxury">
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-40 right-8 lg:right-12 hidden md:flex gap-2 z-20">
        <button
          onClick={prevSlide}
          className="glass-panel rounded-full p-3 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="glass-panel rounded-full p-3 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group py-4 px-1"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={cn(
                "block h-0.5 transition-all duration-500",
                index === currentSlide
                  ? "w-12 bg-primary"
                  : "w-6 bg-foreground/30 group-hover:bg-foreground/50"
              )}
            />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSlideshow;