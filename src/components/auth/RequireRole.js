"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RequireRole({ role, children }) {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && (!session || session.role !== role)) {
      router.replace("/login");
    }
  }, [ready, session, role, router]);

  if (!ready || !session || session.role !== role) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-muted)",
        }}
      >
        Loading…
      </div>
    );
  }

  return children;
}
