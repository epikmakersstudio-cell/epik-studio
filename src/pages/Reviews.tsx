import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Star, Quote } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

const Reviews = () => {
  const { reviews, averageRating, isLoading, isError, refetch } = useReviews();

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
            {reviews.length > 0 && (
              <div className="inline-flex flex-col items-center bg-secondary surface-card px-8 py-6">
                <div className="flex gap-1 mb-2" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < Math.round(averageRating) ? "fill-gold text-gold" : "text-border"} />
                  ))}
                </div>
                <p className="font-serif text-3xl font-medium">
                  {averageRating.toFixed(1)}
                </p>
                <p className="text-muted-foreground text-sm">
                  Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            )}

            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading reviews">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-secondary surface-card animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="mb-4">We couldn't load the reviews right now.</p>
              <button type="button" onClick={() => refetch()} className="btn-outline-luxury text-xs">
                Try Again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Reviews from our clients are coming soon.</p>
          ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {reviews.map((review, index) => (
              <StaggerItem key={review.id ?? index}>
                <div className="bg-secondary surface-card p-8 relative hover:shadow-elevated transition-all duration-500 h-full">
                  {/* Quote Icon */}
                  <Quote
                    size={40}
                    className="text-primary/10 absolute top-6 right-6"
                  />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
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
          )}
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
