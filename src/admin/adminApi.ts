// Types and calls for the admin dashboard. Every call carries the admin token; see useAdminApi.
import type { ServiceId } from "@/data/services";
import type { BookingStatus } from "@/lib/bookings";

export type Admin = { id: string; name: string; email: string };

export type AdminPhoto = {
  id: string;
  serviceId: ServiceId;
  mediaType: "image" | "video";
  // The photo, or the video file; for a video the thumbnail is its preview frame
  imageUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  instagramUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type AdminReview = {
  id: string;
  name: string;
  role: string;
  reviewDate: string;
  rating: number;
  content: string;
  published: boolean;
  createdAt: string;
};

export type MessageStatus = "new" | "read" | "archived";
export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  serviceId: ServiceId | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export type AdminBooking = {
  id: string;
  serviceId: ServiceId | null;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: BookingStatus;
  adminNote: string | null;
  createdAt: string;
};

export type Page<T> = { items: T[]; total: number; page: number; pageSize: number; totalPages: number };

export type Overview = {
  newMessages: number;
  pendingBookings: number;
  upcomingThisWeek: AdminBooking[];
  publishedReviews: number;
  photosByService: Record<ServiceId, number>;
};

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export type SlotSettings = {
  weeklyHours: Record<Weekday, { open: string; close: string } | null>;
  slotMinutes: number;
  maxDaysAhead: number;
  blockedDates: string[];
};
