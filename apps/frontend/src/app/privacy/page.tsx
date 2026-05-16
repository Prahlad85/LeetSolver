"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">Privacy Policy</h1>
      <div className="text-muted-foreground leading-relaxed space-y-6">
        <p>Your privacy is important to us. At LeetSolver.ai, we only store the information necessary to provide our service.</p>
        <h2 className="text-xl font-bold text-foreground">Data Encryption</h2>
        <p>Your LeetCode session cookies are encrypted using AES-256 before being stored in our database. We never read or store your session in plaintext.</p>
        <h2 className="text-xl font-bold text-foreground">Third Party Services</h2>
        <p>We use OpenAI and Google Gemini to generate solutions. No personally identifiable information is shared with these providers.</p>
      </div>
    </div>
  );
}
