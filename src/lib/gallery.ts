// Portfolio gallery API client: the photos the studio uploads for each service, each optionally
// linked to its Instagram post.
import { API_ENABLED, apiRequest } from "@/lib/api";
import type { ServiceId } from "@/data/services";

export type GalleryPhoto = {
  id: string;
  mediaType?: "image" | "video";
  // The photo, or the video file; for a video the thumbnail is its preview frame
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  instagramUrl?: string;
};

// Until the API is connected, the gallery shows the photos bundled with the site
export const GALLERY_API_ENABLED = API_ENABLED;

// Only real Instagram addresses become links, so a bad entry can't point visitors elsewhere
export const isInstagramUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /^(www\.)?instagram\.com$/.test(url.hostname);
  } catch {
    return false;
  }
};

export async function fetchGallery(category: ServiceId, token?: string | null): Promise<GalleryPhoto[]> {
  const data = await apiRequest<unknown>(`/portfolio/${category}/photos`, { token });
  const items = Array.isArray(data) ? data : [];
  return items
    .filter((item): item is Record<string, unknown> => !!item && typeof item.imageUrl === "string")
    .map((item, index) => ({
      id: String(item.id ?? index),
      mediaType: item.mediaType === "video" ? "video" : "image",
      imageUrl: item.imageUrl as string,
      thumbnailUrl: typeof item.thumbnailUrl === "string" ? item.thumbnailUrl : undefined,
      caption: typeof item.caption === "string" ? item.caption : undefined,
      instagramUrl: isInstagramUrl(item.instagramUrl) ? item.instagramUrl : undefined,
    }));
}
