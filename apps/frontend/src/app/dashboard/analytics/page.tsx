"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const solveData = [
  { day: "Mon", solved: 1, failed: 0 },
  { day: "Tue", solved: 1, failed: 0 },
  { day: "Wed", solved: 0, failed: 1 },
  { day: "Thu", solved: 1, failed: 0 },
  { day: "Fri", solved: 1, failed: 0 },
  { day: "Sat", solved: 1, failed: 0 },
  { day: "Sun", solved: 1, failed: 0 },
];

const langData = [
  { name: "Python", value: 45 },
  { name: "JavaScript", value: 30 },
  { name: "Java", value: 15 },
  { name: "C++", value: 10 },
];

const COLORS = ["hsl(var(--primary))", "#3b82f6", "#f59e0b", "#10b981"];

const streakData = [
  { month: "Jan", streak: 8 },
  { month: "Feb", streak: 15 },
  { month: "Mar", streak: 22 },
  { month: "Apr", streak: 18 },
  { month: "May", streak: 28 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your LeetCode automation performance over time.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Acceptance Rate", value: "94%", trend: "+2.4%" },
          { label: "Best Streak", value: "28 days", trend: "+7 days" },
          { label: "AI Accuracy", value: "89%", trend: "+1.2%" },
          { label: "Token Usage (MTD)", value: "120K", trend: "~$0.24" },
        ].map(({ label, value, trend }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-xs text-green-500 mt-1">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Solve Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Daily Solve Activity (This Week)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={solveData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Solved" />
              <Bar dataKey="failed" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Language Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Language Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={langData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {langData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
              />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "12px" }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Trend */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-6">Streak Growth (2025)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={streakData}>
            <defs>
              <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="streak" stroke="hsl(var(--primary))" fill="url(#streakGradient)" strokeWidth={2} name="Streak" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
