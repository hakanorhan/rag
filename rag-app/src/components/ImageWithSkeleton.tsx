"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import Image from "next/image";
import { type CSSProperties, useState } from "react";

type ImageWithSkeletonProps = {
  alt: string;
  loading?: "eager" | "lazy";
  preload?: boolean;
  sizes: string;
  src: string;
  style?: CSSProperties;
  sx: SystemStyleObject<Theme>;
};

export default function ImageWithSkeleton({
  alt,
  loading,
  preload,
  sizes,
  src,
  sx,
  style,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box sx={{ position: "relative", overflow: "hidden", ...sx }}>
      {!loaded ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            bgcolor: "text.disabled",
            opacity: 0.35,
          }}
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        preload={preload}
        onLoad={() => window.setTimeout(() => setLoaded(true), 300)}
        style={{ ...style, visibility: loaded ? "visible" : "hidden" }}
      />
    </Box>
  );
}
