"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { 
  Zap, Clock, CheckCircle2, AlertCircle, Play, 
  Terminal, BarChart3, Settings as SettingsIcon, ExternalLink, History as HistoryIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const recentSolves = [
  { problem: "Two Sum", lang: "JavaScript", status: "Accepted", time: "Today" },
  { problem: "Add Two Numbers", lang: "Python", status: "Accepted", time: "Yesterday" },
  { problem: "Median of Two Sorted Arrays", lang: "Java", status: "Failed", time: "2 days ago" },
];

const currentHour = new Date().getHours();
let greeting = "Good Evening";
if (currentHour < 12) greeting = "Good Morning";
else if (currentHour < 17) greeting = "Good Afternoon";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<{msg: string, time: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
    
    if (user?.id) {
      socket.emit("subscribe_worker", user.id);
      
      socket.on("worker_log", (data) => {
        setLogs(prev => [{ msg: data.message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
        if (data.message.includes("started")) setIsRunning(true);
        if (data.message.includes("Accepted") || data.message.includes("CRITICAL")) setIsRunning(false);
      });
    }

    return () => { socket.disconnect(); };
  }, [user]);

  const triggerAutomation = async () => {
    setIsRunning(true);
    setLogs(prev => [{ msg: "Triggering automation manually...", time: new Date().toLocaleTimeString() }, ...prev]);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/automation/run-now`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
    } catch (err) {
      setLogs(prev => [{ msg: "Failed to trigger automation", time: new Date().toLocaleTimeString() }, ...prev]);
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">System is healthy. All workers operational.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              setLogs(prev => [{ msg: "Starting LeetCode sync...", time: new Date().toLocaleTimeString() }, ...prev]);
              await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/automation/sync-progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id }),
              });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-muted text-foreground hover:bg-muted/80 transition-all border border-border"
          >
            <HistoryIcon className="h-4 w-4" />
            Sync Progress
          </button>
          <button 
            onClick={triggerAutomation}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              isRunning ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95"
            }`}
          >
            <Play className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running..." : "Run Automation"}
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Streak", val: "12 Days", icon: Zap, color: "text-orange-500" },
          { label: "Total Solved", val: "148", icon: CheckCircle2, color: "text-green-500" },
          { label: "Success Rate", val: "94%", icon: BarChart3, color: "text-blue-500" },
          { label: "Next Run", val: "Midnight", icon: Clock, color: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            <p className="text-2xl font-black text-foreground mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Live Automation Console
            </h3>
            {isRunning && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />}
          </div>
          <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[13px] border border-slate-800 shadow-2xl h-[400px] flex flex-col">
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2 opacity-50">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">worker-node-01</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
              {logs.length === 0 ? (
                <div className="text-slate-600 h-full flex items-center justify-center italic">
                  Waiting for automation to trigger...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left duration-300">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={log.msg.includes("CRITICAL") ? "text-red-400" : log.msg.includes("Accepted") ? "text-green-400" : "text-slate-300"}>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold px-2 flex items-center justify-between">
            Recent Activity
            <Link href="/dashboard/history" className="text-xs text-primary hover:underline flex items-center gap-1 font-normal">
              View all <ExternalLink className="h-3 w-3" />
            </Link>
          </h3>
          <div className="space-y-3">
            {recentSolves.map((s, i) => (
              <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center gap-4 hover:border-primary/30 transition-colors">
                <div className={`p-2 rounded-lg ${s.status === "Accepted" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {s.status === "Accepted" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-foreground">{s.problem}</p>
                  <p className="text-[11px] text-muted-foreground">{s.lang} • {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
