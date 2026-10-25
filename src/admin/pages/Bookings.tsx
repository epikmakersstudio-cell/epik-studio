import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, CalendarClock, Mail, Phone, X, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime, type BookingStatus } from "@/lib/bookings";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../useAdminAuth";
import type { AdminBooking, Page } from "../adminApi";
import { Badge, EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, Pager } from "../ui";
import { serviceName } from "../format";

const today = () => format(new Date(), "yyyy-MM-dd");
const yesterday = () => format(new Date(Date.now() - 86_400_000), "yyyy-MM-dd");

const tabs = [
  { value: "pending", label: "To confirm", query: () => "status=pending" },
  { value: "upcoming", label: "Upcoming", query: () => `from=${today()}` },
  { value: "past", label: "Past", query: () => `to=${yesterday()}&sort=desc` },
  { value: "all", label: "All", query: () => "" },
] as const;

const statusTone: Record<BookingStatus, "amber" | "green" | "sky" | "muted"> = {
  pending: "amber",
  confirmed: "green",
  rescheduled: "sky",
  declined: "muted",
  cancelled: "muted",
};

type Action = { booking: AdminBooking; status: "confirmed" | "rescheduled" | "declined" | "cancelled" };

const Bookings = () => {
  const { request } = useAdminAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("pending");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<Action | null>(null);

  const current = tabs.find((t) => t.value === tab)!;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "bookings", tab, page],
    queryFn: () => request<Page<AdminBooking>>(`/admin/bookings?page=${page}&${current.query()}`),
    placeholderData: keepPreviousData,
  });

  const items = data?.items ?? [];
  const byDate = items.reduce<Record<string, AdminBooking[]>>((groups, b) => {
    (groups[b.date] ??= []).push(b);
    return groups;
  }, {});

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Requests from the Contact page. Confirming, rescheduling or declining emails the client automatically."
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Filter bookings">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => {
              setTab(t.value);
              setPage(1);
            }}
            className={cn("chip-luxury whitespace-nowrap", tab === t.value && "is-active")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : error ? (
        <ErrorBlock error={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyBlock>{tab === "pending" ? "No bookings waiting for confirmation." : "No bookings here."}</EmptyBlock>
      ) : (
        <>
          <div className="space-y-8">
            {Object.entries(byDate).map(([date, bookings]) => (
              <section key={date}>
                <h2 className="font-serif text-xl mb-3">{formatDate(date)}</h2>
                <ul className="space-y-3">
                  {bookings.map((b) => (
                    <BookingRow key={b.id} booking={b} onAction={(status) => setAction({ booking: b, status })} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <Pager page={data!.page} totalPages={data!.totalPages} onChange={setPage} />
        </>
      )}

      <ActionDialog action={action} onClose={() => setAction(null)} />
    </>
  );
};

const BookingRow = ({ booking: b, onAction }: { booking: AdminBooking; onAction: (status: Action["status"]) => void }) => {
  const active = ["pending", "confirmed", "rescheduled"].includes(b.status);
  return (
    <li className={cn("rounded-lg border p-4 bg-background", b.status === "pending" ? "border-amber-300" : "border-border")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">
            {formatTime(b.time)} · {b.name}
          </p>
          <p className="text-sm text-muted-foreground">{serviceName(b.serviceId)}</p>
          <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4 mt-1">
            <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1 hover:text-primary">
              <Mail size={14} /> {b.email}
            </a>
            {b.phone && (
              <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 hover:text-primary">
                <Phone size={14} /> {b.phone}
              </a>
            )}
          </p>
        </div>
        <Badge tone={statusTone[b.status]}>{b.status}</Badge>
      </div>
      {b.notes && <p className="text-sm mt-3 whitespace-pre-wrap break-words">“{b.notes}”</p>}
      {b.adminNote && <p className="text-sm mt-2 text-muted-foreground">Your note: {b.adminNote}</p>}
      {active && (
        <div className="flex flex-wrap gap-2 mt-4">
          {b.status !== "confirmed" && (
            <button type="button" className="chip-luxury text-xs" onClick={() => onAction("confirmed")}>
              <Check size={14} /> Confirm
            </button>
          )}
          <button type="button" className="chip-luxury text-xs" onClick={() => onAction("rescheduled")}>
            <CalendarClock size={14} /> Reschedule
          </button>
          {b.status === "pending" ? (
            <button type="button" className="chip-luxury text-xs" onClick={() => onAction("declined")}>
              <X size={14} /> Decline
            </button>
          ) : (
            <button type="button" className="chip-luxury text-xs" onClick={() => onAction("cancelled")}>
              <Ban size={14} /> Cancel
            </button>
          )}
        </div>
      )}
    </li>
  );
};

const actionCopy: Record<Action["status"], { title: string; button: string; description: string }> = {
  confirmed: { title: "Confirm this session", button: "Confirm", description: "The client gets a confirmation email." },
  rescheduled: { title: "Move to a new time", button: "Reschedule", description: "The client is emailed the new date and time." },
  declined: { title: "Decline this request", button: "Decline", description: "The client is emailed that you can't take it. The time is freed." },
  cancelled: { title: "Cancel this session", button: "Cancel session", description: "The client is emailed that it's cancelled. The time is freed." },
};

const ActionDialog = ({ action, onClose }: { action: Action | null; onClose: () => void }) => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!action) return;
    setDate(action.booking.date);
    setTime(action.booking.time);
    setNote("");
  }, [action]);

  if (!action) return null;
  const copy = actionCopy[action.status];
  const b = action.booking;

  const submit = async () => {
    setSaving(true);
    try {
      await request(`/admin/bookings/${b.id}`, {
        method: "PATCH",
        body: {
          status: action.status,
          ...(action.status === "rescheduled" && { date, time }),
          ...(note.trim() && { adminNote: note.trim() }),
        },
      });
      toast({ title: `Booking ${action.status}`, description: `${b.name} has been emailed.` });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      onClose();
    } catch (err) {
      toast({ title: "Couldn't update the booking", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            {b.name}, {serviceName(b.serviceId)}, {formatDate(b.date)} at {formatTime(b.time)}. {copy.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {action.status === "rescheduled" && (
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block font-medium mb-1">New date</span>
                <input type="date" className="field-luxury py-2" value={date} min={today()} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="text-sm">
                <span className="block font-medium mb-1">New time</span>
                <input type="time" className="field-luxury py-2" value={time} step={900} onChange={(e) => setTime(e.target.value)} />
              </label>
            </div>
          )}
          <label className="block text-sm">
            <span className="block font-medium mb-1">Note to the client (optional, included in the email)</span>
            <textarea className="field-luxury py-2 resize-y" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>
        <DialogFooter>
          <button type="button" className="chip-luxury" onClick={onClose}>
            Back
          </button>
          <button
            type="button"
            className="btn-luxury text-xs disabled:opacity-50"
            onClick={submit}
            disabled={saving || (action.status === "rescheduled" && (!date || !time))}
          >
            {saving ? "Saving..." : copy.button}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Bookings;
