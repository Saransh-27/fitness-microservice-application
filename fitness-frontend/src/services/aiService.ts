import api from "./api";
import type { Recommendation } from "../types";

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
      return [];
    }
  },

  /** GET /apis/recommendation/activity/{activityId} */
  getActivityRecommendation: async (activityId: string): Promise<Recommendation> => {
    console.log(`[aiService] GET /apis/recommendation/activity/${activityId}`);
    const { data } = await api.get<Recommendation>(
      `/apis/recommendation/activity/${activityId}`
    );
    return data;
  },
};
