import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Mitchell",
    role: "Maternity Session",
    date: "December 2024",
    content:
      "The most magical experience of my pregnancy journey! Isabella has an incredible gift for making you feel comfortable and beautiful. Every photo captured the essence of this transformative time with such elegance and emotion. These images are treasures I will hold close forever.",
    rating: 5,
  },
  {
    name: "Emily & James Carter",
    role: "Newborn Photography",
    date: "November 2024",
    content:
      "We are absolutely blown away by the photographs of our daughter's first days. Isabella's patience, gentleness, and artistic vision created images that we'll cherish for a lifetime. She captured moments we didn't even know we were making. Truly exceptional.",
    rating: 5,
  },
  {
    name: "Rachel Thompson",
    role: "Baby Shower Shoot",
    date: "October 2024",
    content:
      "From the initial consultation to receiving the final gallery, the entire experience was luxurious and stress-free. Isabella captured the joy and love of our celebration perfectly. The photos look like they belong in a high-end magazine. Worth every penny!",
    rating: 5,
  },
  {
    name: "Amanda & Michael Chen",
    role: "Pre-Birthday Session",
    date: "September 2024",
    content:
      "Our son's first birthday photos exceeded all expectations. Isabella created a whimsical, magical setting that perfectly captured his personality. The attention to detail in styling and the final editing is impeccable. We can't wait to book again!",
    rating: 5,
  },
  {
    name: "Jessica Williams",
    role: "Maternity & Newborn Package",
    date: "August 2024",
    content:
      "I booked both maternity and newborn sessions, and I couldn't be happier with the results. Isabella documented my journey into motherhood with such artistry. The consistency between sessions tells a beautiful story. Highly recommend!",
    rating: 5,
  },
  {
    name: "Christina Davis",
    role: "Family Portrait",
    date: "July 2024",
    content:
      "Isabella has a remarkable ability to capture authentic moments between family members. She made our session feel natural and fun, and the resulting photographs are stunning. Her eye for composition and light is unmatched.",
    rating: 5,
  },
];

const Reviews = () => {
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-background">
        <div className="container-luxury text-center">
          <ScrollReveal animation="fadeUp">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Client Stories
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              Reviews
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Hear from families who trusted us to capture their most precious
              moments
            </p>

            {/* Rating Summary */}
            <div className="inline-flex flex-col items-center bg-secondary surface-card px-8 py-6">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif text-3xl font-medium">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-muted-foreground text-sm">
                Based on {reviews.length} reviews
              </p>
            </div>

            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {reviews.map((review, index) => (
              <StaggerItem key={index}>
                <div className="bg-secondary surface-card p-8 relative hover:shadow-elevated transition-all duration-500 h-full">
                  {/* Quote Icon */}
                  <Quote
                    size={40}
                    className="text-primary/10 absolute top-6 right-6"
                  />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
                    "{review.content}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-border/60 pt-4">
                    <p className="font-serif text-lg">{review.name}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{review.role}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="py-20 bg-secondary">
        <div className="container-luxury">
          <ScrollReveal animation="scaleIn">
            <div className="max-w-4xl mx-auto text-center">
              <Quote size={60} className="text-primary/20 mx-auto mb-6" />
              <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-8 italic">
                "Isabella doesn't just take photographs—she creates art that
                captures the soul of the moment. Our family portraits are more
                than pictures; they're windows into our love story."
              </blockquote>
              <div>
                <p className="font-medium text-lg">— The Martinez Family</p>
                <p className="text-muted-foreground">
                  Family Portrait Session, 2024
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
};

export default Reviews;
