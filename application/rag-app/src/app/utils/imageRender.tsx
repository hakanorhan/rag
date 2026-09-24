"use client";

import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useImageIntersectionObserver } from "@/hooks/useImageIntersectionObserver";

interface ImageParam {
  src: string;
  alt: string;
  objectFit: "contain" | "cover";
  loading?: "eager" | "lazy";
  width?: number | string;
  height?: number | string;
  skeletonDurationMs?: number;
}

export default function ImageRender(param: ImageParam) {
  const forceLoad = false;

  const { isVisible, imageContainerRef } =
    useImageIntersectionObserver(forceLoad);

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setShowImage(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowImage(true);
    }, param.skeletonDurationMs ?? 1200);

    return () => window.clearTimeout(timeout);
  }, [isVisible, param.skeletonDurationMs]);

  return (
    <Box
      ref={imageContainerRef}
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: param.width ?? "100%",
          height: param.height,
          aspectRatio: param.height === undefined ? "16 / 9" : undefined,
          overflow: "hidden",
        }}
      >
        {!showImage && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}

        {showImage && (
          <Image
            src={param.src}
            alt={param.alt}
            fill
            sizes="(max-width: 2000px) 100vw, 10vw"
            loading={param.loading ?? "lazy"}
            style={{ objectFit: param.objectFit }}
          />
        )}
      </Box>
    </Box>
  );
}
