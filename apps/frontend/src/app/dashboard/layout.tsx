"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  LayoutDashboard, History, BarChart2, Settings, LogOut,
  Zap, ChevronRight
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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground font-sans">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-border bg-card/50 flex flex-col md:sticky md:top-16 md:h-[calc(100vh-4rem)] shrink-0">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-3 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border space-y-1">
            <div className="px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-primary">Pro Trial</p>
                <p className="text-xs text-muted-foreground">14 days left</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
