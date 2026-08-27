"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findCenterByEmail, findStudentLogin, getCenterById, hydrate } from "./store";

const SESSION_KEY = "examplatform:session";
const ADMIN_EMAIL = "admin@examplatform.com";
const ADMIN_PASSWORD = "admin123";

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
    hydrate();
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
    (email, password) => {
      if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        persist({ role: "admin", id: "admin", name: "Platform Admin" });
        return { ok: true };
      }
      return { ok: false, error: "Invalid admin email or password." };
    },
    [persist]
  );

  const loginCenter = useCallback(
    (email, password) => {
      const center = findCenterByEmail(email);
      if (!center || center.password !== password) {
        return { ok: false, error: "Invalid email or password." };
      }
      if (center.status === "pending") {
        return { ok: false, error: "Your center is still awaiting admin approval." };
      }
      if (center.status === "rejected") {
        return { ok: false, error: "Your center application was not approved." };
      }
      persist({ role: "center", id: center.id, name: center.name, centerId: center.id });
      return { ok: true };
    },
    [persist]
  );

  const loginStudent = useCallback(
    (centerId, studentCode, password) => {
      const center = getCenterById(centerId);
      if (!center) return { ok: false, error: "Please select your center." };
      const student = findStudentLogin(centerId, studentCode, password);
      if (!student) return { ok: false, error: "Invalid student ID or password." };
      persist({
        role: "student",
        id: student.id,
        name: student.name,
        centerId: center.id,
        centerName: center.name,
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
