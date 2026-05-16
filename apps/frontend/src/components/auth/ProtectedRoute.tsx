"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (_hasHydrated && isClient && !isAuthenticated) {
      router.push("/");
    }
  }, [_hasHydrated, isClient, isAuthenticated, router]);

  // Don't render anything until we know the auth state
  if (!isClient || !_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
