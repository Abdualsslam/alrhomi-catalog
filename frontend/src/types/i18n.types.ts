// Translation namespace type
export type TranslationNamespace = "translation";

// Translation keys interface structure
export interface TranslationKeys {
  // Navigation & Common
  home: string;
  catalog: string;
  admin: string;
  login: string;
  logout: string;
  dashboard: string;
  settings: string;

  // Authentication
  username: string;
  password: string;
  loginButton: string;
  loginError: string;
  welcome: string;

  // Dashboard
  adminDashboard: string;
  dashboardSubtitle: string;
  totalImages: string;
  watermarkedImages: string;
  pendingJobs: string;
  activeUsers: string;

  // Categories
  categories: string;
  addCategory: string;
  categoryName: string;
  editCategory: string;
  deleteCategory: string;

  // Products
  products: string;
  addProduct: string;
  productName: string;
  editProduct: string;
  deleteProduct: string;

  // Images
  images: string;
  uploadImage: string;
  imageManagement: string;

  // Users
  users: string;
  addUser: string;
  userManagement: string;

  // Actions
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirm: string;
  yes: string;
  no: string;
  close: string;

  // Messages
  success: string;
  error: string;
  loading: string;
  noData: string;
  confirmDelete: string;

  // Search & Filters
  search: string;
  filter: string;
  clear: string;

  // Table
  rowsPerPage: string;
  of: string;

  // Category Management
  categoriesManagement: string;
  categoriesManagementDesc: string;
  newCategory: string;
  totalCategories: string;
  noCategories: string;
  startCreateCategory: string;
  createNewCategory: string;
  image: string;
  actions: string;
  categoriesPerPage: string;
  editCategoryDialog: string;
  createCategoryDialog: string;
  parentCategory: string;
  noParent: string;
  categoryNameRequired: string;
  descriptionOptional: string;
  categoryImage: string;
  uploadImageDesc: string;
  uploading: string;
  uploadImageBtn: string;
  removeCurrentImage: string;
  saving: string;
  saveChanges: string;
  create: string;
  confirmDeleteCategory: string;
  deleteWarning: string;
  deleting: string;
  loadCategoriesFailed: string;
  saveCategoryFailed: string;
  imageSizeError: string;
  imageUrlError: string;
  uploadImageFailed: string;
  deleteCategoryFailed: string;
  subcategory: string;
  mainCategory: string;
  noDescription: string;

  // Image Management
  imageManagementDesc: string;
  addNewImage: string;
  newImage: string;
  searchImagePlaceholder: string;
  noImagesYet: string;
  noMatchingResults: string;
  startAddingImages: string;
  tryChangingSearch: string;
  addImage: string;
  removeWatermark: string;
  enableWatermark: string;
  watermarked: string;
  noWatermark: string;
  uncategorized: string;
  imageWithoutProduct: string;
  model: string;
  note: string;
  uploadedAt: string;
  deleteImage: string;
  addNewImageDialog: string;
  fileSelectedSuccess: string;
  changeFile: string;
  dragDropImage: string;
  clickToSelect: string;
  chooseFile: string;
  linkImageToProduct: string;

  // Status Labels
  statusQueued: string;
  statusProcessing: string;
  statusCompleted: string;
  statusFailed: string;

  // Chart Labels
  processed: string;
  pending: string;

  // User Management
  userManagementDesc: string;
  searchUserPlaceholder: string;
  newUser: string;
  noUsersFound: string;
  noUsersYet: string;
  noMatchingUsers: string;
  addNewUser: string;
  repRole: string;
  adminRole: string;
  active: string;
  inactive: string;
  creationDate: string;
  lastActivity: string;
  neverLoggedIn: string;
  editUser: string;
  deleteUser: string;
  usersPerPage: string;
  createNewUser: string;
  email: string;
  role: string;
  userCreatedSuccess: string;
  temporaryPassword: string;

  // Product Management
  productManagement: string;
  productManagementDesc: string;
  newProduct: string;
  searchProductPlaceholder: string;
  category: string;
  allCategories: string;
  product: string;
  code: string;
  imagesCount: string;
  noProducts: string;
  startAddingProduct: string;
  productsPerPage: string;
  editProductDialog: string;
  addProductDialog: string;
  productCode: string;
  chooseCategory: string;
  loadProductsFailed: string;
  saveProductFailed: string;
  deleteProductFailed: string;

  // Catalog
  catalogTitle: string;
  catalogDesc: string;
  noResultsFound: string;
  modifySearchFilters: string;
  showing: string;

  // Filters
  model2023: string;
  model2024: string;
  classic: string;
  pro: string;
  lite: string;
  all: string;
  clearAll: string;

  // Navigation
  productsManagement: string;
  imagesManagement: string;
  usersManagement: string;
}
