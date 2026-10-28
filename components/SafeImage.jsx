"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

// Fills its parent (parent needs `relative` and a size/aspect ratio).
// Shows a skeleton while loading and a tidy fallback if the image fails.
export default function SafeImage({ src, alt, sizes, priority = false, className = "" }) {
  const [state, setState] = useState("loading");

  if (state === "error") {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-mist text-slate"
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-mist" aria-hidden="true" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={`object-cover transition-opacity duration-300 ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </>
  );
}
