import { Dumbbell, Sparkles } from "lucide-react";

export function LoadingScreen({ message = "Initializing Fitness Telemetry Engine..." }: { message?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 animate-bounce">
          <Dumbbell className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            FitPulse SaaS <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
          </h3>
          <p className="text-xs text-muted-foreground mt-1 animate-pulse font-mono">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
