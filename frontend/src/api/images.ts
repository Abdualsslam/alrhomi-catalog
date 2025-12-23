import apiClient from "./client";
import { Image } from "../types/models.types";
import { ImageQueryParams, PaginatedResponse } from "../types/api.types";
import { AxiosResponse } from "axios";

export function searchImages(
  params: ImageQueryParams
): Promise<AxiosResponse<PaginatedResponse<Image>>> {
  return apiClient.getClient().get("/public/images", {
    params: {
      q: params.q,
      category: params.category,
      brand: params.brand,
      model: params.model,
      sizeMin: params.sizeMin,
      sizeMax: params.sizeMax,
      page: params.page,
      limit: params.limit,
    },
  });
}

export function getImageById(id: string): Promise<AxiosResponse<Image>> {
  return apiClient.getClient().get(`/public/images/${id}`);
}

export function getRelatedImages(id: string): Promise<AxiosResponse<Image[]>> {
  return apiClient.getClient().get(`/public/images/${id}/related`);
}

export default apiClient;
