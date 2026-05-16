import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background text-foreground text-center px-4">
      <h1 className="text-8xl font-black tracking-tighter mb-4 text-primary">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button size="lg" className="rounded-full">Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="outline" className="rounded-full">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
