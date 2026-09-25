"use client";

import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useState } from "react";
import { useImageIntersectionObserver } from "@/hooks/useImageIntersectionObserver";

interface ImageParam {
  src: string;
  alt: string;
  objectFit: "contain" | "cover";
  loading?: "eager" | "lazy";
  skeleton?: boolean;
  width?: number | string;
  height?: number | string;
}

export default function ImageRender(param: ImageParam) {
  const theme = useTheme();
  const { isVisible, imageContainerRef } = useImageIntersectionObserver();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === param.src;

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
        {param.skeleton !== false && (
          <Skeleton
            variant="rectangular"
            animation={isLoaded ? false : "wave"}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}

        {isVisible && (
          <Image
            src={param.src}
            alt={param.alt}
            fill
            sizes="(max-width: 2000px) 100vw, 10vw"
            loading={param.loading ?? "lazy"}
            onLoad={(event) => {
              const image = event.currentTarget;
              const reveal = () => setLoadedSrc(param.src);
              void image.decode().then(reveal, reveal);
            }}
            onError={() => setLoadedSrc(param.src)}
            style={{
              objectFit: param.objectFit,
              opacity: isLoaded ? 1 : 0,
              transition: theme.transitions.create("opacity", {
                duration: 700,
                easing: theme.transitions.easing.easeInOut,
              }),
            }}
          />
        )}
      </Box>
    </Box>
  );
}
