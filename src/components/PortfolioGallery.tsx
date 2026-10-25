import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Play, X, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchGallery, GALLERY_API_ENABLED, type GalleryPhoto } from "@/lib/gallery";
import type { ServiceId } from "@/data/services";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/data/social";

type PortfolioGalleryProps = {
  category: { id: ServiceId; title: string; images: string[] };
  onClose: () => void;
};

const PortfolioGallery = ({ category, onClose }: PortfolioGalleryProps) => {
  const { token } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["portfolio-gallery", category.id],
    queryFn: () => fetchGallery(category.id, token),
    enabled: GALLERY_API_ENABLED,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // The studio's uploaded photos; until a service has any (or while the API isn't connected),
  // the photos bundled with the site, so the gallery is never empty
  const bundled: GalleryPhoto[] = category.images.map((imageUrl, i) => ({ id: String(i), imageUrl }));
  const photos: GalleryPhoto[] = GALLERY_API_ENABLED && data?.length ? data : GALLERY_API_ENABLED && !data ? [] : bundled;

  // The video playing on top of the gallery, if any
  const [playing, setPlaying] = useState<GalleryPhoto | null>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // Escape closes the video first, then the gallery; the page behind doesn't scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (playingRef.current) setPlaying(null);
      else onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-espresso/85 backdrop-blur-md overflow-y-auto overscroll-contain"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${category.title} gallery`}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 text-cream p-2.5 rounded-full border border-cream/20 bg-cream/10 backdrop-blur-md hover:bg-cream/20 transition-colors"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 py-16 sm:py-20"
      >
        <h2 className="font-serif text-3xl md:text-4xl text-cream text-center mb-8">{category.title}</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" aria-label="Loading photos">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-cream/10 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-cream/80 py-12" onClick={(e) => e.stopPropagation()}>
            <p className="mb-4">We couldn't load these photos right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn-luxury text-xs inline-flex items-center gap-2"
            >
              <RefreshCw size={14} className={isFetching ? "animate-spin" : undefined} />
              Try Again
            </button>
          </div>
        ) : photos.length === 0 ? (
          <p className="text-center text-cream/80 py-12">New photos are coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-cream/5"
                onClick={(e) => e.stopPropagation()}
              >
                {photo.mediaType === "video" ? (
                  <>
                    {photo.thumbnailUrl ? (
                      <img src={photo.thumbnailUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <video src={`${photo.imageUrl}#t=0.5`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setPlaying(photo)}
                      className="absolute inset-0 flex items-center justify-center bg-espresso/10 hover:bg-espresso/25 transition-colors"
                      aria-label={`Play video${photo.caption ? `: ${photo.caption}` : ""}`}
                    >
                      <span className="rounded-full bg-cream/90 text-espresso p-3.5 sm:p-4 shadow-lg">
                        <Play size={24} className="fill-current translate-x-0.5" />
                      </span>
                    </button>
                  </>
                ) : (
                  <img
                    src={photo.thumbnailUrl ?? photo.imageUrl}
                    alt={photo.caption ?? `${category.title} photo`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* The photo's own Instagram post when the API has one, otherwise the studio's profile */}
                <a
                  href={photo.instagramUrl ?? INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm text-cream bg-gradient-to-t from-espresso/80 to-transparent hover:from-primary/90 transition-colors"
                  aria-label={
                    photo.instagramUrl
                      ? `View this photo on Instagram${photo.caption ? `: ${photo.caption}` : ""}`
                      : `See more of our work on Instagram (@${INSTAGRAM_HANDLE})`
                  }
                >
                  <Instagram size={16} className="shrink-0" />
                  <span className="truncate">View on Instagram</span>
                </a>
              </figure>
            ))}
          </div>
        )}

        <div className="text-center mt-8" onClick={(e) => e.stopPropagation()}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury text-xs inline-flex items-center gap-2"
          >
            <Instagram size={16} />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>

        <p className="text-cream/70 text-center mt-6 text-sm">Tap outside the photos or press Esc to close</p>
      </motion.div>

      {playing && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-espresso/95 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={playing.caption ?? `${category.title} video`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPlaying(null);
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-cream p-2.5 rounded-full border border-cream/20 bg-cream/10 hover:bg-cream/20 transition-colors"
            aria-label="Close video"
          >
            <X size={24} />
          </button>
          <figure className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <video
              src={playing.imageUrl}
              poster={playing.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[80vh] rounded-lg bg-black"
            />
            {playing.caption && <figcaption className="text-cream/80 text-center mt-3 text-sm">{playing.caption}</figcaption>}
          </figure>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioGallery;
