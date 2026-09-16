"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginAdmin as loginAdminAction, loginCenter as loginCenterAction, loginStudent as loginStudentAction } from "@/actions/auth";

const SESSION_KEY = "examplatform:session";

const AuthContext = createContext(null);

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Session must start as `null` (matching the server, which has no localStorage) and only
  // pick up the stored value after mount — reading it in a lazy initializer instead would
  // make the client's first render diverge from the server-rendered HTML and break hydration.
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(loadSession());
    setReady(true);
  }, []);

  const persist = useCallback((next) => {
    setSession(next);
    if (typeof window !== "undefined") {
      if (next) window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const loginAdmin = useCallback(
    async (email, password) => {
      const result = await loginAdminAction(email, password);
      if (!result.ok) return result;
      persist({ role: "admin", id: "admin", name: "Platform Admin" });
      return { ok: true };
    },
    [persist]
  );

  const loginCenter = useCallback(
    async (email, password) => {
      const result = await loginCenterAction(email, password);
      if (!result.ok) return result;
      persist({ role: "center", id: result.center.id, name: result.center.name, centerId: result.center.id });
      return { ok: true };
    },
    [persist]
  );

  const loginStudent = useCallback(
    async (centerId, phone, password) => {
      const result = await loginStudentAction(centerId, phone, password);
      if (!result.ok) return result;
      persist({
        role: "student",
        id: result.student.id,
        name: result.student.name,
        centerId: result.center.id,
        centerName: result.center.name,
      });
      return { ok: true };
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ session, ready, loginAdmin, loginCenter, loginStudent, logout }),
    [session, ready, loginAdmin, loginCenter, loginStudent, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
