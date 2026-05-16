import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background text-muted-foreground py-12">
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-foreground">
            LeetSolver<span className="text-primary">.ai</span>
          </Link>
          <p className="text-sm">Automating your LeetCode journey with intelligent browser automation and advanced AI models.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Product</h4>
          <Link href="/#features" className="text-sm hover:text-foreground transition-colors">Features</Link>
          <Link href="/#pricing" className="text-sm hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/dashboard" className="text-sm hover:text-foreground transition-colors">Dashboard</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Resources</h4>
          <Link href="/docs" className="text-sm hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/blog" className="text-sm hover:text-foreground transition-colors">Blog</Link>
          <Link href="/support" className="text-sm hover:text-foreground transition-colors">Support</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Legal</h4>
          <Link href="/privacy" className="text-sm hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} LeetSolver.ai. All rights reserved.</p>
      </div>
    </footer>
  );
}
