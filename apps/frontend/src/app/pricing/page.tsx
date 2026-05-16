"use client";

export default function PricingPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground text-center">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="p-8 bg-card border border-border rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <p className="text-4xl font-black mb-4">$0</p>
          <ul className="text-sm text-muted-foreground space-y-2 mb-8">
            <li>1 Problem per day</li>
            <li>Python Only</li>
            <li>Basic Analytics</li>
          </ul>
          <button className="w-full py-3 bg-muted rounded-xl font-bold">Current Plan</button>
        </div>
        <div className="p-8 bg-primary text-primary-foreground rounded-2xl text-center shadow-xl shadow-primary/20 scale-105">
          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <p className="text-4xl font-black mb-4">$9</p>
          <ul className="text-sm opacity-80 space-y-2 mb-8">
            <li>Unlimited Problems</li>
            <li>All 4 Languages</li>
            <li>Advanced Analytics</li>
          </ul>
          <button className="w-full py-3 bg-white text-primary rounded-xl font-bold">Get Pro</button>
        </div>
      </div>
    </div>
  );
}
