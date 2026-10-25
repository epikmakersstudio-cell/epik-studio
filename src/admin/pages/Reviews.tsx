import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { summarizeReviews } from "@/data/reviews";
import { services } from "@/data/services";
import { formatDate } from "@/lib/bookings";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../useAdminAuth";
import type { AdminReview } from "../adminApi";
import { Badge, EmptyBlock, ErrorBlock, LoadingBlock, PageHeader } from "../ui";

type Draft = Omit<AdminReview, "id" | "createdAt">;
// Session types come from the shared services list; "Other" keeps free text for packages and older reviews
const serviceNames: string[] = services.map((s) => s.name);
const OTHER = "__other";
const emptyDraft = (): Draft => ({
  name: "",
  role: "",
  reviewDate: new Date().toISOString().slice(0, 10),
  rating: 5,
  content: "",
  published: true,
});

const Reviews = () => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => request<AdminReview[]>("/admin/reviews"),
  });
  const [editing, setEditing] = useState<AdminReview | "new" | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const setPublished = async (review: AdminReview, published: boolean) => {
    try {
      await request(`/admin/reviews/${review.id}`, { method: "PATCH", body: { published } });
      toast({ title: published ? "Review shown on the site" : "Review hidden from the site" });
    } catch (err) {
      toast({ title: "Couldn't update", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  const remove = async (review: AdminReview) => {
    try {
      await request(`/admin/reviews/${review.id}`, { method: "DELETE" });
      toast({ title: "Review deleted" });
    } catch (err) {
      toast({ title: "Couldn't delete", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  const published = (data ?? []).filter((r) => r.published);
  const { averageRating } = summarizeReviews(published);

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Published reviews appear on the Reviews page and in the Pricing page's ratings."
        actions={
          <button type="button" className="btn-luxury text-xs inline-flex items-center gap-2" onClick={() => setEditing("new")}>
            <Plus size={16} /> Add Review
          </button>
        }
      />

      {published.length > 0 && (
        <p className="mb-6 text-sm text-muted-foreground">
          Visitors see <span className="font-medium text-foreground">{averageRating.toFixed(1)} ★</span> from {published.length}{" "}
          published {published.length === 1 ? "review" : "reviews"}.
        </p>
      )}

      {isLoading ? (
        <LoadingBlock />
      ) : error ? (
        <ErrorBlock error={error} onRetry={refetch} />
      ) : data!.length === 0 ? (
        <EmptyBlock>No reviews yet. Add your first client review.</EmptyBlock>
      ) : (
        <ul className="space-y-3">
          {data!.map((review) => (
            <li key={review.id} className={cn("rounded-lg border border-border p-4 bg-background", !review.published && "opacity-70")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {review.name} <span className="text-muted-foreground font-normal">· {review.role}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-gold" aria-label={`${review.rating} out of 5 stars`}>
                      {"★".repeat(review.rating)}
                      <span className="text-border">{"★".repeat(5 - review.rating)}</span>
                    </span>{" "}
                    · {formatDate(review.reviewDate, { month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!review.published && <Badge>Hidden</Badge>}
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={review.published} onCheckedChange={(v) => setPublished(review, v)} aria-label="Show on website" />
                    <span className="hidden sm:inline">On site</span>
                  </label>
                  <button type="button" className="p-1.5 rounded hover:bg-secondary" onClick={() => setEditing(review)} aria-label="Edit review">
                    <Pencil size={16} />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="p-1.5 rounded hover:bg-destructive/10 text-destructive" aria-label="Delete review">
                        <Trash2 size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {review.name}'s review?</AlertDialogTitle>
                        <AlertDialogDescription>This can't be undone. To take it off the site temporarily, switch it off instead.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(review)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{review.content}</p>
            </li>
          ))}
        </ul>
      )}

      <ReviewDialog review={editing} onClose={() => setEditing(null)} onSaved={refresh} />
    </>
  );
};

const ReviewDialog = ({ review, onClose, onSaved }: { review: AdminReview | "new" | null; onClose: () => void; onSaved: () => void }) => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [customRole, setCustomRole] = useState(false);

  useEffect(() => {
    if (!review) return;
    setErrors({});
    setDraft(review === "new" ? emptyDraft() : { ...review });
    setCustomRole(review !== "new" && !serviceNames.includes(review.role));
  }, [review]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const save = async () => {
    setSaving(true);
    const body = { ...draft, name: draft.name.trim(), role: draft.role.trim(), content: draft.content.trim() };
    try {
      if (review === "new") await request("/admin/reviews", { method: "POST", body });
      else if (review) await request(`/admin/reviews/${review.id}`, { method: "PATCH", body });
      toast({ title: review === "new" ? "Review added" : "Review updated" });
      onSaved();
      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "fieldErrors" in err) setErrors((err as { fieldErrors: Record<string, string> }).fieldErrors);
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const field = (key: "name", label: string, placeholder: string) => (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <input className="field-luxury py-2" value={draft[key]} placeholder={placeholder} maxLength={100} onChange={(e) => set(key, e.target.value)} />
      {errors[key] && <span className="block text-destructive text-xs mt-1">{errors[key]}</span>}
    </label>
  );

  return (
    <Dialog open={!!review} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review === "new" ? "Add review" : "Edit review"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Client name", "Sarah & James")}
            <label className="block text-sm">
              <span className="block font-medium mb-1">Session type</span>
              <select
                className="field-luxury py-2"
                value={customRole ? OTHER : draft.role}
                onChange={(e) => {
                  const other = e.target.value === OTHER;
                  setCustomRole(other);
                  set("role", other ? "" : e.target.value);
                }}
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {serviceNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value={OTHER}>Other (type it)</option>
              </select>
              {customRole && (
                <input
                  className="field-luxury py-2 mt-2"
                  value={draft.role}
                  placeholder="Maternity & Newborn Package"
                  maxLength={100}
                  aria-label="Custom session type"
                  onChange={(e) => set("role", e.target.value)}
                />
              )}
              {errors.role && <span className="block text-destructive text-xs mt-1">{errors.role}</span>}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="block font-medium mb-1">Date of session</span>
              <input type="date" className="field-luxury py-2" value={draft.reviewDate} onChange={(e) => set("reviewDate", e.target.value)} />
              {errors.reviewDate && <span className="block text-destructive text-xs mt-1">{errors.reviewDate}</span>}
            </label>
            <div className="text-sm">
              <span className="block font-medium mb-1" id="rating-label">
                Rating
              </span>
              <div className="flex gap-1 py-2" role="radiogroup" aria-labelledby="rating-label">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={draft.rating === n}
                    aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                    onClick={() => set("rating", n)}
                    className="p-0.5"
                  >
                    <Star size={24} className={n <= draft.rating ? "fill-gold text-gold" : "text-border"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="block text-sm">
            <span className="block font-medium mb-1">Review</span>
            <textarea className="field-luxury py-2 resize-y" rows={5} maxLength={2000} value={draft.content} onChange={(e) => set("content", e.target.value)} />
            {errors.content && <span className="block text-destructive text-xs mt-1">{errors.content}</span>}
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={draft.published} onCheckedChange={(v) => set("published", v)} />
            Show on the website
          </label>
        </div>
        <DialogFooter>
          <button type="button" className="chip-luxury" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-luxury text-xs disabled:opacity-50" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Reviews;
