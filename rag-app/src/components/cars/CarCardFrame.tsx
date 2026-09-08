import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import type { CSSProperties, ReactNode } from "react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import type { CarDTO } from "@/types/car";

type CarCardFrameProps = {
  actions?: ReactNode;
  actionsSx?: SystemStyleObject<Theme>;
  cardSx?: SystemStyleObject<Theme>;
  car: CarDTO;
  children: ReactNode;
  contentSx?: SystemStyleObject<Theme>;
  imageLoading?: "eager" | "lazy";
  imageSizes: string;
  imageStyle: CSSProperties;
  imageSx: SystemStyleObject<Theme>;
};

export default function CarCardFrame(props: CarCardFrameProps) {
  const {
    actions,
    actionsSx,
    cardSx,
    car,
    children,
    contentSx,
    imageLoading,
    imageSizes,
    imageStyle,
    imageSx,
  } = props;

  return (
    <Card variant="outlined" sx={cardSx}>
      {car.imageUrl ? (
        <ImageWithSkeleton
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          sx={imageSx}
          sizes={imageSizes}
          loading={imageLoading}
          style={imageStyle}
        />
      ) : null}

      <CardContent sx={contentSx}>{children}</CardContent>

      {actions ? <CardActions sx={actionsSx}>{actions}</CardActions> : null}
    </Card>
  );
}
