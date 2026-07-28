import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, User as UserIcon, LogOut, Shield, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useKeycloak } from "@/context/KeycloakContext";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useKeycloak();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-[#1E2436]/60 bg-[#05060A]/90 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Mobile Menu Button + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#121624] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search workouts, AI recommendations..."
            className="pl-9 pr-4 h-9 text-xs rounded-full bg-[#0F121C] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] focus-visible:border-[#D8FC00]"
          />
        </div>
      </div>

      {/* Right Controls: Clickable User Profile Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="p-1 rounded-full hover:bg-[#121624] transition-colors group border border-transparent hover:border-[#1E2436]"
          aria-label="User menu"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E2BD9] text-[#D8FC00] border border-[#D8FC00]/40 flex items-center justify-center font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            {user?.role === "ADMIN" ? (
              <Shield className="w-4.5 h-4.5 text-[#D8FC00]" />
            ) : (
              <UserIcon className="w-4.5 h-4.5 text-[#D8FC00]" />
            )}
          </div>
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#1E2436] bg-[#0B0E17]/95 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 space-y-1">
            <div className="px-3 py-2 border-b border-[#1E2436]">
              <p className="text-xs font-extrabold text-white">
                {user?.frontname ? `${user.frontname} ${user.lastname || ""}` : user?.username || "Athlete"}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || "user@fitness.com"}</p>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate("/profile");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#121624] transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#D8FC00]" /> User Profile
            </button>

            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate("/settings");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#121624] transition-colors"
            >
              <Settings className="w-4 h-4 text-sky-400" /> Account Settings
            </button>

            <div className="pt-1 border-t border-[#1E2436]">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
