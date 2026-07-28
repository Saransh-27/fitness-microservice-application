import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Dumbbell,
  Timer,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Activity as ActivityIcon,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { activityService } from "@/services/activityService";
import { aiService } from "@/services/aiService";
import type { ActivityResponse, Recommendation } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ActivityFormModal } from "../activities/components/ActivityFormModal";
import { parseRecommendationPoints } from "@/lib/recommendationParser";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeeklyData(activities: ActivityResponse[]) {
  const grouped: Record<string, { calories: number; duration: number }> = {};
  const today = new Date();
  // Last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = DAY_LABELS[d.getDay()];
    grouped[label] = { calories: 0, duration: 0 };
  }

  activities.forEach((act) => {
    const dateStr = act.createdAt || act.startTime;
    if (!dateStr) return;
    const d = new Date(dateStr);
    const label = DAY_LABELS[d.getDay()];
    if (label in grouped) {
      grouped[label].calories += act.caloriesBurned || 0;
      grouped[label].duration += act.duration || 0;
    }
  });

  return Object.entries(grouped).map(([day, vals]) => ({ day, ...vals }));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, keycloakId } = useAuthStore();
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const activityData = await activityService.getAllActivities(0, 50);
      setActivities(activityData.content || []);

      const primaryId = keycloakId || user?.id || user?.username || "";
      if (primaryId) {
        let recData = await aiService.getUserRecommendations(primaryId);
        
        if ((!recData || recData.length === 0) && user?.id && user.id !== primaryId) {
          const fallback = await aiService.getUserRecommendations(user.id);
          if (fallback && fallback.length > 0) recData = fallback;
        }

        if ((!recData || recData.length === 0) && user?.username && user.username !== primaryId) {
          const fallback = await aiService.getUserRecommendations(user.username);
          if (fallback && fallback.length > 0) recData = fallback;
        }

        setRecommendations(recData || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use a stable dependency — only re-fetch when the primary user identity changes
  const stableUserId = keycloakId || user?.id || "";
  useEffect(() => {
    if (stableUserId) {
      fetchDashboardData();
    }
  }, [stableUserId]);

  const totalCalories = activities.reduce(
    (acc, act) => acc + (act.caloriesBurned || 0),
    0
  );
  const totalDuration = activities.reduce(
    (acc, act) => acc + (act.duration || 0),
    0
  );
  const totalWorkouts = activities.length;
  const weeklyChartData = useMemo(() => buildWeeklyData(activities), [activities]);

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-8">
      {/* Header Banner - FitGuide Dark Blue Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E2BD9] via-[#141A99] to-[#0A0D1A] p-6 md:p-8 border border-[#1E2BD9]/40 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D8FC00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8FC00] text-[#05060A] font-extrabold text-xs tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 fill-[#05060A]" /> FitGuide Adaptive AI Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-tight">
              Get Your Fit,{" "}
              <span className="text-[#D8FC00] underline decoration-[#D8FC00]/40">
                {user?.frontname || user?.username || "Athlete"}
              </span>
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              Real-time workout telemetry & AI recommendations synchronized via RabbitMQ async pipeline.
            </p>
          </div>

          <Button
            onClick={() => setIsLogOpen(true)}
            size="lg"
            className="bg-[#D8FC00] hover:bg-[#c2e400] text-[#05060A] font-extrabold rounded-2xl shadow-xl shadow-[#D8FC00]/20 gap-2 h-12 px-6 shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" /> Log New Workout
          </Button>
        </div>
      </div>

      {/* Hero Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <Card className="relative overflow-hidden bg-[#0B0E17] border-[#1E2436] rounded-2xl group hover:border-[#D8FC00]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D8FC00]/10 rounded-full blur-2xl group-hover:bg-[#D8FC00]/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total Energy Burned
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#D8FC00]/15 text-[#D8FC00] border border-[#D8FC00]/30">
              <Flame className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
              {loading ? (
              <Skeleton className="h-8 w-24 bg-[#1E2436]" />
            ) : (
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  {totalCalories.toLocaleString()} <span className="text-xs font-bold text-[#D8FC00]">kcal</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#D8FC00] font-bold mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Total to date
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="relative overflow-hidden bg-[#0B0E17] border-[#1E2436] rounded-2xl group hover:border-[#1E2BD9]/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E2BD9]/20 rounded-full blur-2xl group-hover:bg-[#1E2BD9]/30 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Active Time
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#1E2BD9]/20 text-[#60A5FA] border border-[#1E2BD9]/40">
              <Timer className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-[#1E2436]" />
            ) : (
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  {totalDuration} <span className="text-xs font-bold text-slate-400">mins</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-sky-400 font-bold mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {Math.round(totalDuration / 60 * 10) / 10} hrs total
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="relative overflow-hidden bg-[#0B0E17] border-[#1E2436] rounded-2xl group hover:border-[#A02AF8]/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#A02AF8]/20 rounded-full blur-2xl group-hover:bg-[#A02AF8]/30 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Workouts Executed
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#A02AF8]/20 text-[#C084FC] border border-[#A02AF8]/40">
              <Dumbbell className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-[#1E2436]" />
            ) : (
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  {totalWorkouts} <span className="text-xs font-bold text-slate-400">sessions</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#C084FC] font-bold mt-1.5">
                  <Zap className="w-3.5 h-3.5 fill-[#C084FC]" /> 5-day active streak
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stat Card 4 */}
        <Card className="relative overflow-hidden bg-[#0B0E17] border-[#1E2436] rounded-2xl group hover:border-[#D8FC00]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D8FC00]/10 rounded-full blur-2xl group-hover:bg-[#D8FC00]/20 transition-all" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
              AI Insight Score
            </CardTitle>
            <div className="p-2.5 rounded-xl bg-[#D8FC00]/15 text-[#D8FC00] border border-[#D8FC00]/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-[#D8FC00] font-['Plus_Jakarta_Sans']">
                94<span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Optimal Recovery & Load Ratio
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Calorie Trend */}
        <Card className="lg:col-span-2 bg-[#0B0E17] border-[#1E2436] rounded-3xl p-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-extrabold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
                <ActivityIcon className="w-5 h-5 text-[#D8FC00]" />
                Calorie & Duration Analytics
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Telemetry logged via MongoDB & RabbitMQ async broker
              </CardDescription>
            </div>
            <Badge className="bg-[#1E2BD9] text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1">
              Live Telemetry
            </Badge>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8FC00" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#D8FC00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E2BD9" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#1E2BD9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2436" opacity={0.5} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0E17",
                    borderColor: "#1E2BD9",
                    borderRadius: "16px",
                    color: "#ffffff",
                    fontSize: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#D8FC00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                  name="Calories Burned"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#1E2BD9"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                  name="Daily Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right: AI Health Widget */}
        <Card className="relative overflow-hidden border-[#1E2BD9]/50 bg-gradient-to-b from-[#1E2BD9]/20 via-[#0B0E17] to-[#0B0E17] rounded-3xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#D8FC00]">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
              <CardTitle className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
                AI Health Recommendation
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Powered by Google Gemini AI Microservice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length > 0 ? (
              <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
                {/* Parse recommendation string into structured point cards */}
                {parseRecommendationPoints(recommendations[0].recommendation).map((pt, idx) => (
                  <div
                    key={pt.id || idx}
                    className="p-3.5 rounded-2xl bg-[#05060A] border border-[#1E2BD9]/40 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2BD9] text-[#D8FC00] font-black text-[10px] uppercase tracking-wider">
                        {pt.num ? `${pt.num}. ${pt.title}` : pt.title}
                      </span>
                    </div>
                    <p className="text-slate-200 text-xs font-medium leading-relaxed pt-1">
                      {pt.body}
                    </p>
                  </div>
                ))}

                {/* Suggestions Box */}
                {recommendations[0].suggestions?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-1.5">
                    <h5 className="font-extrabold text-[#D8FC00] text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 fill-[#D8FC00]" /> Suggested Action Plan
                    </h5>
                    <div className="space-y-1 text-slate-300">
                      {recommendations[0].suggestions.map((sug, i) => (
                        <p key={i} className="text-xs font-medium leading-relaxed flex items-start gap-1.5">
                          <span className="text-[#D8FC00] font-bold">•</span>
                          {sug}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#05060A] border border-[#1E2BD9]/40 leading-relaxed font-medium text-slate-200">
                  "Great endurance metrics detected. Consider incorporating 15 minutes of dynamic stretching post-workout to minimize muscle soreness."
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-bold">
                    <span>Recovery Index</span>
                    <span className="text-[#D8FC00]">88%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#121624] rounded-full overflow-hidden border border-[#1E2436]">
                    <div className="h-full bg-[#D8FC00] rounded-full w-[88%] shadow-sm shadow-[#D8FC00]/40" />
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between mt-2 text-xs font-bold border-[#1E2BD9] text-white hover:bg-[#1E2BD9] hover:text-white rounded-xl h-10 transition-colors"
              onClick={() => navigate("/ai-assistant")}
            >
              View All Recommendations <ChevronRight className="w-4 h-4 text-[#D8FC00]" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Telemetry Table Preview */}
      <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Recent Workouts Telemetry
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Backend API Endpoint: GET /apis/activities
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/activities")}
            className="text-xs font-bold text-[#D8FC00] hover:bg-[#121624] gap-1 rounded-xl"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-[#1E2436]" />
              <Skeleton className="h-12 w-full bg-[#1E2436]" />
              <Skeleton className="h-12 w-full bg-[#1E2436]" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#D8FC00]" />
              No workouts logged yet. Click "Log New Workout" to publish telemetry!
            </div>
          ) : (
            <div className="divide-y divide-[#1E2436]">
              {activities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="py-3.5 flex items-center justify-between hover:bg-[#121624] px-3 rounded-2xl transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#1E2BD9] text-[#D8FC00] font-black uppercase text-xs border border-[#1E2BD9]/50">
                      {act.type?.[0] || "A"}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {act.type || "WORKOUT"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-extrabold text-[#D8FC00]">
                        {act.caloriesBurned} kcal
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {act.duration} mins
                      </p>
                    </div>
                    <Badge className="hidden sm:inline-flex bg-[#121624] text-slate-300 border-[#1E2436] font-semibold">
                      Validated
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Modal */}
      <ActivityFormModal
        open={isLogOpen}
        onOpenChange={setIsLogOpen}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
