import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, CalendarClock, Star, Images } from "lucide-react";
import { services } from "@/data/services";
import { formatDate, formatTime } from "@/lib/bookings";
import { useAdminAuth } from "../useAdminAuth";
import type { Overview as OverviewData } from "../adminApi";
import { Badge, EmptyBlock, ErrorBlock, LoadingBlock, PageHeader } from "../ui";
import { serviceName } from "../format";

const Overview = () => {
  const { admin, request } = useAdminAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => request<OverviewData>("/admin/overview"),
  });

  const stats = data && [
    { label: "New messages", value: data.newMessages, icon: Mail, to: "/admin/messages" },
    { label: "Bookings to confirm", value: data.pendingBookings, icon: CalendarClock, to: "/admin/bookings" },
    { label: "Published reviews", value: data.publishedReviews, icon: Star, to: "/admin/reviews" },
    {
      label: "Portfolio photos",
      value: Object.values(data.photosByService).reduce((a, b) => a + b, 0),
      icon: Images,
      to: "/admin/photos",
    },
  ];

  return (
    <>
      <PageHeader title={`Hello, ${admin?.name.split(" ")[0] ?? "there"}`} description="Here's what needs your attention." />
      {isLoading ? (
        <LoadingBlock rows={4} />
      ) : error ? (
        <ErrorBlock error={error} onRetry={refetch} />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats!.map(({ label, value, icon: Icon, to }) => (
              <Link key={label} to={to} className="bg-secondary surface-card p-5 hover:shadow-elevated transition-shadow">
                <Icon size={20} className="text-primary mb-3" />
                <p className="font-serif text-3xl">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </Link>
            ))}
          </div>

          <section>
            <h2 className="font-serif text-2xl mb-4">Sessions in the next 7 days</h2>
            {data!.upcomingThisWeek.length === 0 ? (
              <EmptyBlock>No sessions booked this week.</EmptyBlock>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border bg-background">
                {data!.upcomingThisWeek.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                    <span className="font-medium w-44">
                      {formatDate(b.date, { weekday: "short", day: "numeric", month: "short" })}, {formatTime(b.time)}
                    </span>
                    <span className="flex-1 min-w-[10rem]">
                      {b.name} · {serviceName(b.serviceId)}
                    </span>
                    <Badge tone={b.status === "pending" ? "amber" : b.status === "confirmed" ? "green" : "sky"}>{b.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Photos per service</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {services.map((s) => (
                <Link
                  key={s.id}
                  to={`/admin/photos?service=${s.id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:border-primary/50"
                >
                  <span>{s.name}</span>
                  <span className={data!.photosByService[s.id] ? "font-medium" : "text-destructive font-medium"}>
                    {data!.photosByService[s.id]}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Overview;
