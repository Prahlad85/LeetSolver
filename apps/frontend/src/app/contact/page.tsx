"use client";

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">Contact Us</h1>
      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="text-sm font-bold mb-2 block">Email</label>
            <input type="email" className="w-full p-3 rounded-xl bg-background border border-border outline-none focus:border-primary" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">Message</label>
            <textarea className="w-full p-3 h-32 rounded-xl bg-background border border-border outline-none focus:border-primary" placeholder="How can we help?"></textarea>
          </div>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold">Send Message</button>
        </form>
      </div>
    </div>
  );
}
