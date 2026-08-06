import api from "./api";
import type { Recommendation } from "../types";
import { useDemoStore } from "../store/useDemoStore";
import { DEMO_RECOMMENDATIONS } from "./demoData";

export const aiService = {
  /** GET /apis/recommendation/user/{userId} */
  getUserRecommendations: async (userId: string): Promise<Recommendation[]> => {
    if (!userId) return [];
    console.log(`[aiService] GET /apis/recommendation/user/${userId}`);
    try {
      const { data } = await api.get<any>(`/apis/recommendation/user/${userId}`);
      console.log(`[aiService] GET /apis/recommendation/user/${userId} raw response:`, data);

      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.content)) return data.content;
      return [];
    } catch (err) {
      console.warn(`[aiService] Failed to fetch recommendations for user ${userId}:`, err);

      // Demo mode fallback: return mock recommendations when backend is down
      if (useDemoStore.getState().isDemoMode) {
        console.log("[aiService] Backend offline — returning demo recommendations");
        return DEMO_RECOMMENDATIONS;
      }

      return [];
    }
  },

  /** GET /apis/recommendation/activity/{activityId} */
  getActivityRecommendation: async (activityId: string): Promise<Recommendation> => {
    console.log(`[aiService] GET /apis/recommendation/activity/${activityId}`);
    try {
      const { data } = await api.get<Recommendation>(
        `/apis/recommendation/activity/${activityId}`
      );
      return data;
    } catch (error) {
      // Demo mode fallback
      if (useDemoStore.getState().isDemoMode) {
        console.log("[aiService] Backend offline — returning demo recommendation");
        const match = DEMO_RECOMMENDATIONS.find((r) => r.activityId === activityId);
        return match || DEMO_RECOMMENDATIONS[0];
      }
      throw error;
    }
  },
};
