import apiClient from "./client";
import { Product } from "../types/models.types";
import { ProductQueryParams, PaginatedResponse } from "../types/api.types";
import { AxiosResponse } from "axios";

export function searchProducts(
  params: ProductQueryParams
): Promise<AxiosResponse<PaginatedResponse<Product>>> {
  return apiClient.getClient().get("/public/products", {
    params: {
      q: params.q,
      category: params.category,
      model: params.model,
      productCode: params.productCode,
      page: params.page,
      limit: params.limit,
    },
  });
}

export function getProductById(id: string): Promise<AxiosResponse<Product>> {
  return apiClient.getClient().get(`/public/products/${id}`);
}

export default apiClient;
