import { Star, Quote } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Maternity Session",
    content:
      "The most magical experience! Every photo captured my pregnancy journey with such elegance and emotion. I will treasure these forever.",
    rating: 5,
  },
  {
    name: "Emily & James",
    role: "Newborn Photography",
    content:
      "Absolutely breathtaking work. She captured our daughter's first days with such tenderness and artistry. Beyond our expectations.",
    rating: 5,
  },
  {
    name: "Rachel Thompson",
    role: "Baby Shower Shoot",
    content:
      "From start to finish, the experience was luxurious and stress-free. The photos are like pages from a high-end magazine.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-luxury">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-16 md:mb-20">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
            Client Love
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Words from the Heart
          </h2>
          <div className="divider-elegant mt-6" />
        </ScrollReveal>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="bg-background surface-card p-8 md:p-10 relative hover:shadow-elevated transition-all duration-500">
                {/* Quote Icon */}
                <Quote
                  size={40}
                  className="text-primary/20 absolute top-6 right-6"
                />

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-gold text-gold"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div>
                  <p className="font-serif text-lg">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TestimonialsSection;
