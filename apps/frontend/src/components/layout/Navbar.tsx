"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import AuthModal from "@/components/auth/AuthModal";
import { User, LogOut, ChevronDown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: "login" | "register" }>({ open: false, mode: "login" });
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowDropdown(false);
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

            {/* Actions */}
            <div className="flex items-center gap-4">
              {!_hasHydrated ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
              ) : isAuthenticated ? (
                /* Logged In State */
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-foreground hidden sm:inline-block">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-border bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged Out State */
                <div className="flex items-center gap-2 sm:gap-4">
                  <button 
                    onClick={() => setAuthModal({ open: true, mode: "login" })}
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </button>
                  <Button 
                    onClick={() => setAuthModal({ open: true, mode: "register" })}
                    className="rounded-full px-6 h-9 text-sm font-bold shadow-lg shadow-primary/20"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
        initialMode={authModal.mode} 
      />
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
