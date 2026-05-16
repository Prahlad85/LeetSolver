"use client";

const PageTemplate = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="min-h-[70vh] py-20 px-6 max-w-4xl mx-auto">
    <h1 className="text-4xl font-black tracking-tighter mb-8 text-foreground">{title}</h1>
    <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6">
      {content}
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <PageTemplate 
      title="About Us"
      content={
        <>
          <p>LeetSolver.ai was founded with a simple mission: to help developers maintain their LeetCode streaks without the daily stress. We believe in the power of consistency, and we use cutting-edge AI to ensure you never miss a day.</p>
          <p>Our team consists of engineers from top tech companies who understand the importance of algorithmic practice and the challenges of a busy schedule.</p>
        </>
      }
    />
  );
}
