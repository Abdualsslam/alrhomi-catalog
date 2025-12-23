// src/components/ImageGrid.tsx
import { Grid } from "@mui/material";
import ImageCard from "./ImageCard";
import { FC, ReactElement } from "react";

// Flexible image type that works with both Image and Product types
export interface GridImage {
  _id: string;
  productName?: string;
  description?: string;
  category?: string;
  originalUrl?: string;
  watermarkedUrl?: string;
  isWatermarked?: boolean;
  tags?: string[];
}

interface ImageGridProps {
  images?: GridImage[];
  withDownload?: boolean;
  onSelect?: (img: GridImage) => void;
}

const ImageGrid: FC<ImageGridProps> = ({
  images = [],
  withDownload,
  onSelect
}): ReactElement => {
  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <Grid container spacing={3}>
      {safeImages.map((img) => (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={img._id}>
          <ImageCard
            image={img as any}
            withDownload={withDownload}
            onViewDetails={() => onSelect?.(img)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
