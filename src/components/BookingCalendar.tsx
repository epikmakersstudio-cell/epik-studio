import { useState } from "react";
import { format, addDays, isBefore, isAfter, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// Simulated booked dates (in a real app, this would come from a database)
const bookedDates = [
  addDays(new Date(), 2),
  addDays(new Date(), 5),
  addDays(new Date(), 8),
  addDays(new Date(), 12),
];

const BookingCalendar = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: BookingCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = startOfToday();

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, today)) return true;
    // Disable dates more than 3 months in the future
    if (isAfter(date, addDays(today, 90))) return true;
    // Disable Sundays
    if (date.getDay() === 0) return true;
    // Disable already booked dates
    return bookedDates.some(
      (bookedDate) =>
        format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Select Your Preferred Date
        </label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "field-luxury flex items-center justify-between py-4 text-left",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <CalendarIcon size={18} className="text-primary" />
                {selectedDate ? (
                  format(selectedDate, "EEEE, MMMM d, yyyy")
                ) : (
                  "Choose a date for your session"
                )}
              </span>
              {selectedDate && (
                <Check size={18} className="text-primary" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
            <div className="p-4 border-b border-border/60">
              <p className="font-serif text-lg">Choose a Date</p>
              <p className="text-muted-foreground text-sm">
                Available dates are highlighted
              </p>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
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
          <label className="block text-sm font-medium mb-3">
            Select Your Preferred Time
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              // Simulate some times being unavailable
              const isUnavailable =
                selectedDate &&
                format(selectedDate, "E") === "Sat" &&
                ["4:00 PM", "5:00 PM"].includes(time);

              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => !isUnavailable && onTimeChange(time)}
                  disabled={isUnavailable}
                  aria-pressed={isSelected}
                  className={cn("chip-luxury", isSelected && "is-active")}
                >
                  <Clock size={14} />
                  {time}
                </button>
              );
            })}
          </div>
          {selectedDate && format(selectedDate, "E") === "Sat" && (
            <p className="text-muted-foreground text-xs mt-3">
              * Saturday sessions end at 4 PM
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-up">
          <p className="text-sm text-muted-foreground mb-1">
            Your Selected Appointment
          </p>
          <p className="font-serif text-lg">
            {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
