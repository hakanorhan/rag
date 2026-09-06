/**
 * Intersection Observer pattern for conditionally rendering content
 * when an element enters the viewport:
 * https://www.infinitespiral.co.uk/Blog/NextIntersectionObserver
 *
 * Adapted for project-specific requirements.
 */
"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useElementBoundaryObserver } from "@/lib/customHooks";

type NextIntersectionObserverProps = {
  children: ReactNode;
  rootmargin: string;
  thresholdValue?: number | number[];
  classes: string;
  topIn: string;
  topOut: string;
  bottomIn: string;
  bottomOut: string;
};

export default function NextIntersectionObserver(
  props: NextIntersectionObserverProps,
) {
  const {
    children,
    rootmargin,
    thresholdValue = 0.01,
    classes,
    topIn,
    topOut,
    bottomIn,
    bottomOut,
  } = props;
  const [ref, boundary] = useElementBoundaryObserver(
    rootmargin,
    thresholdValue,
  );

  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    if (boundary === "bottomIn" || boundary === "topIn") {
      setHasEnteredViewport(true);
    }
  }, [boundary]);

  const boundaryClass = {
    topIn,
    topOut,
    bottomIn,
    bottomOut,
  }[boundary || "bottomOut"];

  return (
    <div
      ref={ref}
      className={`${classes} ${boundaryClass}`}
      style={hasEnteredViewport ? undefined : { minHeight: 1 }}
    >
      {hasEnteredViewport ? children : null}
    </div>
  );
}
