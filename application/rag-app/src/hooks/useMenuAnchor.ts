"use client";

import { type MouseEvent, useState } from "react";

export default function useMenuAnchor() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  function openMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElement(event.currentTarget);
  }

  function closeMenu() {
    setAnchorElement(null);
  }

  return {
    anchorElement,
    closeMenu,
    isOpen: Boolean(anchorElement),
    openMenu,
  };
}
