import Navigation from "@/components/Navigation";
import HeroSlideshow from "@/components/HeroSlideshow";
import ServicesSection from "@/components/ServicesSection";
import AboutPreview from "@/components/AboutPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSlideshow />
      <ServicesSection />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
