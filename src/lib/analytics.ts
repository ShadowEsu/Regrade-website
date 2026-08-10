import { REGRADE_CONFIG } from "./site-config";

const VISITOR_KEY = "regrade_vid_v1";

declare global {
  interface Window {
    dataLayer?: unknown[][];
  }
}
const GA_SCRIPT_ID = "regrade-google-analytics";

/**
 * Loads GA only when the public Vite measurement ID is configured at build time.
 * This keeps the site functional without analytics and avoids shipping a placeholder ID.
 */
export function initializeGoogleAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!measurementId || document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  const dataLayer = window.dataLayer ?? [];
  window.dataLayer = dataLayer;
  function gtag(...args: unknown[]) {
    dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", measurementId, { anonymize_ip: true });
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export type VisitorStats = {
  total: number;
  today: number;
  week: number;
  updated_at: string;
};

export type LiveVisitorStats = {
  live: number;
  updated_at: string;
};

async function supabaseRpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${REGRADE_CONFIG.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: REGRADE_CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${REGRADE_CONFIG.supabaseAnonKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`RPC ${fn} failed`);
  return res.json() as Promise<T>;
}

export async function registerVisitor(): Promise<void> {
  try {
    await supabaseRpc("register_visitor", {
      p_visitor_id: getVisitorId(),
      p_path: window.location.pathname || "/",
    });
  } catch {
    // Silent — visitor tracking must not block the page
  }
}

export async function getVisitorStats(): Promise<VisitorStats | null> {
  try {
    return await supabaseRpc<VisitorStats>("get_visitor_stats", {});
  } catch {
    return null;
  }
}

export async function getLiveVisitorCount(): Promise<number | null> {
  try {
    const stats = await supabaseRpc<LiveVisitorStats>("get_live_visitor_count", {});
    return stats.live ?? null;
  } catch {
    return null;
  }
}
