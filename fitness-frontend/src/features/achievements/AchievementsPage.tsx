import { useState, useEffect } from "react";
import { Award, Zap, Flame, Sparkles, CheckCircle2, ShieldCheck, Trophy, Star, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { activityService } from "@/services/activityService";
import { aiService } from "@/services/aiService";
import { useAuthStore } from "@/store/useAuthStore";
import type { ActivityResponse, Recommendation } from "@/types";

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  category: "Activity" | "Calorie" | "AI Insight" | "Consistency";
}

export function AchievementsPage() {
  const { user, keycloakId } = useAuthStore();
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const actData = await activityService.getAllActivities(0, 50);
        setActivities(actData.content || []);

        const userId = keycloakId || user?.id || "";
        if (userId) {
          const recData = await aiService.getUserRecommendations(userId);
          setRecommendations(recData || []);
        }
      } catch (error) {
        console.error("Error fetching achievements data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [keycloakId, user?.id]);

  const totalCalories = activities.reduce((acc, a) => acc + (a.caloriesBurned || 0), 0);
  const totalWorkouts = activities.length;
  const totalRecommendations = recommendations.length;

  const milestones: Milestone[] = [
    {
      id: "first_workout",
      title: "First Step",
      description: "Log your first workout telemetry in FitPulse OS",
      icon: "🏃",
      unlocked: totalWorkouts >= 1,
      progress: Math.min(100, (totalWorkouts / 1) * 100),
      category: "Activity",
    },
    {
      id: "five_workouts",
      title: "Consistent Athlete",
      description: "Complete 5 workout sessions",
      icon: "⚡",
      unlocked: totalWorkouts >= 5,
      progress: Math.min(100, (totalWorkouts / 5) * 100),
      category: "Consistency",
    },
    {
      id: "twenty_workouts",
      title: "Ironclad Veteran",
      description: "Complete 20 intense workout sessions",
      icon: "🏆",
      unlocked: totalWorkouts >= 20,
      progress: Math.min(100, (totalWorkouts / 20) * 100),
      category: "Consistency",
    },
    {
      id: "calorie_1000",
      title: "Calorie Crusher",
      description: "Burn 1,000 total active calories",
      icon: "🔥",
      unlocked: totalCalories >= 1000,
      progress: Math.min(100, (totalCalories / 1000) * 100),
      category: "Calorie",
    },
    {
      id: "calorie_5000",
      title: "Inferno Mode",
      description: "Burn 5,000 total active calories",
      icon: "💥",
      unlocked: totalCalories >= 5000,
      progress: Math.min(100, (totalCalories / 5000) * 100),
      category: "Calorie",
    },
    {
      id: "calorie_10000",
      title: "10k Calorie Titan",
      description: "Burn 10,000 active calories — Elite Level",
      icon: "🌋",
      unlocked: totalCalories >= 10000,
      progress: Math.min(100, (totalCalories / 10000) * 100),
      category: "Calorie",
    },
    {
      id: "ai_insight_1",
      title: "AI Guided",
      description: "Receive your first AI Health Recommendation",
      icon: "🤖",
      unlocked: totalRecommendations >= 1,
      progress: Math.min(100, (totalRecommendations / 1) * 100),
      category: "AI Insight",
    },
    {
      id: "ai_insight_5",
      title: "Adaptive Mastery",
      description: "Unlock 5 AI-driven health optimization recommendations",
      icon: "✨",
      unlocked: totalRecommendations >= 5,
      progress: Math.min(100, (totalRecommendations / 5) * 100),
      category: "AI Insight",
    },
    {
      id: "ai_insight_10",
      title: "AI Telemetry Master",
      description: "Unlock 10 personalized Gemini AI health insights",
      icon: "🧠",
      unlocked: totalRecommendations >= 10,
      progress: Math.min(100, (totalRecommendations / 10) * 100),
      category: "AI Insight",
    },
  ];

  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-8 font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-[#D8FC00]" /> Achievements & Milestones
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Badges and milestones unlocked dynamically based on your workout telemetry & AI recommendations
        </p>
      </div>

      {/* Overview Stat Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E2BD9] via-[#141A99] to-[#0A0D1A] p-6 border border-[#1E2BD9]/40 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D8FC00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#D8FC00] text-[#05060A] flex items-center justify-center text-3xl font-black shadow-xl shrink-0">
              <Trophy className="w-8 h-8 text-[#05060A]" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                {unlockedCount} of {milestones.length} Milestones Unlocked
              </p>
              <p className="text-xs text-slate-200 mt-0.5 font-medium">
                Keep logging workouts and receiving AI recommendations to level up!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Derived Badges Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D8FC00]" /> AI Health Insights Unlocked ({totalRecommendations})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 bg-[#0B0E17] rounded-3xl" />
            <Skeleton className="h-24 bg-[#0B0E17] rounded-3xl" />
          </div>
        ) : recommendations.length === 0 ? (
          <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
            <CardContent className="py-8 text-center text-slate-400 text-xs">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#D8FC00]" />
              No AI recommendations generated yet. Log a workout to trigger your first AI achievement!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="bg-[#0B0E17] border-[#1E2BD9]/40 rounded-3xl p-4 flex items-start gap-3 relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#1E2BD9] text-[#D8FC00] flex items-center justify-center font-bold text-sm shrink-0 border border-[#1E2BD9]/50">
                  <Star className="w-5 h-5 fill-[#D8FC00]" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#1E2BD9] text-white font-extrabold text-[10px] uppercase">
                      {rec.activityType || "ACTIVITY"}
                    </Badge>
                    <span className="text-[10px] text-[#D8FC00] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> AI Validated
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {rec.recommendation || "AI Telemetry Verified"}
                  </p>
                  {rec.improvements?.[0] && (
                    <p className="text-[11px] text-slate-400 truncate">
                      💡 {rec.improvements[0]}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Main Milestones Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-sky-400" /> Fitness Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((m) => (
            <Card
              key={m.id}
              className={`bg-[#0B0E17] border rounded-3xl p-4 transition-all duration-300 relative overflow-hidden ${
                m.unlocked
                  ? "border-[#D8FC00]/40 shadow-lg shadow-[#D8FC00]/5"
                  : "border-[#1E2436] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-slate-400 border-[#1E2436] mt-0.5">
                      {m.category}
                    </Badge>
                  </div>
                </div>
                {m.unlocked ? (
                  <Badge className="bg-[#D8FC00] text-[#05060A] font-extrabold text-[10px] uppercase">
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-[#121624] text-slate-500 text-[10px] font-bold">
                    Locked
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-3">{m.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Progress</span>
                  <span className={m.unlocked ? "text-[#D8FC00]" : ""}>{Math.round(m.progress)}%</span>
                </div>
                <div className="h-2 w-full bg-[#121624] rounded-full overflow-hidden border border-[#1E2436]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.unlocked ? "bg-[#D8FC00]" : "bg-[#1E2BD9]"
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
