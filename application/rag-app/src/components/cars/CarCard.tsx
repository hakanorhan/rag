import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import ImageRender from "@/app/utils/imageRender";

type CarCardProps = {
  car: {
    imageUrl?: string | null;
  };
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  details: Array<{ id: string; text: ReactNode }>;
  price: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "low" | "auto";
};

export default function CarCard({
  car,
  eyebrow,
  title,
  subtitle,
  details,
  price,
  actions,
  loading = false,
  imageLoading,
  imageFetchPriority,
}: CarCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
      }}
    >
      {loading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "auto", aspectRatio: "16 / 9" }}
        />
      ) : car.imageUrl ? (
        <ImageRender
          src={car.imageUrl}
          alt={typeof title === "string" ? title : ""}
          objectFit="contain"
          loading={imageLoading}
          fetchPriority={imageFetchPriority}
        />
      ) : null}

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {eyebrow}

        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>

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
        <Typography
          component="p"
          variant="subtitle1"
          sx={{ fontWeight: 700, mt: "auto", color: "primary.main" }}
        >
          {price}
        </Typography>
      </CardContent>

      {actions ? <CardActions>{actions}</CardActions> : null}
    </Card>
  );
}
