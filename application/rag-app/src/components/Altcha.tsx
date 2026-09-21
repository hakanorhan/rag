"use client";

import "altcha";
import "altcha/i18n/de";
import "altcha/types/react";
import { useEffect, useState } from "react";

export default function Altcha() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <altcha-widget
      challenge="/api/altcha/challenge"
      name="altcha"
      language="de"
    />
  );
}
