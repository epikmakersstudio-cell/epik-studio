import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Instagram, Pencil, Play, Trash2, Upload, X, Check, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { services, type ServiceId } from "@/data/services";
import { isInstagramUrl } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../useAdminAuth";
import type { AdminPhoto } from "../adminApi";
import { capturePoster, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, sendVideo, videoType, type VideoUploadTarget } from "../mediaUpload";
import { EmptyBlock, ErrorBlock, LoadingBlock, PageHeader } from "../ui";

const ACCEPT = [...IMAGE_TYPES, "video/mp4", "video/quicktime", "video/webm", ".mov", ".m4v"].join(",");

type QueuedFile = {
  key: string;
  file: File;
  kind: "image" | "video";
  videoType?: string;
  progress?: number; // videos only, 0 to 1
  preview: string;
  caption: string;
  instagramUrl: string;
  state: "ready" | "uploading" | "done" | "error";
  error?: string;
};

const instagramError = (value: string) =>
  value.trim() && !isInstagramUrl(value.trim()) ? "Paste the full instagram.com link, starting with https://" : undefined;

const Photos = () => {
  const { request, token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceParam = searchParams.get("service");
  const serviceId: ServiceId = services.some((s) => s.id === serviceParam) ? (serviceParam as ServiceId) : services[0].id;

  const photosQuery = useQuery({
    queryKey: ["admin", "photos", serviceId],
    queryFn: () => request<AdminPhoto[]>(`/admin/photos?serviceId=${serviceId}`),
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "photos"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-gallery"] });
  };

  // ---- Upload queue ----
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Free the preview images when files leave the queue or the page closes
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => () => queueRef.current.forEach((q) => URL.revokeObjectURL(q.preview)), []);

  const addFiles = (files: FileList | File[]) => {
    const added: QueuedFile[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(files)) {
      const video = videoType(file);
      const kind = IMAGE_TYPES.includes(file.type) ? "image" : video ? "video" : null;
      if (!kind) rejected.push(`${file.name}: not a JPEG, PNG, WebP, MP4, MOV or WebM`);
      else if (kind === "image" && file.size > MAX_IMAGE_BYTES) rejected.push(`${file.name}: photos can be up to 15 MB`);
      else if (kind === "video" && file.size > MAX_VIDEO_BYTES) rejected.push(`${file.name}: videos can be up to 200 MB`);
      else
        added.push({
          key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          kind,
          videoType: video,
          preview: URL.createObjectURL(file),
          caption: "",
          instagramUrl: "",
          state: "ready",
        });
    }
    if (rejected.length) toast({ title: "Some files were skipped", description: rejected.join(". "), variant: "destructive" });
    setQueue((q) => [...q, ...added]);
  };

  const updateQueued = (key: string, patch: Partial<QueuedFile>) =>
    setQueue((q) => q.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  const removeQueued = (key: string) =>
    setQueue((q) => {
      const item = q.find((i) => i.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      return q.filter((i) => i.key !== key);
    });

  const pending = queue.filter((q) => q.state !== "done");
  const queueHasErrors = pending.some((q) => instagramError(q.instagramUrl));

  // One at a time, so a slow connection shows steady progress and one bad file doesn't stop the rest
  const uploadAll = async () => {
    setUploading(true);
    let done = 0;
    for (const item of pending) {
      updateQueued(item.key, { state: "uploading", error: undefined, progress: undefined });
      const form = new FormData();
      form.append("serviceId", serviceId);
      if (item.caption.trim()) form.append("caption", item.caption.trim());
      if (item.instagramUrl.trim()) form.append("instagramUrl", item.instagramUrl.trim());
      try {
        if (item.kind === "image") {
          form.append("image", item.file);
          await request("/admin/photos", { method: "POST", body: form });
        } else {
          // Ask for an upload address, send the clip straight to storage, then add it to the gallery
          const [poster, target] = await Promise.all([
            capturePoster(item.file),
            request<VideoUploadTarget>("/admin/photos/videos/uploads", {
              method: "POST",
              body: { serviceId, contentType: item.videoType, size: item.file.size },
            }),
          ]);
          await sendVideo(target, item.file, token, (progress) => updateQueued(item.key, { progress }));
          form.append("key", target.key);
          if (poster) form.append("poster", poster, "poster.jpg");
          await request("/admin/photos/videos", { method: "POST", body: form });
        }
        updateQueued(item.key, { state: "done" });
        done += 1;
      } catch (err) {
        updateQueued(item.key, { state: "error", error: err instanceof Error ? err.message : "Upload failed" });
      }
    }
    setUploading(false);
    refresh();
    if (done) toast({ title: `${done} ${done === 1 ? "file" : "files"} uploaded` });
    // Clear the finished ones after a moment so the admin sees the ticks
    setTimeout(() => setQueue((q) => q.filter((i) => (i.state === "done" ? (URL.revokeObjectURL(i.preview), false) : true))), 1500);
  };

  // ---- Existing photos ----
  const [editing, setEditing] = useState<AdminPhoto | null>(null);
  const photos = photosQuery.data ?? [];

  const move = async (index: number, direction: -1 | 1) => {
    const ids = photos.map((p) => p.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    // Show the new order straight away, then save it
    queryClient.setQueryData<AdminPhoto[]>(["admin", "photos", serviceId], (old) =>
      old ? ids.map((id) => old.find((p) => p.id === id)!) : old,
    );
    try {
      await request("/admin/photos/order", { method: "PUT", body: { serviceId, ids } });
    } catch (err) {
      toast({ title: "Couldn't save the new order", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  const remove = async (photo: AdminPhoto) => {
    try {
      await request(`/admin/photos/${photo.id}`, { method: "DELETE" });
      toast({ title: photo.mediaType === "video" ? "Video deleted" : "Photo deleted" });
    } catch (err) {
      toast({ title: "Couldn't delete the photo", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    }
    refresh();
  };

  return (
    <>
      <PageHeader
        title="Photos & videos"
        description="Photos and video clips appear in the Portfolio gallery for their service, in the order shown here. Add the Instagram post link to show a “View on Instagram” button."
      />

      {/* Service picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" role="tablist" aria-label="Service">
        {services.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === serviceId}
            disabled={uploading}
            onClick={() => setSearchParams({ service: s.id })}
            className={cn("chip-luxury whitespace-nowrap", s.id === serviceId && "is-active")}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Upload */}
      <section className="mb-10">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            dragging ? "border-primary bg-primary/5" : "border-border",
          )}
        >
          <Upload className="mx-auto mb-3 text-primary" />
          <p className="mb-1">Drag photos or videos here, or</p>
          <button type="button" onClick={() => fileInput.current?.click()} className="text-primary font-medium hover:underline">
            choose from your device
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Photos: JPEG, PNG or WebP up to 15 MB, resized for the web automatically. Videos: MP4, MOV or WebM up to 200 MB (short clips; MP4 plays on every device).
          </p>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {queue.length > 0 && (
          <div className="mt-6 space-y-3">
            {queue.map((item) => {
              const igError = instagramError(item.instagramUrl);
              return (
                <div key={item.key} className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border p-3">
                  {item.kind === "video" ? (
                    <video src={item.preview} muted playsInline preload="metadata" className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-md shrink-0 bg-secondary" />
                  ) : (
                    <img src={item.preview} alt="" className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-md shrink-0" />
                  )}
                  <div className="flex-1 grid gap-3 sm:grid-cols-2 content-start">
                    <label className="text-sm">
                      <span className="block font-medium mb-1">Caption (optional)</span>
                      <input
                        className="field-luxury py-2"
                        value={item.caption}
                        maxLength={200}
                        disabled={item.state === "uploading" || item.state === "done"}
                        onChange={(e) => updateQueued(item.key, { caption: e.target.value })}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="block font-medium mb-1">Instagram post link (optional)</span>
                      <input
                        className="field-luxury py-2"
                        value={item.instagramUrl}
                        placeholder="https://www.instagram.com/p/…"
                        disabled={item.state === "uploading" || item.state === "done"}
                        onChange={(e) => updateQueued(item.key, { instagramUrl: e.target.value })}
                        aria-invalid={!!igError}
                      />
                      {igError && <span className="block text-destructive text-xs mt-1">{igError}</span>}
                    </label>
                    {item.kind === "video" && item.state === "uploading" && (
                      <div className="sm:col-span-2" role="progressbar" aria-label={`Uploading ${item.file.name}`} aria-valuenow={Math.round((item.progress ?? 0) * 100)}>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary transition-[width]" style={{ width: `${(item.progress ?? 0) * 100}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.progress === undefined ? "Preparing video..." : item.progress < 1 ? `Uploading ${Math.round(item.progress * 100)}%` : "Finishing..."}
                        </p>
                      </div>
                    )}
                    {item.error && <p className="text-destructive text-sm sm:col-span-2">{item.error}</p>}
                  </div>
                  <div className="flex sm:flex-col items-center justify-end sm:justify-start gap-2 shrink-0">
                    {item.state === "uploading" && <Loader2 className="animate-spin text-primary" aria-label="Uploading" />}
                    {item.state === "done" && <Check className="text-emerald-600" aria-label="Uploaded" />}
                    {(item.state === "ready" || item.state === "error") && (
                      <button
                        type="button"
                        onClick={() => removeQueued(item.key)}
                        disabled={uploading}
                        className="p-2 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${item.file.name}`}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {pending.length > 0 && (
              <button
                type="button"
                onClick={uploadAll}
                disabled={uploading || queueHasErrors}
                className="btn-luxury text-xs disabled:opacity-50 inline-flex items-center gap-2"
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Uploading..." : `Upload ${pending.length} ${pending.length === 1 ? "file" : "files"} to ${services.find((s) => s.id === serviceId)!.name}`}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Existing photos */}
      <section>
        <h2 className="font-serif text-2xl mb-4">
          In the gallery {photosQuery.data && <span className="text-muted-foreground text-lg">({photos.length})</span>}
        </h2>
        {photosQuery.isLoading ? (
          <LoadingBlock rows={2} className="h-40" />
        ) : photosQuery.error ? (
          <ErrorBlock error={photosQuery.error} onRetry={photosQuery.refetch} />
        ) : photos.length === 0 ? (
          <EmptyBlock>Nothing uploaded for this service yet. Visitors see the site's built-in photos until you add some.</EmptyBlock>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <li key={photo.id} className="rounded-lg border border-border overflow-hidden bg-background flex flex-col">
                <div className="relative aspect-square bg-secondary">
                  <MediaThumb photo={photo} />
                  <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium">{index + 1}</span>
                  {photo.mediaType === "video" && (
                    <span className="absolute top-2 right-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium inline-flex items-center gap-1">
                      <Play size={12} /> Video
                    </span>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col gap-2 text-sm">
                  <p className={cn("line-clamp-2", !photo.caption && "text-muted-foreground italic")}>{photo.caption || "No caption"}</p>
                  {photo.instagramUrl ? (
                    <a href={photo.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary text-xs hover:underline">
                      <Instagram size={14} /> Instagram post
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No Instagram link</span>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      <button type="button" className="p-1.5 rounded hover:bg-secondary disabled:opacity-30" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move earlier">
                        <ArrowLeft size={16} />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-secondary disabled:opacity-30" disabled={index === photos.length - 1} onClick={() => move(index, 1)} aria-label="Move later">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="p-1.5 rounded hover:bg-secondary" onClick={() => setEditing(photo)} aria-label={photo.mediaType === "video" ? "Edit video details" : "Edit photo details"}>
                        <Pencil size={16} />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button type="button" className="p-1.5 rounded hover:bg-destructive/10 text-destructive" aria-label={photo.mediaType === "video" ? "Delete video" : "Delete photo"}>
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this {photo.mediaType === "video" ? "video" : "photo"}?</AlertDialogTitle>
                            <AlertDialogDescription>It will be removed from the website straight away. This can't be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep it</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(photo)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EditPhotoDialog photo={editing} onClose={() => setEditing(null)} onSaved={refresh} />
    </>
  );
};

// A video without a captured frame shows its own first frame instead
const MediaThumb = ({ photo, className = "w-full h-full object-cover" }: { photo: AdminPhoto; className?: string }) =>
  photo.mediaType === "video" && !photo.thumbnailUrl ? (
    <video src={`${photo.imageUrl}#t=0.5`} muted playsInline preload="metadata" className={className} />
  ) : (
    <img src={photo.thumbnailUrl ?? photo.imageUrl} alt={photo.caption ?? ""} className={className} loading="lazy" />
  );

const EditPhotoDialog = ({ photo, onClose, onSaved }: { photo: AdminPhoto | null; onClose: () => void; onSaved: () => void }) => {
  const { request } = useAdminAuth();
  const { toast } = useToast();
  const [caption, setCaption] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId>(services[0].id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!photo) return;
    setCaption(photo.caption ?? "");
    setInstagramUrl(photo.instagramUrl ?? "");
    setServiceId(photo.serviceId);
  }, [photo]);

  const igError = instagramError(instagramUrl);
  const save = async () => {
    if (!photo) return;
    setSaving(true);
    try {
      await request(`/admin/photos/${photo.id}`, {
        method: "PATCH",
        body: { caption: caption.trim(), instagramUrl: instagramUrl.trim(), serviceId },
      });
      toast({ title: photo.mediaType === "video" ? "Video updated" : "Photo updated" });
      onSaved();
      onClose();
    } catch (err) {
      toast({ title: "Couldn't save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{photo?.mediaType === "video" ? "Edit video" : "Edit photo"}</DialogTitle>
        </DialogHeader>
        {photo && (
          <div className="space-y-4">
            {photo.mediaType === "video" ? (
              <video src={photo.imageUrl} poster={photo.thumbnailUrl ?? undefined} controls playsInline preload="metadata" className="w-full max-h-56 rounded-md bg-black" />
            ) : (
              <MediaThumb photo={photo} className="w-full max-h-56 object-cover rounded-md" />
            )}
            <label className="block text-sm">
              <span className="block font-medium mb-1">Caption</span>
              <input className="field-luxury py-2" value={caption} maxLength={200} onChange={(e) => setCaption(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="block font-medium mb-1">Instagram post link</span>
              <input
                className="field-luxury py-2"
                value={instagramUrl}
                placeholder="https://www.instagram.com/p/…"
                onChange={(e) => setInstagramUrl(e.target.value)}
                aria-invalid={!!igError}
              />
              {igError && <span className="block text-destructive text-xs mt-1">{igError}</span>}
            </label>
            <label className="block text-sm">
              <span className="block font-medium mb-1">Service</span>
              <select className="field-luxury py-2" value={serviceId} onChange={(e) => setServiceId(e.target.value as ServiceId)}>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <DialogFooter>
          <button type="button" className="chip-luxury" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-luxury text-xs disabled:opacity-50" onClick={save} disabled={saving || !!igError}>
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Photos;
