import api from "./api";
import type { ActivityRequest, ActivityResponse, PageResponse } from "../types";
import { useDemoStore } from "../store/useDemoStore";
import { DEMO_ACTIVITIES } from "./demoData";
import { toast } from "sonner";

export const activityService = {
  /** POST /apis/activities */
  createActivity: async (dto: ActivityRequest): Promise<ActivityResponse> => {
    // Block mutating operations in demo mode
    if (useDemoStore.getState().isDemoMode) {
      toast.info("Creating activities is not available in demo mode.", {
        description: "This feature requires the backend microservices to be running.",
      });
      // Return a mock response so the UI doesn't break
      return {
        id: `demo-new-${Date.now()}`,
        userid: dto.userid,
        type: dto.type,
        duration: dto.duration,
        caloriesBurned: dto.caloriesBurned,
        startTime: dto.startTime,
        additionalMatrics: dto.additionalMatrics,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

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

    try {
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
    } catch (error) {
      // Demo mode fallback: return mock activities when backend is down
      if (useDemoStore.getState().isDemoMode) {
        console.log("[activityService] Backend offline — returning demo activities");
        return {
          content: DEMO_ACTIVITIES,
          totalPages: 1,
          totalElements: DEMO_ACTIVITIES.length,
          size: DEMO_ACTIVITIES.length,
          number: 0,
          first: true,
          last: true,
          empty: false,
        };
      }
      throw error;
    }
  },

  /** GET /apis/activities/{id} */
  getActivityById: async (id: string): Promise<ActivityResponse> => {
    try {
      const { data } = await api.get<ActivityResponse>(`/apis/activities/${id}`);
      return data;
    } catch (error) {
      // Demo mode fallback
      if (useDemoStore.getState().isDemoMode) {
        const demoAct = DEMO_ACTIVITIES.find((a) => a.id === id);
        if (demoAct) return demoAct;
        return DEMO_ACTIVITIES[0];
      }
      throw error;
    }
  },

  /** DELETE /apis/activities/{id} */
  deleteActivity: async (id: string): Promise<string> => {
    // Block mutating operations in demo mode
    if (useDemoStore.getState().isDemoMode) {
      toast.info("Deleting activities is not available in demo mode.", {
        description: "This feature requires the backend microservices to be running.",
      });
      return "Demo mode — delete skipped";
    }

    const { data } = await api.delete<string>(`/apis/activities/${id}`);
    return data;
  },
};
