import { useQuery } from "@tanstack/react-query";
import { API_ENABLED, apiRequest } from "@/lib/api";
import { sampleReviews, summarizeReviews, type Review } from "@/data/reviews";
import { useAuth } from "@/hooks/useAuth";

// Published reviews from the admin dashboard, or the sample reviews while the API isn't connected
export function useReviews() {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: () => apiRequest<Review[]>("/reviews", { token }),
    enabled: API_ENABLED,
    staleTime: 5 * 60 * 1000,
  });

  const reviews = API_ENABLED ? query.data ?? [] : sampleReviews;
  return {
    reviews,
    ...summarizeReviews(reviews),
    isLoading: API_ENABLED && query.isLoading,
    isError: API_ENABLED && query.isError,
    refetch: query.refetch,
  };
}
