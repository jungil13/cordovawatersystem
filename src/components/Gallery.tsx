import { useState, useEffect, useRef } from "react";
import { fetchGallery, initialPhotos, GalleryPhoto } from "@/lib/data";
import { Image, ChevronLeft, ChevronRight, X, ZoomIn, Pause, Play } from "lucide-react";

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic photos stored in Supabase database
  useEffect(() => {
    fetchGallery().then((data) => {
      if (data && data.length > 0) {
        setPhotos(data);
      }
    });
  }, []);

  const close = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % photos.length : null));

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Duplicate photos array for continuous seamless infinite marquee effect
  const loopPhotos =
    photos.length > 0
      ? photos.length < 5
        ? [...photos, ...photos, ...photos, ...photos]
        : [...photos, ...photos]
      : [];

  return (
    <section id="gallery" className="py-20 bg-white overflow-hidden reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Image className="w-3.5 h-3.5 text-sky-600" />
              Infrastructure & Operations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Photo Gallery & Facilities
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              An inside look at our treatment facilities, reservoir storage, pipeline upgrades, and community tap stands.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isPaused ? "Play" : "Pause"}</span>
            </button>
            <button
              onClick={scrollLeft}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-blue-700 hover:border-sky-200 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-blue-700 hover:border-sky-200 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Track Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar py-2"
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className={`animate-marquee gap-5 px-4 ${isPaused ? "style-paused" : ""}`}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {loopPhotos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              onClick={() => setLightbox(index % photos.length)}
              className="relative w-72 sm:w-80 h-52 sm:h-56 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 bg-slate-100"
            >
              <img
                src={photo.src}
                alt={photo.alt || photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Tag */}
              {photo.tag && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 uppercase tracking-wider">
                    {photo.tag}
                  </span>
                </div>
              )}

              {/* Zoom Icon Button on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs sm:text-sm font-bold leading-snug drop-shadow-md group-hover:text-cyan-200 transition-colors line-clamp-2">
                  {photo.caption}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">Click to view full photo</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 text-center">
        <p className="text-slate-400 text-xs italic">
          Hover over or touch any image to pause the infinite loop and view higher resolution details.
        </p>
      </div>

      {/* Lightbox Modal */}
      {lightbox !== null && photos[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].alt || photos[lightbox].caption}
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <div className="text-center mt-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30 uppercase tracking-wider mb-1.5">
                {photos[lightbox].tag || "Gallery"} • {lightbox + 1} of {photos.length}
              </span>
              <p className="text-white text-sm sm:text-base font-semibold">
                {photos[lightbox].caption}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
