"use client";

import { useEffect, useRef, useState } from "react";
import type { CarSearchState } from "@/lib/carSearchState";

export function useCarSearchState(
  initialState?: CarSearchState,
  options: { syncUrl?: boolean } = {},
) {
  const initialStateRef = useRef(initialState);
  const [searchState, setSearchState] = useState<CarSearchState | null>(
    initialState ?? null,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSearchState(initialStateRef.current ?? null);
    setIsLoaded(true);
  }, []);

  const updateSearchState = (values: Partial<CarSearchState>) => {
    if (!searchState) return;

    const updatedState = { ...searchState, ...values };
    if (options.syncUrl) {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(values)) {
        if (value || key === "extraIds") params.set(key, value);
        else params.delete(key);
      }
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    }
    setSearchState(updatedState);
  };

  return { searchState, updateSearchState, isLoaded };
}
