// src/api/admin.ts
import apiClient from "./client";
import {
  AdminStats,
  FetchOptions,
  FetchImagesParams,
  CreateUserRequest,
  PaginatedResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  UploadImageResponse,
  FolderQueryDto,
  FolderStructureResponse,
} from "../types/api.types";
import {
  User,
  Image,
  Category,
  Product,
  JobStatus,
} from "../types/models.types";

// ===== إدارة المستخدمين =====
export const fetchUsers = async (
  options: FetchOptions = {}
): Promise<User[]> => {
  return apiClient.get<User[]>("/admin/users", {
    signal: options.signal,
    timeout: options.timeout || 10000,
  });
};

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  return apiClient.post<User>("/admin/users", data);
};

export const deleteUser = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/admin/users/${id}`);
};

// ===== إحصائيات =====
export const fetchStats = async (
  options: FetchOptions = {}
): Promise<AdminStats> => {
  return apiClient.get<AdminStats>("/admin/stats", {
    signal: options.signal,
    timeout: options.timeout || 10000,
  });
};

// ===== الصور =====
export const fetchImages = async (
  params: FetchImagesParams = {}
): Promise<PaginatedResponse<Image>> => {
  const { page = 1, limit = 8, search = "", assigned, ids } = params;
  const queryParams: Record<string, any> = { page, limit };

  if (search) queryParams.search = search;
  if (assigned !== undefined) queryParams.assigned = assigned;
  if (ids) queryParams.ids = ids;

  return apiClient.get<PaginatedResponse<Image>>("/admin/images", {
    params: queryParams,
  });
};

export const toggleWatermark = async (id: string): Promise<Image> => {
  return apiClient.patch<Image>(`/images/${id}/watermark-toggle`);
};

export const fetchJobStatus = async (jobId: string): Promise<JobStatus> => {
  return apiClient.get<JobStatus>(`/job-status/${jobId}`);
};

export const deleteImage = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/admin/images/${id}`);
};

export const uploadImage = async (
  formData: FormData
): Promise<UploadImageResponse> => {
  return apiClient.post<UploadImageResponse>("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchFolderStructure = async (
  query: FolderQueryDto = {}
): Promise<FolderStructureResponse> => {
  return apiClient.get<FolderStructureResponse>("/images/folders", {
    params: query,
  });
};

// ===== الفئات =====
// استخدام public endpoint للعرض العام
export const fetchCategories = async (
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<Category>> => {
  const { page = 1, limit = 10 } = params;
  return apiClient.get<PaginatedResponse<Category>>("/categories", {
    params: { page, limit },
  });
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<Category> => {
  return apiClient.post<Category>("/admin/categories", data);
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<Category> => {
  return apiClient.put<Category>(`/admin/categories/${id}`, data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/admin/categories/${id}`);
};

// ===== المنتجات =====
export const fetchProducts = async (
  params: ProductQueryParams = {}
): Promise<PaginatedResponse<Product>> => {
  const {
    page = 1,
    limit = 12,
    q = "",
    category = "",
    model = "",
    productCode = "",
  } = params;
  const queryParams: Record<string, any> = { page, limit };

  if (q) queryParams.q = q;
  if (category) queryParams.category = category;
  if (model) queryParams.model = model;
  if (productCode) queryParams.productCode = productCode;

  return apiClient.get<PaginatedResponse<Product>>("/products", {
    params: queryParams,
  });
};

export const fetchProduct = async (id: string): Promise<Product> => {
  return apiClient.get<Product>(`/products/${id}`);
};

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  return apiClient.post<Product>("/products", data);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<Product> => {
  return apiClient.put<Product>(`/products/${id}`, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/products/${id}`);
};

export default apiClient;
