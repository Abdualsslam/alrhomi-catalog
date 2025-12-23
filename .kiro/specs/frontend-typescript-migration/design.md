# Design Document: Frontend TypeScript Migration

## Overview

هذا التصميم يوضح الخطة الشاملة لتحويل تطبيق React Frontend من JavaScript/JSX إلى TypeScript/TSX. التحويل سيتم بطريقة منهجية ومنظمة لضمان الحفاظ على الوظائف الحالية مع إضافة type safety كاملة.

المشروع الحالي يستخدم:

- React 19.1.0
- Material-UI (MUI) 7.1.2
- React Router 7.6.2
- Axios للاتصال بالـ API
- i18next للترجمة
- React Context API لإدارة الحالة

## Architecture

### Migration Strategy

سنتبع استراتيجية تحويل تدريجية (Incremental Migration) بالترتيب التالي:

1. **Infrastructure Setup**: إعداد TypeScript configuration والتبعيات
2. **Type Definitions**: إنشاء ملفات تعريف الأنواع المشتركة
3. **Core Utilities**: تحويل الدوال المساعدة والـ utilities
4. **API Layer**: تحويل طبقة API مع تعريف أنواع الـ requests/responses
5. **Contexts**: تحويل React Contexts مع type safety
6. **Components**: تحويل المكونات من الأبسط إلى الأكثر تعقيداً
7. **Pages**: تحويل صفحات التطبيق
8. **Testing**: تحديث الاختبارات لدعم TypeScript

### Directory Structure

```
frontend/src/
├── types/                    # Type definitions
│   ├── api.types.ts         # API request/response types
│   ├── models.types.ts      # Data model types
│   ├── context.types.ts     # Context types
│   ├── component.types.ts   # Component prop types
│   └── declarations.d.ts    # Module declarations
├── api/                     # API layer (converted to .ts)
├── contexts/                # React contexts (converted to .tsx)
├── components/              # React components (converted to .tsx)
├── pages/                   # Page components (converted to .tsx)
├── utils/                   # Utility functions (converted to .ts)
└── ...
```

## Components and Interfaces

### 1. TypeScript Configuration

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "outDir": "./build",
    "rootDir": "./src",
    "removeComments": true,
    "noEmit": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist"]
}
```

#### Package Dependencies

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/react-router-dom": "^5.3.3",
    "@types/node": "^20.0.0",
    "@types/file-saver": "^2.0.5",
    "@types/jest": "^29.5.0",
    "typescript": "^5.3.0"
  }
}
```

### 2. Core Type Definitions

#### types/models.types.ts

```typescript
// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
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

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  tags: string[];
  price?: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageCount: number;
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
```

#### types/api.types.ts

```typescript
import { Image, Product, Category, User, JobStatus } from "./models.types";

// Common API Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
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
  category?: string;
  tags?: string[];
  search?: string;
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
  jobId: string;
  message: string;
}

// Product API Types
export interface ProductQueryParams extends PaginationParams {
  category?: string;
  tags?: string[];
  search?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  images: string[];
  tags?: string[];
  price?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// Category API Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

// Admin Stats Types
export interface AdminStats {
  totalUsers: number;
  totalImages: number;
  totalProducts: number;
  totalCategories: number;
  recentUsers: User[];
  imagesByCategory: Array<{
    category: string;
    count: number;
  }>;
}
```

#### types/context.types.ts

```typescript
import { UserRole } from "./models.types";

// Auth Context Types
export interface AuthContextValue {
  accessToken: string | null;
  role: UserRole | null;
  username: string | null;
  setAccessToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setUsername: (username: string | null) => void;
}

// Theme Context Types
export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}
```

#### types/component.types.ts

```typescript
import { Image, Product, Category } from "./models.types";

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
```

#### types/declarations.d.ts

```typescript
// Module declarations for non-TypeScript imports

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "stylis-rtl" {
  import { Middleware } from "stylis";
  const rtl: Middleware;
  export default rtl;
}
```

### 3. API Layer Type Safety

#### api/client.ts

```typescript
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { ApiError } from "../types/api.types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.m-dowaid.pro";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/"
          ) {
            window.location.assign("/");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  public async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  public async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
```

#### api/images.ts

```typescript
import apiClient from "./client";
import {
  Image,
  ImageQueryParams,
  PaginatedResponse,
  UploadImageRequest,
  UploadImageResponse,
} from "../types";

export const imagesApi = {
  // Get paginated images
  getImages: async (
    params?: ImageQueryParams
  ): Promise<PaginatedResponse<Image>> => {
    return apiClient.get<PaginatedResponse<Image>>("/api/public/images", {
      params,
    });
  },

  // Get single image
  getImage: async (id: string): Promise<Image> => {
    return apiClient.get<Image>(`/api/public/images/${id}`);
  },

  // Upload image (authenticated)
  uploadImage: async (
    data: UploadImageRequest
  ): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.description) formData.append("description", data.description);
    if (data.productName) formData.append("productName", data.productName);
    formData.append("category", data.category);
    if (data.tags) {
      data.tags.forEach((tag) => formData.append("tags[]", tag));
    }

    return apiClient.post<UploadImageResponse>("/api/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Delete image (admin only)
  deleteImage: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/images/${id}`);
  },

  // Update image (admin only)
  updateImage: async (id: string, data: Partial<Image>): Promise<Image> => {
    return apiClient.patch<Image>(`/api/images/${id}`, data);
  },
};
```

### 4. Context Type Safety

#### contexts/AuthContext.tsx

```typescript
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { AuthContextValue } from "../types/context.types";
import { UserRole } from "../types/models.types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  useEffect(() => {
    function onStorage(): void {
      setAccessToken(localStorage.getItem("accessToken"));
      setRole(localStorage.getItem("role") as UserRole | null);
      setUsername(localStorage.getItem("username"));
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value: AuthContextValue = {
    accessToken,
    role,
    username,
    setAccessToken,
    setRole,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
```

#### contexts/ThemeContext.tsx

```typescript
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useContext,
} from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeContextValue, ThemeMode } from "../types/context.types";
import { getTheme } from "../theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("themeMode");
    return (saved as ThemeMode) || "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = (): void => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value: ThemeContextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext };
```

### 5. Component Type Safety

#### components/ImageCard.tsx

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  alpha,
  Stack,
} from "@mui/material";
import { ImageCardProps } from "../types/component.types";
import ImageModal from "./ImageModal";

export default function ImageCard({
  image,
  withDownload = false,
  onViewDetails,
  className,
  style,
}: ImageCardProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const title = image.productName || image.description || "منتج";

  const handleClick = (): void => {
    if (onViewDetails) {
      onViewDetails(image);
    } else {
      navigate(`/product/${image._id}`);
    }
  };

  return (
    <>
      <Card
        className={className}
        style={style}
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <CardActionArea
          onClick={handleClick}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "110%",
              overflow: "hidden",
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            {!imgLoaded && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <Box
              component="img"
              src={image.watermarkedUrl || image.originalUrl}
              alt={title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease",
                opacity: imgLoaded ? 1 : 0,
                p: 1.5,
              }}
            />

            {/* Tags Overlay */}
            {image.tags && image.tags.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  left: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.7,
                  zIndex: 2,
                }}
              >
                {image.tags.slice(0, 3).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.95),
                      color: "text.primary",
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                      height: 26,
                      fontSize: "0.75rem",
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
                      "& .MuiChip-label": {
                        px: 1.2,
                      },
                    }}
                  />
                ))}
                {image.tags.length > 3 && (
                  <Chip
                    label={`+${image.tags.length - 3}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.9),
                      color: "white",
                      backdropFilter: "blur(8px)",
                      border: "none",
                      height: 26,
                      fontSize: "0.75rem",
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                      "& .MuiChip-label": {
                        px: 1.2,
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          <CardContent sx={{ width: "100%", p: 2.5, flexGrow: 0 }}>
            <Stack spacing={1.2}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "1.05rem",
                  minHeight: "2.8em",
                }}
              >
                {title}
              </Typography>

              <Chip
                label={image.category}
                size="medium"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  border: "none",
                  height: 28,
                  fontSize: "0.85rem",
                  width: "fit-content",
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <ImageModal open={open} onClose={() => setOpen(false)} image={image} />
    </>
  );
}
```

### 6. Router Type Safety

#### types/router.types.ts

```typescript
export interface RouteParams {
  id?: string;
  category?: string;
}

export interface LocationState {
  from?: string;
  message?: string;
}
```

#### Usage in Components

```typescript
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RouteParams, LocationState } from "../types/router.types";

function ProductDetail(): JSX.Element {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  // Now id is typed as string | undefined
  // state is typed as LocationState | undefined
}
```

### 7. Form Handling Type Safety

#### Example: Login Form

```typescript
import { useState, FormEvent, ChangeEvent } from "react";
import { LoginRequest } from "../types/api.types";

interface LoginFormData extends LoginRequest {
  rememberMe: boolean;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
}

function LoginPage(): JSX.Element {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Handle login
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### 8. Material-UI Theme Extension

#### theme.ts

```typescript
import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { ThemeMode } from "./types/context.types";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      borderRadius: {
        small: number;
        medium: number;
        large: number;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      borderRadius?: {
        small?: number;
        medium?: number;
        large?: number;
      };
    };
  }
}

export function getTheme(mode: ThemeMode): Theme {
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      // ... other palette options
    },
    custom: {
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
    },
  };

  return createTheme(themeOptions);
}
```

### 9. i18n Type Safety

#### types/i18n.types.ts

```typescript
export type TranslationNamespace = "common" | "auth" | "products" | "admin";

export interface TranslationKeys {
  common: {
    welcome: string;
    loading: string;
    error: string;
    // ... other keys
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    // ... other keys
  };
  // ... other namespaces
}
```

## Data Models

تم تعريف جميع نماذج البيانات في `types/models.types.ts`:

- **User**: معلومات المستخدم
- **Image**: بيانات الصور
- **Product**: بيانات المنتجات
- **Category**: بيانات التصنيفات
- **JobStatus**: حالة المهام غير المتزامنة

جميع النماذج تتضمن:

- أنواع صريحة لجميع الحقول
- تواريخ بصيغة string (ISO format)
- معرفات MongoDB بصيغة string
- حقول اختيارية محددة بوضوح باستخدام `?`

## Correctness Properties

سأقوم الآن بتحليل معايير القبول لتحديد الخصائص القابلة للاختبار:

الخاصية (Property) هي سمة أو سلوك يجب أن يكون صحيحاً عبر جميع عمليات التنفيذ الصالحة للنظام - في الأساس، هي عبارة رسمية حول ما يجب أن يفعله النظام. الخصائص تعمل كجسر بين المواصفات المقروءة للإنسان وضمانات الصحة القابلة للتحقق آلياً.

### Property 1: JSX Files Use TSX Extension

_For any_ file in the src directory that contains JSX syntax, the file extension SHALL be .tsx
**Validates: Requirements 2.1**

### Property 2: Non-JSX Files Use TS Extension

_For any_ file in the src directory that contains only TypeScript/JavaScript without JSX, the file extension SHALL be .ts
**Validates: Requirements 2.2**

### Property 3: Import Resolution Correctness

_For any_ import statement in the codebase, if it references a local file, the TypeScript compiler SHALL successfully resolve the import without errors
**Validates: Requirements 2.3**

### Property 4: Component Props Have Interfaces

_For any_ React component that accepts props, there SHALL exist a corresponding TypeScript interface defining those props
**Validates: Requirements 3.1**

### Property 5: State Variables Are Explicitly Typed

_For any_ useState hook call in a component, the state type SHALL be explicitly defined either through type parameter or type inference from initial value
**Validates: Requirements 3.2**

### Property 6: Refs Are Explicitly Typed

_For any_ useRef hook call in a component, the ref type SHALL be explicitly defined through type parameter
**Validates: Requirements 3.3**

### Property 7: Props Interfaces Are Exported

_For any_ component with props interface, the interface SHALL be exported for reuse in other components
**Validates: Requirements 3.4**

### Property 8: Event Handlers Use React Event Types

_For any_ event handler function in a component, the event parameter SHALL use proper React event types (MouseEvent, ChangeEvent, FormEvent, etc.)
**Validates: Requirements 3.5**

### Property 9: API Request Payloads Are Typed

_For any_ API function that sends request data, there SHALL exist a TypeScript interface defining the request payload structure
**Validates: Requirements 4.1**

### Property 10: API Response Data Is Typed

_For any_ API function that receives response data, there SHALL exist a TypeScript interface defining the response data structure
**Validates: Requirements 4.2**

### Property 11: Nested API Objects Are Fully Typed

_For any_ API response interface with nested objects, all levels of nesting SHALL have explicit types without using 'any'
**Validates: Requirements 4.5**

### Property 12: Contexts Have Value Type Interfaces

_For any_ React Context created with createContext, there SHALL exist a TypeScript interface defining the context value type
**Validates: Requirements 5.1**

### Property 13: useContext Returns Proper Types

_For any_ useContext hook call, the returned value SHALL have the proper type matching the context interface
**Validates: Requirements 5.3**

### Property 14: Context Interfaces Are Complete

_For any_ context interface, all methods and properties SHALL have explicit types without using 'any'
**Validates: Requirements 5.4**

### Property 15: Context Hooks Handle Undefined

_For any_ custom hook that uses useContext, the hook SHALL check for undefined context value and throw an error with proper TypeScript patterns
**Validates: Requirements 5.5**

### Property 16: Utility Functions Have Parameter Types

_For any_ utility function, all parameters SHALL have explicit type annotations
**Validates: Requirements 6.1**

### Property 17: Utility Functions Have Return Types

_For any_ utility function, the return type SHALL be explicitly defined
**Validates: Requirements 6.2**

### Property 18: Optional Parameters Use Proper Syntax

_For any_ utility function with optional parameters, those parameters SHALL use TypeScript optional syntax (?)
**Validates: Requirements 6.4**

### Property 19: Minimize Any Type Usage

_For any_ file in the codebase, the usage of 'any' type SHALL be minimized and only used when absolutely necessary with justification
**Validates: Requirements 6.5**

### Property 20: Route Parameters Are Typed

_For any_ component that uses useParams hook, there SHALL exist an interface defining the route parameters
**Validates: Requirements 7.1**

### Property 21: useParams Has Type Parameter

_For any_ useParams hook call, the hook SHALL include a type parameter specifying the parameter interface
**Validates: Requirements 7.2**

### Property 22: Location State Is Typed

_For any_ component that accesses location.state, the state SHALL be cast to a proper TypeScript type
**Validates: Requirements 7.4**

### Property 23: Form Data Has Interface

_For any_ form component, there SHALL exist a TypeScript interface defining the form data structure
**Validates: Requirements 8.1**

### Property 24: Form Submit Handlers Are Typed

_For any_ form submit handler, the event parameter SHALL use FormEvent type
**Validates: Requirements 8.3**

### Property 25: Form Validation Functions Are Typed

_For any_ form validation function, the function SHALL have explicit parameter and return types
**Validates: Requirements 8.4**

### Property 26: Form Error States Are Typed

_For any_ form component with error state, there SHALL exist a TypeScript interface defining the error structure
**Validates: Requirements 8.5**

### Property 27: Test Files Use Proper Extensions

_For any_ test file in the codebase, the file SHALL use .test.ts or .test.tsx extension
**Validates: Requirements 11.2**

### Property 28: Mocks Are Type-Safe

_For any_ mock used in tests, the mock SHALL have proper TypeScript types matching the mocked entity
**Validates: Requirements 11.4**

### Property 29: Error Boundaries Use Proper Types

_For any_ error boundary component, the error parameter SHALL use proper TypeScript error types
**Validates: Requirements 12.2**

### Property 30: Catch Blocks Type Errors

_For any_ try-catch block, the caught error SHALL be properly typed (not implicitly 'any')
**Validates: Requirements 12.3**

### Property 31: Error Display Uses Typed Objects

_For any_ component that displays errors, the error object SHALL have a defined TypeScript type
**Validates: Requirements 12.5**

### Property 32: Translation Keys Are Validated

_For any_ translation key usage, the key SHALL be validated at compile time through TypeScript types
**Validates: Requirements 13.1**

### Property 33: useTranslation Is Properly Typed

_For any_ useTranslation hook call, the hook SHALL include type parameters for proper typing of the translation function
**Validates: Requirements 13.3**

### Property 34: Translation Parameters Are Typed

_For any_ translation function that accepts parameters, the parameters SHALL have defined TypeScript types
**Validates: Requirements 13.4**

### Property 35: useState Calls Are Explicitly Typed

_For any_ useState hook call, the state type SHALL be explicitly defined through type parameter or clear type inference
**Validates: Requirements 14.1**

### Property 36: useReducer Has Typed Actions and State

_For any_ useReducer hook call, both the state and action types SHALL be explicitly defined
**Validates: Requirements 14.2**

### Property 37: Custom Hooks Have Return Types

_For any_ custom hook function, the return type SHALL be explicitly defined
**Validates: Requirements 14.3**

## Error Handling

### TypeScript Compilation Errors

**Strategy**: استخدام strict mode في TypeScript لاكتشاف الأخطاء مبكراً

**Error Categories**:

1. **Type Mismatch Errors**: عدم تطابق الأنواع
2. **Missing Type Annotations**: نقص تعريفات الأنواع
3. **Implicit Any**: استخدام any بشكل ضمني
4. **Null/Undefined Errors**: أخطاء null و undefined

**Handling Approach**:

- تفعيل `strict: true` في tsconfig.json
- استخدام `noImplicitAny: true`
- استخدام `strictNullChecks: true`
- معالجة كل خطأ بشكل فردي أثناء التحويل

### Runtime Errors

**Strategy**: الحفاظ على معالجة الأخطاء الحالية مع إضافة type safety

**Error Types**:

1. **API Errors**: أخطاء من الـ backend
2. **Network Errors**: أخطاء الاتصال
3. **Validation Errors**: أخطاء التحقق من البيانات
4. **Authentication Errors**: أخطاء المصادقة

**Type-Safe Error Handling**:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error
  );
}

try {
  await apiCall();
} catch (error: unknown) {
  if (isApiError(error)) {
    // Handle API error with type safety
    console.error(error.message);
  } else if (error instanceof Error) {
    // Handle standard Error
    console.error(error.message);
  } else {
    // Handle unknown error
    console.error("An unknown error occurred");
  }
}
```

### Migration Errors

**Common Issues During Migration**:

1. **Import Path Errors**:

   - Problem: تغيير امتدادات الملفات يكسر الـ imports
   - Solution: TypeScript يحل هذا تلقائياً مع moduleResolution: "node"

2. **Third-Party Library Types**:

   - Problem: بعض المكتبات لا تحتوي على type definitions
   - Solution: تثبيت @types packages أو إنشاء custom declarations

3. **Complex Type Inference**:

   - Problem: TypeScript لا يستطيع استنتاج الأنواع المعقدة
   - Solution: إضافة type annotations صريحة

4. **Generic Type Constraints**:
   - Problem: استخدام generics بشكل خاطئ
   - Solution: إضافة constraints مناسبة

## Testing Strategy

### Dual Testing Approach

سنستخدم نهجاً مزدوجاً للاختبار:

1. **Unit Tests**: للتحقق من أمثلة محددة وحالات حدية
2. **Type Tests**: للتحقق من صحة الأنواع في وقت الترجمة

### Unit Testing

**Framework**: Jest with TypeScript support

**Configuration**:

```json
{
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
  "moduleNameMapper": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  }
}
```

**Test Categories**:

1. **Component Tests**: اختبار المكونات مع React Testing Library
2. **Hook Tests**: اختبار custom hooks
3. **Utility Tests**: اختبار الدوال المساعدة
4. **API Tests**: اختبار طبقة API مع mocked responses

**Example Component Test**:

```typescript
import { render, screen } from "@testing-library/react";
import { ImageCard } from "./ImageCard";
import { Image } from "../types/models.types";

describe("ImageCard", () => {
  const mockImage: Image = {
    _id: "123",
    originalUrl: "https://example.com/image.jpg",
    category: "Test Category",
    tags: ["tag1", "tag2"],
    uploadedBy: "user123",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("renders image with correct title", () => {
    render(<ImageCard image={mockImage} />);
    // Test assertions
  });
});
```

### Type Testing

**Approach**: استخدام TypeScript compiler للتحقق من الأنواع

**Type Test Examples**:

```typescript
// types/__tests__/api.types.test.ts
import { expectType, expectError } from "tsd";
import { LoginRequest, AuthResponse } from "../api.types";

// Test that LoginRequest requires username and password
expectType<LoginRequest>({
  username: "test",
  password: "test123",
});

// Test that missing fields cause errors
expectError<LoginRequest>({
  username: "test",
  // password is missing
});

// Test that AuthResponse has correct structure
expectType<AuthResponse>({
  accessToken: "token",
  user: {
    id: "123",
    username: "test",
    email: "test@example.com",
    role: "user",
  },
});
```

### Compilation Tests

**Strategy**: التحقق من أن المشروع يترجم بدون أخطاء

**Test Script**:

```bash
# Run TypeScript compiler in check mode
npm run type-check

# Run with strict mode
tsc --noEmit --strict
```

### Integration Tests

**Focus**: التحقق من أن جميع الأجزاء تعمل معاً بعد التحويل

**Test Areas**:

1. **Authentication Flow**: تسجيل الدخول والخروج
2. **Image Upload**: رفع الصور مع type safety
3. **Product Management**: إدارة المنتجات
4. **Admin Dashboard**: لوحة التحكم

### Test Coverage Goals

**Minimum Coverage**:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**Priority Areas** (90%+ coverage):

- API layer
- Context providers
- Utility functions
- Custom hooks

### Property-Based Testing

**Library**: fast-check (for TypeScript)

**Usage**: اختبار الخصائص العامة عبر مدخلات عشوائية

**Example**:

```typescript
import fc from "fast-check";

describe("API Type Safety", () => {
  it("should handle any valid image data", () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string(),
          originalUrl: fc.webUrl(),
          category: fc.string(),
          tags: fc.array(fc.string()),
          uploadedBy: fc.string(),
          createdAt: fc.date().map((d) => d.toISOString()),
          updatedAt: fc.date().map((d) => d.toISOString()),
        }),
        (image) => {
          // Test that image conforms to Image type
          const validated: Image = image;
          expect(validated._id).toBeDefined();
          expect(validated.originalUrl).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Regression Testing

**Strategy**: التأكد من أن التحويل لم يكسر الوظائف الموجودة

**Approach**:

1. تشغيل جميع الاختبارات الموجودة قبل التحويل
2. تسجيل النتائج كـ baseline
3. تحويل الملفات تدريجياً
4. تشغيل الاختبارات بعد كل تحويل
5. التأكد من عدم انخفاض التغطية

### Test Execution

**Commands**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Continuous Integration

**CI Pipeline**:

1. Install dependencies
2. Run type checking (`tsc --noEmit`)
3. Run linting
4. Run unit tests
5. Run integration tests
6. Generate coverage report
7. Build application
8. Deploy (if all tests pass)

**Quality Gates**:

- Zero TypeScript errors
- Zero linting errors
- Minimum 80% test coverage
- All tests passing
- Successful build

## Implementation Notes

### Migration Order

1. **Phase 1: Setup** (يوم واحد)

   - تثبيت TypeScript والتبعيات
   - إنشاء tsconfig.json
   - إنشاء بنية types/

2. **Phase 2: Type Definitions** (يومان)

   - إنشاء جميع ملفات التعريف في types/
   - تعريف models, API types, context types, component types

3. **Phase 3: Core Layer** (يومان)

   - تحويل api/client.js
   - تحويل جميع ملفات API
   - تحويل utility functions

4. **Phase 4: Contexts** (يوم واحد)

   - تحويل AuthContext
   - تحويل ThemeContext

5. **Phase 5: Components** (3-4 أيام)

   - تحويل المكونات الأساسية (ImageCard, SearchBar, etc.)
   - تحويل المكونات المعقدة (ImageModal, Filters, etc.)
   - تحويل مكونات Admin

6. **Phase 6: Pages** (يومان)

   - تحويل صفحات التطبيق
   - تحويل صفحات Admin

7. **Phase 7: Testing** (يومان)

   - تحديث الاختبارات
   - إضافة type tests
   - التحقق من التغطية

8. **Phase 8: Cleanup** (يوم واحد)
   - مراجعة الكود
   - إزالة any types غير الضرورية
   - تحسين الأنواع
   - توثيق

**Total Estimated Time**: 12-14 يوم عمل

### Best Practices

1. **Start Strict**: استخدام strict mode من البداية
2. **Incremental Migration**: تحويل ملف واحد في كل مرة
3. **Test After Each Change**: اختبار بعد كل تحويل
4. **Document Complex Types**: توثيق الأنواع المعقدة
5. **Use Type Inference**: الاعتماد على type inference عندما يكون واضحاً
6. **Avoid Any**: تجنب any قدر الإمكان
7. **Export Types**: تصدير الأنواع لإعادة الاستخدام
8. **Use Generics**: استخدام generics للمرونة
9. **Consistent Naming**: استخدام تسمية متسقة للأنواع
10. **Type Guards**: استخدام type guards للتحقق من الأنواع في runtime

### Tools and Resources

**Development Tools**:

- VS Code with TypeScript extension
- ESLint with TypeScript plugin
- Prettier for code formatting
- ts-node for running TypeScript directly

**Useful Packages**:

- `@types/*`: Type definitions for third-party libraries
- `ts-jest`: Jest transformer for TypeScript
- `tsd`: Test TypeScript type definitions
- `fast-check`: Property-based testing

**Documentation**:

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Material-UI TypeScript Guide: https://mui.com/guides/typescript/
