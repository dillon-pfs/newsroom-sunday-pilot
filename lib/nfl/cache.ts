import { CONFIG } from "./config.ts";
import type { Provider, SavedState, Store } from "./types.ts";

// All keys share a Redis hash tag so the Lua operations also work in a cluster.
const PREFIX = "pfs:{nfl}:v1";

export class RedisStore implements Store {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error("Redis must use HTTPS");
    this.url = parsed.toString().replace(/\/$/, "");
    this.token = token;
  }

  private async command(command: (string | number)[]): Promise<unknown> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) throw new Error(`Score cache HTTP ${response.status}`);
    const payload = await response.json() as { result?: unknown; error?: string };
    if (payload.error) throw new Error("Score cache command failed");
    return payload.result;
  }

  async read(key: string): Promise<SavedState | null> {
    const value = await this.command(["GET", `${PREFIX}:state:${key}`]);
    if (value === null) return null;
    if (typeof value !== "string") throw new Error("Invalid score cache value");
    const state = JSON.parse(value) as SavedState;
    if (!state || typeof state.nextRefreshAt !== "number" || !state.identities ||
        (state.snapshot && !Array.isArray(state.snapshot.games))) throw new Error("Invalid saved score state");
    return state;
  }

  async acquire(_key: string, token: string): Promise<boolean> {
    return await this.command(["SET", `${PREFIX}:lock`, token, "NX", "PX", CONFIG.lockMs]) === "OK";
  }

  async save(key: string, token: string, state: SavedState): Promise<boolean> {
    // Fencing: an expired worker cannot overwrite a newer worker's result.
    const script = "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[2],ARGV[2]); return 1 else return 0 end";
    return await this.command(["EVAL", script, 2, `${PREFIX}:lock`, `${PREFIX}:state:${key}`, token, JSON.stringify(state)]) === 1;
  }

  async release(_key: string, token: string): Promise<void> {
    await this.command(["EVAL", "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end", 1, `${PREFIX}:lock`, token]);
  }

  async reserve(provider: Provider, intervalMs: number): Promise<boolean> {
    // Reserved BEFORE the HTTP request: even a failed/crashed refresh uses quota.
    return await this.command(["SET", `${PREFIX}:budget:${provider}`, "1", "NX", "PX", intervalMs]) === "OK";
  }
}

/** Local development and deterministic tests only; never selected in production. */
export class MemoryStore implements Store {
  private states = new Map<string, SavedState>();
  private lock: { token: string; expires: number } | null = null;
  private budgets = new Map<Provider, number>();
  private now: () => number;
  constructor(now: () => number = Date.now) { this.now = now; }

  async read(key: string): Promise<SavedState | null> {
    return structuredClone(this.states.get(key) ?? null);
  }
  async acquire(_key: string, token: string): Promise<boolean> {
    if (this.lock && this.lock.expires > this.now()) return false;
    this.lock = { token, expires: this.now() + CONFIG.lockMs };
    return true;
  }
  async save(key: string, token: string, state: SavedState): Promise<boolean> {
    if (this.lock?.token !== token || this.lock.expires <= this.now()) return false;
    this.states.set(key, structuredClone(state));
    return true;
  }
  async release(_key: string, token: string): Promise<void> {
    if (this.lock?.token === token) this.lock = null;
  }
  async reserve(provider: Provider, intervalMs: number): Promise<boolean> {
    if ((this.budgets.get(provider) ?? 0) > this.now()) return false;
    this.budgets.set(provider, this.now() + intervalMs);
    return true;
  }
}

let store: Store | undefined;
export function getStore(): Store {
  if (store) return store;
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (url && token) return store = new RedisStore(url, token);
  if (url || token) throw new Error("Both Redis environment variables are required");
  if (process.env.NODE_ENV === "production") throw new Error("Configure shared Redis before enabling production scores");
  console.warn("[nfl] Development memory cache active; restart loses saved scores.");
  return store = new MemoryStore();
}
