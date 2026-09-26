import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import maternity from "@/assets/portfolio-maternity.jpg";
import newborn from "@/assets/portfolio-newborn.jpg";
import prebirthday from "@/assets/portfolio-prebirthday.jpg";
import family from "@/assets/portfolio-family.jpg";
import fashion from "@/assets/portfolio-fashion.jpg";
import wedding from "@/assets/portfolio-wedding.jpg";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";

const services = [
  {
    title: "Fashion",
    description:
      "Bold, editorial imagery that brings your style and personality to life",
    image: fashion,
    link: "/services/fashion",
    imagePosition: "object-top",
  },
  {
    title: "Wedding",
    description:
      "Timeless storytelling of your love, from the vows to the last dance",
    image: wedding,
    link: "/services/wedding",
  },
  {
    title: "Baby Shower & Maternity",
    description:
      "Celebrate the radiant beauty of motherhood and the joy of anticipation",
    image: maternity,
    link: "/services/baby-shower",
  },
  {
    title: "Pre-Birthday & Birthday",
    description:
      "Whimsical celebrations capturing the magic of growing up",
    image: prebirthday,
    link: "/services/pre-birthday",
  },
  {
    title: "Newborn",
    description:
      "Tender, intimate portraits of your newest family member",
    image: newborn,
    link: "/services/newborn",
  },
  {
    title: "Family Portraits",
    description:
      "Timeless portraits celebrating your family's unique story and connections",
    image: family,
    link: "/services/family-portraits",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-16 md:mb-20">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
            Our Expertise
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Photography Services
          </h2>
          <div className="divider-elegant mt-6" />
        </ScrollReveal>

        {/* Services Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <Link
                to={service.link}
                className="group card-luxury block"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover ${service.imagePosition ?? ""}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2">
                      {service.title}
                    </h3>
                    <p className="text-cream/80 text-sm md:text-base font-light mb-4 max-w-xs">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm tracking-wider uppercase">
                      <span>Explore</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default ServicesSection;
