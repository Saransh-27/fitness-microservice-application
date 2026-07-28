import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  RefreshCw,
  Flame,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { aiService } from "@/services/aiService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Recommendation } from "@/types";
import { parseRecommendationPoints } from "@/lib/recommendationParser";

export function AIAssistantPage() {
  const { user, keycloakId } = useAuthStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const primaryId = keycloakId || user?.id || user?.username || "";
      if (primaryId) {
        let data = await aiService.getUserRecommendations(primaryId);
        
        // Fallback 1: try user.id if keycloakId returned 0 items
        if ((!data || data.length === 0) && user?.id && user.id !== primaryId) {
          console.log("[AIAssistantPage] Fallback fetch by user.id:", user.id);
          const fallbackData = await aiService.getUserRecommendations(user.id);
          if (fallbackData && fallbackData.length > 0) data = fallbackData;
        }

        // Fallback 2: try username if user.id returned 0 items
        if ((!data || data.length === 0) && user?.username && user.username !== primaryId) {
          console.log("[AIAssistantPage] Fallback fetch by username:", user.username);
          const fallbackData = await aiService.getUserRecommendations(user.username);
          if (fallbackData && fallbackData.length > 0) data = fallbackData;
        }

        // Sort most recent first
        const sorted = (data || []).sort((a: Recommendation, b: Recommendation) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
        setRecommendations(sorted);
      }
    } catch (error) {
      console.error("Failed to load AI recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [keycloakId, user?.id]);

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <Bot className="w-7 h-7 text-[#D8FC00]" /> AI Health Recommendations
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            AI-generated insights from your logged workouts — powered by Google Gemini
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          disabled={loading}
          className="gap-2 border-[#1E2BD9] text-white hover:bg-[#1E2BD9] rounded-2xl h-10 font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D8FC00] ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Banner */}
      {!loading && recommendations.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E2BD9] via-[#141A99] to-[#0A0D1A] p-5 border border-[#1E2BD9]/40 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D8FC00]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D8FC00] text-[#05060A] flex items-center justify-center shadow-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans']">
                {recommendations.length} AI Recommendation{recommendations.length !== 1 ? "s" : ""} Generated
              </p>
              <p className="text-sm text-slate-300 font-medium">
                Each recommendation is automatically triggered after you log a workout via RabbitMQ async pipeline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#0B0E17] border-[#1E2436] rounded-3xl p-2">
              <CardContent className="pt-4 space-y-3">
                <Skeleton className="h-5 w-40 bg-[#1E2436]" />
                <Skeleton className="h-16 w-full bg-[#1E2436]" />
                <Skeleton className="h-10 w-full bg-[#1E2436]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
          <CardContent className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#1E2BD9]/20 text-[#D8FC00] border border-[#1E2BD9]/40 flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <p className="font-extrabold text-white text-lg">No AI Recommendations Yet</p>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                Log a workout in the Activity Log page. The AI recommendation engine will automatically analyze your activity and generate personalized insights.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card
              key={rec.id}
              className="bg-[#0B0E17] border-[#1E2436] rounded-3xl hover:border-[#1E2BD9]/50 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Timeline Number */}
                    <div className="w-9 h-9 rounded-2xl bg-[#1E2BD9] text-[#D8FC00] border border-[#1E2BD9]/50 flex items-center justify-center font-black text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                        <Badge className="bg-[#1E2BD9] text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1">
                          {rec.activityType || "ACTIVITY"}
                        </Badge>
                      </CardTitle>
                      {rec.createdAt && (
                        <CardDescription className="text-xs text-slate-500 mt-0.5 font-mono">
                          {new Date(rec.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
                    #{rec.id?.slice(-8).toUpperCase()}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Main Recommendation Parsed Points */}
                <div className="space-y-2.5">
                  {parseRecommendationPoints(rec.recommendation).map((pt, ptIdx) => (
                    <div
                      key={pt.id || ptIdx}
                      className="p-4 rounded-2xl bg-[#05060A] border border-[#1E2BD9]/40 space-y-1.5 shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#1E2BD9] text-[#D8FC00] font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D8FC00]" />
                          {pt.num ? `${pt.num}. ${pt.title}` : pt.title}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 font-medium leading-relaxed pt-1">
                        {pt.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Key Improvements */}
                  {rec.improvements?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-2.5">
                      <p className="font-extrabold text-[#D8FC00] text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Zap className="w-4 h-4 fill-[#D8FC00]" /> Key Improvements
                      </p>
                      <ul className="space-y-2">
                        {rec.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-[#D8FC00] shrink-0 mt-0.5" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safety Protocol */}
                  {rec.safety?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-2.5">
                      <p className="font-extrabold text-sky-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-sky-400" /> Safety Protocol
                      </p>
                      <ul className="space-y-2">
                        {rec.safety.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium leading-relaxed">
                            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Suggestions */}
                  {rec.suggestions?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-2.5">
                      <p className="font-extrabold text-orange-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-orange-400" /> Actionable Suggestions
                      </p>
                      <ul className="space-y-2">
                        {rec.suggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium leading-relaxed">
                            <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
