import type { MetaAdParams, UtmParams } from "@/types/lead";

const STORAGE_KEY = "stelle_attribution_v1";

interface StoredAttribution extends UtmParams, MetaAdParams {
  landingUrl?: string;
}

/**
 * Reads UTM + Meta click/campaign params from the current URL (present only
 * on the first hit from the ad) and persists them in sessionStorage so they
 * survive the quiz -> lead-capture flow even without query params on every
 * internal navigation.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const keys: (keyof StoredAttribution)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "campaign_id",
    "adset_id",
    "ad_id",
  ];

  const incoming: StoredAttribution = {};
  let hasAny = false;
  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      incoming[key] = value;
      hasAny = true;
    }
  }

  if (hasAny) {
    incoming.landingUrl = window.location.href;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
  } else if (!window.sessionStorage.getItem(STORAGE_KEY)) {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ landingUrl: window.location.href })
    );
  }
}

export function getAttribution(): StoredAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAttribution) : {};
  } catch {
    return {};
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fires a tracking event to Meta Pixel (if loaded) and to a dataLayer (GA4/GTM).
 *
 * IMPORTANT (health-data compliance): never pass quiz answer content
 * (concerns, awareness level, motivation, etc.) inside event params. Meta's
 * policy on sensitive/health-adjacent categories prohibits sending that kind
 * of data through Pixel/CAPI. Only structural, non-clinical params are
 * allowed here (e.g. a question index).
 */
export function trackEvent(
  eventName: "PageView" | "ViewContent" | "QuizStart" | "QuizQuestionAnswered" | "Lead" | "Contact",
  params?: Record<string, string | number>
) {
  if (typeof window === "undefined") return;

  const standardEvents = new Set(["PageView", "ViewContent", "Lead", "Contact"]);
  if (window.fbq) {
    if (standardEvents.has(eventName)) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("trackCustom", eventName, params);
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}
