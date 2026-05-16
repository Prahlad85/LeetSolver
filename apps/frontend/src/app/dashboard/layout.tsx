"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import {
  LayoutDashboard, History, BarChart2, Settings, LogOut,
  Zap, ChevronRight, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "Solve History", icon: History },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground font-sans relative">
        {/* Mobile Toggle Button (Floating) */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-[60] h-12 w-12 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center border border-primary-foreground/20"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-[55] w-64 bg-card border-r border-border transition-transform duration-300 transform
          md:relative md:translate-x-0 md:h-[calc(100vh-4rem)] md:sticky md:top-16
          ${sidebarOpen ? "translate-x-0  mt-16" : "-translate-x-full"}
        `}>
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-70">
                  {user?.id?.slice(-8)}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary/60 group-hover:text-primary"}`} />
                  {label}
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 mt-auto border-t border-border space-y-1">
            <div className="px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <div>
                <p className="text-xs font-black text-primary uppercase">Pro Status</p>
                <p className="text-[10px] text-muted-foreground">Unlimited Access</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
