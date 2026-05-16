"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import AuthModal from "@/components/auth/AuthModal";
import {
  User, LogOut, ChevronDown, Zap, Menu, X,
  Sun, Moon, Palette, LayoutDashboard, History, Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const themes = [
  { name: "light", icon: Sun, color: "bg-white" },
  { name: "dark", icon: Moon, color: "bg-slate-900" },
  { name: "blue", icon: Palette, color: "bg-blue-600" },
  { name: "yellow", icon: Palette, color: "bg-yellow-500" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: "login" | "register" }>({ open: false, mode: "login" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Close mobile menu when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Check if the click was NOT on the toggle button
        const toggleBtn = document.getElementById("mobile-toggle");
        if (toggleBtn && !toggleBtn.contains(event.target as Node)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] border-b border-border bg-background/80 backdrop-blur-md h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">
                LeetSolver<span className="text-primary">.ai</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Desktop Theme Switcher */}
              <div className="hidden md:block relative">
                <button onClick={() => setShowThemeMenu(!showThemeMenu)} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><Palette className="h-5 w-5" /></button>
                {showThemeMenu && (
                  <div className="absolute right-0 mt-2 p-2 bg-card border border-border rounded-xl shadow-xl flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                    {themes.map((t) => (
                      <button key={t.name} onClick={() => { setTheme(t.name); setShowThemeMenu(false); }}
                        className={`h-8 w-8 rounded-full border-2 ${t.color} ${mounted && theme === t.name ? "border-primary shadow-md" : "border-transparent"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-4">
                {!_hasHydrated ? <div className="h-8 w-24 bg-muted animate-pulse rounded-full" /> : isAuthenticated ? (
                  <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors shadow-sm">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
                      <span className="text-sm font-semibold text-foreground">{user?.name?.split(" ")[0]}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"><LayoutDashboard className="h-3.5 w-3.5 text-primary" /> Dashboard</Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"><LogOut className="h-3.5 w-3.5" /> Sign Out</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAuthModal({ open: true, mode: "login" })} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">Sign In</button>
                    <Button onClick={() => setAuthModal({ open: true, mode: "register" })} className="rounded-full px-6 h-9 text-sm font-bold shadow-lg shadow-primary/20">Get Started</Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground relative z-[110]"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Improved Mobile Dropdown (Below Navbar) */}
        {mobileMenuOpen && (
          <>
            {/* Background Overlay - To catch clicks anywhere else */}
            <div className="md:hidden fixed inset-0 z-[80]" onClick={() => setMobileMenuOpen(false)} />

            {/* Dropdown Content */}
            <div
  ref={mobileMenuRef}
  className="
    md:hidden
    absolute
    top-16
    left-0
    w-full
    z-[90]
    bg-background/95
    backdrop-blur-md
    border-b
    border-border
    shadow-2xl
    animate-in
    slide-in-from-right
    duration-300
    overflow-hidden
  "
>
              <div className="p-6 flex flex-col gap-6">
                {/* Mobile Theme Toggle */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select Theme</p>
                  <div className="flex gap-4">
                    {themes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className={`h-10 w-10 rounded-full border-2 ${t.color} ${mounted && theme === t.name ? "border-primary shadow-lg scale-110" : "border-border shadow-sm"} transition-all`}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border w-full" />

                {isAuthenticated ? (
                  <nav className="flex flex-col gap-1">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium transition-colors"><LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard</Link>
                    <Link href="/dashboard/history" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium transition-colors"><History className="h-5 w-5 text-primary" /> Solve History</Link>
                    <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium transition-colors"><Settings className="h-5 w-5 text-primary" /> Settings</Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/5 text-destructive font-medium transition-colors"><LogOut className="h-5 w-5" /> Sign Out</button>
                  </nav>
                ) : (
                  <div className="flex flex-col gap-4 pb-4">
                    <Button onClick={() => { setAuthModal({ open: true, mode: "register" }); setMobileMenuOpen(false); }} className="w-full h-12 rounded-xl text-base font-bold shadow-xl shadow-primary/20">Get Started Free</Button>
                    <Button variant="outline" onClick={() => { setAuthModal({ open: true, mode: "login" }); setMobileMenuOpen(false); }} className="w-full h-12 rounded-xl text-base font-medium">Sign In</Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      <AuthModal isOpen={authModal.open} onClose={() => setAuthModal({ ...authModal, open: false })} initialMode={authModal.mode} />
      <div className="h-16" />
    </>
  );
}
