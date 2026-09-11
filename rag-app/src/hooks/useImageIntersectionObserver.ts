"use client"

import { useEffect, useRef, useState } from "react";
export function useImageIntersectionObserver(forceLoad = false) {
    const [isVisible, setIsVisible] = useState(forceLoad);
  
    const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.01 },
    );

    if (imageContainerRef.current) {
      observer.observe(imageContainerRef.current);
    }

    return () => observer.disconnect();
  }, [forceLoad]);

  return {
    isVisible,
    imageContainerRef
  }
}
