import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DemoBanner } from "@/components/common/DemoBanner";
import { X } from "lucide-react";

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-purple-500/20 selection:text-purple-600">
      {/* Demo Mode Banner — shown at the very top when active */}
      <DemoBanner />

      <div className="flex flex-1">
        {/* Desktop Permanent Sidebar */}
        <Sidebar className="hidden md:flex shrink-0" />

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 max-w-[80vw] h-full bg-background border-r border-border shadow-2xl">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar className="w-full h-full border-none" />
            </div>
          </div>
        )}

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
