// Sample reviews, shown on the Reviews page and the Pricing page's ratings section only while the
// API isn't connected. Once it is, reviews come from the admin dashboard (see src/hooks/useReviews.ts).
export type Review = {
  id?: string;
  name: string;
  role: string;
  date: string;
  content: string;
  rating: number; // 1-5
};

export const sampleReviews: Review[] = [
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

// Average rating (0 when there are no reviews) and how many reviews gave each star rating, 5 down to 1
export function summarizeReviews(reviews: Pick<Review, "rating">[]) {
  return {
    averageRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    ratingBreakdown: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    })),
  };
}
