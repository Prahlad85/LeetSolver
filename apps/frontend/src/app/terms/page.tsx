"use client";

export default function TermsPage() {
  return (
    <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">Terms of Service</h1>
      <div className="text-muted-foreground leading-relaxed space-y-6">
        <p>By using LeetSolver.ai, you agree to the following terms:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for your LeetCode account. We are not liable for any bans or penalties.</li>
          <li>Our service is provided "as is" without any warranties.</li>
          <li>You will not use our service for any illegal or unauthorized purpose.</li>
        </ul>
      </div>
    </div>
  );
}
