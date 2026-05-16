"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Save } from "lucide-react";

export default function SettingsPage() {
  const { token } = useAuthStore();
  const [sessionCookie, setSessionCookie] = useState("");
  const [showCookie, setShowCookie] = useState(false);
  const [language, setLanguage] = useState("Python");
  const [provider, setProvider] = useState("gpt-4o");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const apiCall = async (url: string, body: object) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`, {
      method: url.includes("language") ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  const saveSession = async () => {
    if (!sessionCookie.trim()) return;
    setLoading(true);
    try {
      await apiCall("/api/users/connect-leetcode", { leetcodeSession: sessionCookie });
      setMessage({ text: "LeetCode session connected and encrypted ✓", type: "success" });
      setSessionCookie("");
    } catch {
      setMessage({ text: "Failed to save session. Please try again.", type: "error" });
    }
    setLoading(false);
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await apiCall("/api/users/language", { language });
      setMessage({ text: "Preferences updated successfully ✓", type: "success" });
    } catch {
      setMessage({ text: "Failed to update preferences.", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure your LeetCode integration and automation preferences.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border text-sm ${
          message.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-500"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* LeetCode Integration */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">LeetCode Integration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Connect your LeetCode account via session cookie</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">LEETCODE_SESSION Cookie</label>
              <div className="relative">
                <input
                  type={showCookie ? "text" : "password"}
                  value={sessionCookie}
                  onChange={(e) => setSessionCookie(e.target.value)}
                  placeholder="Paste your LeetCode session cookie here..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-background border border-input text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button onClick={() => setShowCookie(!showCookie)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCookie ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                🔒 Encrypted with AES-256 before storage. We never read your cookie in plaintext.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                How to get it: Open LeetCode → DevTools (F12) → Application → Cookies → Copy <code className="bg-muted px-1 rounded">LEETCODE_SESSION</code> value
              </p>
            </div>
            <Button onClick={saveSession} disabled={loading || !sessionCookie.trim()} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save & Encrypt Session
            </Button>
          </div>
        </div>

        {/* Automation Preferences */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">Automation Preferences</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose your default language and AI model</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Default AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="claude-3-5">Claude 3.5 Sonnet</option>
                <option value="gemini-1-5">Gemini 1.5 Pro</option>
              </select>
            </div>
            <Button onClick={savePreferences} disabled={loading} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">Account Information</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">User ID</p>
                <p className="text-xs text-muted-foreground font-mono mt-1 select-all bg-muted px-2 py-1 rounded w-fit">
                  {useAuthStore.getState().user?.id || "Not Logged In"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Use this ID for manual automation triggers via API.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-500/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/5">
            <h2 className="font-semibold text-red-500">Danger Zone</h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
