// Booking and contact API calls for signed-in clients. Dates are studio-local "YYYY-MM-DD",
// times "HH:mm" (India time), exactly as the API stores them.
import { apiRequest } from "@/lib/api";
import type { ServiceId } from "@/data/services";

export type CalendarInfo = {
  today: string;
  maxDaysAhead: number;
  closedWeekdays: number[]; // 0 = Sunday
  blockedDates: string[];
};

export type Availability = {
  date: string;
  reason?: "past" | "too-far" | "blocked" | "closed";
  slots: { time: string; available: boolean }[];
};

export type BookingStatus = "pending" | "confirmed" | "rescheduled" | "declined" | "cancelled";

export type MyBooking = {
  id: string;
  serviceId: ServiceId | null;
  date: string;
  time: string;
  status: BookingStatus;
  notes: string | null;
  adminNote: string | null;
  createdAt: string;
};

export type BookingRequest = {
  serviceId?: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  serviceId?: string;
  message: string;
};

export const fetchCalendarInfo = (token: string | null) => apiRequest<CalendarInfo>("/bookings/calendar", { token });

export const fetchAvailability = (date: string, token: string | null) =>
  apiRequest<Availability>(`/bookings/availability?date=${date}`, { token });

export const createBooking = (body: BookingRequest, token: string | null) =>
  apiRequest<{ id: string; status: BookingStatus }>("/bookings", { method: "POST", body, token });

export const fetchMyBookings = (token: string | null) => apiRequest<MyBooking[]>("/bookings/mine", { token });

export const cancelBooking = (id: string, token: string | null) =>
  apiRequest<{ id: string; status: BookingStatus }>(`/bookings/${id}/cancel`, { method: "POST", token });

export const sendContactMessage = (body: ContactRequest, token: string | null) =>
  apiRequest<{ id: string }>("/contact", { method: "POST", body, token });

// "14:00" -> "2:00 PM"
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

// "2026-10-02" -> "Friday, October 2, 2026" (read as a calendar date, never shifted by time zone)
export function formatDate(date: string, options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" }) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}
