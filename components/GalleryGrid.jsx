"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ImageOff, SearchX } from "lucide-react";
import SafeImage from "./SafeImage";
import { GALLERY, GALLERY_CATEGORIES } from "../data/gallery";

function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index];
  const closeRef = useRef(null);
  const [imgState, setImgState] = useState("loading");

  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    setImgState("loading");
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${item.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy hover:bg-royal-light"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy hover:bg-royal-light sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy hover:bg-royal-light sm:right-6"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      <figure className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
          {imgState === "error" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate">
              <ImageOff className="h-10 w-10" aria-hidden="true" />
              <span className="text-sm">This image could not be loaded.</span>
            </div>
          ) : (
            <>
              {imgState === "loading" && <div className="absolute inset-0 animate-pulse bg-mist" aria-hidden="true" />}
              <Image
                key={item.id}
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
                onLoad={() => setImgState("loaded")}
                onError={() => setImgState("error")}
              />
            </>
          )}
        </div>
        <figcaption className="mt-3 text-center text-sm text-white">
          {item.title} · {index + 1} / {items.length}
        </figcaption>
      </figure>
    </div>
  );
}

export default function GalleryGrid({ items = GALLERY, showFilters = true }) {
  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);
  const triggerRefs = useRef({});
  const lastOpened = useRef(null);

  const visible = category === "All" ? items : items.filter((i) => i.category === category);

  const close = useCallback(() => {
    setOpenIndex(null);
    const id = lastOpened.current;
    if (id && triggerRefs.current[id]) triggerRefs.current[id].focus();
  }, []);

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter gallery by category" className="mb-8 flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`min-h-[44px] rounded-full border px-5 text-sm font-medium transition ${
                category === c
                  ? "border-royal bg-royal text-white"
                  : "border-line bg-white text-navy hover:border-royal hover:text-royal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <SearchX className="h-10 w-10 text-royal" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-bold">Nothing here yet</h3>
          <p className="mt-2 text-sm text-slate">There are no photos in this category.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                ref={(el) => { triggerRefs.current[item.id] = el; }}
                onClick={() => { lastOpened.current = item.id; setOpenIndex(i); }}
                aria-label={`Open image: ${item.title}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-line bg-mist"
              >
                <SafeImage
                  src={item.src}
                  alt={item.alt}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {openIndex !== null && visible[openIndex] && (
        <Lightbox items={visible} index={openIndex} onClose={close} onIndex={setOpenIndex} />
      )}
    </div>
  );
}
