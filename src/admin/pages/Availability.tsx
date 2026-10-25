import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/lib/bookings";
import { useAdminAuth } from "../useAdminAuth";
import { WEEKDAYS, type SlotSettings, type Weekday } from "../adminApi";
import { ErrorBlock, LoadingBlock, PageHeader } from "../ui";

const DAY_NAMES: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
// Monday first, as a studio week reads
const ORDERED_DAYS: Weekday[] = [...WEEKDAYS.slice(1), WEEKDAYS[0]];

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

// The start times a day's hours produce, so the admin sees exactly what clients will be offered
const slotsFor = (hours: { open: string; close: string }, slotMinutes: number) => {
  const times: string[] = [];
  for (let m = toMinutes(hours.open); m + slotMinutes <= toMinutes(hours.close); m += slotMinutes) {
    times.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return times;
};

const Availability = () => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "slot-settings"],
    queryFn: () => request<SlotSettings>("/admin/settings/slots"),
  });
  const [draft, setDraft] = useState<SlotSettings | null>(null);
  const [newBlocked, setNewBlocked] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  if (isLoading || (!draft && !error)) return <LoadingBlock rows={4} />;
  if (error) return <ErrorBlock error={error} onRetry={refetch} />;
  const settings = draft!;

  const setDay = (day: Weekday, hours: SlotSettings["weeklyHours"][Weekday]) =>
    setDraft({ ...settings, weeklyHours: { ...settings.weeklyHours, [day]: hours } });

  const invalidDays = ORDERED_DAYS.filter((d) => {
    const h = settings.weeklyHours[d];
    return h && toMinutes(h.open) >= toMinutes(h.close);
  });
  const dirty = JSON.stringify(settings) !== JSON.stringify(data);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await request<SlotSettings>("/admin/settings/slots", { method: "PUT", body: settings });
      queryClient.setQueryData(["admin", "slot-settings"], saved);
      queryClient.invalidateQueries({ queryKey: ["booking-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast({ title: "Availability saved", description: "Clients see the new times straight away." });
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addBlocked = () => {
    if (!newBlocked || settings.blockedDates.includes(newBlocked)) return;
    setDraft({ ...settings, blockedDates: [...settings.blockedDates, newBlocked].sort() });
    setNewBlocked("");
  };
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const upcomingBlocked = settings.blockedDates.filter((d) => d >= todayKey);

  return (
    <>
      <PageHeader
        title="Availability"
        description="The times clients can pick on the Contact page. Existing bookings are never changed by these settings."
        actions={
          <button type="button" className="btn-luxury text-xs disabled:opacity-50" onClick={save} disabled={!dirty || saving || invalidDays.length > 0}>
            {saving ? "Saving..." : dirty ? "Save Changes" : "Saved"}
          </button>
        }
      />

      <div className="grid gap-10 xl:grid-cols-[1fr_20rem]">
        <section>
          <h2 className="font-serif text-2xl mb-4">Opening hours</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-background">
            {ORDERED_DAYS.map((day) => {
              const hours = settings.weeklyHours[day];
              const slots = hours ? slotsFor(hours, settings.slotMinutes) : [];
              return (
                <li key={day} className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-3 w-36">
                      <Switch
                        checked={!!hours}
                        onCheckedChange={(open) => setDay(day, open ? { open: "10:00", close: "18:00" } : null)}
                        aria-label={`Open on ${DAY_NAMES[day]}`}
                      />
                      <span className="font-medium">{DAY_NAMES[day]}</span>
                    </label>
                    {hours ? (
                      <div className="flex items-center gap-2 text-sm">
                        <input type="time" step={900} className="field-luxury py-1.5 w-32" value={hours.open} onChange={(e) => setDay(day, { ...hours, open: e.target.value })} aria-label={`${DAY_NAMES[day]} opening time`} />
                        <span>to</span>
                        <input type="time" step={900} className="field-luxury py-1.5 w-32" value={hours.close} onChange={(e) => setDay(day, { ...hours, close: e.target.value })} aria-label={`${DAY_NAMES[day]} closing time`} />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    )}
                  </div>
                  {hours && (
                    <p className={invalidDays.includes(day) ? "text-destructive text-xs mt-2" : "text-muted-foreground text-xs mt-2"}>
                      {invalidDays.includes(day)
                        ? "Closing time must be after opening time."
                        : slots.length
                          ? `${slots.length} ${slots.length === 1 ? "slot" : "slots"}: ${slots.map(formatTime).join(", ")}`
                          : "No full session fits in these hours."}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl mb-4">Booking rules</h2>
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="block font-medium mb-1">Session length</span>
                <select
                  className="field-luxury py-2"
                  value={settings.slotMinutes}
                  onChange={(e) => setDraft({ ...settings, slotMinutes: Number(e.target.value) })}
                >
                  {[30, 45, 60, 90, 120, 180, 240].map((m) => (
                    <option key={m} value={m}>
                      {m < 60 ? `${m} minutes` : `${m / 60} ${m === 60 ? "hour" : "hours"}`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="block font-medium mb-1">Clients can book up to</span>
                <select
                  className="field-luxury py-2"
                  value={settings.maxDaysAhead}
                  onChange={(e) => setDraft({ ...settings, maxDaysAhead: Number(e.target.value) })}
                >
                  {[30, 60, 90, 180, 365].map((d) => (
                    <option key={d} value={d}>
                      {d} days ahead
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-2">Blocked dates</h2>
            <p className="text-sm text-muted-foreground mb-4">Holidays or days you're away. Clients can't book these.</p>
            <div className="flex gap-2 mb-4">
              <input type="date" className="field-luxury py-2" min={todayKey} value={newBlocked} onChange={(e) => setNewBlocked(e.target.value)} aria-label="Date to block" />
              <button type="button" className="chip-luxury" onClick={addBlocked} disabled={!newBlocked}>
                Add
              </button>
            </div>
            {upcomingBlocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming blocked dates.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {upcomingBlocked.map((d) => (
                  <li key={d} className="inline-flex items-center gap-1 rounded-full bg-secondary pl-3 pr-1 py-1 text-sm">
                    {formatDate(d, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-background"
                      onClick={() => setDraft({ ...settings, blockedDates: settings.blockedDates.filter((x) => x !== d) })}
                      aria-label={`Unblock ${d}`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Availability;
