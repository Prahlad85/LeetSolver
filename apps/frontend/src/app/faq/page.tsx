"use client";

export default function FAQPage() {
  const faqs = [
    { q: "Is it safe?", a: "Yes, we use industry-standard encryption for your cookies." },
    { q: "Will I get banned?", a: "Automation carries a small risk. Use at your own discretion." },
    { q: "Which languages are supported?", a: "Python, JavaScript, Java, and C++." },
  ];
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">FAQ</h1>
      <div className="space-y-6">
        {faqs.map(f => (
          <div key={f.q} className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="font-bold text-foreground mb-2">{f.q}</h3>
            <p className="text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
