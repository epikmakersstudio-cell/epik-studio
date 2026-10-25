import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore, Mail, MailOpen, Phone, Reply, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../useAdminAuth";
import type { AdminMessage, MessageStatus, Page } from "../adminApi";
import { Badge, EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, Pager } from "../ui";
import { formatDateTime, serviceName } from "../format";

const tabs: { value: MessageStatus | "inbox"; label: string }[] = [
  { value: "inbox", label: "Inbox" },
  { value: "new", label: "Unread" },
  { value: "archived", label: "Archived" },
];

const Messages = () => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("inbox");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "messages", tab, page],
    queryFn: () => request<Page<AdminMessage>>(`/admin/messages?page=${page}${tab === "inbox" ? "" : `&status=${tab}`}`),
    placeholderData: keepPreviousData,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
  };

  const setStatus = async (message: AdminMessage, status: MessageStatus) => {
    try {
      await request(`/admin/messages/${message.id}`, { method: "PATCH", body: { status } });
    } catch (err) {
      toast({ title: "Couldn't update", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  const remove = async (message: AdminMessage) => {
    try {
      await request(`/admin/messages/${message.id}`, { method: "DELETE" });
      toast({ title: "Message deleted" });
    } catch (err) {
      toast({ title: "Couldn't delete", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  const replyLink = (m: AdminMessage) =>
    `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: your message to Epikmakers")}&body=${encodeURIComponent(
      `Hi ${m.name},\n\n\n\n---\nYou wrote:\n${m.message}`,
    )}`;

  return (
    <>
      <PageHeader title="Messages" description="Sent from the Contact page's “Send a Message” form. You also get each one by email." />

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Filter messages">
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
            className={cn("chip-luxury", tab === t.value && "is-active")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : error ? (
        <ErrorBlock error={error} onRetry={refetch} />
      ) : data!.items.length === 0 ? (
        <EmptyBlock>{tab === "archived" ? "No archived messages." : "No messages here. You're all caught up!"}</EmptyBlock>
      ) : (
        <>
          <ul className="space-y-3">
            {data!.items.map((m) => (
              <li key={m.id} className={cn("rounded-lg border p-4 bg-background", m.status === "new" ? "border-primary/40" : "border-border")}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      {m.name}
                      {m.status === "new" && <Badge tone="primary">New</Badge>}
                    </p>
                    <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                        <Mail size={14} /> {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 hover:text-primary">
                          <Phone size={14} /> {m.phone}
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDateTime(m.createdAt)}</p>
                    {m.serviceId && <p>{serviceName(m.serviceId)}</p>}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <a href={replyLink(m)} onClick={() => m.status === "new" && setStatus(m, "read")} className="chip-luxury text-xs">
                    <Reply size={14} /> Reply
                  </a>
                  {m.status === "new" ? (
                    <button type="button" className="chip-luxury text-xs" onClick={() => setStatus(m, "read")}>
                      <MailOpen size={14} /> Mark read
                    </button>
                  ) : m.status === "read" ? (
                    <button type="button" className="chip-luxury text-xs" onClick={() => setStatus(m, "new")}>
                      <Mail size={14} /> Mark unread
                    </button>
                  ) : null}
                  {m.status === "archived" ? (
                    <button type="button" className="chip-luxury text-xs" onClick={() => setStatus(m, "read")}>
                      <ArchiveRestore size={14} /> Move to inbox
                    </button>
                  ) : (
                    <button type="button" className="chip-luxury text-xs" onClick={() => setStatus(m, "archived")}>
                      <Archive size={14} /> Archive
                    </button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="chip-luxury text-xs text-destructive">
                        <Trash2 size={14} /> Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this message from {m.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This can't be undone. To keep it out of the way, archive it instead.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(m)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
          <Pager page={data!.page} totalPages={data!.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default Messages;
