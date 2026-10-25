import { useState } from "react";
import { format, addDays, isBefore, isAfter, startOfToday, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { API_ENABLED } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { fetchAvailability, fetchCalendarInfo, formatTime } from "@/lib/bookings";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  // "HH:mm" when the API is connected; the display label otherwise
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

// Used only while the API isn't connected (a preview; nothing is booked)
const previewTimeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const noSlotsMessage: Record<string, string> = {
  closed: "The studio is closed on this day. Please choose another date.",
  blocked: "This date isn't available. Please choose another.",
  past: "This date has passed. Please choose another.",
  "too-far": "We can't take bookings this far ahead yet.",
};

const BookingCalendar = ({ selectedDate, selectedTime, onDateChange, onTimeChange }: BookingCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();
  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined;

  const calendarInfo = useQuery({
    queryKey: ["booking-calendar"],
    queryFn: () => fetchCalendarInfo(token),
    enabled: API_ENABLED,
    staleTime: 5 * 60 * 1000,
  });
  const availability = useQuery({
    queryKey: ["availability", dateKey],
    queryFn: () => fetchAvailability(dateKey!, token),
    enabled: API_ENABLED && !!dateKey,
    staleTime: 30 * 1000,
  });

  const today = calendarInfo.data ? parseISO(calendarInfo.data.today) : startOfToday();
  const maxDaysAhead = calendarInfo.data?.maxDaysAhead ?? 90;

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, today) || isAfter(date, addDays(today, maxDaysAhead))) return true;
    if (!API_ENABLED) return date.getDay() === 0; // preview: closed Sundays
    const info = calendarInfo.data;
    if (!info) return false;
    return info.closedWeekdays.includes(date.getDay()) || info.blockedDates.includes(format(date, "yyyy-MM-dd"));
  };

  const slots = API_ENABLED
    ? (availability.data?.slots ?? []).map((s) => ({ value: s.time, label: formatTime(s.time), available: s.available }))
    : previewTimeSlots.map((label) => ({ value: label, label, available: true }));
  const selectedLabel = API_ENABLED && selectedTime ? formatTime(selectedTime) : selectedTime;
  const allTaken = slots.length > 0 && slots.every((s) => !s.available);

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Select Your Preferred Date</label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn("field-luxury flex items-center justify-between py-4 text-left", !selectedDate && "text-muted-foreground")}
            >
              <span className="flex items-center gap-3">
                <CalendarIcon size={18} className="text-primary" />
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Choose a date for your session"}
              </span>
              {selectedDate && <Check size={18} className="text-primary" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
            <div className="p-4 border-b border-border/60">
              <p className="font-serif text-lg">Choose a Date</p>
              <p className="text-muted-foreground text-sm">Available dates are highlighted</p>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                onTimeChange("");
                setIsOpen(false);
              }}
              disabled={isDateDisabled}
              initialFocus
              className="p-3 pointer-events-auto"
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
                disabled: "text-muted-foreground/40 cursor-not-allowed",
              }}
            />
            <div className="p-3 border-t border-border/60 bg-secondary/40">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="animate-fade-up">
          <label className="block text-sm font-medium mb-3">Select Your Preferred Time</label>
          {API_ENABLED && availability.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Loading times">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : API_ENABLED && availability.isError ? (
            <p className="text-sm text-muted-foreground">
              We couldn't load the free times.{" "}
              <button type="button" onClick={() => availability.refetch()} className="text-primary font-medium hover:underline">
                Try again
              </button>
            </p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {noSlotsMessage[availability.data?.reason ?? ""] ?? "There are no times left on this day. Please choose another date."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => slot.available && onTimeChange(slot.value)}
                      disabled={!slot.available}
                      aria-pressed={isSelected}
                      aria-label={slot.available ? slot.label : `${slot.label} (booked)`}
                      className={cn("chip-luxury", isSelected && "is-active", !slot.available && "line-through")}
                    >
                      <Clock size={14} />
                      {slot.label}
                    </button>
                  );
                })}
              </div>
              {allTaken && (
                <p className="text-muted-foreground text-xs mt-3">This day is fully booked. Please choose another date.</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-up">
          <p className="text-sm text-muted-foreground mb-1">Your Selected Appointment</p>
          <p className="font-serif text-lg">
            {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedLabel}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
