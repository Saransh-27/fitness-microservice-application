// ============================================================
// Activity Types — maps to backend ActivityRequestDto, ActivityResponseDto, ActivityType enum
// ============================================================

export enum ActivityType {
  RUNNING = "RUNNING",
  CYCLING = "CYCLING",
  JOGGING = "JOGGING",
  SWIMMING = "SWIMMING",
  WALKING = "WALKING",
  HIKING = "HIKING",
  YOGA = "YOGA",
  CARDIO = "CARDIO",
  STREAKING = "STREAKING",
  OTHER = "OTHER",
}

export interface ActivityRequest {
  userid: string;
  type: ActivityType;
  duration: number;
  caloriesBurned: number;
  startTime: string;
  additionalMatrics?: Record<string, unknown>;
}

export interface ActivityResponse {
  id: string;
  userid: string;
  type: ActivityType;
  duration: number;
  caloriesBurned: number;
  startTime: string;
  additionalMatrics?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** Spring Data Page wrapper for paginated activity results */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
