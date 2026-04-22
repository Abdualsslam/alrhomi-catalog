import { User } from "./models.types";

// Common API Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  totalItems?: number;
  page?: number;
  limit?: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Auth API Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Image API Types
export interface ImageQueryParams extends PaginationParams {
  q?: string;
  category?: string;
  brand?: string;
  model?: string;
  sizeMin?: number;
  sizeMax?: number;
  tags?: string[];
  search?: string;
  assigned?: boolean;
  ids?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface UploadImageRequest {
  file: File;
  description?: string;
  productName?: string;
  category: string;
  tags?: string[];
}

export interface UploadImageResponse {
  jobId?: string;
  message?: string;
  watermarkedUrl?: string;
  originalUrl?: string;
}

// Product API Types
export interface ProductQueryParams extends PaginationParams {
  q?: string;
  category?: string;
  model?: string;
  productCode?: string;
  tags?: string[];
  search?: string;
   hasImages?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  images: string[];
  tags?: string[];
  price?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

// Category API Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent?: string | null;
  image?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> { }

// Admin Stats Types
export interface AdminStats {
  totalUsers: number;
  totalImages: number;
  totalProducts: number;
  productsWithImages: number;
  productsWithoutImages: number;
  totalCategories: number;
  watermarkedCount: number;
  pendingJobs: number;
  activeUsers: number;
  recentUsers: User[];
  imagesByCategory: Array<{
    category: string;
    count: number;
  }>;
}

// Admin API Types
export interface FetchOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export interface FetchImagesParams extends PaginationParams {
  search?: string;
  assigned?: boolean;
  ids?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  role?: string;
}

// Real Folder System Types
export interface RealFolder {
  _id: string;
  name: string;
  parent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContentsResponse {
  folders: RealFolder[];
  images: ImageData[];
  breadcrumbs: Array<{ id: string | null; name: string }>;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}

export interface ImageData {
  _id: string;
  originalUrl: string;
  watermarkedUrl?: string;
  folder?: string | null;
  product?: string | null;
  isWatermarked: boolean;
  status: string;
  createdAt: string;
}


