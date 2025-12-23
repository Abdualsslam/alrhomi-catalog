// User Types
export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "user";

// Image Types
export interface Image {
  _id: string;
  originalUrl: string;
  watermarkedUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  productName?: string;
  category: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Product Image Type (for images embedded in products)
export interface ProductImage {
  _id: string;
  originalUrl: string;
  watermarkedUrl?: string;
  isWatermarked?: boolean;
}

// Product Variant Type
export interface ProductVariant {
  name: string;
  values: string[];
}

// Similar Product Type (populated reference)
export interface SimilarProduct {
  _id: string;
  productName: string;
  productCode: string;
  category: string;
  model?: string;
  originalUrl?: string;
  watermarkedUrl?: string;
}

// Product Types
export interface Product {
  _id: string;
  productCode: string;
  productName: string;
  description?: string;
  category: string;
  subcategory?: string;
  model?: string;
  note?: string;
  variants?: ProductVariant[];
  tags?: string[];
  images?: ProductImage[];
  similarProducts?: SimilarProduct[];
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
  } | null;
  image?: string;
  imageCount?: number;
  itemsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Job Status Types
export interface JobStatus {
  _id: string;
  jobId: string;
  status: JobStatusType;
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatusType = "pending" | "processing" | "completed" | "failed";
