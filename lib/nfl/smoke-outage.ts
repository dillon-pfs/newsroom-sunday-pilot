export type SmokeOutage = "none" | "espn" | "all";

/** Preview/local fault injection only. Production always uses the real feeds. */
export function smokeOutage(env: Record<string, string | undefined> = process.env): SmokeOutage {
  if (env.VERCEL_ENV === "production") return "none";
  if (env.NODE_ENV !== "development" && env.VERCEL_ENV !== "preview") return "none";
  const value = env.NFL_SMOKE_OUTAGE;
  if (!value || value === "none") return "none";
  if (value === "espn" || value === "all") return value;
  throw new Error("NFL_SMOKE_OUTAGE must be none, espn or all");
}

export async function forcedProviderFailure(): Promise<never> {
  throw new Error("Forced provider outage for preview smoke check");
}
