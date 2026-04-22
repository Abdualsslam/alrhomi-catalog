// import { useCallback, useEffect, useMemo, useState, ChangeEvent, KeyboardEvent } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Paper,
//   Skeleton,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Tooltip,
//   Typography,
//   Alert,
//   useTheme,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Close as CloseIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Inventory2 as InventoryIcon,
//   Search as SearchIcon,
//   Warning as WarningIcon,
//   PhotoLibrary as PhotoLibraryIcon,
//   CheckCircle as CheckCircleIcon,
//   Image as ImageIcon,
//   Link as LinkIcon,
//   Folder as FolderIcon,
//   Home as HomeIcon,
//   NavigateNext as NavigateNextIcon,
// } from "@mui/icons-material";
// import {
//   fetchProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   fetchCategories,
//   fetchImages,
//   getFolderContents,
// } from "../../api/admin";
// import { RealFolder } from "../../types/api.types";
// import { Category } from "../../types/models.types";
// // Local interfaces for this component
// interface FormVariant {
//   name: string;
//   values: string[];
// }

// interface ProductForm {
//   productName: string;
//   productCode: string;
//   model: string;
//   category: string;
//   subcategory: string;
//   description: string;
//   note: string;
//   tags: string[];
//   variants: FormVariant[];
// }

// interface ImageItem {
//   _id: string;
//   originalUrl?: string;
//   watermarkedUrl?: string;
//   productName?: string;
//   [key: string]: unknown;
// }

// interface ProductItem {
//   _id: string;
//   productName?: string;
//   productCode?: string;
//   model?: string;
//   category?: string;
//   subcategory?: string;
//   description?: string;
//   note?: string;
//   tags?: string[];
//   variants?: FormVariant[];
//   imageIds?: string[];
//   similarProductIds?: string[];
//   imageCount?: number;
//   [key: string]: unknown;
// }

// interface CategoryItem extends Category {
//   parent?: { _id: string; name: string } | null;
// }

// interface DeleteDialogState {
//   open: boolean;
//   id: string | null;
//   name: string;
//   loading: boolean;
// }

// interface LibraryState<T> {
//   items: T[];
//   loading: boolean;
//   total: number;
// }

// interface QueryState {
//   page: number;
//   rowsPerPage: number;
//   search: string;
//   assigned?: string;
// }

// const getDefaultForm = (): ProductForm => ({
//   productName: "",
//   productCode: "",
//   model: "",
//   category: "",
//   subcategory: "",
//   description: "",
//   note: "",
//   tags: [],
//   variants: [],
// });

// export default function ProductManagement() {
//   const theme = useTheme();
//   const [products, setProducts] = useState<ProductItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({ category: "", model: "" });
//   const [open, setOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
//   const [form, setForm] = useState<ProductForm>(getDefaultForm);
//   const [tagInput, setTagInput] = useState("");
//   const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
//   const [selectedImagesLoading, setSelectedImagesLoading] = useState(false);
//   const [imageDialogOpen, setImageDialogOpen] = useState(false);

//   // Image Library state with folder navigation
//   const [imageLibrary, setImageLibrary] = useState<LibraryState<ImageItem>>({
//     items: [],
//     loading: false,
//     total: 0,
//   });
//   const [imageLibraryQuery, setImageLibraryQuery] = useState<QueryState>({
//     page: 0,
//     rowsPerPage: 6,
//     search: "",
//     assigned: "all",
//   });

//   // Folder navigation state for image dialog
//   const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
//   const [folders, setFolders] = useState<RealFolder[]>([]);
//   const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
//     { id: null, name: "الملفات" },
//   ]);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
//     open: false,
//     id: null,
//     name: "",
//     loading: false,
//   });

//   // Similar products state
//   const [selectedSimilarProducts, setSelectedSimilarProducts] = useState<ProductItem[]>([]);
//   const [selectedSimilarProductsLoading, setSelectedSimilarProductsLoading] = useState(false);
//   const [similarProductsDialogOpen, setSimilarProductsDialogOpen] = useState(false);
//   const [productsLibrary, setProductsLibrary] = useState<LibraryState<ProductItem>>({
//     items: [],
//     loading: false,
//     total: 0,
//   });
//   const [productsLibraryQuery, setProductsLibraryQuery] = useState<Omit<QueryState, 'assigned'>>({
//     page: 0,
//     rowsPerPage: 6,
//     search: "",
//   });

//   const loadProducts = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetchProducts({
//         page: page + 1,
//         limit: rowsPerPage,
//         q: search,
//         category: filters.category || undefined,
//         model: filters.model || undefined,
//       });
//       // fetchProducts returns PaginatedResponse directly
//       const items = res.items;
//       const totalItems = res.totalItems || res.total || 0;

//       if (items.length === 0 && totalItems > 0 && page > 0) {
//         setPage((prev) => Math.max(prev - 1, 0));
//         return;
//       }

//       setProducts(items as unknown as ProductItem[]);
//       setTotalCount(totalItems);
//     } catch (err: unknown) {
//       console.error(err);
//       const error = err as { response?: { data?: { message?: string } } };
//       const message = error.response?.data?.message;
//       setError(
//         typeof message === "string" ? message : "فشل في تحميل المنتجات. حاول مرة أخرى."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.category, filters.model, page, rowsPerPage, search]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // دالة لجلب الصور للمكتبة مع دعم المجلدات
//   const loadImageLibrary = useCallback(async () => {
//     if (!imageDialogOpen) return;

//     setImageLibrary(prev => ({ ...prev, loading: true }));

//     try {
//       // إذا كان هناك بحث، نبحث مباشرة في الصور
//       if (imageLibraryQuery.search) {
//         const res = await fetchImages({
//           page: imageLibraryQuery.page + 1,
//           limit: imageLibraryQuery.rowsPerPage,
//           search: imageLibraryQuery.search,
//           assigned: imageLibraryQuery.assigned === 'all' ? undefined : imageLibraryQuery.assigned === 'assigned' ? true : false,
//         });
//         setImageLibrary({
//           items: (res.items || []) as unknown as ImageItem[],
//           loading: false,
//           total: res.totalItems || res.total || 0,
//         });
//         setFolders([]);
//         return;
//       }

//       // تحميل محتويات المجلد الحالي
//       const folderId = currentFolderId || 'root';
//       const res = await getFolderContents(folderId);

//       setFolders(res.folders);
//       setImageLibrary({
//         items: (res.images || []) as unknown as ImageItem[],
//         loading: false,
//         total: res.images?.length || 0,
//       });
//       setBreadcrumbs(res.breadcrumbs);
//     } catch (err) {
//       console.error("Failed to load images", err);
//       setImageLibrary(prev => ({ ...prev, loading: false }));
//     }
//   }, [imageDialogOpen, imageLibraryQuery, currentFolderId]);

//   useEffect(() => {
//     loadImageLibrary();
//   }, [loadImageLibrary]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetchCategories({ page: 1, limit: 1000 });
//         // fetchCategories returns PaginatedResponse directly
//         setCategories((res.items || []) as CategoryItem[]);
//       } catch (err: unknown) {
//         console.error("Failed to load categories", err);
//       }
//     })();
//   }, []);

//   const parentCategories = useMemo(
//     () => categories.filter((cat) => !cat.parent),
//     [categories]
//   );

//   const subcategoryOptions = useMemo(
//     () =>
//       categories.filter(
//         (cat) => cat.parent && cat.parent._id === form.category
//       ),
//     [categories, form.category]
//   );

//   const selectedImageIds = useMemo(
//     () => selectedImages.map((image) => image._id),
//     [selectedImages]
//   );

//   const selectedImageIdSet = useMemo(
//     () => new Set(selectedImages.map((image) => image._id)),
//     [selectedImages]
//   );

//   const selectedSimilarProductIds = useMemo(
//     () => selectedSimilarProducts.map((product) => product._id),
//     [selectedSimilarProducts]
//   );

//   const selectedSimilarProductIdSet = useMemo(
//     () => new Set(selectedSimilarProducts.map((product) => product._id)),
//     [selectedSimilarProducts]
//   );


//   const fetchSelectedImagesMeta = useCallback(async (ids: string[]) => {
//     if (!ids || ids.length === 0) {
//       setSelectedImages([]);
//       return;
//     }
//     setSelectedImagesLoading(true);
//     try {
//       const res = await fetchImages({
//         ids: ids.join(","),
//         limit: ids.length,
//         page: 1,
//       });
//       // fetchImages returns PaginatedResponse directly
//       const items = Array.isArray(res.items) ? res.items : [];
//       if (items.length === 0) {
//         setSelectedImages(ids.map((id: string) => ({ _id: id })));
//         return;
//       }
//       const map = new Map(items.map((item: { _id: string }) => [item._id, item as unknown as ImageItem]));
//       setSelectedImages(ids.map((id: string) => map.get(id) || { _id: id } as ImageItem));
//     } catch (err: unknown) {
//       console.error("Failed to load selected images", err);
//       setSelectedImages(ids.map((id: string) => ({ _id: id })));
//     } finally {
//       setSelectedImagesLoading(false);
//     }
//   }, []);

//   // Load products library for similar products dialog
//   const loadProductsLibrary = useCallback(async () => {
//     if (!similarProductsDialogOpen) return;
//     setProductsLibrary((prev) => ({ ...prev, loading: true }));
//     try {
//       const res = await fetchProducts({
//         page: productsLibraryQuery.page + 1,
//         limit: productsLibraryQuery.rowsPerPage,
//         q: productsLibraryQuery.search || undefined,
//       });
//       // fetchProducts returns PaginatedResponse directly
//       const items = res.items;
//       const totalItems = res.totalItems || res.total || 0;
//       setProductsLibrary((prev) => ({
//         ...prev,
//         items: items as unknown as ProductItem[],
//         total: totalItems,
//       }));
//     } catch (err) {
//       console.error("Failed to load products", err);
//     } finally {
//       setProductsLibrary((prev) => ({ ...prev, loading: false }));
//     }
//   }, [similarProductsDialogOpen, productsLibraryQuery]);

//   useEffect(() => {
//     loadProductsLibrary();
//   }, [loadProductsLibrary]);

//   // Fetch similar products metadata when editing
//   const fetchSelectedSimilarProductsMeta = useCallback(async (ids: string[]) => {
//     if (!ids || ids.length === 0) {
//       setSelectedSimilarProducts([]);
//       return;
//     }
//     setSelectedSimilarProductsLoading(true);
//     try {
//       // Fetch each product individually since we don't have a bulk endpoint
//       const results = await Promise.all(
//         ids.map(async (id: string) => {
//           try {
//             const res = await fetchProducts({ page: 1, limit: 1000 });
//             // fetchProducts returns PaginatedResponse directly
//             const found = res.items?.find((p: { _id: string }) => p._id === id);
//             return found || { _id: id, productName: "منتج غير موجود" };
//           } catch {
//             return { _id: id, productName: "منتج غير موجود" };
//           }
//         })
//       );
//       // Filter unique and valid products
//       const uniqueResults: ProductItem[] = [];
//       const seenIds = new Set<string>();
//       for (const p of results) {
//         if (!seenIds.has(p._id)) {
//           seenIds.add(p._id);
//           uniqueResults.push(p as ProductItem);
//         }
//       }
//       setSelectedSimilarProducts(uniqueResults);
//     } catch (err: unknown) {
//       console.error("Failed to load similar products", err);
//       setSelectedSimilarProducts(ids.map((id: string) => ({ _id: id, productName: "منتج غير موجود" })));
//     } finally {
//       setSelectedSimilarProductsLoading(false);
//     }
//   }, []);

//   const handleFormChange = (key: keyof ProductForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const value = event.target.value;
//     setForm((prev) => {
//       if (key === "category") {
//         return { ...prev, category: value, subcategory: "" };
//       }
//       return { ...prev, [key]: value };
//     });
//   };

//   const handleImageSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setImageLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
//   };

//   const handleImagePageChange = (_: unknown, newPage: number) => {
//     setImageLibraryQuery((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleImageRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setImageLibraryQuery((prev) => ({
//       ...prev,
//       rowsPerPage: parseInt(event.target.value, 10),
//       page: 0,
//     }));
//   };

//   const openImageDialog = () => {
//     setImageDialogOpen(true);
//     // Reset folder navigation state
//     setCurrentFolderId(null);
//     setBreadcrumbs([{ id: null, name: "الملفات" }]);
//     setFolders([]);
//   };

//   const closeImageDialog = () => {
//     setImageDialogOpen(false);
//     // Reset folder navigation when closing
//     setCurrentFolderId(null);
//     setBreadcrumbs([{ id: null, name: "الملفات" }]);
//     setFolders([]);
//     setImageLibraryQuery(prev => ({ ...prev, search: "", page: 0 }));
//   };

//   // Folder navigation handlers
//   const handleFolderClick = (folder: RealFolder) => {
//     setCurrentFolderId(folder._id);
//     setImageLibraryQuery(prev => ({ ...prev, page: 0 }));
//   };

//   const handleBreadcrumbClick = (crumb: { id: string | null; name: string }) => {
//     setCurrentFolderId(crumb.id);
//     setImageLibraryQuery(prev => ({ ...prev, search: "", page: 0 }));
//   };

//   const toggleImageSelection = (image: ImageItem) => {
//     setSelectedImages((prev) => {
//       const exists = prev.find((img) => img._id === image._id);
//       if (exists) {
//         return prev.filter((img) => img._id !== image._id);
//       }
//       return [...prev, image];
//     });
//   };

//   const handleRemoveSelectedImage = (id: string) => {
//     setSelectedImages((prev) => prev.filter((img) => img._id !== id));
//   };

//   // Similar products dialog handlers
//   const openSimilarProductsDialog = () => {
//     setSimilarProductsDialogOpen(true);
//   };

//   const closeSimilarProductsDialog = () => {
//     setSimilarProductsDialogOpen(false);
//   };

//   const handleProductsSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setProductsLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
//   };

//   const handleProductsPageChange = (_: unknown, newPage: number) => {
//     setProductsLibraryQuery((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleProductsRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setProductsLibraryQuery((prev) => ({
//       ...prev,
//       rowsPerPage: parseInt(event.target.value, 10),
//       page: 0,
//     }));
//   };

//   const toggleSimilarProductSelection = (product: ProductItem) => {
//     // Don't allow selecting the current product being edited
//     if (editingProduct && product._id === editingProduct._id) return;

//     setSelectedSimilarProducts((prev) => {
//       const exists = prev.find((p) => p._id === product._id);
//       if (exists) {
//         return prev.filter((p) => p._id !== product._id);
//       }
//       return [...prev, product];
//     });
//   };

//   const handleRemoveSelectedSimilarProduct = (id: string) => {
//     setSelectedSimilarProducts((prev) => prev.filter((p) => p._id !== id));
//   };

//   const handleAddVariant = () => {
//     setForm((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           name: "",
//           values: [""],
//         },
//       ],
//     }));
//   };

//   const handleRemoveVariant = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, variantIndex) => variantIndex !== index),
//     }));
//   };

//   const handleVariantNameChange = (index: number, value: string) => {
//     setForm((prev) => {
//       const updated = [...prev.variants];
//       updated[index] = { ...updated[index], name: value };
//       return { ...prev, variants: updated };
//     });
//   };

//   const handleVariantValueChange = (variantIndex: number, valueIndex: number, value: string) => {
//     setForm((prev) => {
//       const variants = [...prev.variants];
//       const targetVariant = variants[variantIndex];
//       if (!targetVariant) return prev;
//       const values = [...targetVariant.values];
//       values[valueIndex] = value;
//       variants[variantIndex] = { ...targetVariant, values };
//       return { ...prev, variants };
//     });
//   };

//   const handleAddVariantValue = (variantIndex: number) => {
//     setForm((prev) => {
//       const variants = [...prev.variants];
//       const targetVariant = variants[variantIndex];
//       if (!targetVariant) return prev;
//       const values = [...targetVariant.values, ""];
//       variants[variantIndex] = { ...targetVariant, values };
//       return { ...prev, variants };
//     });
//   };

//   const handleRemoveVariantValue = (variantIndex: number, valueIndex: number) => {
//     setForm((prev) => {
//       const variants = [...prev.variants];
//       const targetVariant = variants[variantIndex];
//       if (!targetVariant) return prev;
//       const values = targetVariant.values.filter(
//         (_, currentIndex) => currentIndex !== valueIndex
//       );
//       variants[variantIndex] = { ...targetVariant, values: values.length ? values : [""] };
//       return { ...prev, variants };
//     });
//   };

//   const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setTagInput(event.target.value);
//   };

//   const addTagFromInput = () => {
//     const value = tagInput.trim();
//     if (!value) return;
//     setForm((prev) => {
//       if (prev.tags.includes(value)) {
//         return prev;
//       }
//       return { ...prev, tags: [...prev.tags, value] };
//     });
//     setTagInput("");
//   };

//   const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter" || event.key === ",") {
//       event.preventDefault();
//       addTagFromInput();
//     }
//   };

//   const handleTagDelete = (tagToDelete: string) => {
//     setForm((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToDelete),
//     }));
//   };

//   const resetForm = () => {
//     setForm(getDefaultForm());
//     setTagInput("");
//     setSelectedImages([]);
//     setSelectedSimilarProducts([]);
//     setEditingProduct(null);
//     setError("");
//   };

//   const hydrateForm = (product: ProductItem | null) => {
//     if (!product) {
//       resetForm();
//       return;
//     }
//     const categoryId =
//       categories.find(
//         (cat) => !cat.parent && cat.name === product.category
//       )?._id || "";
//     const subcategoryId =
//       categories.find(
//         (cat) => cat.parent && cat.name === product.subcategory
//       )?._id || "";

//     const imageIds = Array.isArray(product.imageIds) ? product.imageIds : [];
//     const similarProductIds = Array.isArray(product.similarProductIds) ? product.similarProductIds : [];

//     setForm({
//       productName: product.productName || "",
//       productCode: product.productCode || "",
//       model: product.model || "",
//       category: categoryId,
//       subcategory: subcategoryId,
//       description: product.description || "",
//       note: product.note || "",
//       tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
//       variants: Array.isArray(product.variants)
//         ? product.variants.map((variant) => ({
//           name: variant?.name || "",
//           values:
//             Array.isArray(variant?.values) && variant.values.length > 0
//               ? variant.values
//               : [""],
//         }))
//         : [],
//     });
//     setTagInput("");
//     fetchSelectedImagesMeta(imageIds);
//     fetchSelectedSimilarProductsMeta(similarProductIds);
//   };

//   const handleOpen = (product: ProductItem | null = null) => {
//     setEditingProduct(product);
//     hydrateForm(product);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     resetForm();
//   };

//   const buildPayload = () => {
//     const tagsArray = Array.from(
//       new Set(form.tags.map((tag) => tag.trim()).filter(Boolean))
//     );

//     const variantsPayload = form.variants
//       .map((variant) => ({
//         name: variant.name.trim(),
//         values: variant.values.map((value) => value.trim()).filter(Boolean),
//       }))
//       .filter((variant) => variant.name && variant.values.length > 0);

//     return {
//       name: form.productName.trim(),
//       productName: form.productName.trim(),
//       productCode: form.productCode.trim(),
//       model: form.model.trim(),
//       category: form.category,
//       subcategory: form.subcategory || undefined,
//       description: form.description.trim() || "",
//       note: form.note.trim() || undefined,
//       tags: tagsArray,
//       variants: variantsPayload,
//       images: selectedImageIds,
//       imageIds: selectedImageIds,
//       similarProductIds: selectedSimilarProductIds,
//     };
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError("");
//     const payload = buildPayload();

//     try {
//       if (editingProduct) {
//         await updateProduct(editingProduct._id, payload);
//       } else {
//         await createProduct(payload);
//       }
//       handleClose();
//       loadProducts();
//     } catch (err: unknown) {
//       console.error(err);
//       const error = err as { response?: { data?: { message?: string } } };
//       const message = error.response?.data?.message;
//       setError(
//         typeof message === "string" ? message : "فشل في حفظ المنتج. حاول مرة أخرى."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openDeleteDialog = (product: ProductItem) => {
//     setDeleteDialog({
//       open: true,
//       id: product._id,
//       name: product.productName || "",
//       loading: false,
//     });
//   };

//   const closeDeleteDialog = () =>
//     setDeleteDialog({ open: false, id: null, name: "", loading: false });

//   const handleDeleteProduct = async () => {
//     if (!deleteDialog.id) return;
//     setDeleteDialog((prev) => ({ ...prev, loading: true }));
//     setError("");
//     try {
//       await deleteProduct(deleteDialog.id);
//       closeDeleteDialog();
//       loadProducts();
//     } catch (err: unknown) {
//       console.error(err);
//       const error = err as { response?: { data?: { message?: string } } };
//       const message = error.response?.data?.message;
//       setError(
//         typeof message === "string" ? message : "فشل في حذف المنتج. حاول مرة أخرى."
//       );
//       setDeleteDialog((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.target.value);
//     setPage(0);
//   };

//   const handleFilterChange = (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFilters((prev) => ({ ...prev, [key]: event.target.value }));
//     setPage(0);
//   };

//   const disabledSave =
//     !form.productName.trim() ||
//     !form.productCode.trim() ||
//     !form.model.trim() ||
//     !form.category ||
//     saving;

//   return (
//     <Box sx={{ width: "100%", pb: 4 }}>
//       <Box
//         sx={{
//           mb: { xs: 3, sm: 4 },
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           gap: 2,
//           alignItems: { xs: "flex-start", md: "center" },
//           justifyContent: "space-between",
//         }}
//       >
//         <Box>
//           <Typography variant="h4" sx={{ mb: 1 }}>
//             إدارة المنتجات
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             تحكم كامل في بيانات المنتجات وربطها بالصور
//           </Typography>
//         </Box>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpen(null)}
//           sx={{ borderRadius: 3, px: 3, py: 1.2 }}
//         >
//           منتج جديد
//         </Button>
//       </Box>

//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <TextField
//             fullWidth
//             placeholder="ابحث باسم المنتج، الكود أو الوصف..."
//             value={search}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
//         <Grid size={{ xs: 12, md: 3 }}>
//           <TextField
//             select
//             fullWidth
//             label="الفئة"
//             value={filters.category}
//             onChange={handleFilterChange("category")}
//           >
//             <MenuItem value="">كل الفئات</MenuItem>
//             {parentCategories.map((cat) => (
//               <MenuItem key={cat._id} value={cat._id}>
//                 {cat.name}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid size={{ xs: 12, md: 3 }}>
//           <TextField
//             fullWidth
//             label="الماركة"
//             value={filters.model}
//             onChange={handleFilterChange("model")}
//           />
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert
//           severity="error"
//           sx={{ mb: 2 }}
//           onClose={() => setError("")}
//         >
//           {error}
//         </Alert>
//       )}

//       <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
//         <Paper sx={{ width: "100%", overflowX: "auto" }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>المنتج</TableCell>
//                 <TableCell>الكود</TableCell>
//                 <TableCell>الفئة</TableCell>
//                 <TableCell>الماركة</TableCell>
//                 <TableCell>عدد الصور</TableCell>
//                 <TableCell align="right">الإجراءات</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 Array.from({ length: rowsPerPage }).map((_, i) => (
//                   <TableRow key={i}>
//                     {Array.from({ length: 6 }).map((__, idx) => (
//                       <TableCell key={idx}>
//                         <Skeleton variant="text" height={24} />
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : products.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
//                     <InventoryIcon
//                       sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
//                     />
//                     <Typography variant="h6" >
//                       لا توجد منتجات
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       ابدأ بإضافة منتج جديد لإدارته لاحقاً
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 products.map((product) => (
//                   <TableRow key={product._id} hover>
//                     <TableCell>
//                       <Box sx={{ display: "flex", flexDirection: "column" }}>
//                         <Typography >
//                           {product.productName}
//                         </Typography>
//                         {product.tags && product.tags.length > 0 && (
//                           <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
//                             {product.tags.slice(0, 3).map((tag) => (
//                               <Chip key={tag} label={tag} size="small" />
//                             ))}
//                             {product.tags.length > 3 && (
//                               <Chip
//                                 label={`+${product.tags.length - 3}`}
//                                 size="small"
//                                 variant="outlined"
//                               />
//                             )}
//                           </Box>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{product.productCode}</TableCell>
//                     <TableCell>
//                       <Typography variant="body2">{product.category || "-"}</Typography>
//                       {product.subcategory && (
//                         <Typography variant="caption" color="text.secondary">
//                           فرعي: {product.subcategory}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>{product.model}</TableCell>
//                     <TableCell>{product.imageCount ?? 0}</TableCell>
//                     <TableCell align="right">
//                       <Tooltip title="تعديل">
//                         <IconButton size="small" onClick={() => handleOpen(product)}>
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="حذف">
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => openDeleteDialog(product)}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </Paper>

//         <TablePagination
//           component="div"
//           count={totalCount}
//           page={page}
//           onPageChange={(_, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(event) => {
//             setRowsPerPage(parseInt(event.target.value, 10));
//             setPage(0);
//           }}
//           rowsPerPageOptions={[5, 10, 20, 50]}
//           labelRowsPerPage="منتجات لكل صفحة"
//           labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
//         />
//       </Card>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Typography variant="h6" >
//             {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
//           </Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers sx={{ pt: 3 }}>
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
//               {error}
//             </Alert>
//           )}
//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 label="اسم المنتج"
//                 value={form.productName}
//                 onChange={handleFormChange("productName")}
//                 fullWidth
//                 required
//                 sx={{
//                   mb: 2,
//                   input: {
//                     textAlign: "right",
//                   },
//                 }}
//                 slotProps={{
//                   formHelperText: {
//                     sx: { textAlign: "right" },
//                   },
//                 }}
//               />
//               <TextField
//                 label="كود المنتج"
//                 value={form.productCode}
//                 onChange={handleFormChange("productCode")}
//                 fullWidth
//                 required
//                 sx={{
//                   mb: 2,
//                   input: {
//                     textAlign: "right",
//                   },
//                 }}
//                 slotProps={{
//                   formHelperText: {
//                     sx: { textAlign: "right" },
//                   },
//                 }}
//               />
//               <TextField
//                 label="الماركة"
//                 value={form.model}
//                 onChange={handleFormChange("model")}
//                 fullWidth
//                 required
//                 sx={{
//                   mb: 2,
//                   input: {
//                     textAlign: "right",
//                   },
//                 }}
//                 slotProps={{
//                   formHelperText: {
//                     sx: { textAlign: "right" },
//                   },
//                 }}
//               />
//               <TextField
//                 select
//                 label="الفئة"
//                 value={form.category}
//                 onChange={handleFormChange("category")}
//                 fullWidth
//                 required
//                 sx={{ mb: 2 }}
//               >
//                 <MenuItem value="">اختر فئة</MenuItem>
//                 {parentCategories.map((cat) => (
//                   <MenuItem key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="الفئة الفرعية"
//                 value={form.subcategory}
//                 onChange={handleFormChange("subcategory")}
//                 fullWidth
//                 disabled={!form.category}
//               >
//                 <MenuItem value="">بدون</MenuItem>
//                 {subcategoryOptions.map((sub) => (
//                   <MenuItem key={sub._id} value={sub._id}>
//                     {sub.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Box
//                 sx={{
//                   border: `1px solid ${theme.palette.divider}`,
//                   borderRadius: 2,
//                   p: 2,
//                   mb: 2,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     mb: 2,
//                   }}
//                 >
//                   <Typography variant="subtitle1" >
//                     السمات / المتغيرات
//                   </Typography>
//                   {form.variants.length > 0 && (
//                     <Typography variant="body2" color="text.secondary">
//                       استخدمها لوصف المقاسات، الأوزان أو أي خيارات أخرى
//                     </Typography>
//                   )}
//                 </Box>

//                 {form.variants.length === 0 ? (
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 2,
//                       textAlign: "center",
//                       borderStyle: "dashed",
//                       color: "text.secondary",
//                     }}
//                   >
//                     لا توجد سمات مضافة حتى الآن.
//                   </Paper>
//                 ) : (
//                   form.variants.map((variant, variantIndex) => (
//                     <Box
//                       key={`variant-${variantIndex}`}
//                       sx={{
//                         border: `1px solid ${theme.palette.divider}`,
//                         borderRadius: 2,
//                         p: 2,
//                         mb: 2,
//                         backgroundColor: theme.palette.action.hover,
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           mb: 2,
//                         }}
//                       >
//                         <Typography variant="subtitle2">
//                           السمة #{variantIndex + 1}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleRemoveVariant(variantIndex)}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                       <TextField
//                         label="اسم السمة"
//                         value={variant.name}
//                         onChange={(event) =>
//                           handleVariantNameChange(variantIndex, event.target.value)
//                         }
//                         fullWidth
//                         sx={{
//                           mb: 2,
//                           input: {
//                             textAlign: "right",
//                           },
//                         }}
//                       />
//                       {variant.values.map((value, valueIndex) => (
//                         <Box
//                           key={`variant-${variantIndex}-value-${valueIndex}`}
//                           sx={{
//                             display: "flex",
//                             gap: 1,
//                             alignItems: "center",
//                             mb: 1.5,
//                           }}
//                         >
//                           <TextField
//                             label={`قيمة ${valueIndex + 1}`}
//                             value={value}
//                             onChange={(event) =>
//                               handleVariantValueChange(
//                                 variantIndex,
//                                 valueIndex,
//                                 event.target.value
//                               )
//                             }
//                             fullWidth
//                             sx={{
//                               input: {
//                                 textAlign: "right",
//                               },
//                             }}
//                           />
//                           <Tooltip title="إزالة القيمة">
//                             <span>
//                               <IconButton
//                                 size="small"
//                                 color="error"
//                                 onClick={() =>
//                                   handleRemoveVariantValue(variantIndex, valueIndex)
//                                 }
//                                 disabled={variant.values.length === 1}
//                               >
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             </span>
//                           </Tooltip>
//                         </Box>
//                       ))}
//                       <Button
//                         size="small"
//                         startIcon={<AddIcon />}
//                         onClick={() => handleAddVariantValue(variantIndex)}
//                         sx={{ borderRadius: 3 }}
//                       >
//                         إضافة قيمة
//                       </Button>
//                     </Box>
//                   ))
//                 )}

//                 <Button
//                   fullWidth={form.variants.length === 0}
//                   variant={form.variants.length === 0 ? "outlined" : "text"}
//                   startIcon={<AddIcon />}
//                   onClick={handleAddVariant}
//                   sx={{ borderRadius: 3 }}
//                 >
//                   إضافة سمة جديدة
//                 </Button>
//               </Box>

//               <Box
//                 sx={{
//                   border: `1px solid ${theme.palette.divider}`,
//                   borderRadius: 2,
//                   p: 2,
//                   mb: 2,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     alignItems: { xs: "flex-start", sm: "center" },
//                     justifyContent: "space-between",
//                     gap: 2,
//                     mb: 2,
//                   }}
//                 >
//                   <Box>
//                     <Typography variant="subtitle1" >
//                       الصور المرتبطة
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       اختر صوراً جاهزة من مكتبة الوسائط لربطها بهذا المنتج
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<PhotoLibraryIcon />}
//                       onClick={openImageDialog}
//                       sx={{ borderRadius: 3 }}
//                     >
//                       اختيار من المخزن
//                     </Button>
//                   </Box>
//                 </Box>

//                 {selectedImagesLoading ? (
//                   <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                     <CircularProgress size={24} />
//                     <Typography>جاري تحميل معلومات الصور...</Typography>
//                   </Box>
//                 ) : selectedImages.length === 0 ? (
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 3,
//                       textAlign: "center",
//                       borderStyle: "dashed",
//                       color: "text.secondary",
//                     }}
//                   >
//                     <PhotoLibraryIcon sx={{ mb: 1 }} />
//                     <Typography>لا توجد صور مرتبطة حالياً.</Typography>
//                     <Typography variant="body2">استخدم زر "اختيار من المخزن" أعلاه.</Typography>
//                   </Paper>
//                 ) : (
//                   <Grid container spacing={2}>
//                     {selectedImages.map((image) => {
//                       const url = image.watermarkedUrl || image.originalUrl || "";
//                       return (
//                         <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
//                           <Card
//                             sx={{
//                               borderRadius: 3,
//                               height: "100%",
//                               display: "flex",
//                               flexDirection: "column",
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 position: "relative",
//                                 pt: "56.25%",
//                                 backgroundColor: "action.hover",
//                               }}
//                             >
//                               {url ? (
//                                 <Box
//                                   component="img"
//                                   src={url}
//                                   alt={String(image.productName || image.productCode || image._id || "")}
//                                   sx={{
//                                     position: "absolute",
//                                     top: 0,
//                                     left: 0,
//                                     width: "100%",
//                                     height: "100%",
//                                     objectFit: "cover",
//                                     borderTopLeftRadius: 12,
//                                     borderTopRightRadius: 12,
//                                   }}
//                                 />
//                               ) : (
//                                 <Box
//                                   sx={{
//                                     position: "absolute",
//                                     top: 0,
//                                     left: 0,
//                                     width: "100%",
//                                     height: "100%",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     color: "text.secondary",
//                                   }}
//                                 >
//                                   <ImageIcon fontSize="large" />
//                                 </Box>
//                               )}
//                             </Box>
//                             <Box sx={{ p: 2, flexGrow: 1 }}>
//                               <Typography >
//                                 {String(image.productName || "صورة بدون اسم")}
//                               </Typography>
//                               <Typography variant="body2" color="text.secondary">
//                                 {String(image.productCode || image._id)}
//                               </Typography>
//                             </Box>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                                 px: 2,
//                                 pb: 2,
//                               }}
//                             >
//                               <Chip
//                                 label={`#${image._id.slice(-5)}`}
//                                 size="small"
//                                 variant="outlined"
//                               />
//                               <Button
//                                 size="small"
//                                 color="error"
//                                 onClick={() => handleRemoveSelectedImage(image._id)}
//                               >
//                                 إزالة
//                               </Button>
//                             </Box>
//                           </Card>
//                         </Grid>
//                       );
//                     })}
//                   </Grid>
//                 )}
//               </Box>

//               {/* Similar Products Section */}
//               <Box
//                 sx={{
//                   border: `1px solid ${theme.palette.divider}`,
//                   borderRadius: 2,
//                   p: 2,
//                   mb: 2,
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     alignItems: { xs: "flex-start", sm: "center" },
//                     justifyContent: "space-between",
//                     gap: 2,
//                     mb: 2,
//                   }}
//                 >
//                   <Box>
//                     <Typography variant="subtitle1">
//                       المنتجات المشابهة
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       اختر منتجات مشابهة لعرضها في صفحة تفاصيل هذا المنتج
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                     <Button
//                       variant="outlined"
//                       startIcon={<LinkIcon />}
//                       onClick={openSimilarProductsDialog}
//                       sx={{ borderRadius: 3 }}
//                     >
//                       اختيار منتجات
//                     </Button>
//                   </Box>
//                 </Box>

//                 {selectedSimilarProductsLoading ? (
//                   <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                     <CircularProgress size={24} />
//                     <Typography>جاري تحميل المنتجات المشابهة...</Typography>
//                   </Box>
//                 ) : selectedSimilarProducts.length === 0 ? (
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 3,
//                       textAlign: "center",
//                       borderStyle: "dashed",
//                       color: "text.secondary",
//                     }}
//                   >
//                     <LinkIcon sx={{ mb: 1 }} />
//                     <Typography>لا توجد منتجات مشابهة محددة.</Typography>
//                     <Typography variant="body2">استخدم زر "اختيار منتجات" أعلاه.</Typography>
//                   </Paper>
//                 ) : (
//                   <Grid container spacing={2}>
//                     {selectedSimilarProducts.map((product) => (
//                       <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
//                         <Card
//                           sx={{
//                             borderRadius: 3,
//                             height: "100%",
//                             display: "flex",
//                             flexDirection: "column",
//                           }}
//                         >
//                           <Box sx={{ p: 2, flexGrow: 1 }}>
//                             <Typography fontWeight="medium">
//                               {product.productName || "منتج بدون اسم"}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                               {product.productCode || product._id}
//                             </Typography>
//                             {product.category && (
//                               <Chip
//                                 label={product.category}
//                                 size="small"
//                                 sx={{ mt: 1 }}
//                               />
//                             )}
//                           </Box>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "flex-end",
//                               px: 2,
//                               pb: 2,
//                             }}
//                           >
//                             <Button
//                               size="small"
//                               color="error"
//                               onClick={() => handleRemoveSelectedSimilarProduct(product._id)}
//                             >
//                               إزالة
//                             </Button>
//                           </Box>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 )}
//               </Box>

//               <TextField
//                 label="الوصف"
//                 value={form.description}
//                 onChange={handleFormChange("description")}
//                 fullWidth
//                 multiline
//                 rows={3}
//                 sx={{
//                   mb: 2,
//                   textarea: {
//                     textAlign: "right",
//                   },
//                 }}
//                 slotProps={{
//                   formHelperText: {
//                     sx: { textAlign: "right" },
//                   },
//                 }}
//               />
//               <TextField
//                 label="ملاحظات"
//                 value={form.note}
//                 onChange={handleFormChange("note")}
//                 fullWidth
//                 multiline
//                 rows={2}
//                 sx={{
//                   mb: 2,
//                   textarea: {
//                     textAlign: "right",
//                   },
//                 }}
//                 slotProps={{
//                   formHelperText: {
//                     sx: { textAlign: "right" },
//                   },
//                 }}
//               />
//               <Box
//                 sx={{
//                   border: `1px dashed ${theme.palette.divider}`,
//                   borderRadius: 2,
//                   p: 2,
//                 }}
//               >
//                 <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                   الوسوم
//                 </Typography>
//                 <TextField
//                   placeholder="اكتب الوسم واضغط إنتر"
//                   value={tagInput}
//                   onChange={handleTagInputChange}
//                   onKeyDown={handleTagKeyDown}
//                   fullWidth
//                   helperText="مثال: جديد، مميز، عرض"
//                   sx={{
//                     mb: 1,
//                     input: {
//                       textAlign: "right",
//                     },
//                   }}
//                   slotProps={{
//                     formHelperText: {
//                       sx: { textAlign: "right" },
//                     },
//                   }}
//                 />
//                 <Button
//                   variant="text"
//                   size="small"
//                   startIcon={<AddIcon />}
//                   onClick={addTagFromInput}
//                   sx={{ borderRadius: 3, mb: 1 }}
//                 >
//                   إضافة الوسم الحالي
//                 </Button>
//                 {form.tags.length === 0 ? (
//                   <Typography variant="body2" color="text.secondary">
//                     لا توجد وسوم مضافة حالياً.
//                   </Typography>
//                 ) : (
//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                     {form.tags.map((tag) => (
//                       <Chip
//                         key={tag}
//                         label={tag}
//                         onDelete={() => handleTagDelete(tag)}
//                         deleteIcon={<CloseIcon />}
//                       />
//                     ))}
//                   </Box>
//                 )}
//               </Box>
//             </Grid>
//           </Grid>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             borderTop: `1px solid ${theme.palette.divider}`,
//             py: 2,
//             px: 3,
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             disabled={disabledSave}
//             startIcon={saving ? <CircularProgress size={18} /> : null}
//             sx={{ borderRadius: 3, px: 4 }}
//           >
//             {saving ? "جارٍ الحفظ..." : editingProduct ? "حفظ التعديلات" : "إنشاء المنتج"}
//           </Button>
//           <Button onClick={handleClose} sx={{ borderRadius: 3 }}>
//             إلغاء
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Image Library Dialog with Folder Navigation */}
//       <Dialog
//         open={imageDialogOpen}
//         onClose={closeImageDialog}
//         fullWidth
//         maxWidth="lg"
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Typography variant="h6">مكتبة الصور</Typography>
//           <IconButton onClick={closeImageDialog}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 3, minHeight: 500 }}>
//           {/* شريط البحث */}
//           <TextField
//             fullWidth
//             placeholder="ابحث عن صورة مباشرة (سيتجاهل المجلدات)..."
//             value={imageLibraryQuery.search}
//             onChange={handleImageSearchChange}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* شريط المسار (Breadcrumbs) - يظهر فقط عند عدم البحث */}
//           {!imageLibraryQuery.search && (
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 1.5,
//                 mb: 2,
//                 borderRadius: 2,
//                 border: `1px solid ${theme.palette.divider}`,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1,
//                 flexWrap: 'wrap'
//               }}
//             >
//               {breadcrumbs.map((crumb, index) => {
//                 const isLast = index === breadcrumbs.length - 1;
//                 return (
//                   <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
//                     {index > 0 && <NavigateNextIcon fontSize="small" sx={{ mx: 0.5, color: 'text.secondary' }} />}
//                     {isLast ? (
//                       <Typography fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
//                         {crumb.name}
//                       </Typography>
//                     ) : (
//                       <Button
//                         size="small"
//                         onClick={() => handleBreadcrumbClick(crumb)}
//                         sx={{
//                           minWidth: 'auto',
//                           px: 1,
//                           textTransform: 'none',
//                           color: 'text.secondary'
//                         }}
//                         startIcon={index === 0 ? <HomeIcon fontSize="small" /> : undefined}
//                       >
//                         {crumb.name}
//                       </Button>
//                     )}
//                   </Box>
//                 );
//               })}
//             </Paper>
//           )}

//           {/* منطقة العرض */}
//           {imageLibrary.loading ? (
//             <Grid container spacing={2}>
//               {[1, 2, 3, 4, 5, 6].map(i => (
//                 <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
//                   <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <>
//               {/* عرض المجلدات أولاً */}
//               {folders.length > 0 && !imageLibraryQuery.search && (
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                   {folders.map((folder) => (
//                     <Grid size={{ xs: 6, sm: 4, md: 3 }} key={folder._id}>
//                       <Card
//                         onClick={() => handleFolderClick(folder)}
//                         sx={{
//                           borderRadius: 3,
//                           cursor: 'pointer',
//                           transition: 'all 0.2s',
//                           '&:hover': {
//                             transform: 'translateY(-2px)',
//                             boxShadow: theme.shadows[4],
//                             borderColor: theme.palette.primary.main,
//                           },
//                           border: `1px solid ${theme.palette.divider}`,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             p: 2,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             gap: 1,
//                           }}
//                         >
//                           <FolderIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
//                           <Typography variant="body2" fontWeight="medium" noWrap sx={{ width: '100%', textAlign: 'center' }}>
//                             {folder.name}
//                           </Typography>
//                         </Box>
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//               )}

//               {/* عرض الصور */}
//               <Grid container spacing={2}>
//                 {imageLibrary.items.length === 0 && folders.length === 0 ? (
//                   <Grid size={{ xs: 12 }}>
//                     <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
//                       <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
//                       <Typography>لا توجد صور</Typography>
//                     </Paper>
//                   </Grid>
//                 ) : imageLibrary.items.length === 0 && folders.length > 0 ? (
//                   <Grid size={{ xs: 12 }}>
//                     <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed' }}>
//                       <Typography color="text.secondary">هذا المجلد لا يحتوي على صور، فقط مجلدات فرعية</Typography>
//                     </Paper>
//                   </Grid>
//                 ) : (
//                   imageLibrary.items.map((image) => {
//                     const url = image.watermarkedUrl || image.originalUrl || "";
//                     const isSelected = selectedImageIdSet.has(image._id);
//                     const isAssignedToAnother = image.productId && (!editingProduct || image.productId !== editingProduct._id);
//                     const isSelectable = !isAssignedToAnother || isSelected;

//                     return (
//                       <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
//                         <Card
//                           onClick={() => {
//                             if (!isSelectable) return;
//                             toggleImageSelection(image);
//                           }}
//                           sx={{
//                             borderRadius: 3,
//                             cursor: isSelectable ? "pointer" : "not-allowed",
//                             opacity: isSelectable ? 1 : 0.55,
//                             position: "relative",
//                             border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none'
//                           }}
//                         >
//                           <Box sx={{ position: "relative", pt: "56.25%" }}>
//                             <Box component="img" src={url} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
//                             {isSelected && <CheckCircleIcon color="primary" sx={{ position: "absolute", top: 8, right: 8, bgcolor: 'white', borderRadius: '50%' }} />}
//                           </Box>
//                           <Box sx={{ p: 1.5 }}>
//                             <Typography variant="body2" noWrap>{image.productName || 'صورة'}</Typography>
//                           </Box>
//                         </Card>
//                       </Grid>
//                     );
//                   })
//                 )}
//               </Grid>
//             </>
//           )}

//           {/* Pagination */}
//           {imageLibrary.total > 0 && (
//             <TablePagination
//               component="div"
//               count={imageLibrary.total}
//               page={imageLibraryQuery.page}
//               onPageChange={handleImagePageChange}
//               rowsPerPage={imageLibraryQuery.rowsPerPage}
//               onRowsPerPageChange={handleImageRowsChange}
//               labelRowsPerPage="صور لكل صفحة"
//             />
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
//           <Button onClick={closeImageDialog}>إغلاق</Button>
//           <Button variant="contained" onClick={closeImageDialog}>
//             تأكيد الاختيار ({selectedImages.length})
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={deleteDialog.open}
//         onClose={closeDeleteDialog}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{ sx: { direction: "rtl" } }}
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             borderBottom: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <WarningIcon color="error" />
//           <Typography variant="h6" >
//             تأكيد الحذف
//           </Typography>
//         </DialogTitle>
//         <DialogContent sx={{ py: 3 }}>
//           <Typography>
//             هل أنت متأكد من حذف المنتج "{deleteDialog.name}"؟ لا يمكن التراجع عن هذا الإجراء.
//           </Typography>
//         </DialogContent>
//         <DialogActions
//           sx={{
//             borderTop: `1px solid ${theme.palette.divider}`,
//             py: 2,
//             px: 3,
//           }}
//         >
//           <Button onClick={closeDeleteDialog} disabled={deleteDialog.loading}>
//             إلغاء
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDeleteProduct}
//             startIcon={
//               deleteDialog.loading ? <CircularProgress size={16} /> : <DeleteIcon />
//             }
//             disabled={deleteDialog.loading}
//           >
//             حذف
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Similar Products Dialog */}
//       <Dialog
//         open={similarProductsDialogOpen}
//         onClose={closeSimilarProductsDialog}
//         fullWidth
//         maxWidth="lg"
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Typography variant="h6">
//             اختيار المنتجات المشابهة
//           </Typography>
//           <IconButton onClick={closeSimilarProductsDialog}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Grid container spacing={2} sx={{ mb: 2 }}>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 placeholder="ابحث باسم المنتج أو الكود..."
//                 value={productsLibraryQuery.search}
//                 onChange={handleProductsSearchChange}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//           </Grid>

//           {productsLibrary.loading && productsLibrary.items.length === 0 ? (
//             <Grid container spacing={2}>
//               {Array.from({ length: productsLibraryQuery.rowsPerPage }).map((_, idx) => (
//                 <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
//                   <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : productsLibrary.items.length === 0 ? (
//             <Paper
//               variant="outlined"
//               sx={{
//                 p: 4,
//                 textAlign: "center",
//                 borderStyle: "dashed",
//                 color: "text.secondary",
//               }}
//             >
//               <InventoryIcon sx={{ fontSize: 48, mb: 1 }} />
//               <Typography variant="h6">
//                 لا توجد منتجات مطابقة
//               </Typography>
//               <Typography variant="body2">
//                 جرّب تعديل شروط البحث.
//               </Typography>
//             </Paper>
//           ) : (
//             <Grid container spacing={2}>
//               {productsLibrary.items.map((product) => {
//                 const isSelected = selectedSimilarProductIdSet.has(product._id);
//                 const isCurrentProduct = editingProduct && product._id === editingProduct._id;
//                 const isSelectable = !isCurrentProduct;
//                 return (
//                   <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
//                     <Card
//                       onClick={() => {
//                         if (!isSelectable) return;
//                         toggleSimilarProductSelection(product);
//                       }}
//                       sx={{
//                         borderRadius: 3,
//                         cursor: isSelectable ? "pointer" : "not-allowed",
//                         opacity: isSelectable ? 1 : 0.55,
//                         position: "relative",
//                         border: isSelected ? `2px solid ${theme.palette.primary.main}` : undefined,
//                       }}
//                     >
//                       <Box sx={{ p: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                           <Box sx={{ flex: 1 }}>
//                             <Typography fontWeight="medium">
//                               {product.productName || "منتج بدون اسم"}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                               {product.productCode}
//                             </Typography>
//                             {product.category && (
//                               <Chip
//                                 label={product.category}
//                                 size="small"
//                                 variant="outlined"
//                               />
//                             )}
//                           </Box>
//                           {isSelected && (
//                             <CheckCircleIcon
//                               color="primary"
//                               sx={{ ml: 1 }}
//                             />
//                           )}
//                         </Box>
//                         {isCurrentProduct && (
//                           <Chip
//                             label="المنتج الحالي"
//                             color="warning"
//                             size="small"
//                             sx={{ mt: 1 }}
//                           />
//                         )}
//                       </Box>
//                     </Card>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           )}

//           <TablePagination
//             component="div"
//             count={productsLibrary.total}
//             page={productsLibraryQuery.page}
//             onPageChange={handleProductsPageChange}
//             rowsPerPage={productsLibraryQuery.rowsPerPage}
//             onRowsPerPageChange={handleProductsRowsChange}
//             rowsPerPageOptions={[6, 12, 24]}
//             labelRowsPerPage="منتجات لكل صفحة"
//             labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
//             sx={{ mt: 2 }}
//           />
//         </DialogContent>
//         <DialogActions
//           sx={{
//             borderTop: `1px solid ${theme.palette.divider}`,
//             py: 2,
//             px: 3,
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             تم اختيار {selectedSimilarProducts.length} {selectedSimilarProducts.length === 1 ? "منتج" : "منتجات"} مشابهة.
//           </Typography>
//           <Button onClick={closeSimilarProductsDialog} sx={{ borderRadius: 3 }}>
//             تم
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

import { useCallback, useEffect, useMemo, useState, ChangeEvent, KeyboardEvent } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory2 as InventoryIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CheckCircle as CheckCircleIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchImages,
  getFolderContents,
} from "../../api/admin";
import { RealFolder } from "../../types/api.types";
import { Category } from "../../types/models.types";

// Local interfaces for this component
interface FormVariant {
  name: string;
  values: string[];
}

interface ProductForm {
  productName: string;
  productCode: string;
  model: string;
  category: string;
  subcategory: string;
  description: string;
  note: string;
  tags: string[];
  variants: FormVariant[];
}

interface ImageItem {
  _id: string;
  originalUrl?: string;
  watermarkedUrl?: string;
  productName?: string;
  productCode?: string;
  productId?: string;
  [key: string]: unknown;
}

interface ProductItem {
  _id: string;
  productName?: string;
  productCode?: string;
  model?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  note?: string;
  tags?: string[];
  variants?: FormVariant[];
  imageIds?: string[];
  similarProductIds?: string[];
  imageCount?: number;
  [key: string]: unknown;
}

interface CategoryItem extends Category {
  parent?: { _id: string; name: string } | null;
}

interface DeleteDialogState {
  open: boolean;
  id: string | null;
  name: string;
  loading: boolean;
}

interface LibraryState<T> {
  items: T[];
  loading: boolean;
  total: number;
}

interface QueryState {
  page: number;
  rowsPerPage: number;
  search: string;
  assigned?: string;
}

const getDefaultForm = (): ProductForm => ({
  productName: "",
  productCode: "",
  model: "",
  category: "",
  subcategory: "",
  description: "",
  note: "",
  tags: [],
  variants: [],
});

export default function ProductManagement() {
  const theme = useTheme();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [withoutImagesCount, setWithoutImagesCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    model: "",
    hasImages: "",
  });
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [form, setForm] = useState<ProductForm>(getDefaultForm);
  const [tagInput, setTagInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [selectedImagesLoading, setSelectedImagesLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Image Library state with folder navigation
  const [imageLibrary, setImageLibrary] = useState<LibraryState<ImageItem>>({
    items: [],
    loading: false,
    total: 0,
  });
  const [imageLibraryQuery, setImageLibraryQuery] = useState<QueryState>({
    page: 0,
    rowsPerPage: 6,
    search: "",
    assigned: "all",
  });

  // Folder navigation state for image dialog
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<RealFolder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: "الملفات" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    id: null,
    name: "",
    loading: false,
  });

  // Similar products state
  const [selectedSimilarProducts, setSelectedSimilarProducts] = useState<ProductItem[]>([]);
  const [selectedSimilarProductsLoading, setSelectedSimilarProductsLoading] = useState(false);
  const [similarProductsDialogOpen, setSimilarProductsDialogOpen] = useState(false);
  const [productsLibrary, setProductsLibrary] = useState<LibraryState<ProductItem>>({
    items: [],
    loading: false,
    total: 0,
  });
  const [productsLibraryQuery, setProductsLibraryQuery] = useState<Omit<QueryState, "assigned">>({
    page: 0,
    rowsPerPage: 6,
    search: "",
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = (await fetchProducts({
        page: page + 1,
        limit: rowsPerPage,
        q: search,
        category: filters.category || undefined,
        model: filters.model || undefined,
        hasImages:
          filters.hasImages === ""
            ? undefined
            : filters.hasImages === "with"
              ? "true"
              : "false",
      } as unknown as Parameters<typeof fetchProducts>[0])) as {
        items: unknown[];
        totalItems?: number;
        total?: number;
        withoutImagesCount?: number;
      };

      const items = Array.isArray(res.items) ? res.items : [];
      const totalItems = res.totalItems || res.total || 0;

      if (items.length === 0 && totalItems > 0 && page > 0) {
        setPage((prev) => Math.max(prev - 1, 0));
        return;
      }

      setProducts(items as ProductItem[]);
      setTotalCount(totalItems);
      setWithoutImagesCount(res.withoutImagesCount || 0);
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message;
      setError(
        typeof message === "string" ? message : "فشل في تحميل المنتجات. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.model, filters.hasImages, page, rowsPerPage, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // دالة لجلب الصور للمكتبة مع دعم المجلدات
  const loadImageLibrary = useCallback(async () => {
    if (!imageDialogOpen) return;

    setImageLibrary((prev) => ({ ...prev, loading: true }));

    try {
      // إذا كان هناك بحث، نبحث مباشرة في الصور
      if (imageLibraryQuery.search) {
        const res = await fetchImages({
          page: imageLibraryQuery.page + 1,
          limit: imageLibraryQuery.rowsPerPage,
          search: imageLibraryQuery.search,
          assigned:
            imageLibraryQuery.assigned === "all"
              ? undefined
              : imageLibraryQuery.assigned === "assigned"
                ? true
                : false,
        });
        setImageLibrary({
          items: (res.items || []) as unknown as ImageItem[],
          loading: false,
          total: res.totalItems || res.total || 0,
        });
        setFolders([]);
        return;
      }

      // تحميل محتويات المجلد الحالي
      const folderId = currentFolderId || "root";
      const res = await getFolderContents(folderId);

      setFolders(res.folders);
      setImageLibrary({
        items: (res.images || []) as unknown as ImageItem[],
        loading: false,
        total: res.images?.length || 0,
      });
      setBreadcrumbs(res.breadcrumbs);
    } catch (err) {
      console.error("Failed to load images", err);
      setImageLibrary((prev) => ({ ...prev, loading: false }));
    }
  }, [imageDialogOpen, imageLibraryQuery, currentFolderId]);

  useEffect(() => {
    loadImageLibrary();
  }, [loadImageLibrary]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 1000 });
        setCategories((res.items || []) as CategoryItem[]);
      } catch (err: unknown) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  const parentCategories = useMemo(
    () => categories.filter((cat) => !cat.parent),
    [categories]
  );

  const subcategoryOptions = useMemo(
    () =>
      categories.filter(
        (cat) => cat.parent && cat.parent._id === form.category
      ),
    [categories, form.category]
  );

  const selectedImageIds = useMemo(
    () => selectedImages.map((image) => image._id),
    [selectedImages]
  );

  const selectedImageIdSet = useMemo(
    () => new Set(selectedImages.map((image) => image._id)),
    [selectedImages]
  );

  const selectedSimilarProductIds = useMemo(
    () => selectedSimilarProducts.map((product) => product._id),
    [selectedSimilarProducts]
  );

  const selectedSimilarProductIdSet = useMemo(
    () => new Set(selectedSimilarProducts.map((product) => product._id)),
    [selectedSimilarProducts]
  );

  const fetchSelectedImagesMeta = useCallback(async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setSelectedImages([]);
      return;
    }
    setSelectedImagesLoading(true);
    try {
      const res = await fetchImages({
        ids: ids.join(","),
        limit: ids.length,
        page: 1,
      });
      const items = Array.isArray(res.items) ? res.items : [];
      if (items.length === 0) {
        setSelectedImages(ids.map((id: string) => ({ _id: id })));
        return;
      }
      const map = new Map(
        items.map((item: { _id: string }) => [item._id, item as unknown as ImageItem])
      );
      setSelectedImages(ids.map((id: string) => map.get(id) || ({ _id: id } as ImageItem)));
    } catch (err: unknown) {
      console.error("Failed to load selected images", err);
      setSelectedImages(ids.map((id: string) => ({ _id: id })));
    } finally {
      setSelectedImagesLoading(false);
    }
  }, []);

  // Load products library for similar products dialog
  const loadProductsLibrary = useCallback(async () => {
    if (!similarProductsDialogOpen) return;
    setProductsLibrary((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetchProducts({
        page: productsLibraryQuery.page + 1,
        limit: productsLibraryQuery.rowsPerPage,
        q: productsLibraryQuery.search || undefined,
      });
      const items = res.items;
      const totalItems = res.totalItems || res.total || 0;
      setProductsLibrary((prev) => ({
        ...prev,
        items: items as unknown as ProductItem[],
        total: totalItems,
      }));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setProductsLibrary((prev) => ({ ...prev, loading: false }));
    }
  }, [similarProductsDialogOpen, productsLibraryQuery]);

  useEffect(() => {
    loadProductsLibrary();
  }, [loadProductsLibrary]);

  // Fetch similar products metadata when editing
  const fetchSelectedSimilarProductsMeta = useCallback(async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setSelectedSimilarProducts([]);
      return;
    }
    setSelectedSimilarProductsLoading(true);
    try {
      const results = await Promise.all(
        ids.map(async (id: string) => {
          try {
            const res = await fetchProducts({ page: 1, limit: 1000 });
            const found = res.items?.find((p: { _id: string }) => p._id === id);
            return found || { _id: id, productName: "منتج غير موجود" };
          } catch {
            return { _id: id, productName: "منتج غير موجود" };
          }
        })
      );

      const uniqueResults: ProductItem[] = [];
      const seenIds = new Set<string>();
      for (const p of results) {
        if (!seenIds.has(p._id)) {
          seenIds.add(p._id);
          uniqueResults.push(p as ProductItem);
        }
      }
      setSelectedSimilarProducts(uniqueResults);
    } catch (err: unknown) {
      console.error("Failed to load similar products", err);
      setSelectedSimilarProducts(
        ids.map((id: string) => ({ _id: id, productName: "منتج غير موجود" }))
      );
    } finally {
      setSelectedSimilarProductsLoading(false);
    }
  }, []);

  const handleFormChange =
    (key: keyof ProductForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => {
        if (key === "category") {
          return { ...prev, category: value, subcategory: "" };
        }
        return { ...prev, [key]: value };
      });
    };

  const handleImageSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setImageLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
  };

  const handleImagePageChange = (_: unknown, newPage: number) => {
    setImageLibraryQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleImageRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageLibraryQuery((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const openImageDialog = () => {
    setImageDialogOpen(true);
    setCurrentFolderId(null);
    setBreadcrumbs([{ id: null, name: "الملفات" }]);
    setFolders([]);
  };

  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setCurrentFolderId(null);
    setBreadcrumbs([{ id: null, name: "الملفات" }]);
    setFolders([]);
    setImageLibraryQuery((prev) => ({ ...prev, search: "", page: 0 }));
  };

  // Folder navigation handlers
  const handleFolderClick = (folder: RealFolder) => {
    setCurrentFolderId(folder._id);
    setImageLibraryQuery((prev) => ({ ...prev, page: 0 }));
  };

  const handleBreadcrumbClick = (crumb: { id: string | null; name: string }) => {
    setCurrentFolderId(crumb.id);
    setImageLibraryQuery((prev) => ({ ...prev, search: "", page: 0 }));
  };

  const toggleImageSelection = (image: ImageItem) => {
    setSelectedImages((prev) => {
      const exists = prev.find((img) => img._id === image._id);
      if (exists) {
        return prev.filter((img) => img._id !== image._id);
      }
      return [...prev, image];
    });
  };

  const handleRemoveSelectedImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img._id !== id));
  };

  // Similar products dialog handlers
  const openSimilarProductsDialog = () => {
    setSimilarProductsDialogOpen(true);
  };

  const closeSimilarProductsDialog = () => {
    setSimilarProductsDialogOpen(false);
  };

  const handleProductsSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProductsLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
  };

  const handleProductsPageChange = (_: unknown, newPage: number) => {
    setProductsLibraryQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleProductsRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProductsLibraryQuery((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const toggleSimilarProductSelection = (product: ProductItem) => {
    if (editingProduct && product._id === editingProduct._id) return;

    setSelectedSimilarProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveSelectedSimilarProduct = (id: string) => {
    setSelectedSimilarProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          values: [""],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const handleVariantNameChange = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], name: value };
      return { ...prev, variants: updated };
    });
  };

  const handleVariantValueChange = (variantIndex: number, valueIndex: number, value: string) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = [...targetVariant.values];
      values[valueIndex] = value;
      variants[variantIndex] = { ...targetVariant, values };
      return { ...prev, variants };
    });
  };

  const handleAddVariantValue = (variantIndex: number) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = [...targetVariant.values, ""];
      variants[variantIndex] = { ...targetVariant, values };
      return { ...prev, variants };
    });
  };

  const handleRemoveVariantValue = (variantIndex: number, valueIndex: number) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = targetVariant.values.filter((_, currentIndex) => currentIndex !== valueIndex);
      variants[variantIndex] = { ...targetVariant, values: values.length ? values : [""] };
      return { ...prev, variants };
    });
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const addTagFromInput = () => {
    const value = tagInput.trim();
    if (!value) return;
    setForm((prev) => {
      if (prev.tags.includes(value)) {
        return prev;
      }
      return { ...prev, tags: [...prev.tags, value] };
    });
    setTagInput("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTagFromInput();
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const resetForm = () => {
    setForm(getDefaultForm());
    setTagInput("");
    setSelectedImages([]);
    setSelectedSimilarProducts([]);
    setEditingProduct(null);
    setError("");
  };

  const hydrateForm = (product: ProductItem | null) => {
    if (!product) {
      resetForm();
      return;
    }
    const categoryId =
      categories.find((cat) => !cat.parent && cat.name === product.category)?._id || "";
    const subcategoryId =
      categories.find((cat) => cat.parent && cat.name === product.subcategory)?._id || "";

    const imageIds = Array.isArray(product.imageIds) ? product.imageIds : [];
    const similarProductIds = Array.isArray(product.similarProductIds)
      ? product.similarProductIds
      : [];

    setForm({
      productName: product.productName || "",
      productCode: product.productCode || "",
      model: product.model || "",
      category: categoryId,
      subcategory: subcategoryId,
      description: product.description || "",
      note: product.note || "",
      tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            name: variant?.name || "",
            values:
              Array.isArray(variant?.values) && variant.values.length > 0
                ? variant.values
                : [""],
          }))
        : [],
    });
    setTagInput("");
    fetchSelectedImagesMeta(imageIds);
    fetchSelectedSimilarProductsMeta(similarProductIds);
  };

  const handleOpen = (product: ProductItem | null = null) => {
    setEditingProduct(product);
    hydrateForm(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const buildPayload = () => {
    const tagsArray = Array.from(new Set(form.tags.map((tag) => tag.trim()).filter(Boolean)));

    const variantsPayload = form.variants
      .map((variant) => ({
        name: variant.name.trim(),
        values: variant.values.map((value) => value.trim()).filter(Boolean),
      }))
      .filter((variant) => variant.name && variant.values.length > 0);

    return {
      name: form.productName.trim(),
      productName: form.productName.trim(),
      productCode: form.productCode.trim(),
      model: form.model.trim(),
      category: form.category,
      subcategory: form.subcategory || undefined,
      description: form.description.trim() || "",
      note: form.note.trim() || undefined,
      tags: tagsArray,
      variants: variantsPayload,
      images: selectedImageIds,
      imageIds: selectedImageIds,
      similarProductIds: selectedSimilarProductIds,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = buildPayload();

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
      } else {
        await createProduct(payload);
      }
      handleClose();
      loadProducts();
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message;
      setError(typeof message === "string" ? message : "فشل في حفظ المنتج. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (product: ProductItem) => {
    setDeleteDialog({
      open: true,
      id: product._id,
      name: product.productName || "",
      loading: false,
    });
  };

  const closeDeleteDialog = () =>
    setDeleteDialog({ open: false, id: null, name: "", loading: false });

  const handleDeleteProduct = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    setError("");
    try {
      await deleteProduct(deleteDialog.id);
      closeDeleteDialog();
      loadProducts();
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message;
      setError(typeof message === "string" ? message : "فشل في حذف المنتج. حاول مرة أخرى.");
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleFilterChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFilters((prev) => ({ ...prev, [key]: event.target.value }));
      setPage(0);
    };

  const disabledSave =
    !form.productName.trim() ||
    !form.productCode.trim() ||
    !form.model.trim() ||
    !form.category ||
    saving;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            إدارة المنتجات
          </Typography>
          <Typography variant="body2" color="text.secondary">
            تحكم كامل في بيانات المنتجات وربطها بالصور
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
          sx={{ borderRadius: 3, px: 3, py: 1.2 }}
        >
          منتج جديد
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="ابحث باسم المنتج، الكود أو الوصف..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="الفئة"
            value={filters.category}
            onChange={handleFilterChange("category")}
          >
            <MenuItem value="">كل الفئات</MenuItem>
            {parentCategories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            label="الماركة"
            value={filters.model}
            onChange={handleFilterChange("model")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="الصور"
            value={filters.hasImages}
            onChange={handleFilterChange("hasImages")}
          >
            <MenuItem value="">كل المنتجات</MenuItem>
            <MenuItem value="with">لديها صور</MenuItem>
            <MenuItem value="without">بدون صور</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Chip
          icon={<InventoryIcon />}
          label={`إجمالي المنتجات: ${totalCount}`}
          variant="outlined"
        />
        <Chip
          icon={<PhotoLibraryIcon />}
          color={withoutImagesCount > 0 ? "warning" : "success"}
          label={`بدون صور: ${withoutImagesCount}`}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المنتج</TableCell>
                <TableCell>الكود</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell>الماركة</TableCell>
                <TableCell>عدد الصور</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <InventoryIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                    <Typography variant="h6">لا توجد منتجات</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ابدأ بإضافة منتج جديد لإدارته لاحقاً
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography>{product.productName}</Typography>
                        {product.tags && product.tags.length > 0 && (
                          <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {product.tags.slice(0, 3).map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                            {product.tags.length > 3 && (
                              <Chip
                                label={`+${product.tags.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.category || "-"}</Typography>
                      {product.subcategory && (
                        <Typography variant="caption" color="text.secondary">
                          فرعي: {product.subcategory}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={(product.imageCount ?? 0) > 0 ? "success" : "warning"}
                        icon={(product.imageCount ?? 0) > 0 ? <CheckCircleIcon /> : <ImageIcon />}
                        label={product.imageCount ?? 0}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="تعديل">
                        <IconButton size="small" onClick={() => handleOpen(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="منتجات لكل صفحة"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
        />
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">
            {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="اسم المنتج"
                value={form.productName}
                onChange={handleFormChange("productName")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                label="كود المنتج"
                value={form.productCode}
                onChange={handleFormChange("productCode")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                label="الماركة"
                value={form.model}
                onChange={handleFormChange("model")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                select
                label="الفئة"
                value={form.category}
                onChange={handleFormChange("category")}
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="">اختر فئة</MenuItem>
                {parentCategories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="الفئة الفرعية"
                value={form.subcategory}
                onChange={handleFormChange("subcategory")}
                fullWidth
                disabled={!form.category}
              >
                <MenuItem value="">بدون</MenuItem>
                {subcategoryOptions.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">السمات / المتغيرات</Typography>
                  {form.variants.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      استخدمها لوصف المقاسات، الأوزان أو أي خيارات أخرى
                    </Typography>
                  )}
                </Box>

                {form.variants.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    لا توجد سمات مضافة حتى الآن.
                  </Paper>
                ) : (
                  form.variants.map((variant, variantIndex) => (
                    <Box
                      key={`variant-${variantIndex}`}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        backgroundColor: theme.palette.action.hover,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2">السمة #{variantIndex + 1}</Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveVariant(variantIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <TextField
                        label="اسم السمة"
                        value={variant.name}
                        onChange={(event) =>
                          handleVariantNameChange(variantIndex, event.target.value)
                        }
                        fullWidth
                        sx={{
                          mb: 2,
                          input: {
                            textAlign: "right",
                          },
                        }}
                      />

                      {variant.values.map((value, valueIndex) => (
                        <Box
                          key={`variant-${variantIndex}-value-${valueIndex}`}
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <TextField
                            label={`قيمة ${valueIndex + 1}`}
                            value={value}
                            onChange={(event) =>
                              handleVariantValueChange(variantIndex, valueIndex, event.target.value)
                            }
                            fullWidth
                            sx={{
                              input: {
                                textAlign: "right",
                              },
                            }}
                          />
                          <Tooltip title="إزالة القيمة">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleRemoveVariantValue(variantIndex, valueIndex)
                                }
                                disabled={variant.values.length === 1}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      ))}

                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddVariantValue(variantIndex)}
                        sx={{ borderRadius: 3 }}
                      >
                        إضافة قيمة
                      </Button>
                    </Box>
                  ))
                )}

                <Button
                  fullWidth={form.variants.length === 0}
                  variant={form.variants.length === 0 ? "outlined" : "text"}
                  startIcon={<AddIcon />}
                  onClick={handleAddVariant}
                  sx={{ borderRadius: 3 }}
                >
                  إضافة سمة جديدة
                </Button>
              </Box>

              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">الصور المرتبطة</Typography>
                    <Typography variant="body2" color="text.secondary">
                      اختر صوراً جاهزة من مكتبة الوسائط لربطها بهذا المنتج
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoLibraryIcon />}
                      onClick={openImageDialog}
                      sx={{ borderRadius: 3 }}
                    >
                      اختيار من المخزن
                    </Button>
                  </Box>
                </Box>

                {selectedImagesLoading ? (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircularProgress size={24} />
                    <Typography>جاري تحميل معلومات الصور...</Typography>
                  </Box>
                ) : selectedImages.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    <PhotoLibraryIcon sx={{ mb: 1 }} />
                    <Typography>لا توجد صور مرتبطة حالياً.</Typography>
                    <Typography variant="body2">
                      استخدم زر "اختيار من المخزن" أعلاه.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {selectedImages.map((image) => {
                      const url = image.watermarkedUrl || image.originalUrl || "";
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                pt: "56.25%",
                                backgroundColor: "action.hover",
                              }}
                            >
                              {url ? (
                                <Box
                                  component="img"
                                  src={url}
                                  alt={String(image.productName || image.productCode || image._id || "")}
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.secondary",
                                  }}
                                >
                                  <ImageIcon fontSize="large" />
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ p: 2, flexGrow: 1 }}>
                              <Typography>{String(image.productName || "صورة بدون اسم")}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {String(image.productCode || image._id)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 2,
                                pb: 2,
                              }}
                            >
                              <Chip label={`#${image._id.slice(-5)}`} size="small" variant="outlined" />
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveSelectedImage(image._id)}
                              >
                                إزالة
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>

              {/* Similar Products Section */}
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">المنتجات المشابهة</Typography>
                    <Typography variant="body2" color="text.secondary">
                      اختر منتجات مشابهة لعرضها في صفحة تفاصيل هذا المنتج
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={openSimilarProductsDialog}
                      sx={{ borderRadius: 3 }}
                    >
                      اختيار منتجات
                    </Button>
                  </Box>
                </Box>

                {selectedSimilarProductsLoading ? (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircularProgress size={24} />
                    <Typography>جاري تحميل المنتجات المشابهة...</Typography>
                  </Box>
                ) : selectedSimilarProducts.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    <LinkIcon sx={{ mb: 1 }} />
                    <Typography>لا توجد منتجات مشابهة محددة.</Typography>
                    <Typography variant="body2">
                      استخدم زر "اختيار منتجات" أعلاه.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {selectedSimilarProducts.map((product) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box sx={{ p: 2, flexGrow: 1 }}>
                            <Typography fontWeight="medium">
                              {product.productName || "منتج بدون اسم"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.productCode || product._id}
                            </Typography>
                            {product.category && (
                              <Chip label={product.category} size="small" sx={{ mt: 1 }} />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              px: 2,
                              pb: 2,
                            }}
                          >
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveSelectedSimilarProduct(product._id)}
                            >
                              إزالة
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              <TextField
                label="الوصف"
                value={form.description}
                onChange={handleFormChange("description")}
                fullWidth
                multiline
                rows={3}
                sx={{
                  mb: 2,
                  textarea: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />

              <TextField
                label="ملاحظات"
                value={form.note}
                onChange={handleFormChange("note")}
                fullWidth
                multiline
                rows={2}
                sx={{
                  mb: 2,
                  textarea: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />

              <Box
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  الوسوم
                </Typography>
                <TextField
                  placeholder="اكتب الوسم واضغط إنتر"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  fullWidth
                  helperText="مثال: جديد، مميز، عرض"
                  sx={{
                    mb: 1,
                    input: {
                      textAlign: "right",
                    },
                  }}
                  slotProps={{
                    formHelperText: {
                      sx: { textAlign: "right" },
                    },
                  }}
                />
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addTagFromInput}
                  sx={{ borderRadius: 3, mb: 1 }}
                >
                  إضافة الوسم الحالي
                </Button>
                {form.tags.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    لا توجد وسوم مضافة حالياً.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {form.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleTagDelete(tag)}
                        deleteIcon={<CloseIcon />}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={disabledSave}
            startIcon={saving ? <CircularProgress size={18} /> : null}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {saving ? "جارٍ الحفظ..." : editingProduct ? "حفظ التعديلات" : "إنشاء المنتج"}
          </Button>
          <Button onClick={handleClose} sx={{ borderRadius: 3 }}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Library Dialog with Folder Navigation */}
      <Dialog open={imageDialogOpen} onClose={closeImageDialog} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">مكتبة الصور</Typography>
          <IconButton onClick={closeImageDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, minHeight: 500 }}>
          {/* شريط البحث */}
          <TextField
            fullWidth
            placeholder="ابحث عن صورة مباشرة (سيتجاهل المجلدات)..."
            value={imageLibraryQuery.search}
            onChange={handleImageSearchChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* شريط المسار (Breadcrumbs) - يظهر فقط عند عدم البحث */}
          {!imageLibraryQuery.search && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    {index > 0 && (
                      <NavigateNextIcon fontSize="small" sx={{ mx: 0.5, color: "text.secondary" }} />
                    )}
                    {isLast ? (
                      <Typography fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                        {crumb.name}
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => handleBreadcrumbClick(crumb)}
                        sx={{
                          minWidth: "auto",
                          px: 1,
                          textTransform: "none",
                          color: "text.secondary",
                        }}
                        startIcon={index === 0 ? <HomeIcon fontSize="small" /> : undefined}
                      >
                        {crumb.name}
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Paper>
          )}

          {/* منطقة العرض */}
          {imageLibrary.loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {/* عرض المجلدات أولاً */}
              {folders.length > 0 && !imageLibraryQuery.search && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {folders.map((folder) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={folder._id}>
                      <Card
                        onClick={() => handleFolderClick(folder)}
                        sx={{
                          borderRadius: 3,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows[4],
                            borderColor: theme.palette.primary.main,
                          },
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FolderIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            noWrap
                            sx={{ width: "100%", textAlign: "center" }}
                          >
                            {folder.name}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* عرض الصور */}
              <Grid container spacing={2}>
                {imageLibrary.items.length === 0 && folders.length === 0 ? (
                  <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}>
                      <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                      <Typography>لا توجد صور</Typography>
                    </Paper>
                  </Grid>
                ) : imageLibrary.items.length === 0 && folders.length > 0 ? (
                  <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }}>
                      <Typography color="text.secondary">
                        هذا المجلد لا يحتوي على صور، فقط مجلدات فرعية
                      </Typography>
                    </Paper>
                  </Grid>
                ) : (
                  imageLibrary.items.map((image) => {
                    const url = image.watermarkedUrl || image.originalUrl || "";
                    const isSelected = selectedImageIdSet.has(image._id);
                    const isAssignedToAnother =
                      image.productId && (!editingProduct || image.productId !== editingProduct._id);
                    const isSelectable = !isAssignedToAnother || isSelected;

                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
                        <Card
                          onClick={() => {
                            if (!isSelectable) return;
                            toggleImageSelection(image);
                          }}
                          sx={{
                            borderRadius: 3,
                            cursor: isSelectable ? "pointer" : "not-allowed",
                            opacity: isSelectable ? 1 : 0.55,
                            position: "relative",
                            border: isSelected ? `2px solid ${theme.palette.primary.main}` : "none",
                          }}
                        >
                          <Box sx={{ position: "relative", pt: "56.25%" }}>
                            <Box
                              component="img"
                              src={url}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {isSelected && (
                              <CheckCircleIcon
                                color="primary"
                                sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", borderRadius: "50%" }}
                              />
                            )}
                          </Box>
                          <Box sx={{ p: 1.5 }}>
                            <Typography variant="body2" noWrap>
                              {image.productName || "صورة"}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </>
          )}

          {/* Pagination */}
          {imageLibrary.total > 0 && (
            <TablePagination
              component="div"
              count={imageLibrary.total}
              page={imageLibraryQuery.page}
              onPageChange={handleImagePageChange}
              rowsPerPage={imageLibraryQuery.rowsPerPage}
              onRowsPerPageChange={handleImageRowsChange}
              labelRowsPerPage="صور لكل صفحة"
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={closeImageDialog}>إغلاق</Button>
          <Button variant="contained" onClick={closeImageDialog}>
            تأكيد الاختيار ({selectedImages.length})
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <WarningIcon color="error" />
          <Typography variant="h6">تأكيد الحذف</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>
            هل أنت متأكد من حذف المنتج "{deleteDialog.name}"؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
          }}
        >
          <Button onClick={closeDeleteDialog} disabled={deleteDialog.loading}>
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
            startIcon={deleteDialog.loading ? <CircularProgress size={16} /> : <DeleteIcon />}
            disabled={deleteDialog.loading}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Similar Products Dialog */}
      <Dialog open={similarProductsDialogOpen} onClose={closeSimilarProductsDialog} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">اختيار المنتجات المشابهة</Typography>
          <IconButton onClick={closeSimilarProductsDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                placeholder="ابحث باسم المنتج أو الكود..."
                value={productsLibraryQuery.search}
                onChange={handleProductsSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {productsLibrary.loading && productsLibrary.items.length === 0 ? (
            <Grid container spacing={2}>
              {Array.from({ length: productsLibraryQuery.rowsPerPage }).map((_, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : productsLibrary.items.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderStyle: "dashed",
                color: "text.secondary",
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6">لا توجد منتجات مطابقة</Typography>
              <Typography variant="body2">جرّب تعديل شروط البحث.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {productsLibrary.items.map((product) => {
                const isSelected = selectedSimilarProductIdSet.has(product._id);
                const isCurrentProduct = editingProduct && product._id === editingProduct._id;
                const isSelectable = !isCurrentProduct;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                    <Card
                      onClick={() => {
                        if (!isSelectable) return;
                        toggleSimilarProductSelection(product);
                      }}
                      sx={{
                        borderRadius: 3,
                        cursor: isSelectable ? "pointer" : "not-allowed",
                        opacity: isSelectable ? 1 : 0.55,
                        position: "relative",
                        border: isSelected ? `2px solid ${theme.palette.primary.main}` : undefined,
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="medium">
                              {product.productName || "منتج بدون اسم"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {product.productCode}
                            </Typography>
                            {product.category && (
                              <Chip label={product.category} size="small" variant="outlined" />
                            )}
                          </Box>
                          {isSelected && <CheckCircleIcon color="primary" sx={{ ml: 1 }} />}
                        </Box>
                        {isCurrentProduct && (
                          <Chip label="المنتج الحالي" color="warning" size="small" sx={{ mt: 1 }} />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <TablePagination
            component="div"
            count={productsLibrary.total}
            page={productsLibraryQuery.page}
            onPageChange={handleProductsPageChange}
            rowsPerPage={productsLibraryQuery.rowsPerPage}
            onRowsPerPageChange={handleProductsRowsChange}
            rowsPerPageOptions={[6, 12, 24]}
            labelRowsPerPage="منتجات لكل صفحة"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            تم اختيار {selectedSimilarProducts.length}{" "}
            {selectedSimilarProducts.length === 1 ? "منتج" : "منتجات"} مشابهة.
          </Typography>
          <Button onClick={closeSimilarProductsDialog} sx={{ borderRadius: 3 }}>
            تم
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}