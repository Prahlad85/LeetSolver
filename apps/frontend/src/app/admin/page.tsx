"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

    socket.on("connect", () => {
      setLogs((prev) => [...prev, `[System] Connected to Real-time Log Server (ID: ${socket.id})`]);
    });

    socket.on("worker_log", (data: { userId: string, message: string }) => {
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, `[${time}] ${data.message}`]);
    });

    socket.on("disconnect", () => {
      setLogs((prev) => [...prev, `[System] Disconnected from server.`]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col bg-background text-foreground font-sans p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Admin Control Panel</h1>
        <p className="text-muted-foreground mt-2">Manage queues, monitor workers, and view system health in real-time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Users</h3>
          <div className="text-3xl font-bold">1,248</div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Workers</h3>
          <div className="text-3xl font-bold text-green-500">24 / 24</div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Queue Length</h3>
          <div className="text-3xl font-bold text-yellow-500">0</div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Cost (MTD)</h3>
          <div className="text-3xl font-bold text-red-500">$342.50</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/50">
            <h2 className="text-lg font-semibold">Worker Node Health</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-border pb-4">
              <span className="font-mono text-muted-foreground">worker-node-a1</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md">Healthy</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border pb-4">
              <span className="font-mono text-muted-foreground">worker-node-b2</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md">Healthy</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-mono text-muted-foreground">worker-node-c3</span>
              <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md">Restarting</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col h-96">
          <div className="p-6 border-b border-border bg-muted/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Live System Logs</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs text-muted-foreground">Live (Socket.IO)</span>
            </div>
          </div>
          <div className="p-6 bg-[#0a0a0a] font-mono text-xs text-green-400 flex-1 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">Waiting for worker events...</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="mb-1">{log}</p>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
