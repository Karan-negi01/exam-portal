"use client";

import { useCallback, useEffect, useState } from "react";

// Replaces the old useDB() (which read a reactive localStorage snapshot) now
// that data lives in Supabase: fetches once on mount, and callers re-invoke
// `refresh()` after any mutation instead of getting it for free. `fetchFn` is
// expected to be a stable reference (a Server Action import), not an inline
// function, since it's a useCallback dependency.
export function useAsyncData(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err?.message || "Something went wrong loading data.");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    // Fetching on mount is the point of this hook — the setState calls inside
    // `refresh` happen after the async gap, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
