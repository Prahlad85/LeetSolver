"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

const historyData = [
  { problem: "Two Sum", difficulty: "Easy", lang: "Python", status: "Success", provider: "GPT-4o", time: "45ms", date: "May 15, 2025" },
  { problem: "LRU Cache", difficulty: "Medium", lang: "JavaScript", status: "Success", provider: "Claude 3.5", time: "78ms", date: "May 14, 2025" },
  { problem: "Median of Two Sorted Arrays", difficulty: "Hard", lang: "Java", status: "Failed", provider: "Gemini", time: "-", date: "May 13, 2025" },
  { problem: "Valid Parentheses", difficulty: "Easy", lang: "Python", status: "Success", provider: "GPT-4o", time: "32ms", date: "May 12, 2025" },
  { problem: "Merge K Sorted Lists", difficulty: "Hard", lang: "C++", status: "Success", provider: "GPT-4o", time: "91ms", date: "May 11, 2025" },
  { problem: "Maximum Subarray", difficulty: "Medium", lang: "Python", status: "Success", provider: "GPT-4o", time: "55ms", date: "May 10, 2025" },
];

const difficultyColor = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  const filtered = historyData.filter(h =>
    h.problem.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Solve History</h1>
        <p className="text-muted-foreground text-sm mt-1">{historyData.length} problems automatically solved by AI.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-input rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Problem</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Difficulty</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Language</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Provider</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.problem}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor[item.difficulty as keyof typeof difficultyColor]}`}>
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">{item.lang}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === "Success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{item.provider}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-mono">{item.time}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No problems found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
