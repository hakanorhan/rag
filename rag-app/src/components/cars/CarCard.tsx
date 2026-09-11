"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip, { type ChipProps } from "@mui/material/Chip";
import { yellow } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

type CarCardProps = {
  car: {
    imageUrl?: string | null;
  };
  eyebrow?: string;
  title: string;
  subtitle?: string;
  details: Array<{ id: string; text: string }>;
  price: string;
  statusColor: ChipProps["color"];
  statusLabel: string;
  actions?: ReactNode;
  forceLoad?: boolean;
};

export default function CarCard({
  car,
  eyebrow,
  title,
  subtitle,
  details,
  price,
  statusColor,
  statusLabel,
  actions,
  forceLoad = false,
}: CarCardProps) {
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

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
      }}
    >
      <Box
        ref={imageContainerRef}
        sx={{
          position: "relative",
          width: "100%",
          height: 210,
          overflow: "hidden",
        }}
      >
        {isVisible && car.imageUrl ? (
          <Image
            src={car.imageUrl}
            alt={title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            loading="lazy"
            style={{
              objectFit: "contain",
            }}
          />
        ) : null}
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {eyebrow ? (
          <Typography variant="overline" color="text.secondary">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
        <Box sx={{ mt: 1.5 }}>
          <Chip label={statusLabel} color={statusColor} size="small" />
        </Box>
        <Box sx={{ my: 2, flexGrow: 1 }}>
          {details.map((detail) => (
            <Typography
              key={detail.id}
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {detail.text}
            </Typography>
          ))}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: "auto" }}>
          {price}
        </Typography>
      </CardContent>

      {actions ? (
        <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions>
      ) : null}
    </Card>
  );
}
