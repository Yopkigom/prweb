"use client";

import Image from "next/image";
import { useState } from "react";

type YouTubeFacadeProps = {
  id: string;
  title: string;
  // Local poster image (public/). Keeping it first-party avoids any third-party
  // request until the visitor actually plays the video.
  poster: string;
};

// Click-to-load YouTube embed. The iframe (and ~1 MB of player script plus its
// cookies) is only created after the visitor presses play, which keeps the home
// page free of third-party traffic for Lighthouse and for visitors who never play.
export function YouTubeFacade({ id, title, poster }: YouTubeFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`${title} 영상 재생`}
      className="group relative block h-full w-full cursor-pointer overflow-hidden"
    >
      {/* Static export runs Image unoptimized; the poster is pre-sized to 960x540.
          Keep the default lazy loading: `priority` / `loading="eager"` both emit a
          <link rel=preload> that competes with CSS/JS on slow mobile and pushes the
          header text LCP past 2.5 s (Lighthouse mobile 100 -> 92~98). */}
      <Image
        src={poster}
        alt=""
        width={960}
        height={540}
        className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-8 w-8 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
