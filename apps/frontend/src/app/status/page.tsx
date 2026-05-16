"use client";

export default function StatusPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-black tracking-tighter mb-4 text-foreground">System Status</h1>
      <div className="flex items-center justify-center gap-2 text-green-500 font-bold mb-12">
        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
        All Systems Operational
      </div>
      <div className="space-y-4 max-w-md mx-auto text-left">
        <div className="flex justify-between p-4 bg-card border border-border rounded-xl">
          <span>API Service</span>
          <span className="text-green-500 font-bold">Online</span>
        </div>
        <div className="flex justify-between p-4 bg-card border border-border rounded-xl">
          <span>Worker Nodes</span>
          <span className="text-green-500 font-bold">3 Active</span>
        </div>
        <div className="flex justify-between p-4 bg-card border border-border rounded-xl">
          <span>Dashboard</span>
          <span className="text-green-500 font-bold">Online</span>
        </div>
      </div>
    </div>
  );
}
