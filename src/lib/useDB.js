"use client";

import { useEffect, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot, hydrate } from "./store";

export function useDB() {
  useEffect(() => {
    hydrate();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
