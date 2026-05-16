"use client";

import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Zap, TrendingUp, Code2, CheckCircle2, Circle, ArrowRight } from "lucide-react";

const recentActivity = [
  { problem: "Two Sum", lang: "Python", status: "Success", time: "2h ago" },
  { problem: "LRU Cache", lang: "JavaScript", status: "Success", time: "Yesterday" },
  { problem: "Median of Two Sorted Arrays", lang: "Java", status: "Failed", time: "2 days ago" },
];

export default function DashboardPage() {
  const { user, token } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Good morning, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your automation is running. Here's today's overview.</p>
        </div>
        <Link href="/dashboard/settings">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
            <Zap className="h-4 w-4" />
            Configure Automation
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Current Streak", value: isLoading ? null : (stats?.streak ?? 0), unit: "days", icon: TrendingUp, color: "text-orange-500" },
          { label: "Total Solved", value: isLoading ? null : (stats?.totalSolved ?? 0), unit: "problems", icon: CheckCircle2, color: "text-green-500" },
          { label: "Success Rate", value: isLoading ? null : (stats?.successRate ?? 0), unit: "%", icon: Code2, color: "text-primary" },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-lg bg-muted ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
              {value === null ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-0.5">
                  {value}<span className="text-sm text-muted-foreground ml-1 font-normal">{unit}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Status */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Automation Queue</h2>
            <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Workers Active
            </span>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next run</span>
              <span className="font-medium text-foreground">12:00 AM UTC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Queue length</span>
              <span className="font-medium text-foreground">0 jobs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Worker nodes</span>
              <span className="font-medium text-green-500">3 / 3 healthy</span>
            </div>
            <div className="pt-3">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full w-0"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Queue is idle. Waiting for next scheduled run.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
            <Link href="/dashboard/history" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === "Success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.problem}</p>
                    <p className="text-xs text-muted-foreground">{item.lang} · {item.time}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.status === "Success"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-400"
                }`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
