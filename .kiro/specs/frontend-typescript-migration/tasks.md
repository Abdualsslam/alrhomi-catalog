# Implementation Plan: Frontend TypeScript Migration

## Overview

هذه الخطة تحول تطبيق React Frontend بالكامل من JavaScript/JSX إلى TypeScript/TSX. التحويل سيتم بطريقة تدريجية ومنظمة، بدءاً من البنية التحتية، ثم الأنواع المشتركة، ثم الطبقات الأساسية، وصولاً إلى المكونات والصفحات.

## Tasks

- [x] 1. Setup TypeScript Infrastructure

  - Install TypeScript and all required type definition packages (@types/react, @types/react-dom, @types/node, @types/react-router-dom, @types/file-saver, @types/jest)
  - Create tsconfig.json with strict mode enabled
  - Update package.json scripts to support TypeScript
  - Configure Jest to work with TypeScript (jest.config.js or package.json)
  - Verify that the project compiles with `tsc --noEmit`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 11.1_

- [x] 2. Create Core Type Definitions

  - [x] 2.1 Create types/models.types.ts

    - Define User, UserRole, Image, Product, Category, JobStatus, JobStatusType interfaces
    - Export all model types
    - _Requirements: 4.2, 4.5_

  - [x] 2.2 Create types/api.types.ts

    - Define PaginationParams, PaginatedResponse, ApiError interfaces
    - Define all API request interfaces (LoginRequest, RegisterRequest, UploadImageRequest, etc.)
    - Define all API response interfaces (AuthResponse, UploadImageResponse, etc.)
    - Define query parameter interfaces (ImageQueryParams, ProductQueryParams)
    - Define AdminStats interface
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [x] 2.3 Create types/context.types.ts

    - Define AuthContextValue interface
    - Define ThemeMode type and ThemeContextValue interface
    - _Requirements: 5.1, 5.4_

  - [x] 2.4 Create types/component.types.ts

    - Define BaseComponentProps interface
    - Define props interfaces for all major components (ImageCardProps, ImageModalProps, SearchBarProps, FiltersProps, ImageGridProps)
    - _Requirements: 3.1, 3.4_

  - [x] 2.5 Create types/router.types.ts

    - Define RouteParams interface for URL parameters
    - Define LocationState interface for navigation state
    - _Requirements: 7.1, 7.5_

  - [x] 2.6 Create types/i18n.types.ts

    - Define TranslationNamespace type
    - Define TranslationKeys interface structure
    - _Requirements: 13.2_

  - [x] 2.7 Create types/declarations.d.ts

    - Add module declarations for image imports (.png, .jpg, .jpeg, .webp, .svg, .gif)
    - Add module declaration for CSS imports
    - Add module declaration for stylis-rtl
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 2.8 Create types/index.ts
    - Export all types from a central location for easy imports
    - _Requirements: 14.4_

- [x] 3. Migrate API Layer

  - [x] 3.1 Convert api/client.js to api/client.ts

    - Create ApiClient class with typed methods (get, post, put, patch, delete)
    - Add proper types for AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError
    - Type the interceptors properly
    - Export typed apiClient instance
    - _Requirements: 4.1, 4.2, 4.3, 6.1, 6.2_

  - [x] 3.2 Convert api/images.js to api/images.ts

    - Import types from types/api.types and types/models.types
    - Type all API functions with proper request/response types
    - Use generic types for paginated responses
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 3.3 Convert api/products.js to api/products.ts

    - Import types from types/api.types and types/models.types
    - Type all API functions with proper request/response types
    - _Requirements: 4.1, 4.2_

  - [x] 3.4 Convert api/admin.js to api/admin.ts
    - Import types from types/api.types and types/models.types
    - Type all admin API functions
    - Type AdminStats response properly
    - _Requirements: 4.1, 4.2, 4.5_

- [x] 4. Migrate Utility Functions

  - [x] 4.1 Convert utils/seoHelpers.js to utils/seoHelpers.ts

    - Add explicit parameter types for all functions
    - Add explicit return types for all functions
    - Mark optional parameters with ? syntax
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 4.2 Convert utils/structuredData.js to utils/structuredData.ts
    - Add explicit parameter types for all functions
    - Add explicit return types for all functions
    - Define interfaces for structured data objects
    - _Requirements: 6.1, 6.2_

- [x] 5. Migrate Context Providers

  - [x] 5.1 Convert contexts/AuthContext.jsx to contexts/AuthContext.tsx

    - Import AuthContextValue and UserRole types
    - Create AuthProviderProps interface
    - Type the context with AuthContextValue | undefined
    - Type all state variables explicitly
    - Create useAuth custom hook with proper return type and undefined check
    - Export AuthContext and useAuth
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 14.1_

  - [x] 5.2 Convert contexts/ThemeContext.jsx to contexts/ThemeContext.tsx
    - Import ThemeContextValue and ThemeMode types
    - Create ThemeProviderProps interface
    - Type the context with ThemeContextValue | undefined
    - Type mode state with ThemeMode
    - Create useThemeMode custom hook with proper return type and undefined check
    - Type the theme object from getTheme function
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 14.1_

- [x] 6. Migrate Theme Configuration

  - [x] 6.1 Convert theme.js to theme.ts
    - Import Theme, ThemeOptions from @mui/material/styles
    - Import ThemeMode from types
    - Create module augmentation for custom theme properties
    - Type getTheme function with proper parameter and return types
    - _Requirements: 9.2, 9.5, 6.1, 6.2_

- [-] 7. Migrate Core Components

  - [x] 7.1 Convert components/ImageCard.jsx to components/ImageCard.tsx

    - Import ImageCardProps from types
    - Type component props with ImageCardProps
    - Type all state variables (open: boolean, imgLoaded: boolean)
    - Type event handlers with proper React event types
    - Type handleClick function with void return
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ] 7.2 Convert components/ImageModal.jsx to components/ImageModal.tsx

    - Import ImageModalProps from types
    - Type component props
    - Type all state variables
    - Type event handlers
    - _Requirements: 3.1, 3.2, 3.5_

  - [ ] 7.3 Convert components/ImageGrid.jsx to components/ImageGrid.tsx

    - Import ImageGridProps from types
    - Type component props
    - Type map callback parameters
    - _Requirements: 3.1, 3.4_

  - [ ] 7.4 Convert components/SearchBar.jsx to components/SearchBar.tsx

    - Import SearchBarProps from types
    - Type component props
    - Type event handlers (ChangeEvent, KeyboardEvent)
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ] 7.5 Convert components/Filters.jsx to components/Filters.tsx

    - Import FiltersProps from types
    - Type component props
    - Type all state variables
    - Type event handlers
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ] 7.6 Convert components/SEO.jsx to components/SEO.tsx

    - Define SEOProps interface
    - Type component props
    - Type useLocation hook usage
    - _Requirements: 3.1, 3.4, 7.4_

  - [ ] 7.7 Convert components/CategoryShowcase.jsx to components/CategoryShowcase.tsx

    - Define CategoryShowcaseProps interface
    - Type component props
    - Type all state variables
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 7.8 Convert components/WhatsAppCTA.jsx to components/WhatsAppCTA.tsx

    - Define WhatsAppCTAProps interface (if props exist)
    - Type component
    - _Requirements: 3.1, 3.4_

  - [ ] 7.9 Convert components/Testimonials.jsx to components/Testimonials.tsx

    - Define TestimonialsProps interface (if props exist)
    - Type component
    - Type testimonial data structure
    - _Requirements: 3.1, 3.4_

  - [ ] 7.10 Convert components/AboutContactSection.jsx to components/AboutContactSection.tsx
    - Define AboutContactSectionProps interface (if props exist)
    - Type component
    - _Requirements: 3.1, 3.4_

- [ ] 8. Migrate Layout Components

  - [ ] 8.1 Convert components/layout/MainLayout.jsx to components/layout/MainLayout.tsx

    - Define MainLayoutProps interface
    - Type component props
    - Type useLocation and useNavigate hooks
    - _Requirements: 3.1, 3.4, 7.2, 7.4_

  - [ ] 8.2 Convert components/AdminLayout.jsx to components/AdminLayout.tsx

    - Define AdminLayoutProps interface
    - Type component props
    - Type all state variables
    - Type useAuth hook usage
    - Type event handlers
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 5.3_

  - [ ] 8.3 Convert components/AdminApp.jsx to components/AdminApp.tsx
    - Type component
    - Type Routes and Route components usage
    - _Requirements: 3.1_

- [ ] 9. Migrate Page Components

  - [ ] 9.1 Convert pages/HomePage.jsx to pages/HomePage.tsx

    - Type component
    - Type all state variables
    - Type useEffect dependencies
    - Type API call responses
    - _Requirements: 3.1, 3.2, 4.2_

  - [ ] 9.2 Convert pages/CatalogPage.jsx to pages/CatalogPage.tsx

    - Type component
    - Type all state variables (images, loading, filters, etc.)
    - Type useRef with proper ref type
    - Type API call responses
    - Type event handlers
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 4.2_

  - [ ] 9.3 Convert pages/CategoriesPage.jsx to pages/CategoriesPage.tsx

    - Type component
    - Type all state variables
    - Type API call responses
    - _Requirements: 3.1, 3.2, 4.2_

  - [ ] 9.4 Convert pages/ProductDetail.jsx to pages/ProductDetail.tsx

    - Type component
    - Type useParams with RouteParams interface
    - Type all state variables
    - Type API call responses
    - Type useNavigate hook
    - _Requirements: 3.1, 3.2, 4.2, 7.1, 7.2_

  - [ ] 9.5 Convert pages/LoginPage.jsx to pages/LoginPage.tsx
    - Type component
    - Define LoginFormData interface
    - Define LoginFormErrors interface
    - Type all state variables
    - Type form event handlers (FormEvent, ChangeEvent)
    - Type useAuth hook usage
    - Type useNavigate and useLocation hooks
    - _Requirements: 3.1, 3.2, 3.5, 5.3, 7.2, 7.4, 8.1, 8.3, 8.5_

- [ ] 10. Migrate Admin Pages

  - [ ] 10.1 Convert pages/admin/AdminDashboard.jsx to pages/admin/AdminDashboard.tsx

    - Type component
    - Type all state variables (stats, loading, error)
    - Type API call responses with AdminStats type
    - Type chart data structures
    - _Requirements: 3.1, 3.2, 4.2_

  - [ ] 10.2 Convert pages/admin/ImageManagement.jsx to pages/admin/ImageManagement.tsx
    - Type component
    - Type all state variables (images, filters, pagination, etc.)
    - Type API call responses
    - Type event handlers
    - Type file upload handling
    - _Requirements: 3.1, 3.2, 3.5, 4.2_

- [ ] 11. Migrate Root Files

  - [ ] 11.1 Convert App.jsx to App.tsx

    - Type component
    - Type useAuth hook usage
    - Type getDefaultRoute function
    - _Requirements: 3.1, 5.3, 6.1, 6.2_

  - [ ] 11.2 Convert index.js to index.tsx

    - Update imports to use .tsx extensions where needed
    - Type document.documentElement operations
    - Type createCache configuration
    - _Requirements: 2.3_

  - [ ] 11.3 Convert i18n.js to i18n.ts

    - Type i18n configuration
    - Import translation types if needed
    - _Requirements: 13.2_

  - [ ] 11.4 Convert reportWebVitals.js to reportWebVitals.ts

    - Type the onPerfEntry parameter
    - Type the metric parameter in callback
    - _Requirements: 6.1, 6.2_

  - [ ] 11.5 Convert setupTests.js to setupTests.ts
    - Ensure @testing-library/jest-dom types are imported
    - _Requirements: 11.1_

- [ ] 12. Update Test Files

  - [ ] 12.1 Convert App.test.js to App.test.tsx

    - Import proper types from @testing-library/react
    - Type test data and mocks
    - Ensure tests pass with TypeScript
    - _Requirements: 11.2, 11.3_

  - [ ] 12.2 Create type tests for core types

    - Create types/**tests**/models.types.test.ts
    - Create types/**tests**/api.types.test.ts
    - Use expectType and expectError from tsd library
    - Test that type definitions are correct
    - _Requirements: 4.1, 4.2_

  - [ ] 12.3 Create component type tests
    - Test that component props are properly typed
    - Test that invalid props cause TypeScript errors
    - _Requirements: 3.1, 3.4_

- [ ] 13. Checkpoint - Verify Compilation

  - Run `tsc --noEmit` to check for TypeScript errors
  - Fix any remaining type errors
  - Ensure strict mode compliance
  - Ask user if any questions arise
  - _Requirements: 1.3, 10.1, 10.5_

- [ ] 14. Update Build Configuration

  - [ ] 14.1 Verify tsconfig.json settings

    - Ensure strict: true
    - Ensure noImplicitAny: true
    - Ensure strictNullChecks: true
    - Ensure all paths are correctly configured
    - _Requirements: 1.1, 1.3_

  - [ ] 14.2 Update package.json scripts

    - Add "type-check": "tsc --noEmit" script
    - Ensure "start", "build", "test" work with TypeScript
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 14.3 Configure ESLint for TypeScript
    - Install @typescript-eslint/parser and @typescript-eslint/eslint-plugin
    - Update .eslintrc to use TypeScript parser
    - Add TypeScript-specific rules
    - _Requirements: 6.5, 19_

- [ ] 15. Clean Up and Optimize

  - [ ] 15.1 Remove any unnecessary 'any' types

    - Search for 'any' usage in codebase
    - Replace with proper types where possible
    - Document remaining 'any' usage with comments
    - _Requirements: 6.5_

  - [ ] 15.2 Verify all imports are correct

    - Ensure no .js or .jsx extensions in imports
    - Ensure all type imports use 'import type' where appropriate
    - _Requirements: 2.3_

  - [ ] 15.3 Add JSDoc comments to complex types
    - Document complex interfaces and types
    - Add examples where helpful
    - _Requirements: 6.1, 6.2_

- [ ] 16. Final Testing and Verification

  - [ ] 16.1 Run full test suite

    - Execute `npm test` and ensure all tests pass
    - Verify test coverage meets minimum 80%
    - _Requirements: 10.3, 11.5_

  - [ ] 16.2 Run type checking

    - Execute `npm run type-check`
    - Ensure zero TypeScript errors
    - _Requirements: 1.3, 10.1_

  - [ ] 16.3 Build production bundle

    - Execute `npm run build`
    - Ensure build succeeds without errors
    - Verify bundle size is reasonable
    - _Requirements: 10.2, 10.5_

  - [ ] 16.4 Manual testing
    - Start development server
    - Test authentication flow
    - Test image browsing and filtering
    - Test admin functionality
    - Test responsive design
    - _Requirements: 2.4, 10.1_

- [ ] 17. Final Checkpoint
  - Verify zero .js or .jsx files remain in src directory
  - Confirm all TypeScript errors are resolved
  - Ensure all tests pass
  - Ask user for final review
  - _Requirements: 2.5, 10.1, 10.2, 10.3_

## Notes

- Each task references specific requirements for traceability
- The migration follows a bottom-up approach: infrastructure → types → utilities → contexts → components → pages
- Checkpoints ensure incremental validation
- Type tests validate correctness of type definitions
- Unit tests ensure functionality is preserved during migration
- The entire migration is estimated to take 12-14 working days
