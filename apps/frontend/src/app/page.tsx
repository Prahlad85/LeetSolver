"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart2, Clock, CheckCircle2, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const features = [
  { icon: Zap, title: "AI-Powered Solutions", desc: "GPT-4o/Gemini generates optimal code with best complexity every single day." },
  { icon: Clock, title: "Runs While You Sleep", desc: "Automation runs at midnight UTC. Wake up to a perfect streak." },
  { icon: Shield, title: "Encrypted & Secure", desc: "Session cookies are encrypted with AES-256. Security is our priority." },
  { icon: BarChart2, title: "Analytics Dashboard", desc: "Track acceptance rates, streaks, and AI accuracy in real-time." },
  { icon: Code2, title: "Multi-Language", desc: "Python, JavaScript, Java, and C++ supported out of the box." },
  { icon: CheckCircle2, title: "Auto-Retry Logic", desc: "If AI fails, it self-corrects based on error context up to 3 times." },
];

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<{ open: boolean, mode: "login" | "register" }>({ open: false, mode: "login" });
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  return (
    <div className="flex flex-col bg-background text-foreground">
      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
        initialMode={authModal.mode} 
      />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Live · 2,400+ problems solved today
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground leading-tight mb-6">
            Solve LeetCode<br />
            <span className="text-primary">on Autopilot.</span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered browser automation that fetches, solves, and submits daily LeetCode problems — even when you're offline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setAuthModal({ open: true, mode: "register" })}
              className="rounded-full px-8 h-12 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setAuthModal({ open: true, mode: "login" })}
              className="rounded-full px-8 h-12 text-base font-medium gap-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all duration-300">
              <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-24 bg-muted/30 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">Simple Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: "Free", price: "$0", features: ["1 problem/day", "Python only", "Basic analytics"], highlight: false },
              { plan: "Pro", price: "$9", features: ["Unlimited solves", "All 4 languages", "Advanced analytics", "GPT-4o Access"], highlight: true },
              { plan: "Enterprise", price: "$29", features: ["Team access", "Custom models", "SLA Support"], highlight: false },
            ].map(({ plan, price, features, highlight }) => (
              <div key={plan} className={`p-6 rounded-2xl border ${highlight ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105" : "bg-card border-border"}`}>
                <p className="text-sm font-medium uppercase opacity-70">{plan}</p>
                <p className="text-4xl font-black mt-2">{price}</p>
                <ul className="mt-6 space-y-3">
                  {features.map(f => <li key={f} className="text-sm flex items-center gap-2">✓ {f}</li>)}
                </ul>
                <Button 
                  className={`w-full mt-8 rounded-xl ${highlight ? "bg-white text-primary hover:bg-white/90" : ""}`}
                  onClick={() => setAuthModal({ open: true, mode: "register" })}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
