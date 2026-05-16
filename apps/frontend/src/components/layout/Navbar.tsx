"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import AuthModal from "@/components/auth/AuthModal";
import { 
  User, LogOut, ChevronDown, Zap, Menu, X, 
  Sun, Moon, LayoutDashboard, History, Settings 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: "login" | "register" }>({ open: false, mode: "login" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch for theme
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Zap className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">
                LeetSolver<span className="text-primary">.ai</span>
              </span>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              </button>

              {!_hasHydrated ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
              ) : isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-border bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                        <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => setAuthModal({ open: true, mode: "login" })} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                    Sign In
                  </button>
                  <Button onClick={() => setAuthModal({ open: true, mode: "register" })} className="rounded-full px-6 h-9 text-sm font-bold shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground">
                {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-lg animate-in slide-in-from-right duration-300">
            <div className="p-6 flex flex-col gap-6">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium">
                      <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                    </Link>
                    <Link href="/dashboard/history" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium">
                      <History className="h-5 w-5 text-primary" /> Solve History
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium">
                      <Settings className="h-5 w-5 text-primary" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/5 text-destructive font-medium">
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </nav>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Button onClick={() => { setAuthModal({ open: true, mode: "register" }); setMobileMenuOpen(false); }} className="w-full h-12 rounded-xl text-base font-bold">
                    Get Started Free
                  </Button>
                  <Button variant="outline" onClick={() => { setAuthModal({ open: true, mode: "login" }); setMobileMenuOpen(false); }} className="w-full h-12 rounded-xl text-base font-medium">
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
        initialMode={authModal.mode} 
      />
      <div className="h-16" />
    </>
  );
}
