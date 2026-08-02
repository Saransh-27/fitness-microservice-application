import { Sparkles } from "lucide-react";
import { FitPulseLogo } from "@/components/common/FitPulseLogo";

export function LoadingScreen({ message = "Initializing Fitness Telemetry Engine..." }: { message?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <FitPulseLogo className="w-16 h-16 rounded-2xl shadow-2xl shadow-[#D8FC00]/20 animate-bounce" />
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            FitPulse OS <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
          </h3>
          <p className="text-xs text-muted-foreground mt-1 animate-pulse font-mono">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
