// ============================================================
// Recommendation Types — maps to backend Recommendation entity
// ============================================================

export interface Recommendation {
  id: string;
  activityId: string;
  userId: string;
  activityType: string;
  recommendation: string;
  improvements: string[];
  suggestions: string[];
  safety: string[];
  createdAt: string;
}
