"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import { useImageIntersectionObserver } from "@/hooks/useImageIntersectionObserver";

interface ImageParam {
  src: string;
  alt: string;
  objectFit: "contain" | "cover";
  loading?: "eager" | "lazy";
}

export default function ImageRender(param: ImageParam) {
  const forceLoad = false;

  const { isVisible, imageContainerRef } =
    useImageIntersectionObserver(forceLoad);
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
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
        }}
      >
        {isVisible && (
          <Image
            src={param.src}
            alt={param.alt}
            fill
            sizes="(max-width: 2000px) 100vw, (max-width: 2000px) 10vw, 100vw"
            loading={param.loading ? param.loading : "lazy"}
            style={{ objectFit: param.objectFit }}
          />
        )}
      </Box>
    </Box>
  );
}
