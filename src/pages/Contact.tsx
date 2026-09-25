import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  service: z.string().optional(),
  message: z.string().trim().max(1000, "Message too long").optional(),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Booking Request Sent!",
      description: "Thank you for reaching out. We'll confirm your appointment within 24 hours.",
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
    setSelectedDate(undefined);
    setSelectedTime("");
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-background">
        <div className="container-luxury text-center">
          <ScrollReveal animation="fadeUp">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6">
              Book Your Session
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to capture your special moments? Select your preferred date
              and time below
            </p>
            <div className="divider-elegant mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20 md:pb-32 bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <ScrollReveal animation="slideLeft">
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-8">
                Let's Create Together
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Whether you're expecting, planning a celebration, or welcoming
                a new addition to your family, I'd love to hear from you. Select
                your preferred date and time, or reach out directly.
              </p>

              <StaggerContainer className="space-y-6" staggerDelay={0.1}>
                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Studio Location</h4>
                      <p className="text-muted-foreground text-sm">
                        123 Artistry Lane, Creative District
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <a
                        href="mailto:hello@lumierestudio.com"
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                      >
                        hello@lumierestudio.com
                      </a>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Studio Hours</h4>
                      <p className="text-muted-foreground text-sm">
                        Monday – Friday: 9am – 6pm
                        <br />
                        Saturday: 10am – 4pm (By appointment)
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/1234567890?text=${encodeURIComponent("Hi! I'm interested in booking a photography session.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mt-10 px-6 py-4 bg-[#25D366] text-white rounded-md tracking-wide hover:bg-[#128C7E] hover:shadow-soft transition-all duration-300"
              >
                <MessageCircle size={20} />
                <span className="font-medium">Chat on WhatsApp</span>
              </a>

              {/* Features */}
              <div className="mt-10 p-6 bg-secondary surface-card">
                <h4 className="font-serif text-lg mb-4">What's Included</h4>
                <ul className="space-y-3">
                  {[
                    "Pre-session consultation call",
                    "Access to studio wardrobe & props",
                    "Professional hair & makeup guidance",
                    "2-hour photography session",
                    "Curated gallery of 30+ edited images",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle size={16} className="text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Booking Form */}
            <ScrollReveal animation="slideRight" delay={0.2}>
              <div className="bg-secondary p-8 md:p-10 surface-card">
                <h3 className="font-serif text-2xl mb-6">Schedule Your Session</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Calendar */}
                  <BookingCalendar
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                  />

                  <div className="border-t border-border/60 pt-6">
                    <h4 className="font-medium mb-4">Your Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          className="field-luxury"
                          placeholder="Jane Smith"
                        />
                        {errors.name && (
                          <p className="text-destructive text-xs mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          maxLength={255}
                          className="field-luxury"
                          placeholder="jane@example.com"
                        />
                        {errors.email && (
                          <p className="text-destructive text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={20}
                          className="field-luxury"
                          placeholder="+1 (234) 567-890"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="service"
                          className="block text-sm font-medium mb-2"
                        >
                          Service Type
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="field-luxury"
                        >
                          <option value="">Select a service</option>
                          <option value="maternity">Maternity Photoshoot</option>
                          <option value="newborn">Newborn Photography</option>
                          <option value="babyshower">Baby Shower</option>
                          <option value="prebirthday">Pre-Birthday Shoot</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Special Requests
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        maxLength={1000}
                        className="field-luxury resize-none"
                        placeholder="Any special requests or details..."
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !selectedDate || !selectedTime}
                    className="w-full btn-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Request Booking"}
                  </button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    We'll confirm your appointment via email within 24 hours
                  </p>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
