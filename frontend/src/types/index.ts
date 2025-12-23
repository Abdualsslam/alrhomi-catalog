/**
 * Central Type Definitions Export
 *
 * This file provides a single entry point for importing all TypeScript types
 * used throughout the application. Import types from this file instead of
 * individual type files for cleaner imports.
 *
 * Example usage:
 *   import { User, Image, AuthContextValue, ImageCardProps } from '../types';
 */

// Model Types
export type {
  User,
  UserRole,
  Image,
  Product,
  ProductImage,
  ProductVariant,
  SimilarProduct,
  Category,
  JobStatus,
  JobStatusType,
} from "./models.types";

// API Types
export type {
  PaginationParams,
  PaginatedResponse,
  ApiError,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ImageQueryParams,
  UploadImageRequest,
  UploadImageResponse,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  AdminStats,
} from "./api.types";

// Context Types
export type {
  AuthContextValue,
  ThemeMode,
  ThemeContextValue,
} from "./context.types";

// Component Types
export type {
  BaseComponentProps,
  ImageCardProps,
  ImageModalProps,
  SearchBarProps,
  FiltersProps,
  ImageGridProps,
  CategoryShowcaseProps,
  WhatsAppCTAProps,
  SEOProps,
  TestimonialsProps,
  AboutContactSectionProps,
  MainLayoutProps,
  AdminLayoutProps,
  AdminAppProps,
} from "./component.types";

// Router Types
export type { RouteParams, LocationState } from "./router.types";

// i18n Types
export type { TranslationNamespace, TranslationKeys } from "./i18n.types";
