"use server";

import { getFullDb } from "./db";
import { computeAnalytics as computeAnalyticsPure } from "@/lib/analytics";

export async function computeAnalytics() {
  const db = await getFullDb();
  return computeAnalyticsPure(db);
}
