"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            LeetSolver<span className="text-primary">.ai</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-foreground">Create your account</h2>
          <p className="text-muted-foreground mt-1 text-sm">Start solving LeetCode on autopilot</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Min. 8 characters" />
            </div>
            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account...</span>
              ) : "Get Started Free"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
