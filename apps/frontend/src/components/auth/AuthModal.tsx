"use client";

import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      
      login(data.token, data.user);
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-md border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 text-center">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to your automation dashboard" : "Start solving LeetCode on autopilot"}
          </p>
        </div>

        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg text-center">{error}</div>}
            
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    placeholder="John Doe" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="name@company.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Password</label>
                {mode === "login" && <button type="button" className="text-[10px] text-primary hover:underline font-bold uppercase">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="••••••••" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span> : (mode === "login" ? "Sign In" : "Get Started")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-xl h-11 font-semibold gap-2 border-border/50 hover:bg-muted/50">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="rounded-xl h-11 font-semibold gap-2 border-border/50 hover:bg-muted/50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="ml-1.5 text-primary font-bold hover:underline">
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
