import { useEffect, useRef, useState } from "react";

export type ElementBoundary =
  | "topIn"
  | "topOut"
  | "bottomIn"
  | "bottomOut"
  | "";

export function useElementBoundaryObserver(
  rootMargin: string,
  threshold: number | number[],
) {
  const ref = useRef<HTMLDivElement>(null);
  const [boundary, setBoundary] = useState<ElementBoundary>("");

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setBoundary(entry.boundingClientRect.top <= 0 ? "topIn" : "bottomIn");
          return;
        }

        setBoundary(
          entry.boundingClientRect.bottom <= 0 ? "topOut" : "bottomOut",
        );
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, boundary] as const;
}
