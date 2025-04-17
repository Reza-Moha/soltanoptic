"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";

/**
 * Custom hook to manage query, company, and date search parameters
 * for lens order filtering in Next.js apps using App Router.
 */
export default function useLensSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const company = useMemo(
    () => searchParams.get("company") || "",
    [searchParams],
  );
  const date = useMemo(() => searchParams.get("date") || "", [searchParams]);

  /**
   * Update the URL query parameters with new values.
   * Removes parameters if the new value is empty or undefined.
   */
  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return { query, company, date, updateParams };
}
