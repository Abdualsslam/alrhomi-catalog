import { Image, Category } from "./models.types";

// Common Component Props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

// Image Card Props
export interface ImageCardProps extends BaseComponentProps {
  image: Image;
  withDownload?: boolean;
  onViewDetails?: (image: Image) => void;
}

// Image Modal Props
export interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  image: Image | null;
}

// Search Bar Props
export interface SearchBarProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

// Filters Props
export interface FiltersProps extends BaseComponentProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

// Image Grid Props
export interface ImageGridProps extends BaseComponentProps {
  images: Image[];
  loading?: boolean;
  onImageClick?: (image: Image) => void;
}

// Category Showcase Props
export interface CategoryShowcaseProps extends BaseComponentProps {
  categories?: Category[];
  loading?: boolean;
  limit?: number;
  showMore?: boolean;
  onMoreClick?: () => void;
}

// WhatsApp CTA Props
export interface WhatsAppCTAProps extends BaseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  product?: Image;
  context?: string;
  sx?: Record<string, any>;
}

// SEO Props
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  author?: string;
}

// Testimonials Props (no props currently, but defined for future use)
export interface TestimonialsProps extends BaseComponentProps {}

// About Contact Section Props (no props currently, but defined for future use)
export interface AboutContactSectionProps extends BaseComponentProps {}

// Main Layout Props (no props currently, but defined for future use)
export interface MainLayoutProps extends BaseComponentProps {}

// Admin Layout Props (no props currently, but defined for future use)
export interface AdminLayoutProps extends BaseComponentProps {}

// Admin App Props (no props currently, but defined for future use)
export interface AdminAppProps extends BaseComponentProps {}
