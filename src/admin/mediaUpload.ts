// Video uploads for the Photos page. The file goes straight from the browser to storage
// (Cloudflare R2 in production), so large clips never pass through the API.
import { API_BASE_URL } from "@/lib/api";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const VIDEO_TYPES: Record<string, string> = { mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm" };

// Some systems leave the type blank for .mov files, so fall back to the file name
export function videoType(file: File): string | undefined {
  if (Object.values(VIDEO_TYPES).includes(file.type)) return file.type;
  if (file.type && file.type !== "application/octet-stream") return undefined;
  return VIDEO_TYPES[file.name.split(".").pop()?.toLowerCase() ?? ""];
}

export type VideoUploadTarget = { key: string; uploadUrl: string; headers: Record<string, string> };

// Grabs a still frame about a second in, used as the video's thumbnail. Resolves empty when the
// browser can't decode the clip (for example some iPhone HEVC files on Windows); the upload still works.
export function capturePoster(file: File): Promise<Blob | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let settled = false;
    const finish = (blob?: Blob | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(blob ?? undefined);
    };
    const timer = setTimeout(() => finish(), 15000);
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 0) / 2);
    };
    video.onseeked = () => {
      if (!video.videoWidth) return finish();
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      canvas.toBlob(finish, "image/jpeg", 0.85);
    };
    video.onerror = () => finish();
    video.src = url;
  });
}

// PUTs the file to the upload address, reporting progress from 0 to 1. The development fallback
// address is on the API itself, which needs the admin token; R2's signed address must not get it.
export function sendVideo(target: VideoUploadTarget, file: File, token: string | undefined, onProgress: (fraction: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", target.uploadUrl);
    for (const [name, value] of Object.entries(target.headers)) xhr.setRequestHeader(name, value);
    if (token && API_BASE_URL && target.uploadUrl.startsWith(API_BASE_URL.replace(/\/$/, ""))) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () =>
      xhr.status < 300 ? resolve() : reject(new Error(xhr.status === 403 ? "The upload link was refused or expired. Please try again." : "The video upload failed. Please try again."));
    xhr.onerror = () => reject(new Error("The video upload failed. Check your connection and try again."));
    xhr.send(file);
  });
}
