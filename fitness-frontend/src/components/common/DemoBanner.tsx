import { useNavigate } from "react-router-dom";
import { useDemoStore } from "@/store/useDemoStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_REPO_URL = "https://github.com/Saransh-27/fitness-microservice-application";

export function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useDemoStore();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const handleExitDemo = () => {
    exitDemoMode();
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="relative z-40 w-full bg-gradient-to-r from-[#D8FC00]/15 via-[#1E2BD9]/20 to-[#D8FC00]/15 border-b border-[#D8FC00]/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D8FC00] text-[#05060A] shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Demo Mode</span>
          </div>
          <p className="text-xs text-slate-300 font-medium truncate">
            Viewing with sample data — backend microservices are offline.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121624] border border-[#1E2436] text-xs font-bold text-slate-300 hover:text-white hover:border-[#1E2BD9] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D8FC00]" />
            View Source Code
          </a>
          <Button
            onClick={handleExitDemo}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-[#121624] rounded-xl gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Exit Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
