import { track } from "@vercel/analytics";

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>
) {
  try {
    track(name, props);
  } catch {
    // analytics failures should never break the app
  }
}
