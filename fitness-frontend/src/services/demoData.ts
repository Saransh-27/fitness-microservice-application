/**
 * Demo Data — Realistic mock data for portfolio demo mode.
 *
 * All dates are generated relative to Date.now() so the demo always looks fresh.
 * These are only used when the backend is NOT running AND demo mode is active.
 */

import type { UserResponse, ActivityResponse, Recommendation } from "../types";
import { ActivityType, UserRole } from "../types";

// ============================================================
// Demo User
// ============================================================

export const DEMO_USER: UserResponse = {
  id: "d3m0-u53r-4a7b-9c2e-f1a8b3d5e7c9",
  keycloakId: "d3m0-u53r-4a7b-9c2e-f1a8b3d5e7c9",
  username: "alex.demo",
  email: "alex@fitpulse.demo",
  frontname: "Alex",
  lastname: "Rivera",
  password: "",
  role: UserRole.USER,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================
// Demo Activities (12 diverse workouts across last 7 days)
// ============================================================

function daysAgo(days: number, hoursOffset = 0): string {
  return new Date(
    Date.now() - days * 24 * 60 * 60 * 1000 + hoursOffset * 60 * 60 * 1000
  ).toISOString();
}

export const DEMO_ACTIVITIES: ActivityResponse[] = [
  {
    id: "act-001-a1b2c3d4e5f6",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.RUNNING,
    duration: 45,
    caloriesBurned: 520,
    startTime: daysAgo(0, -2),
    additionalMatrics: { avgHeartRate: 152, avgPace: "5:30 min/km", distance: "8.2 km" },
    createdAt: daysAgo(0, -2),
    updatedAt: daysAgo(0, -2),
  },
  {
    id: "act-002-b2c3d4e5f6a1",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.YOGA,
    duration: 60,
    caloriesBurned: 180,
    startTime: daysAgo(0, -6),
    additionalMatrics: { style: "Vinyasa Flow", flexibility: "Improved" },
    createdAt: daysAgo(0, -6),
    updatedAt: daysAgo(0, -6),
  },
  {
    id: "act-003-c3d4e5f6a1b2",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.CYCLING,
    duration: 55,
    caloriesBurned: 640,
    startTime: daysAgo(1, -3),
    additionalMatrics: { distance: "22.5 km", avgSpeed: "24.5 km/h", elevationGain: "340m" },
    createdAt: daysAgo(1, -3),
    updatedAt: daysAgo(1, -3),
  },
  {
    id: "act-004-d4e5f6a1b2c3",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.SWIMMING,
    duration: 40,
    caloriesBurned: 450,
    startTime: daysAgo(1, -7),
    additionalMatrics: { laps: 32, strokeType: "Freestyle", poolLength: "25m" },
    createdAt: daysAgo(1, -7),
    updatedAt: daysAgo(1, -7),
  },
  {
    id: "act-005-e5f6a1b2c3d4",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.CARDIO,
    duration: 30,
    caloriesBurned: 380,
    startTime: daysAgo(2, -4),
    additionalMatrics: { exercises: "Jump rope, Burpees, Box jumps", avgHeartRate: 165 },
    createdAt: daysAgo(2, -4),
    updatedAt: daysAgo(2, -4),
  },
  {
    id: "act-006-f6a1b2c3d4e5",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.HIKING,
    duration: 120,
    caloriesBurned: 780,
    startTime: daysAgo(3, -5),
    additionalMatrics: { trail: "Mountain Ridge Trail", elevation: "850m", distance: "14.2 km" },
    createdAt: daysAgo(3, -5),
    updatedAt: daysAgo(3, -5),
  },
  {
    id: "act-007-a7b8c9d0e1f2",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.RUNNING,
    duration: 30,
    caloriesBurned: 350,
    startTime: daysAgo(3, -1),
    additionalMatrics: { avgPace: "5:15 min/km", distance: "5.7 km", notes: "Tempo run" },
    createdAt: daysAgo(3, -1),
    updatedAt: daysAgo(3, -1),
  },
  {
    id: "act-008-b8c9d0e1f2a7",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.WALKING,
    duration: 45,
    caloriesBurned: 160,
    startTime: daysAgo(4, -8),
    additionalMatrics: { steps: 5800, terrain: "Urban park" },
    createdAt: daysAgo(4, -8),
    updatedAt: daysAgo(4, -8),
  },
  {
    id: "act-009-c9d0e1f2a7b8",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.JOGGING,
    duration: 35,
    caloriesBurned: 310,
    startTime: daysAgo(5, -3),
    additionalMatrics: { avgPace: "6:45 min/km", distance: "5.2 km" },
    createdAt: daysAgo(5, -3),
    updatedAt: daysAgo(5, -3),
  },
  {
    id: "act-010-d0e1f2a7b8c9",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.CYCLING,
    duration: 70,
    caloriesBurned: 720,
    startTime: daysAgo(5, -6),
    additionalMatrics: { distance: "35 km", avgSpeed: "30 km/h", type: "Road cycling" },
    createdAt: daysAgo(5, -6),
    updatedAt: daysAgo(5, -6),
  },
  {
    id: "act-011-e1f2a7b8c9d0",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.YOGA,
    duration: 50,
    caloriesBurned: 150,
    startTime: daysAgo(6, -5),
    additionalMatrics: { style: "Hatha", focus: "Flexibility & breathing" },
    createdAt: daysAgo(6, -5),
    updatedAt: daysAgo(6, -5),
  },
  {
    id: "act-012-f2a7b8c9d0e1",
    userid: DEMO_USER.keycloakId,
    type: ActivityType.STREAKING,
    duration: 25,
    caloriesBurned: 290,
    startTime: daysAgo(6, -1),
    additionalMatrics: { sprints: 8, restInterval: "60s", avgSprintSpeed: "28 km/h" },
    createdAt: daysAgo(6, -1),
    updatedAt: daysAgo(6, -1),
  },
];

// ============================================================
// Demo AI Recommendations (3 detailed recommendations)
// ============================================================

export const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-001-x1y2z3w4v5u6",
    activityId: "act-001-a1b2c3d4e5f6",
    userId: DEMO_USER.keycloakId,
    activityType: "RUNNING",
    recommendation:
      "1. OverAll : Your 45-minute run showed excellent cardiovascular endurance with a steady pace of 5:30 min/km. Heart rate remained in the optimal aerobic zone throughout the session. 2. Pace Analysis : Your pacing strategy is consistent and well-controlled. Consider incorporating negative splits — running the second half slightly faster — to build race-day performance. 3. Recovery : Post-run recovery is critical. Implement 10-15 minutes of dynamic stretching focusing on hip flexors, hamstrings, and calves to prevent tightness and injury. 4. Hydration : Based on your session duration and estimated sweat rate, aim for 500-700ml of water within 30 minutes post-workout, supplemented with electrolytes if outdoor temperature exceeds 25°C.",
    improvements: [
      "Incorporate interval training once per week (e.g., 400m repeats) to boost VO2 max",
      "Add strength training for legs (squats, lunges) 2x per week to improve running economy",
      "Track cadence — target 170-180 steps per minute for optimal efficiency",
    ],
    suggestions: [
      "Try a long slow distance (LSD) run of 12-15 km on weekends for endurance building",
      "Use a foam roller for 5-10 minutes post-run targeting IT band and quadriceps",
      "Consider periodization — alternate high-intensity and recovery weeks",
    ],
    safety: [
      "Monitor resting heart rate each morning — a spike of 10+ bpm may indicate overtraining",
      "Replace running shoes every 500-800 km to prevent joint stress",
      "Avoid running on consecutive days without adequate recovery if experiencing knee discomfort",
    ],
    createdAt: daysAgo(0, -1),
  },
  {
    id: "rec-002-y2z3w4v5u6x1",
    activityId: "act-003-c3d4e5f6a1b2",
    userId: DEMO_USER.keycloakId,
    activityType: "CYCLING",
    recommendation:
      "1. Performance Summary : Your 55-minute cycling session covered 22.5 km at an excellent average speed of 24.5 km/h with 340m of elevation gain. This indicates strong aerobic fitness and climbing ability. 2. Power Efficiency : Your calorie burn of 640 kcal suggests you maintained a high power output throughout. Focus on maintaining a consistent cadence of 80-90 RPM to optimize pedaling efficiency. 3. Hill Training : The elevation gain shows good hill climbing effort. Progressive overload — gradually increasing weekly elevation totals by 10% — will improve your climbing threshold.",
    improvements: [
      "Practice high-cadence spinning (100+ RPM) on flat terrain to improve neuromuscular efficiency",
      "Incorporate 2x20 minute threshold intervals at 85-90% max heart rate",
      "Work on cornering technique and bike handling during descent sections",
    ],
    suggestions: [
      "Join a group ride once per week for drafting practice and social motivation",
      "Consider bike fitting adjustments — proper saddle height reduces knee strain by up to 30%",
      "Track power output with a power meter for data-driven training zones",
    ],
    safety: [
      "Always perform a pre-ride bike check: tire pressure, brakes, and chain lubrication",
      "Use high-visibility clothing and front/rear lights even during daytime rides",
      "Maintain adequate nutrition during rides exceeding 60 minutes — 30-60g carbs per hour",
    ],
    createdAt: daysAgo(1, -2),
  },
  {
    id: "rec-003-z3w4v5u6x1y2",
    activityId: "act-002-b2c3d4e5f6a1",
    userId: DEMO_USER.keycloakId,
    activityType: "YOGA",
    recommendation:
      "1. Mind-Body Connection : Your 60-minute Vinyasa Flow session demonstrates commitment to holistic fitness. Yoga complements high-intensity training by improving flexibility, reducing cortisol, and enhancing recovery. 2. Flexibility Progress : Regular yoga practice 2-3 times per week can improve joint range of motion by 15-20% within 8 weeks. Focus on hip-opening poses and spinal twists for running and cycling benefits. 3. Breathing Technique : Incorporate pranayama (controlled breathing) exercises — 5 minutes of box breathing (4-4-4-4 pattern) before starting can deepen your practice and reduce anxiety.",
    improvements: [
      "Progress to advanced poses like Crow Pose and Wheel Pose as core strength improves",
      "Add yin yoga sessions (longer holds of 3-5 minutes) for deep tissue and fascia release",
      "Practice balance poses like Tree and Warrior III to improve proprioception for all sports",
    ],
    suggestions: [
      "Schedule yoga on rest days from cardio to maximize recovery benefits",
      "Use a yoga block and strap to safely deepen stretches without risking injury",
      "Try a guided meditation app for 10 minutes post-session to enhance mindfulness gains",
    ],
    safety: [
      "Never force a stretch beyond your comfort zone — listen to your body's signals",
      "Warm up with Sun Salutations before attempting deep stretches",
      "If you have lower back issues, modify forward folds with bent knees",
    ],
    createdAt: daysAgo(0, -5),
  },
];
