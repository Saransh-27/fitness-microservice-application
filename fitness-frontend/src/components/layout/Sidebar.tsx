import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Bot,
  User,
  Shield,
  Dumbbell,
  Apple,
  TrendingUp,
  Settings,
  LogOut,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useKeycloak } from "@/context/KeycloakContext";
import { ThemeToggle } from "@/theme/theme-toggle";
import { FitPulseLogo } from "@/components/common/FitPulseLogo";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Activity Log",
    href: "/activities",
    icon: Activity,
  },
  {
    title: "AI Recommendations",
    href: "/ai-assistant",
    icon: Bot,
    badge: "AI",
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: Award,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Admin Portal",
    href: "/admin/users",
    icon: Shield,
    adminOnly: true,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  return (
    <aside
      className={cn(
        "flex flex-col justify-between h-screen w-64 border-r border-[#1E2436]/60 bg-[#06080E]/90 backdrop-blur-2xl p-4 sticky top-0 z-30 transition-all duration-300 overflow-y-auto",
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2 py-1">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <FitPulseLogo className="w-10 h-10 rounded-2xl shadow-lg shadow-[#D8FC00]/10" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                FitPulse <span className="text-[#D8FC00]">OS</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5 font-medium">
                Microservice AI Telemetry
              </span>
            </div>
          </Link>
        </div>

        {/* AI Banner Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1E2BD9]/30 via-[#141828] to-[#05060A] border border-[#1E2BD9]/40 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D8FC00]/10 rounded-full blur-xl group-hover:bg-[#D8FC00]/20 transition-all" />
          <div className="flex items-center gap-2 mb-1 text-[#D8FC00] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI Health Engine
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Auto-analyzing workout telemetry via RabbitMQ event pipeline.
          </p>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            Main Menu
          </p>
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#D8FC00] text-[#05060A] font-extrabold shadow-md shadow-[#D8FC00]/20"
                    : "text-slate-300 hover:text-white hover:bg-[#121624] border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                      isActive
                        ? "text-[#05060A]"
                        : "text-slate-400 group-hover:text-[#D8FC00]"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider",
                      isActive
                        ? "bg-[#05060A] text-[#D8FC00]"
                        : "bg-[#1E2BD9] text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-3 border-t border-[#1E2436]/60">
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            Management
          </p>
          {secondaryNavItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-[#D8FC00] text-[#05060A] font-extrabold shadow-md shadow-[#D8FC00]/20"
                    : "text-slate-300 hover:text-white hover:bg-[#121624]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                    isActive
                      ? "text-[#05060A]"
                      : "text-slate-400 group-hover:text-[#D8FC00]"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
