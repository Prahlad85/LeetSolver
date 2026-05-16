"use client";

export default function FeaturesPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { t: "AI Solving", d: "Uses GPT-4o and Gemini 2.0 to solve complex problems." },
          { t: "Automated Submissions", d: "Headless browser workers submit code on your behalf." },
          { t: "Streak Insurance", d: "Never miss a daily problem even when you are traveling." },
          { t: "Security First", d: "AES-256 encryption for all sensitive data." },
        ].map(f => (
          <div key={f.t} className="p-6 bg-card border border-border rounded-2xl">
            <h3 className="font-bold text-foreground mb-1">{f.t}</h3>
            <p className="text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
