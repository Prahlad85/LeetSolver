"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Shield, Sparkles } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for testing the automation",
    features: ["1 Problem per day", "Python Only", "Basic Analytics", "Community Support"],
    buttonText: "Current Plan",
    highlight: false,
    priceId: null
  },
  {
    name: "Pro",
    price: "$9",
    desc: "The complete automation suite",
    features: ["Unlimited Problems", "All 4 Languages", "Advanced Analytics", "GPT-4o & Gemini Pro", "Priority Support"],
    buttonText: "Upgrade to Pro",
    highlight: true,
    priceId: "price_pro_mock_123" // Replace with your real Stripe Price ID
  }
];

export default function PricingPage() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string | null) => {
    if (!priceId) return;
    if (!user) {
      alert("Please login first to upgrade!");
      return;
    }

    setLoading(priceId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/billing/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error(data.error || "Failed to create session");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
            Pricing Plans
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-foreground">
            Simple, Transparent <br />
            <span className="text-primary">Pricing.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your coding goals. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:translate-y-[-8px] ${
                plan.highlight 
                ? "bg-card border-primary shadow-2xl shadow-primary/20" 
                : "bg-card/50 border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 right-8 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground font-medium">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={!plan.priceId || loading === plan.priceId}
                className={`w-full h-12 rounded-xl font-bold text-base shadow-lg transition-all ${
                  plan.highlight 
                  ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/40" 
                  : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {loading === plan.priceId ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-16 flex flex-col items-center gap-4 py-8 border-t border-border/50">
          <div className="flex items-center gap-6 opacity-50">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Shield className="h-4 w-4" /> Secure Payments
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Zap className="h-4 w-4" /> Instant Activation
            </div>
          </div>
          <div className="flex gap-4 grayscale opacity-50">
             {/* Add card icons here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
