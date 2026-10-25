import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { API_ENABLED } from "@/lib/api";
import { cancelBooking, fetchMyBookings, formatDate, formatTime, type BookingStatus, type MyBooking } from "@/lib/bookings";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

const statusStyle: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Awaiting confirmation", className: "bg-amber-100 text-amber-900" },
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-900" },
  rescheduled: { label: "Rescheduled", className: "bg-sky-100 text-sky-900" },
  declined: { label: "Declined", className: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "Photography session";

const MyBookings = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetchMyBookings(token),
    enabled: API_ENABLED,
  });
  const cancel = useMutation({
    mutationFn: (id: string) => cancelBooking(id, token),
    onSuccess: () => {
      toast({ title: "Booking cancelled", description: "We've let the studio know." });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (error) =>
      toast({ title: "Couldn't cancel", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const today = new Date().toISOString().slice(0, 10);
  const isActive = (b: MyBooking) => ["pending", "confirmed", "rescheduled"].includes(b.status) && b.date >= today;
  const upcoming = (data ?? []).filter(isActive).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const past = (data ?? []).filter((b) => !isActive(b));

  const renderBooking = (booking: MyBooking) => {
    const status = statusStyle[booking.status];
    return (
      <li key={booking.id} className="bg-secondary surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl">{serviceName(booking.serviceId)}</h3>
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium", status.className)}>{status.label}</span>
        </div>
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={16} className="text-primary" />
            {formatDate(booking.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            {formatTime(booking.time)}
          </span>
        </p>
        {booking.adminNote && (
          <p className="mt-3 text-sm">
            <span className="font-medium">Note from the studio:</span> {booking.adminNote}
          </p>
        )}
        {isActive(booking) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className="mt-4 text-sm text-primary font-medium hover:underline" disabled={cancel.isPending}>
                Cancel this booking
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  {serviceName(booking.serviceId)} on {formatDate(booking.date)} at {formatTime(booking.time)}. The time will be
                  released for other clients.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep booking</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancel.mutate(booking.id)}>Cancel booking</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </li>
    );
  };

  return (
    <>
      <Helmet>
        <title>My Bookings | Epikmakers</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <section className="flex-1 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container-luxury max-w-3xl">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Your Sessions</p>
                <h1 className="font-serif text-4xl md:text-5xl font-medium">My Bookings</h1>
              </div>
              <Link to="/contact" className="btn-luxury text-xs">
                Book a Session
              </Link>
            </div>

            {!API_ENABLED ? (
              <p className="text-muted-foreground">Online bookings aren't available yet. Please check back soon.</p>
            ) : isLoading ? (
              <div className="space-y-4" aria-label="Loading bookings">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 bg-secondary surface-card animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <p className="text-muted-foreground">
                We couldn't load your bookings.{" "}
                <button type="button" onClick={() => refetch()} className="text-primary font-medium hover:underline">
                  Try again
                </button>
              </p>
            ) : data!.length === 0 ? (
              <p className="text-muted-foreground">You haven't booked a session yet.</p>
            ) : (
              <div className="space-y-10">
                <div>
                  <h2 className="font-serif text-2xl mb-4">Upcoming</h2>
                  {upcoming.length ? (
                    <ul className="space-y-4">{upcoming.map(renderBooking)}</ul>
                  ) : (
                    <p className="text-muted-foreground">No upcoming sessions.</p>
                  )}
                </div>
                {past.length > 0 && (
                  <div>
                    <h2 className="font-serif text-2xl mb-4">Past &amp; cancelled</h2>
                    <ul className="space-y-4">{past.map(renderBooking)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default MyBookings;
