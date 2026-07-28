import api from "./api";
import type { ActivityRequest, ActivityResponse, PageResponse } from "../types";

export const activityService = {
  /** POST /apis/activities */
  createActivity: async (dto: ActivityRequest): Promise<ActivityResponse> => {
    console.log("[activityService] POST /apis/activities payload:", dto);
    const { data } = await api.post<ActivityResponse>("/apis/activities", dto);
    console.log("[activityService] POST /apis/activities response:", data);
    return data;
  },

  /** GET /apis/activities?page=&size= */
  getAllActivities: async (
    page: number = 0,
    size: number = 50
  ): Promise<PageResponse<ActivityResponse>> => {
    console.log(`[activityService] GET /apis/activities?page=${page}&size=${size}`);
    const { data } = await api.get<any>("/apis/activities", {
      params: { page, size },
    });
    console.log("[activityService] GET /apis/activities raw response:", data);

    // If data is a direct Array, wrap in PageResponse format
    if (Array.isArray(data)) {
      return {
        content: data,
        totalPages: 1,
        totalElements: data.length,
        size: data.length,
        number: 0,
        first: true,
        last: true,
        empty: data.length === 0,
      };
    }

    // If data is Spring Page object with content property
    if (data && Array.isArray(data.content)) {
      return data;
    }

    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
      first: true,
      last: true,
      empty: true,
    };
  },

  /** GET /apis/activities/{id} */
  getActivityById: async (id: string): Promise<ActivityResponse> => {
    const { data } = await api.get<ActivityResponse>(`/apis/activities/${id}`);
    return data;
  },

  /** DELETE /apis/activities/{id} */
  deleteActivity: async (id: string): Promise<string> => {
    const { data } = await api.delete<string>(`/apis/activities/${id}`);
    return data;
  },
};
